// Funcionalidades EdTech para pasantes y estudiantes - Legal PY

/**
 * Bitácora Digital Biométrica para pasantes
 * Registra asistencia con verificación biométrica y geolocalización
 */

export interface BitacoraEntry {
  id: string;
  pasantiaId: string;
  estudianteId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida?: string;
  ubicacion: {
    lat: number;
    lng: number;
    direccion: string;
    tipo: "juzgado" | "estudio" | "oficina" | "otro";
    nombreLugar?: string;
  };
  verificacionBiometrica: {
    entrada: {
      timestamp: string;
      metodo: "face" | "fingerprint" | "passkey";
      exitoso: boolean;
    };
    salida?: {
      timestamp: string;
      metodo: "face" | "fingerprint" | "passkey";
      exitoso: boolean;
    };
  };
  actividades: string[];
  documentosCargados?: {
    id: string;
    nombre: string;
    tipo: string;
    hash: string; // Hash del documento para integridad
  }[];
  tutorId?: string;
  tutorAprobado?: boolean;
  observaciones?: string;
}

/**
 * Check-in geolocalizado en juzgados
 */
export interface CheckInJuzgado {
  id: string;
  estudianteId: string;
  juzgadoId: string;
  juzgadoNombre: string;
  fecha: string;
  hora: string;
  ubicacion: {
    lat: number;
    lng: number;
    direccion: string;
    precision: number; // Precisión en metros
  };
  verificacionBiometrica: {
    timestamp: string;
    metodo: "face" | "fingerprint" | "passkey";
    exitoso: boolean;
  };
  fotoEvidencia?: string; // URL de foto del juzgado
  estado: "pendiente" | "verificado" | "rechazado";
  tutorId?: string;
  tutorAprobado?: boolean;
}

/**
 * Certificado académico con validación Blockchain
 */
export interface CertificadoAcademico {
  id: string;
  estudianteId: string;
  tipo: "pasantia" | "curso" | "especializacion" | "certificacion";
  titulo: string;
  descripcion: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  horas: number;
  institucion: string;
  hashBlockchain: string; // Hash único para verificación
  qrCode: string; // URL del código QR
  urlVerificacion: string; // URL pública para verificar el certificado
  estado: "emitido" | "verificado" | "revocado";
  metadata: {
    pasantiaId?: string;
    cursoId?: string;
    especializacionId?: string;
    certificacionId?: string;
    tutorId?: string;
    calificacion?: number;
  };
}

/**
 * Billetera Académica del estudiante
 */
export interface BilleteraAcademica {
  estudianteId: string;
  certificados: CertificadoAcademico[];
  horasTotales: number;
  pasantiasCompletadas: number;
  cursosCompletados: number;
  certificaciones: number;
  ultimaActualizacion: string;
}

/**
 * Juzgado registrado para check-in
 */
export interface Juzgado {
  id: string;
  nombre: string;
  tipo: "civil" | "penal" | "laboral" | "comercial" | "familia" | "niñez";
  direccion: string;
  ciudad: string;
  ubicacion: {
    lat: number;
    lng: number;
  };
  radioPermitido: number; // Radio en metros para permitir check-in
  activo: boolean;
}

// Funciones de utilidad

/**
 * Obtiene la ubicación actual del usuario
 */
export async function obtenerUbicacionActual(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no disponible"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Verifica si el usuario está dentro del radio permitido del juzgado
 */
export function verificarProximidadJuzgado(
  ubicacionUsuario: { lat: number; lng: number },
  juzgado: Juzgado,
  radioPermitido: number = 100
): boolean {
  const distancia = calcularDistancia(
    ubicacionUsuario.lat,
    ubicacionUsuario.lng,
    juzgado.ubicacion.lat,
    juzgado.ubicacion.lng
  );
  return distancia <= radioPermitido;
}

/**
 * Calcula la distancia entre dos puntos geográficos (Haversine)
 */
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

/**
 * Genera un hash único para un certificado (simulado - en producción usaría blockchain real)
 */
export function generarHashCertificado(certificado: Omit<CertificadoAcademico, "hashBlockchain">): string {
  // En producción, esto se conectaría a un servicio de blockchain
  // Por ahora, generamos un hash simulado
  const data = JSON.stringify({
    id: certificado.id,
    estudianteId: certificado.estudianteId,
    tipo: certificado.tipo,
    titulo: certificado.titulo,
    fechaEmision: certificado.fechaEmision,
    metadata: certificado.metadata,
  });
  
  // Simulación de hash (en producción usar SHA-256 o similar)
  return `0x${Buffer.from(data).toString("hex").substring(0, 64)}`;
}

/**
 * Obtiene la billetera académica de un estudiante
 */
export function obtenerBilleteraAcademica(estudianteId: string): BilleteraAcademica | null {
  if (typeof window === "undefined") return null;
  
  const billetera = localStorage.getItem(`legal-py-billetera-${estudianteId}`);
  if (!billetera) return null;
  
  return JSON.parse(billetera);
}

/**
 * Guarda la billetera académica de un estudiante
 */
export function guardarBilleteraAcademica(billetera: BilleteraAcademica): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(`legal-py-billetera-${billetera.estudianteId}`, JSON.stringify(billetera));
}

