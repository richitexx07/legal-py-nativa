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
    
    return parsePoliciesByLevel(content);
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
      title: 'NIVEL 1: LECTURA OBLIGATORIA (Esenciales)',
      description: 'Estas políticas rigen su uso diario y sus derechos fundamentales.'
    },
    {
      id: 'nivel-2',
      emoji: '🟨',
      title: 'NIVEL 2: SEGURIDAD FINANCIERA Y OPERATIVA',
      description: 'Lectura crítica para quienes realizan pagos o gestionan casos.'
    },
    {
      id: 'nivel-3',
      emoji: '🟦',
      title: 'NIVEL 3: CUMPLIMIENTO INTERNACIONAL Y CORPORATIVO',
      description: 'Para empresas, usuarios extranjeros y seguridad de estado.'
    }
  ];

  // Encontrar el índice de cada nivel
  const levelIndices: Array<{ pattern: typeof levelPatterns[0]; index: number }> = [];
  
  levelPatterns.forEach(pattern => {
    const index = content.indexOf(pattern.title);
    if (index !== -1) {
      levelIndices.push({ pattern, index });
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
    
    levels.push({
      id: current.pattern.id,
      title: current.pattern.title.replace(/^[🟥🟨🟦]\s*/, ''), // Remover emoji del título
      emoji: current.pattern.emoji,
      description: current.pattern.description,
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
