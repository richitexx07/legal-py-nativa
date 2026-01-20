// Sistema de gestión de contenido legal editable

/**
 * Contenido de políticas y términos
 */
export interface LegalContent {
  id: string;
  title: string;
  lastUpdated: string; // ISO 8601
  content: string; // Markdown o HTML
  version: number;
}

/**
 * Obtiene el contenido de políticas de privacidad
 */
export function getPrivacyPolicy(): LegalContent {
  if (typeof window === "undefined") {
    return getDefaultPrivacyPolicy();
  }

  const key = "legal-py-privacy-policy";
  const stored = localStorage.getItem(key);

  if (!stored) {
    const defaultContent = getDefaultPrivacyPolicy();
    savePrivacyPolicy(defaultContent);
    return defaultContent;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultPrivacyPolicy();
  }
}

/**
 * Guarda el contenido de políticas de privacidad
 */
export function savePrivacyPolicy(content: LegalContent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("legal-py-privacy-policy", JSON.stringify(content));
}

/**
 * Obtiene el contenido de términos y condiciones
 */
export function getTermsAndConditions(): LegalContent {
  if (typeof window === "undefined") {
    return getDefaultTermsAndConditions();
  }

  const key = "legal-py-terms-conditions";
  const stored = localStorage.getItem(key);

  if (!stored) {
    const defaultContent = getDefaultTermsAndConditions();
    saveTermsAndConditions(defaultContent);
    return defaultContent;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultTermsAndConditions();
  }
}

/**
 * Guarda el contenido de términos y condiciones
 */
export function saveTermsAndConditions(content: LegalContent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("legal-py-terms-conditions", JSON.stringify(content));
}

/**
 * Contenido por defecto de políticas de privacidad
 */
function getDefaultPrivacyPolicy(): LegalContent {
  return {
    id: "privacy-policy",
    title: "Política de Privacidad",
    lastUpdated: new Date().toISOString(),
    version: 1,
    content: `# Política de Privacidad de Legal PY

**Última actualización:** ${new Date().toLocaleDateString("es-PY", { year: "numeric", month: "long", day: "numeric" })}

## 1. Información que Recopilamos

Legal PY recopila información personal cuando te registras en nuestra plataforma, utilizas nuestros servicios o te comunicas con nosotros. La información que recopilamos incluye:

### 1.1 Información de Identificación
- Nombre completo
- Dirección de correo electrónico
- Número de teléfono (opcional)
- Información de perfil según tu rol (cliente, profesional, estudiante)

### 1.2 Información Profesional (para profesionales)
- Título profesional
- Especialidad
- Matrícula profesional
- Documentos de verificación
- Experiencia y credenciales

### 1.3 Información de Uso
- Datos de navegación
- Interacciones con la plataforma
- Historial de casos y servicios
- Preferencias de notificaciones

### 1.4 Información de Pago
- Métodos de pago registrados (solo registro, no procesamos pagos)
- Historial de transacciones registradas

## 2. Uso de la Información

Utilizamos tu información personal para:

- **Proporcionar servicios:** Gestionar tu cuenta, conectar clientes con profesionales, facilitar trámites legales
- **Verificación:** Verificar credenciales profesionales y mantener la integridad de la plataforma
- **Comunicación:** Enviar notificaciones, actualizaciones y respuestas a tus consultas
- **Mejora del servicio:** Analizar el uso de la plataforma para mejorar nuestros servicios
- **Cumplimiento legal:** Cumplir con obligaciones legales y regulatorias

## 3. Seguridad de los Datos

Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:

- **Encriptación:** Datos sensibles encriptados en tránsito y en reposo
- **Acceso limitado:** Solo personal autorizado tiene acceso a información personal
- **Monitoreo:** Sistemas de monitoreo para detectar y prevenir accesos no autorizados
- **Backups:** Copias de seguridad regulares de los datos

## 4. Compartir Información

**Legal PY NO vende ni alquila tu información personal.**

Compartimos información únicamente en las siguientes circunstancias:

- **Con profesionales:** Cuando un cliente contrata servicios, se comparte información necesaria para la prestación del servicio
- **Proveedores de servicios:** Con terceros que nos ayudan a operar la plataforma (hosting, análisis, etc.), bajo estrictos acuerdos de confidencialidad
- **Obligaciones legales:** Cuando sea requerido por ley, orden judicial o autoridad competente
- **Con tu consentimiento:** En cualquier otra situación, solo con tu consentimiento explícito

## 5. Tus Derechos

Tienes derecho a:

- **Acceso:** Solicitar una copia de tu información personal
- **Rectificación:** Corregir información inexacta o incompleta
- **Eliminación:** Solicitar la eliminación de tu información personal (sujeto a obligaciones legales)
- **Oposición:** Oponerte al procesamiento de tu información en ciertas circunstancias
- **Portabilidad:** Recibir tu información en formato estructurado
- **Retirar consentimiento:** Retirar tu consentimiento en cualquier momento

Para ejercer estos derechos, contáctanos en: privacidad@legalpy.com

## 6. Cookies y Tecnologías Similares

Utilizamos cookies y tecnologías similares para:

- Mantener tu sesión activa
- Recordar tus preferencias
- Analizar el uso de la plataforma
- Mejorar la experiencia del usuario

Puedes gestionar las cookies desde la configuración de tu navegador.

## 7. Retención de Datos

Conservamos tu información personal mientras:

- Tu cuenta esté activa
- Sea necesario para proporcionar servicios
- Sea requerido por obligaciones legales
- Existan intereses legítimos válidos

## 8. Menores de Edad

Legal PY no está dirigido a menores de 18 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.

## 9. Transferencias Internacionales

Tus datos pueden ser procesados y almacenados fuera de Paraguay. En estos casos, nos aseguramos de que existan salvaguardas adecuadas para proteger tu información.

## 10. Cambios a esta Política

Nos reservamos el derecho de actualizar esta Política de Privacidad. Te notificaremos de cambios significativos por email o mediante un aviso en la plataforma. La fecha de "Última actualización" indica cuándo se realizó el último cambio.

## 11. Contacto

Para preguntas, solicitudes o preocupaciones sobre esta Política de Privacidad, contáctanos:

- **Email:** privacidad@legalpy.com
- **Dirección:** [Dirección de la empresa]
- **Teléfono:** [Teléfono de contacto]

---

**Al usar Legal PY, aceptas esta Política de Privacidad.**`,
  };
}

