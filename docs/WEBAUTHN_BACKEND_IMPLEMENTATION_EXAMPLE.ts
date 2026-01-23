/**
 * EJEMPLO DE IMPLEMENTACIÓN BACKEND WEBAUTHN - LEGAL PY
 * 
 * Este archivo muestra una implementación práctica de los endpoints
 * siguiendo la arquitectura definida en WEBAUTHN_BACKEND_ARCHITECTURE.md
 * 
 * ⚠️ NO USAR EN PRODUCCIÓN SIN REVISIÓN DE SEGURIDAD
 * 
 * @author Senior Backend Security Engineer
 * @date 2025-01-27
 */

import { Router, Request, Response } from 'express';
import { Redis } from 'ioredis';
import { 
  generateAuthenticationOptions, 
  verifyAuthenticationResponse,
  type AuthenticatorDevice,
  type VerifiedAuthenticationResponse
} from '@simplewebauthn/server';
import { rpID, rpName, origin } from '../config/webauthn';
import { db } from '../db';
import { auditLog } from '../services/audit';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const redis = new Redis(process.env.REDIS_URL);

// ============================================================================
// LOGIN BIOMÉTRICO
// ============================================================================

/**
 * POST /api/webauthn/login/options
 * Genera opciones de autenticación para login passwordless
 */
