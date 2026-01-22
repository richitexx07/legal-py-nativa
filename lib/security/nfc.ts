/**
 * Utilidades para lectura NFC de cédulas electrónicas
 * Soporta Android e iOS con chips NFC
 */

export interface NFCReadResult {
  success: boolean;
  data?: {
    documentNumber?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
    expirationDate?: string;
    photo?: string; // Base64 de la foto
  };
  error?: string;
}

/**
 * Lee datos de una cédula electrónica usando NFC
 * Requiere que el dispositivo tenga NFC y la cédula tenga chip
 */
export async function readNFCIdCard(): Promise<NFCReadResult> {
  if (typeof window === "undefined") {
    return { success: false, error: "NFC no disponible en este entorno" };
  }

  // Verificar soporte de NFC
  if (!("NDEFReader" in window)) {
    return { success: false, error: "Tu dispositivo no soporta lectura NFC" };
  }

  try {
    const ndef = new (window as any).NDEFReader();

    // Escanear tag NFC
    await ndef.scan();

    return new Promise((resolve) => {
      ndef.addEventListener("reading", (event: any) => {
        try {
          // En producción, aquí se parsearían los datos del chip de la cédula
          // Los formatos varían según el país (ICAO 9303 para pasaportes, formatos nacionales para cédulas)
          
          // Simulación: extraer datos básicos
          const message = event.message;
          const records = message.records || [];

          // Buscar record con datos de identidad
          let documentData: any = {};
          for (const record of records) {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder();
              const text = textDecoder.decode(record.data);
              // Parsear texto (formato específico del país)
              // Ejemplo: "DOCUMENTO:1234567|NOMBRE:JUAN|APELLIDO:PEREZ"
              const parts = text.split("|");
              parts.forEach((part: string) => {
                const [key, value] = part.split(":");
                if (key && value) {
                  documentData[key.toLowerCase()] = value;
                }
              });
            }
          }

          resolve({
            success: true,
            data: {
              documentNumber: documentData.documento || documentData.documentnumber,
              firstName: documentData.nombre || documentData.firstname,
              lastName: documentData.apellido || documentData.lastname,
              dateOfBirth: documentData.fechanacimiento || documentData.dateofbirth,
              nationality: documentData.nacionalidad || documentData.nationality,
              expirationDate: documentData.fechavencimiento || documentData.expirationdate,
            },
          });
        } catch (error) {
          resolve({
            success: false,
            error: "Error parseando datos de la cédula: " + (error as Error).message,
          });
        }
      });

      ndef.addEventListener("readingerror", (error: any) => {
        resolve({
          success: false,
          error: "Error leyendo NFC: " + (error?.message || "Error desconocido"),
        });
      });

      // Timeout después de 30 segundos
      setTimeout(() => {
        resolve({
          success: false,
          error: "Timeout: No se detectó ninguna cédula cerca del dispositivo",
        });
      }, 30000);
    });
  } catch (error) {
    return {
      success: false,
      error: "Error iniciando lectura NFC: " + (error as Error).message,
    };
  }
}

/**
 * Verifica si NFC está disponible en el dispositivo
 */
export function isNFCAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return "NDEFReader" in window || "nfc" in navigator;
}
