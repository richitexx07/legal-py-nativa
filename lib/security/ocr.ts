/**
 * Utilidades para OCR (Reconocimiento Óptico de Caracteres)
 * Usa Tesseract.js para leer datos de documentos escaneados
 * 
 * NOTA: Para usar esto, instalar: npm install tesseract.js
 */

export interface OCRResult {
  success: boolean;
  text?: string;
  data?: {
    documentNumber?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    expirationDate?: string;
    nationality?: string;
  };
  confidence?: number;
  error?: string;
}

/**
 * Lee texto de una imagen usando OCR
 * @param imageFile - Archivo de imagen (File o Blob)
 * @param language - Idioma para OCR (default: 'spa' para español)
 */
export async function readOCR(imageFile: File | Blob, language: string = "spa"): Promise<OCRResult> {
  try {
    // Importación dinámica de Tesseract (solo si está instalado)
    // En producción, esto se haría con: import Tesseract from 'tesseract.js';
    let Tesseract: any = null;
    try {
      // @ts-ignore - Tesseract.js puede no estar instalado
      Tesseract = await import("tesseract.js");
    } catch {
      // Tesseract no está instalado, retornar error
      return {
        success: false,
        error: "Tesseract.js no está instalado. Ejecuta: npm install tesseract.js",
      };
    }

    if (!Tesseract) {
      return {
        success: false,
        error: "Tesseract.js no está instalado. Ejecuta: npm install tesseract.js",
      };
    }

    const { createWorker } = Tesseract.default || Tesseract;

    // Crear worker de Tesseract
    const worker = await createWorker(language);

    try {
      // Realizar OCR
      const { data } = await worker.recognize(imageFile);

      // Extraer datos estructurados del texto
      const extractedData = extractDocumentData(data.text);

      return {
        success: true,
        text: data.text,
        data: extractedData,
        confidence: data.confidence,
      };
    } finally {
      await worker.terminate();
    }
  } catch (error) {
    return {
      success: false,
      error: "Error en OCR: " + (error as Error).message,
    };
  }
}

/**
 * Extrae datos estructurados del texto OCR
 * Busca patrones comunes en cédulas paraguayas
 */
function extractDocumentData(text: string): OCRResult["data"] {
  const data: OCRResult["data"] = {};
  const upperText = text.toUpperCase();

  // Buscar número de documento (formato paraguayo: 1234567 o 1.234.567)
  const docMatch = text.match(/(\d{1,3}(?:\.\d{3})*)/);
  if (docMatch) {
    data.documentNumber = docMatch[1].replace(/\./g, "");
  }

  // Buscar nombres (líneas que contienen palabras comunes de nombres)
  const namePatterns = [
    /NOMBRE[:\s]+([A-ZÁÉÍÓÚÑ\s]+)/i,
    /NOMBRES?[:\s]+([A-ZÁÉÍÓÚÑ\s]+)/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      const nameParts = match[1].trim().split(/\s+/);
      if (nameParts.length >= 2) {
        data.firstName = nameParts[0];
        data.lastName = nameParts.slice(1).join(" ");
      }
      break;
    }
  }

  // Buscar fecha de nacimiento (formato: DD/MM/YYYY o DD-MM-YYYY)
  const birthMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/);
  if (birthMatch) {
    data.dateOfBirth = birthMatch[1];
  }

  // Buscar fecha de vencimiento
  const expMatch = text.match(/VENC[\.]?[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i);
  if (expMatch) {
    data.expirationDate = expMatch[1];
  }

  // Buscar nacionalidad
  const natMatch = text.match(/NAC[\.]?[:\s]+([A-ZÁÉÍÓÚÑ]+)/i);
  if (natMatch) {
    data.nationality = natMatch[1];
  }

  return data;
}

/**
 * Pre-llena un formulario con datos extraídos de OCR
 */
export function prefillFormFromOCR(ocrResult: OCRResult, formData: Record<string, any>): Record<string, any> {
  if (!ocrResult.success || !ocrResult.data) {
    return formData;
  }

  const { data } = ocrResult;

  return {
    ...formData,
    documentNumber: data.documentNumber || formData.documentNumber,
    firstName: data.firstName || formData.firstName,
    lastName: data.lastName || formData.lastName,
    dateOfBirth: data.dateOfBirth || formData.dateOfBirth,
    expirationDate: data.expirationDate || formData.expirationDate,
    nationality: data.nationality || formData.nationality,
  };
}