router.post('/login/options', rateLimiter({ max: 5, window: 60000 }), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL' });
    }

    // Buscar usuario
    const user = await db.users.findByEmail(email);
    if (!user) {
      // No revelar si el usuario existe (security best practice)
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      return res.status(200).json({
        challenge: '', // Challenge vacío si no hay usuario
        rpId: rpID,
        allowCredentials: []
      });
    }

    // Buscar credenciales activas del usuario
    const credentials = await db.webauthnCredentials.findByUserId(user.id, 'login');
    if (credentials.length === 0) {
      return res.status(400).json({ 
        error: 'NO_CREDENTIALS',
        message: 'Usuario no tiene credenciales biométricas registradas'
      });
    }

    // Generar challenge único (32 bytes)
    const challenge = Buffer.from(crypto.getRandomValues(new Uint8Array(32)))
      .toString('base64url');

    // Guardar challenge en Redis con TTL 60s
    await redis.setex(
      `webauthn:login:challenge:${challenge}`,
      60,
      JSON.stringify({
        email,
        userId: user.id,
        timestamp: Date.now()
      })
    );

    // Preparar allowCredentials
    const allowCredentials = credentials.map(cred => ({
      id: Buffer.from(cred.credential_id, 'base64url'),
      type: 'public-key' as const,
      transports: cred.transports || ['internal']
    }));

    // Generar opciones de autenticación
    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials,
      userVerification: 'required',
      timeout: 60000
    });

    // Registrar en auditoría
    await auditLog.log({
      event: 'LOGIN_CHALLENGE_GENERATED',
      userId: user.id,
      email,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      challenge: options.challenge,
      rpId: options.rpId,
      allowCredentials: options.allowCredentials,
      userVerification: options.userVerification,
      timeout: options.timeout
    });

  } catch (error) {
    console.error('Error generating login options:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

/**
 * POST /api/webauthn/login/verify
 * Verifica la respuesta de autenticación biométrica
 */
router.post('/login/verify', rateLimiter({ max: 10, window: 3600000 }), async (req: Request, res: Response) => {
  try {
    const { email, credential, challenge } = req.body;

    // Validar inputs
    if (!email || !credential || !challenge) {
      return res.status(400).json({ error: 'MISSING_PARAMETERS' });
    }

    // Recuperar challenge de Redis
    const challengeData = await redis.get(`webauthn:login:challenge:${challenge}`);
    if (!challengeData) {
      await auditLog.log({
        event: 'LOGIN_VERIFICATION_FAILED',
        reason: 'INVALID_CHALLENGE',
        email,
        ipAddress: req.ip
      });
      return res.status(400).json({ 
        verified: false,
        error: 'INVALID_CHALLENGE',
        code: 'AUTH_FAILED'
      });
    }

    const context = JSON.parse(challengeData);

    // Verificar que el email coincide
    if (context.email !== email) {
      await auditLog.log({
        event: 'LOGIN_VERIFICATION_FAILED',
        reason: 'EMAIL_MISMATCH',
        email,
        expectedEmail: context.email,
        ipAddress: req.ip
      });
      return res.status(400).json({
        verified: false,
        error: 'EMAIL_MISMATCH',
        code: 'AUTH_FAILED'
      });
    }

    // Buscar credencial
    const storedCredential = await db.webauthnCredentials.findByCredentialId(
      Buffer.from(credential.id, 'base64url').toString('base64url'),
      'login'
    );

    if (!storedCredential || storedCredential.user_id !== context.userId) {
      await auditLog.log({
        event: 'LOGIN_VERIFICATION_FAILED',
        reason: 'CREDENTIAL_NOT_FOUND',
        userId: context.userId,
        ipAddress: req.ip
      });
      return res.status(400).json({
        verified: false,
        error: 'CREDENTIAL_NOT_FOUND',
        code: 'AUTH_FAILED'
      });
    }

    // Preparar authenticator device
    const authenticator: AuthenticatorDevice = {
      credentialID: Buffer.from(storedCredential.credential_id, 'base64url'),
      credentialPublicKey: storedCredential.public_key,
      counter: storedCredential.counter,
      transports: storedCredential.transports || ['internal']
    };

    // Verificar respuesta
    let verification: VerifiedAuthenticationResponse;
    try {
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge: challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator,
        requireUserVerification: true
      });
    } catch (error: any) {
      await auditLog.log({
        event: 'LOGIN_VERIFICATION_FAILED',
        reason: 'VERIFICATION_ERROR',
        error: error.message,
        userId: context.userId,
        ipAddress: req.ip
      });
      return res.status(400).json({
        verified: false,
        error: 'INVALID_SIGNATURE',
        code: 'AUTH_FAILED'
      });
    }

    // Verificar signCount (anti-replay)
    if (verification.authenticator.counter <= storedCredential.counter) {
      await auditLog.log({
        event: 'REPLAY_ATTACK_DETECTED',
        userId: context.userId,
        oldCounter: storedCredential.counter,
        newCounter: verification.authenticator.counter,
        ipAddress: req.ip
      });
      return res.status(400).json({
        verified: false,
        error: 'REPLAY_ATTACK_DETECTED',
        code: 'AUTH_FAILED'
      });
    }

    // Actualizar counter en BD
    await db.webauthnCredentials.updateCounter(
      storedCredential.id,
      verification.authenticator.counter
    );

    // Eliminar challenge (one-time use)
    await redis.del(`webauthn:login:challenge:${challenge}`);

    // Generar sesión JWT
    const sessionToken = await generateSessionToken({
      userId: context.userId,
      email: context.email,
      authMethod: 'webauthn'
    });

    // Actualizar last_used_at
    await db.webauthnCredentials.updateLastUsed(storedCredential.id);

    // Registrar éxito en auditoría
    await auditLog.log({
      event: 'LOGIN_VERIFICATION_SUCCESS',
      userId: context.userId,
      email: context.email,
      credentialId: storedCredential.credential_id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      verified: true,
      session: {
        token: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      user: {
        id: context.userId,
        email: context.email
      }
    });

  } catch (error) {
    console.error('Error verifying login:', error);
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

// ============================================================================
// PAGO / TRANSACCIÓN BIOMÉTRICA
// ============================================================================

/**
 * POST /api/webauthn/payment/options
 * Genera opciones de autenticación para autorizar un pago
 */
router.post('/payment/options', 
  requireAuth, // Middleware que verifica JWT
  rateLimiter({ max: 10, window: 60000 }),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; // Del middleware requireAuth
      const { amount, currency, transactionId, description } = req.body;

      // Validar inputs
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'INVALID_AMOUNT' });
      }
      if (!currency || !['PYG', 'USD', 'EUR'].includes(currency)) {
        return res.status(400).json({ error: 'INVALID_CURRENCY' });
      }
      if (!transactionId) {
        return res.status(400).json({ error: 'MISSING_TRANSACTION_ID' });
      }

      // Validar transacción en BD
      const transaction = await db.transactions.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ error: 'TRANSACTION_NOT_FOUND' });
      }
      if (transaction.user_id !== userId) {
        return res.status(403).json({ error: 'UNAUTHORIZED' });
      }
      if (transaction.status !== 'pending') {
        return res.status(400).json({ 
          error: 'INVALID_TRANSACTION_STATUS',
          currentStatus: transaction.status
        });
      }
      if (transaction.amount !== amount || transaction.currency !== currency) {
        return res.status(400).json({ error: 'AMOUNT_MISMATCH' });
      }

      // Buscar credencial activa del usuario (solo una para pagos)
      const credential = await db.webauthnCredentials.findActiveByUserId(userId, 'payment');
      if (!credential) {
        return res.status(400).json({ 
          error: 'NO_PAYMENT_CREDENTIAL',
          message: 'Usuario no tiene credencial biométrica registrada para pagos'
        });
      }

      // Generar challenge único
      const challenge = Buffer.from(crypto.getRandomValues(new Uint8Array(32)))
        .toString('base64url');

      // Guardar challenge con CONTEXTO COMPLETO
      const contextData = {
        userId,
        amount,
        currency,
        transactionId,
        timestamp: Date.now(),
        expiresAt: Date.now() + 60000 // 60s
      };

      await redis.setex(
        `webauthn:payment:challenge:${challenge}`,
        60,
        JSON.stringify(contextData)
      );

      // Bloquear transacción (status: pending_biometric)
      await db.transactions.updateStatus(transactionId, 'pending_biometric');

      // Preparar allowCredentials (solo la credencial activa)
      const allowCredentials = [{
        id: Buffer.from(credential.credential_id, 'base64url'),
        type: 'public-key' as const,
        transports: credential.transports || ['internal']
      }];

      // Generar opciones
      const options = await generateAuthenticationOptions({
        rpID,
        allowCredentials,
        userVerification: 'required',
        timeout: 60000
      });

      // Registrar en auditoría
      await auditLog.log({
        event: 'PAYMENT_CHALLENGE_GENERATED',
        userId,
        transactionId,
        amount,
        currency,
        ipAddress: req.ip
      });

      res.json({
        challenge: options.challenge,
        rpId: options.rpId,
        allowCredentials: options.allowCredentials,
        userVerification: options.userVerification,
        timeout: options.timeout
      });

    } catch (error) {
      console.error('Error generating payment options:', error);
      res.status(500).json({ error: 'INTERNAL_ERROR' });
    }
  }
);

