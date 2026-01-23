import fs from 'fs';
import path from 'path';

export interface PolicyLevel {
  id: string;
  title: string;
  emoji: string;
  description: string;
  policies: Policy[];
}

export interface Policy {
  number: number;
  title: string;
  content: string;
}

/**
 * Lee y parsea el archivo de políticas maestras, separándolo por niveles
 */
export function getLegalPolicies(): PolicyLevel[] {
  try {
    const filePath = path.join(process.cwd(), 'src/data/legal/politicas_maestras.md');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const parsed = parsePoliciesByLevel(content);
    return parsed;
  } catch (error) {
    console.error('Error reading legal policies:', error);
    return [];
  }
}

/**
 * Parsea el contenido markdown y lo separa por niveles
 */
function parsePoliciesByLevel(content: string): PolicyLevel[] {
  const levels: PolicyLevel[] = [];
  
  // Dividir por niveles usando los emojis y títulos de nivel
  const levelPatterns = [
    {
      id: 'nivel-1',
      emoji: '🟥',
      titlePattern: /🟥\s*NIVEL\s*1:/i,
      title: 'NIVEL 1: TÉRMINOS Y CONDICIONES GLOBALES',
      description: 'Estas políticas rigen su uso diario, sus derechos fundamentales y la privacidad de sus datos.'
    },
    {
      id: 'nivel-2',
      emoji: '🟨',
      titlePattern: /🟨\s*NIVEL\s*2:/i,
      title: 'NIVEL 2: SERVICIOS Y HERRAMIENTAS INTELIGENTES',
      description: 'Reglas específicas para la gestión de casos, documentos y pagos.'
    },
    {
      id: 'nivel-3',
      emoji: '🟦',
      titlePattern: /🟦\s*NIVEL\s*3:/i,
      title: 'NIVEL 3: ECOSISTEMA EDUCATIVO (EdTech)',
      description: 'Para empresas, usuarios extranjeros (UE/USA) y seguridad de estado.'
    },
    {
      id: 'nivel-4',
      emoji: '🟩',
      titlePattern: /🟩\s*NIVEL\s*4:/i,
      title: 'NIVEL 4: CUMPLIMIENTO Y SEGURIDAD',
      description: 'Biometría, identidad y protección de datos bajo estándares internacionales.'
    }
  ];

  // Encontrar el índice de cada nivel usando el patrón regex
  const levelIndices: Array<{ pattern: typeof levelPatterns[0]; index: number }> = [];
  
  levelPatterns.forEach(pattern => {
    const match = content.match(pattern.titlePattern);
    if (match && match.index !== undefined) {
      levelIndices.push({ pattern, index: match.index });
    }
  });

  // Ordenar por índice
  levelIndices.sort((a, b) => a.index - b.index);

  // Extraer contenido de cada nivel
  for (let i = 0; i < levelIndices.length; i++) {
    const current = levelIndices[i];
    const next = levelIndices[i + 1];
    
    const startIndex = current.index;
    const endIndex = next ? next.index : content.length;
    
    const levelContent = content.substring(startIndex, endIndex);
    const policies = extractPolicies(levelContent);
    
    // Extraer el título real del contenido (después del emoji y "NIVEL X:")
    const titleMatch = levelContent.match(/##\s*[🟥🟨🟦🟩]\s*(NIVEL\s*\d+:[^#\n]+)/i);
    const actualTitle = titleMatch ? titleMatch[1].trim() : current.pattern.title.replace(/^[🟥🟨🟦🟩]\s*/, '');
    
    // Extraer la descripción real del contenido (línea después del título con *)
    const descMatch = levelContent.match(/\*\s*([^\n]+)/);
    const actualDescription = descMatch ? descMatch[1].trim() : current.pattern.description;
    
    levels.push({
      id: current.pattern.id,
      title: actualTitle,
      emoji: current.pattern.emoji,
      description: actualDescription,
      policies
    });
  }

  return levels;
}

/**
 * Extrae las políticas individuales de un nivel
 */
function extractPolicies(levelContent: string): Policy[] {
  const policies: Policy[] = [];
  const lines = levelContent.split('\n');
  let currentPolicy: { number: number; title: string; content: string[] } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detectar inicio de nueva política (número seguido de punto y título)
    const policyMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (policyMatch) {
      // Guardar política anterior si existe
      if (currentPolicy) {
        policies.push({
          number: currentPolicy.number,
          title: currentPolicy.title,
          content: currentPolicy.content.join('\n').trim()
        });
      }
      
      // Iniciar nueva política
      currentPolicy = {
        number: parseInt(policyMatch[1]),
        title: policyMatch[2],
        content: []
      };
    } else if (currentPolicy) {
      // Si la línea está vacía o es parte del contenido
      if (line || currentPolicy.content.length > 0) {
        // Agregar contenido a la política actual
        // Saltar líneas vacías al inicio del contenido
        if (line || currentPolicy.content.length > 0) {
          currentPolicy.content.push(line);
        }
      }
    }
  }
  
  // Agregar última política
  if (currentPolicy) {
    policies.push({
      number: currentPolicy.number,
      title: currentPolicy.title,
      content: currentPolicy.content.join('\n').trim()
    });
  }
  
  return policies;
}

/**
 * Obtiene el texto completo de las políticas maestras sin parsear
 */
export function getRawLegalPolicies(): string {
  try {
    const filePath = path.join(process.cwd(), 'src/data/legal/politicas_maestras.md');
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading raw legal policies:', error);
    return '';
  }
}