/**
 * Agrega un certificado a la billetera académica
 */
export function agregarCertificadoABilletera(
  estudianteId: string,
  certificado: CertificadoAcademico
): void {
  const billetera = obtenerBilleteraAcademica(estudianteId) || {
    estudianteId,
    certificados: [],
    horasTotales: 0,
    pasantiasCompletadas: 0,
    cursosCompletados: 0,
    certificaciones: 0,
    ultimaActualizacion: new Date().toISOString(),
  };

  billetera.certificados.push(certificado);
  billetera.horasTotales += certificado.horas || 0;
  
  if (certificado.tipo === "pasantia") billetera.pasantiasCompletadas++;
  if (certificado.tipo === "curso") billetera.cursosCompletados++;
  if (certificado.tipo === "certificacion") billetera.certificaciones++;
  
  billetera.ultimaActualizacion = new Date().toISOString();
  
  guardarBilleteraAcademica(billetera);
}

/**
 * Obtiene las entradas de bitácora de un estudiante
 */
export function obtenerBitacoraEstudiante(estudianteId: string, pasantiaId?: string): BitacoraEntry[] {
  if (typeof window === "undefined") return [];
  
  const bitacora = localStorage.getItem(`legal-py-bitacora-${estudianteId}`);
  if (!bitacora) return [];
  
  const entries: BitacoraEntry[] = JSON.parse(bitacora);
  
  if (pasantiaId) {
    return entries.filter((entry) => entry.pasantiaId === pasantiaId);
  }
  
  return entries;
}

/**
 * Guarda una entrada en la bitácora
 */
export function guardarEntradaBitacora(entry: BitacoraEntry): void {
  if (typeof window === "undefined") return;
  
  const entries = obtenerBitacoraEstudiante(entry.estudianteId);
  entries.push(entry);
  
  localStorage.setItem(`legal-py-bitacora-${entry.estudianteId}`, JSON.stringify(entries));
}

/**
 * Obtiene los check-ins de un estudiante
 */
export function obtenerCheckInsEstudiante(estudianteId: string): CheckInJuzgado[] {
  if (typeof window === "undefined") return [];
  
  const checkIns = localStorage.getItem(`legal-py-checkins-${estudianteId}`);
  if (!checkIns) return [];
  
  return JSON.parse(checkIns);
}

/**
 * Guarda un check-in
 */
export function guardarCheckIn(checkIn: CheckInJuzgado): void {
  if (typeof window === "undefined") return;
  
  const checkIns = obtenerCheckInsEstudiante(checkIn.estudianteId);
  checkIns.push(checkIn);
  
  localStorage.setItem(`legal-py-checkins-${checkIn.estudianteId}`, JSON.stringify(checkIns));
}

// Datos mock de juzgados
export const mockJuzgados: Juzgado[] = [
  {
    id: "juz-1",
    nombre: "Juzgado de Primera Instancia en lo Civil y Comercial N° 1",
    tipo: "civil",
    direccion: "Av. Mariscal López 1234, Asunción",
    ciudad: "Asunción",
    ubicacion: {
      lat: -25.2637,
      lng: -57.5759,
    },
    radioPermitido: 100,
    activo: true,
  },
  {
    id: "juz-2",
    nombre: "Juzgado de Primera Instancia en lo Penal N° 2",
    tipo: "penal",
    direccion: "Calle Palma 567, Asunción",
    ciudad: "Asunción",
    ubicacion: {
      lat: -25.2817,
      lng: -57.6353,
    },
    radioPermitido: 100,
    activo: true,
  },
  {
    id: "juz-3",
    nombre: "Juzgado de Primera Instancia en lo Laboral N° 1",
    tipo: "laboral",
    direccion: "Av. España 890, Asunción",
    ciudad: "Asunción",
    ubicacion: {
      lat: -25.2947,
      lng: -57.6083,
    },
    radioPermitido: 100,
    activo: true,
  },
];
