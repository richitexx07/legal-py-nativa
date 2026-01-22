/**
 * Utilidades para WebAuthn (Autenticación biométrica nativa)
 * Soporta FaceID, TouchID, Windows Hello, etc.
 */

export interface WebAuthnCredential {
  id: string;
  publicKey: string;
  counter: number;
}

/**
 * Registra una nueva credencial WebAuthn para el usuario
 * @param userId ID único del usuario
 * @param userName Nombre del usuario
 * @param email Email del usuario (para guardar la credencial localmente)
 */
export async function registerWebAuthn(
  userId: string,
  userName: string,
  email?: string
): Promise<WebAuthnCredential | null> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    console.warn("WebAuthn no está disponible en este navegador");
    return null;
  }

  try {
    // Generar challenge aleatorio
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Opciones de creación de credencial
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Legal PY",
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(userId),
        name: userName,
        displayName: userName,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Preferir autenticadores integrados (FaceID, TouchID)
        userVerification: "required",
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: "direct",
    };

    // Crear credencial
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error("No se pudo crear la credencial");
    }

    const response = credential.response as AuthenticatorAttestationResponse;

    // Convertir a formato almacenable
    const webAuthnCredential: WebAuthnCredential = {
      id: credential.id,
      publicKey: Array.from(new Uint8Array(response.getPublicKey() || new Uint8Array())).map(b => b.toString(16).padStart(2, '0')).join(''),
      counter: 0,
    };

    // Guardar credencial localmente si se proporciona email
    if (email && typeof window !== "undefined") {
      localStorage.setItem(`legal-py-webauthn-${email}`, credential.id);
    }

    return webAuthnCredential;
  } catch (error) {
    console.error("Error registrando WebAuthn:", error);
    return null;
  }
}

/**
 * Autentica al usuario usando WebAuthn
 * @param credentialId ID de la credencial (opcional, si no se proporciona busca todas)
 * @param email Email del usuario para buscar credenciales guardadas
 */
export async function authenticateWebAuthn(
  credentialId?: string,
  email?: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return { success: false, error: "WebAuthn no está disponible" };
  }

  try {
    // Generar challenge aleatorio
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Buscar credencial guardada si no se proporciona ID
    let finalCredentialId = credentialId;
    if (!finalCredentialId && email) {
      finalCredentialId = localStorage.getItem(`legal-py-webauthn-${email}`) || undefined;
    }

    // Opciones de autenticación
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      ...(finalCredentialId
        ? {
            allowCredentials: [
              {
                id: Uint8Array.from(atob(finalCredentialId), (c) => c.charCodeAt(0)),
                type: "public-key",
                transports: ["internal", "hybrid"], // FaceID, TouchID, USB, NFC
              },
            ],
          }
        : {
            // Si no hay credencial específica, permitir cualquier autenticador
            userVerification: "required",
          }),
      timeout: 60000,
    };

    // Autenticar
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential;

    if (!assertion) {
      return { success: false, error: "Autenticación cancelada" };
    }

    // En producción, aquí se verificaría la firma con el servidor
    return { success: true };
  } catch (error: any) {
    console.error("Error autenticando con WebAuthn:", error);
    
    // Errores amigables
    if (error.name === "NotAllowedError") {
      return { success: false, error: "Autenticación cancelada por el usuario" };
    }
    if (error.name === "NotSupportedError") {
      return { success: false, error: "Biometría no soportada en este dispositivo" };
    }
    if (error.name === "InvalidStateError") {
      return { success: false, error: "No tienes biometría registrada" };
    }
    
    return { success: false, error: error.message || "Error al autenticar" };
  }
}

/**
 * Verifica si WebAuthn está disponible en el dispositivo
 */
export function isWebAuthnAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return typeof window.PublicKeyCredential !== "undefined";
}
