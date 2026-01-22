/**
 * Servicio de OCR especializado para documentos de identidad paraguayos
 * Usa Tesseract.js para extraer datos automáticamente
 */

import { readOCR, type OCRResult } from "./security/ocr";

export interface IdCardData {
  nombres?: string;
  apellidos?: string;
  documentNumber?: string;
  dateOfBirth?: string;
  expirationDate?: string;
  nationality?: string;
}

/**
 * Extrae datos de una cédula de identidad paraguaya usando OCR
 * @param imageFile - Archivo de imagen de la cédula
 * @returns Datos extraídos o null si falla
 */
export async function extractIdData(imageFile: File | Blob): Promise<IdCardData | null> {
  try {
    // Usar el servicio de OCR existente
    const result: OCRResult = await readOCR(imageFile, "spa");

    if (!result.success || !result.text) {
      return null;
    }

    const text = result.text;
    const data: IdCardData = {};

    // Extraer número de cédula (formatos paraguayos: 1.234.567 o 1234567)
    const docPatterns = [
      /N[º°]?\s*[:\-]?\s*(\d{1,3}(?:\.\d{3})*)/i, // Nº: 1.234.567
      /C[ÉE]DULA[:\-]?\s*(\d{1,3}(?:\.\d{3})*)/i, // CÉDULA: 1.234.567
      /DOCUMENTO[:\-]?\s*(\d{1,3}(?:\.\d{3})*)/i, // DOCUMENTO: 1.234.567
      /(\d{1,3}\.\d{3}\.\d{3})/, // Formato directo: 1.234.567
      /(\d{7,8})/, // Formato sin puntos: 1234567
    ];

    for (const pattern of docPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.documentNumber = match[1].replace(/\./g, "");
        break;
      }
    }

    // Extraer nombres (buscar patrones comunes en cédulas paraguayas)
    const namePatterns = [
      /NOMBRES?[:\-]?\s*([A-ZÁÉÍÓÚÑ\s]+)/i,
      /NOM[\.]?[:\-]?\s*([A-ZÁÉÍÓÚÑ\s]+)/i,
      /PRIMER\s+NOMBRE[:\-]?\s*([A-ZÁÉÍÓÚÑ\s]+)/i,
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        const nameText = match[1].trim();
        const nameParts = nameText.split(/\s+/);
        if (nameParts.length >= 1) {
          data.nombres = nameParts[0];
          if (nameParts.length > 1) {
            // Si hay más partes, pueden ser nombres adicionales
            data.nombres = nameParts.slice(0, -1).join(" ");
          }
        }
        break;
      }
    }

    // Extraer apellidos
    const lastNamePatterns = [
      /APELLIDOS?[:\-]?\s*([A-ZÁÉÍÓÚÑ\s]+)/i,
      /APELL[\.]?[:\-]?\s*([A-ZÁÉÍÓÚÑ\s]+)/i,
    ];

    for (const pattern of lastNamePatterns) {
      const match = text.match(pattern);
      if (match) {
        data.apellidos = match[1].trim();
        break;
      }
    }

    // Si no se encontraron apellidos por separado, intentar extraer del nombre completo
    if (!data.apellidos && data.nombres) {
      const fullNameMatch = text.match(/([A-ZÁÉÍÓÚÑ\s]{10,})/);
      if (fullNameMatch) {
        const fullName = fullNameMatch[1].trim();
        const parts = fullName.split(/\s+/);
        if (parts.length >= 2) {
          // Asumir que los últimos 1-2 son apellidos
          data.apellidos = parts.slice(-2).join(" ");
          if (!data.nombres) {
            data.nombres = parts.slice(0, -2).join(" ");
          }
        }
      }
    }

    // Extraer fecha de nacimiento
    const birthPatterns = [
      /F[\.]?\s*NAC[\.]?[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
      /FECHA\s+DE\s+NACIMIENTO[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
      /NAC[\.]?[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
    ];

    for (const pattern of birthPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.dateOfBirth = match[1];
        break;
      }
    }

    // Extraer fecha de vencimiento
    const expPatterns = [
      /VENC[\.]?[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
      /VENCIMIENTO[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
      /V[ÁA]L[\.]?[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
    ];

    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.expirationDate = match[1];
        break;
      }
    }

    // Extraer nacionalidad
    const natPatterns = [
      /NAC[\.]?[:\-]?\s*([A-ZÁÉÍÓÚÑ]+)/i,
      /NACIONALIDAD[:\-]?\s*([A-ZÁÉÍÓÚÑ]+)/i,
    ];

    for (const pattern of natPatterns) {
      const match = text.match(pattern);
      if (match && !match[1].match(/\d/)) {
        // Asegurar que no sea una fecha
        data.nationality = match[1];
        break;
      }
    }

    // Retornar solo si se extrajo al menos el número de documento
    if (data.documentNumber) {
      return data;
    }

    return null;
  } catch (error) {
    console.error("Error extrayendo datos de cédula:", error);
    return null;
  }
}
