/**
 * Utilidades de seguridad y blindaje visual
 */

/**
 * Genera un hash simulado para un caso (simula blockchain hash)
 */
export function generateCaseHash(caseId: string, title: string, createdAt: string): string {
  // Simular hash usando una combinación de datos del caso
  const hashInput = `${caseId}-${title}-${createdAt}`;
  
  // Generar hash simple (en producción sería un hash criptográfico real)
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  
  // Convertir a hexadecimal y formatear como hash blockchain
  const hexHash = Math.abs(hash).toString(16).padStart(40, '0');
  return `0x${hexHash}`;
}

/**
 * Trunca un hash para mostrar solo los primeros y últimos caracteres
 */
export function truncateHash(hash: string, startChars: number = 4, endChars: number = 4): string {
  if (hash.length <= startChars + endChars) {
    return hash;
  }
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
}

/**
 * Copia texto al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}