/**
 * POST /api/webauthn/payment/verify
 * Verifica la respuesta de autorización biométrica para pago
 */
router.post('/payment/verify',
  requireAuth,
  rateLimiter({ max: 10, window: 3600000 }),
  async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const { credential, challenge, transactionId } = req.body;

      // Validar inputs
      if (!credential || !challenge || !transactionId) {
        return res.status(400).json({ error: 'MISSING_PARAMETERS' });
      }

      // Recuperar challenge con contexto
      const challengeData = await redis.get(`webauthn:payment:challenge:${challenge}`);
      if (!challengeData) {
        await auditLog.log({
          event: 'PAYMENT_VERIFICATION_FAILED',
          reason: 'INVALID_CHALLENGE',
          userId,
          transactionId,
          ipAddress: req.ip
        });
        return res.status(400).json({
          verified: false,
          error: 'INVALID_CHALLENGE',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      const context = JSON.parse(challengeData);

      // ⚠️ VALIDACIÓN CRÍTICA: Context Binding
      if (context.userId !== userId) {
        await auditLog.log({
          event: 'PAYMENT_CONTEXT_MISMATCH',
          reason: 'USER_ID_MISMATCH',
          expectedUserId: context.userId,
          actualUserId: userId,
          transactionId,
          ipAddress: req.ip
        });
        return res.status(403).json({
          verified: false,
          error: 'CONTEXT_MISMATCH',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      if (context.transactionId !== transactionId) {
        await auditLog.log({
          event: 'PAYMENT_CONTEXT_MISMATCH',
          reason: 'TRANSACTION_ID_MISMATCH',
          expectedTransactionId: context.transactionId,
          actualTransactionId: transactionId,
          userId,
          ipAddress: req.ip
        });
        return res.status(400).json({
          verified: false,
          error: 'CONTEXT_MISMATCH',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      // Verificar expiración
      if (Date.now() > context.expiresAt) {
        await redis.del(`webauthn:payment:challenge:${challenge}`);
        return res.status(400).json({
          verified: false,
          error: 'CHALLENGE_EXPIRED',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      // Verificar transacción en BD (doble verificación)
      const transaction = await db.transactions.findById(transactionId);
      if (!transaction || transaction.user_id !== userId) {
        return res.status(404).json({ error: 'TRANSACTION_NOT_FOUND' });
      }
      if (transaction.status !== 'pending_biometric') {
        return res.status(400).json({
          verified: false,
          error: 'INVALID_TRANSACTION_STATUS',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }
      if (transaction.amount !== context.amount || transaction.currency !== context.currency) {
        await auditLog.log({
          event: 'PAYMENT_CONTEXT_MISMATCH',
          reason: 'AMOUNT_CURRENCY_MISMATCH',
          expected: { amount: context.amount, currency: context.currency },
          actual: { amount: transaction.amount, currency: transaction.currency },
          userId,
          transactionId,
          ipAddress: req.ip
        });
        return res.status(400).json({
          verified: false,
          error: 'CONTEXT_MISMATCH',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      // Buscar credencial
      const storedCredential = await db.webauthnCredentials.findActiveByUserId(userId, 'payment');
      if (!storedCredential) {
        return res.status(400).json({
          verified: false,
          error: 'CREDENTIAL_NOT_FOUND',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      // Preparar authenticator
      const authenticator: AuthenticatorDevice = {
        credentialID: Buffer.from(storedCredential.credential_id, 'base64url'),
        credentialPublicKey: storedCredential.public_key,
        counter: storedCredential.counter,
        transports: storedCredential.transports || ['internal']
      };

      // Verificar respuesta
      let verification: VerifiedAuthenticationResponse;
      try {
        verification = await verifyAuthenticationResponse({
          response: credential,
          expectedChallenge: challenge,
          expectedOrigin: origin,
          expectedRPID: rpID,
          authenticator,
          requireUserVerification: true
        });
      } catch (error: any) {
        await auditLog.log({
          event: 'PAYMENT_VERIFICATION_FAILED',
          reason: 'VERIFICATION_ERROR',
          error: error.message,
          userId,
          transactionId,
          ipAddress: req.ip
        });
        return res.status(400).json({
          verified: false,
          error: 'INVALID_SIGNATURE',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      // Verificar signCount
      if (verification.authenticator.counter <= storedCredential.counter) {
        await auditLog.log({
          event: 'REPLAY_ATTACK_DETECTED',
          context: 'PAYMENT',
          userId,
          transactionId,
          oldCounter: storedCredential.counter,
          newCounter: verification.authenticator.counter,
          ipAddress: req.ip
        });
        return res.status(400).json({
          verified: false,
          error: 'REPLAY_ATTACK_DETECTED',
          code: 'PAYMENT_AUTH_FAILED'
        });
      }

      // Actualizar counter
      await db.webauthnCredentials.updateCounter(
        storedCredential.id,
        verification.authenticator.counter
      );

      // Eliminar challenge
      await redis.del(`webauthn:payment:challenge:${challenge}`);

      // Autorizar transacción en BD
      await db.transactions.updateStatus(transactionId, 'authorized');
      await db.transactions.setAuthorizedAt(transactionId, new Date());
      await db.transactions.setBiometricVerified(transactionId, true);

      // Actualizar last_used_at
      await db.webauthnCredentials.updateLastUsed(storedCredential.id);

      // Registrar éxito
      await auditLog.log({
        event: 'PAYMENT_VERIFICATION_SUCCESS',
        userId,
        transactionId,
        amount: context.amount,
        currency: context.currency,
        credentialId: storedCredential.credential_id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json({
        verified: true,
        transaction: {
          id: transactionId,
          status: 'authorized',
          authorizedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'INTERNAL_ERROR' });
    }
  }
);

export default router;