/**
 * Contenido por defecto de términos y condiciones
 */
function getDefaultTermsAndConditions(): LegalContent {
  return {
    id: "terms-conditions",
    title: "Términos y Condiciones de Uso",
    lastUpdated: new Date().toISOString(),
    version: 1,
    content: `# Términos y Condiciones de Uso de Legal PY

**Última actualización:** ${new Date().toLocaleDateString("es-PY", { year: "numeric", month: "long", day: "numeric" })}

## 1. Aceptación de los Términos

Al acceder y utilizar Legal PY, aceptas estar sujeto a estos Términos y Condiciones de Uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar la plataforma.

## 2. Descripción del Servicio

Legal PY es una plataforma digital que conecta clientes con profesionales legales, facilita la gestión de casos y trámites legales, y ofrece servicios educativos y de capacitación.

**IMPORTANTE:** Legal PY es una plataforma de intermediación. No proporcionamos asesoramiento legal directo ni procesamos pagos. Los servicios legales son proporcionados por profesionales independientes.

## 3. Registro y Cuentas

### 3.1 Elegibilidad
- Debes tener al menos 18 años de edad
- Debes tener capacidad legal para contratar
- Debes proporcionar información veraz y actualizada

### 3.2 Tipos de Cuenta
- **Cliente:** Para personas que buscan servicios legales
- **Profesional:** Para abogados, escribanos, gestores y otros profesionales legales
- **Estudiante:** Para estudiantes de derecho y pasantes

### 3.3 Responsabilidades
- Mantener la confidencialidad de tu cuenta
- Notificar inmediatamente cualquier uso no autorizado
- Proporcionar información veraz y actualizada
- Cumplir con todas las leyes y regulaciones aplicables

## 4. Uso de la Plataforma

### 4.1 Uso Permitido
Puedes usar Legal PY para:
- Buscar y contactar profesionales legales
- Gestionar casos y expedientes
- Acceder a servicios educativos
- Registrar pagos realizados externamente

### 4.2 Uso Prohibido
Está prohibido:
- Usar la plataforma para actividades ilegales
- Publicar información falsa o engañosa
- Violar derechos de propiedad intelectual
- Interferir con el funcionamiento de la plataforma
- Acceder a cuentas de otros usuarios
- Realizar ingeniería inversa o intentar acceder al código fuente

## 5. Servicios de Profesionales

### 5.1 Relación Cliente-Profesional
- Legal PY facilita la conexión, pero la relación legal es directamente entre cliente y profesional
- Los profesionales son independientes y no son empleados de Legal PY
- Legal PY no garantiza resultados específicos de servicios legales

### 5.2 Verificación de Profesionales
- Verificamos credenciales profesionales cuando es posible
- Sin embargo, es responsabilidad del cliente verificar la idoneidad del profesional
- Legal PY no se hace responsable por la calidad de los servicios prestados por profesionales

## 6. Pagos y Facturación

### 6.1 Registro de Pagos
- Legal PY NO procesa pagos
- Solo registramos pagos realizados externamente
- Los pagos se realizan directamente entre cliente y profesional

### 6.2 Suscripciones Profesionales
- Las suscripciones se renuevan automáticamente
- Puedes cancelar en cualquier momento desde tu panel
- La cancelación será efectiva al finalizar el período de facturación actual
- No se realizarán reembolsos por períodos ya facturados

## 7. Propiedad Intelectual

### 7.1 Contenido de Legal PY
- Todo el contenido de la plataforma (texto, gráficos, logos, software) es propiedad de Legal PY o sus licenciantes
- Está protegido por leyes de propiedad intelectual
- No puedes copiar, modificar o distribuir contenido sin autorización

### 7.2 Contenido del Usuario
- Conservas los derechos sobre el contenido que subes
- Al subir contenido, nos otorgas una licencia para usarlo en la plataforma
- Eres responsable de tener los derechos necesarios sobre el contenido que subes

## 8. Limitación de Responsabilidad

**DESCARGO IMPORTANTE:**

Legal PY se proporciona "tal cual" y "según disponibilidad". No garantizamos:

- Que la plataforma esté libre de errores o interrupciones
- Que los servicios cumplan con expectativas específicas
- Resultados específicos de servicios legales
- La disponibilidad continua de la plataforma

**Legal PY no será responsable por:**

- Daños directos, indirectos, incidentales o consecuentes
- Pérdida de datos, beneficios o oportunidades
- Decisiones tomadas basándose en información de la plataforma
- Actos u omisiones de profesionales independientes

## 9. Indemnización

Aceptas indemnizar y eximir de responsabilidad a Legal PY, sus afiliados, directores, empleados y agentes de cualquier reclamo, daño, obligación, pérdida, responsabilidad, costo o deuda, y gastos (incluyendo honorarios legales) que surjan de:

- Tu uso de la plataforma
- Violación de estos términos
- Violación de derechos de terceros
- Información falsa o engañosa proporcionada

## 10. Cancelación y Terminación

### 10.1 Por el Usuario
- Puedes cancelar tu cuenta en cualquier momento
- La cancelación no afecta obligaciones pendientes

### 10.2 Por Legal PY
Podemos suspender o terminar tu cuenta si:
- Violas estos términos
- Realizas actividades fraudulentas
- No pagas suscripciones pendientes
- Por razones legales o de seguridad

## 11. Modificaciones de los Términos

Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos de cambios significativos. El uso continuado de la plataforma después de los cambios constituye aceptación de los nuevos términos.

## 12. Ley Aplicable y Jurisdicción

Estos términos se rigen por las leyes de la República del Paraguay. Cualquier disputa será resuelta en los tribunales competentes de Asunción, Paraguay.

## 13. Disposiciones Generales

### 13.1 Divisibilidad
Si alguna disposición es inválida, las demás permanecen en vigor.

### 13.2 Renuncia
La falta de ejercicio de un derecho no constituye renuncia.

### 13.3 Acuerdo Completo
Estos términos constituyen el acuerdo completo entre tú y Legal PY.

## 14. Contacto

Para preguntas sobre estos términos, contáctanos:

- **Email:** legal@legalpy.com
- **Dirección:** [Dirección de la empresa]
- **Teléfono:** [Teléfono de contacto]

---

**Al registrarte y usar Legal PY, aceptas estos Términos y Condiciones de Uso.**`,
  };
}
