"use client";

/**
 * BiometricGate - Action-Based Security (NO bloqueo por navegación)
 *
 * La biometría NO se usa para explorar la plataforma.
 * La biometría se usa exclusivamente para AUTORIZAR ACCIONES SENSIBLES.
 *
 * Este gate global NUNCA muestra modal ni bloquea navegación.
 * Las puertas biométricas se activan solo en ACCIONES:
 * - Suscribirse a plan, realizar pago → PayBiometric en PaymentAuthorizationModal
 * - Crear/enviar caso, subir documento, firmar → gates en cada flujo
 *
 * @author Legal PY Security Team
 * @version 4.0.0 - Action-Based
 */

export default function BiometricGate() {
  return null;
}
