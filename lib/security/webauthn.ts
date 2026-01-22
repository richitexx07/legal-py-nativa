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
 */
export async function registerWebAuthn(userId: string, userName: string): Promise<WebAuthnCredential | null> {
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
    return {
      id: credential.id,
      publicKey: Array.from(new Uint8Array(response.getPublicKey() || new Uint8Array())).map(b => b.toString(16).padStart(2, '0')).join(''),
      counter: 0,
    };
  } catch (error) {
    console.error("Error registrando WebAuthn:", error);
    return null;
  }
}

/**
 * Autentica al usuario usando WebAuthn
 */
export async function authenticateWebAuthn(credentialId: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return false;
  }

  try {
    // Generar challenge aleatorio
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Opciones de autenticación
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [
        {
          id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
          type: "public-key",
          transports: ["internal", "hybrid"], // FaceID, TouchID, USB, NFC
        },
      ],
      userVerification: "required",
      timeout: 60000,
    };

    // Autenticar
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential;

    if (!assertion) {
      return false;
    }

    // En producción, aquí se verificaría la firma con el servidor
    return true;
  } catch (error) {
    console.error("Error autenticando con WebAuthn:", error);
    return false;
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
