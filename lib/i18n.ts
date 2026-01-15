// Estructura i18n mínima sin librerías pesadas

export type Idioma = "es" | "gn" | "en" | "pt";

export interface Diccionario {
  nav: {
    inicio: string;
    profesionales: string;
    gestores: string;
    ujieres: string;
    casos: string;
    migraciones: string;
    mensajes: string;
    traduccion: string;
    soyProfesional: string;
    publicarCaso: string;
  };
  footer: {
    copyright: string;
    demo: string;
    seguridad: string;
    privacidad: string;
    cumplimiento: string;
    soporte: string;
  };
  bottomNav: {
    inicio: string;
    buscar: string;
    agenda: string;
    mensajes: string;
    perfil: string;
  };
  common: {
    buscar: string;
    verMas: string;
    cerrar: string;
    volver: string;
  };
  home: {
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    locationPlaceholder: string;
    servicesTitle: string;
    featuredTitle: string;
    featuredViewAll: string;
    featuredViewProfile: string;
    casesTitle: string;
    casesViewAll: string;
    casesViewDetails: string;
    quickAccessTitle: string;
    quickChatTitle: string;
    quickChatSubtitle: string;
    quickCourierTitle: string;
    quickCourierSubtitle: string;
    quickAuctionsTitle: string;
    quickAuctionsSubtitle: string;
  };
  professionals: {
    listTitle: string;
    listSubtitle: string;
    actionsChat: string;
    actionsViewProfile: string;
    actionsBook: string;
    bookConsultation: string;
    videoCall: string;
  };
  translation: {
    pageTitle: string;
    pageSubtitle: string;
    uploadLabel: string;
    sourceLanguage: string;
    targetLanguage: string;
    translateButton: string;
    statusIdle: string;
    statusProcessing: string;
    statusResultTitle: string;
    statusPlaceholder: string;
  };
  video: {
    pageTitle: string;
    pageSubtitle: string;
    startCall: string;
    endCall: string;
    connecting: string;
    inCall: string;
    callEnded: string;
  };
}

const diccionarios: Record<Idioma, Diccionario> = {
  es: {
    nav: {
      inicio: "Inicio",
      profesionales: "Profesionales",
      gestores: "Gestores",
      ujieres: "Ujieres",
      casos: "Casos",
      migraciones: "Migraciones",
      mensajes: "Mensajes",
      traduccion: "Traducción",
      soyProfesional: "Soy profesional",
      publicarCaso: "Publicar caso",
    },
    footer: {
      copyright: "©",
      demo: "Demo para inversores",
      seguridad: "Seguridad",
      privacidad: "Privacidad",
      cumplimiento: "Cumplimiento",
      soporte: "Soporte multilingüe",
    },
    bottomNav: {
      inicio: "Inicio",
      buscar: "Buscar",
      agenda: "Agenda",
      mensajes: "Mensajes",
      perfil: "Perfil",
    },
    common: {
      buscar: "Buscar",
      verMas: "Ver más",
      cerrar: "Cerrar",
      volver: "Volver",
    },
    home: {
      heroTitlePrefix: "Encuentra el profesional legal que",
      heroTitleHighlight: "necesitas",
      heroSubtitle:
        "Encontrá profesionales verificados, gestores y ujieres. Publicá tu caso, subí documentos, recibí notificaciones y hacé seguimiento en un solo lugar.",
      searchPlaceholder: "¿Qué servicio legal necesitas?",
      locationPlaceholder: "Ubicación",
      servicesTitle: "Servicios principales",
      featuredTitle: "Destacados",
      featuredViewAll: "Ver todos →",
      featuredViewProfile: "Ver Perfil →",
      casesTitle: "Seguimiento de Casos",
      casesViewAll: "Ver todos →",
      casesViewDetails: "Ver Detalles →",
      quickAccessTitle: "Accesos rápidos",
      quickChatTitle: "Consulta Rápida",
      quickChatSubtitle: "Chat con un Abogado Ahora",
      quickCourierTitle: "Servicio de Courier Legal",
      quickCourierSubtitle: "Envío o Legalización de Documentos",
      quickAuctionsTitle: "Subastas de Casos",
      quickAuctionsSubtitle: "Publica tu Caso y Recibe Ofertas",
    },
    professionals: {
      listTitle: "Profesionales",
      listSubtitle: "Listado demo con perfiles ficticios verificados.",
      actionsChat: "Iniciar chat",
      actionsViewProfile: "Ver perfil",
      actionsBook: "Reservar cita",
      bookConsultation: "Reservar Consulta",
      videoCall: "Videollamada",
    },
    translation: {
      pageTitle: "Traducción de documentos legales",
      pageSubtitle:
        "Subí tus documentos y obtené una traducción legal lista para revisión profesional.",
      uploadLabel: "Subir archivo (PDF, DOCX)",
      sourceLanguage: "Idioma de origen",
      targetLanguage: "Idioma de destino",
      translateButton: "Traducir",
      statusIdle: "Esperando un archivo para traducir.",
      statusProcessing: "Procesando traducción (demo)...",
      statusResultTitle: "Resultado de la traducción (demo)",
      statusPlaceholder:
        "Aquí se mostrará una vista previa del texto traducido cuando conectemos el servicio real.",
    },
    video: {
      pageTitle: "Sala de videollamada",
      pageSubtitle:
        "Conectate por cámara con tu profesional de confianza. Esta es una demo sin video real todavía.",
      startCall: "Iniciar videollamada",
      endCall: "Finalizar llamada",
      connecting: "Conectando con la sala...",
      inCall: "En videollamada",
      callEnded: "La llamada finalizó.",
    },
  },
  gn: {
    nav: {
      inicio: "Ñepyrũ",
      profesionales: "Mba'apohára",
      gestores: "Ñangarekohára",
      ujieres: "Ujieres",
      casos: "Mba'e",
      migraciones: "Jeguata",
      mensajes: "Ñe'ẽmondo",
      traduccion: "Ñemongu'e",
      soyProfesional: "Che mba'apohára",
      publicarCaso: "Mba'e ojehechaukáva",
    },
    footer: {
      copyright: "©",
      demo: "Demo ojehechaukáva",
      seguridad: "Tekorosã",
      privacidad: "Ñemigua",
      cumplimiento: "Jejapo",
      soporte: "Pytyvõ hetã'ỹre",
    },
    bottomNav: {
      inicio: "Ñepyrũ",
      buscar: "Jeheka",
      agenda: "Aranduka",
      mensajes: "Ñe'ẽmondo",
      perfil: "Rekove",
    },
    common: {
      buscar: "Jeheka",
      verMas: "Ehecha hetave",
      cerrar: "Mboty",
      volver: "Jejujey",
    },
    home: {
      heroTitlePrefix: "Eheka abogado o gestor",
      heroTitleHighlight: "reikotevẽva",
      heroSubtitle:
        "Ejuhu profesional kuéra tekorosãme. Emoherakuã ne caso ha emoneĩ ne kuatia kuéra peteĩ tenda añoite.",
      searchPlaceholder: "Mba'épa servicio legal reikotevẽ?",
      locationPlaceholder: "Tenda",
      servicesTitle: "Servicio tenondeguáva",
      featuredTitle: "Oñemombe'úva",
      featuredViewAll: "Ehecha opavavéva →",
      featuredViewProfile: "Ehecha perfil →",
      casesTitle: "Ojehúva rehegua",
      casesViewAll: "Ehecha opavavéva →",
      casesViewDetails: "Ehecha mba'épa →",
      quickAccessTitle: "Jeike pya'eve",
      quickChatTitle: "Ñomongeta Pya'e",
      quickChatSubtitle: "Eñe'ẽ peteĩ abogado ndive ko'ag̃aite",
      quickCourierTitle: "Servicio courier legal",
      quickCourierSubtitle: "Emondo ha egueru kuatia kuéra tekorosãme",
      quickAuctionsTitle: "Subasta de casos",
      quickAuctionsSubtitle: "Emoherakuã nde caso ha ekaru ñembojerovia",
    },
    professionals: {
      listTitle: "Profesional kuéra",
      listSubtitle: "Lista demo profesional kuéra rehegua.",
      actionsChat: "Eñomongeta",
      actionsViewProfile: "Ehecha perfil",
      actionsBook: "Eñemongueta",
      bookConsultation: "Eñemongueta",
      videoCall: "Videollamada",
    },
    translation: {
      pageTitle: "Ñemongu'e kuatia legal",
      pageSubtitle:
        "Emyanyhẽ kuatia kuéra ha eñemongu'e ñe'ẽ ambuépe (demo).",
      uploadLabel: "Emyanyhẽ marandu (PDF, DOCX)",
      sourceLanguage: "Ñe'ẽ ypy",
      targetLanguage: "Ñe'ẽ sapy'a",
      translateButton: "Emongu'e",
      statusIdle: "Oha'arõ kuatia oñemongu'e hag̃ua.",
      statusProcessing: "Oñemongu'e hína (demo)...",
      statusResultTitle: "Apopyre ñemongu'e rehegua (demo)",
      statusPlaceholder:
        "Ápe ojehechaukáta jehaipyre oñemongu'éva jafastenapérõ servicio tee.",
    },
    video: {
      pageTitle: "Oñemongu'e cámara rupive",
      pageSubtitle:
        "Eñemongeta ne profesional ndive cámara rupive (demo gueteri, ndorekói video real).",
      startCall: "Eñepyrũ videollamada",
      endCall: "Embota llamada",
      connecting: "Oñembojuaju hína sala rehe...",
      inCall: "Oĩ videollamada-pe",
      callEnded: "Opáma llamada.",
    },
  },
  en: {
    nav: {
      inicio: "Home",
      profesionales: "Professionals",
      gestores: "Managers",
      ujieres: "Ushers",
      casos: "Cases",
      migraciones: "Immigration",
      mensajes: "Messages",
      traduccion: "Translation",
      soyProfesional: "I'm a professional",
      publicarCaso: "Publish case",
    },
    footer: {
      copyright: "©",
      demo: "Demo for investors",
      seguridad: "Security",
      privacidad: "Privacy",
      cumplimiento: "Compliance",
      soporte: "Multilingual support",
    },
    bottomNav: {
      inicio: "Home",
      buscar: "Search",
      agenda: "Schedule",
      mensajes: "Messages",
      perfil: "Profile",
    },
    common: {
      buscar: "Search",
      verMas: "See more",
      cerrar: "Close",
      volver: "Back",
    },
    home: {
      heroTitlePrefix: "Find the legal professional you",
      heroTitleHighlight: "need",
      heroSubtitle:
        "Discover verified lawyers, managers and ushers. Publish your case, upload documents, receive notifications and track everything in one place.",
      searchPlaceholder: "What legal service do you need?",
      locationPlaceholder: "Location",
      servicesTitle: "Main services",
      featuredTitle: "Featured",
      featuredViewAll: "View all →",
      featuredViewProfile: "View Profile →",
      casesTitle: "Case tracking",
      casesViewAll: "View all →",
      casesViewDetails: "View Details →",
      quickAccessTitle: "Quick access",
      quickChatTitle: "Quick consultation",
      quickChatSubtitle: "Chat with a lawyer now",
      quickCourierTitle: "Legal courier service",
      quickCourierSubtitle: "Send or legalize documents",
      quickAuctionsTitle: "Case auctions",
      quickAuctionsSubtitle: "Publish your case and receive offers",
    },
    professionals: {
      listTitle: "Professionals",
      listSubtitle: "Demo list with verified, fictional profiles.",
      actionsChat: "Start chat",
      actionsViewProfile: "View profile",
      actionsBook: "Book appointment",
      bookConsultation: "Book Consultation",
      videoCall: "Video call",
    },
    translation: {
      pageTitle: "Legal document translation",
      pageSubtitle:
        "Upload your documents and get a legal-grade translation ready for professional review.",
      uploadLabel: "Upload file (PDF, DOCX)",
      sourceLanguage: "Source language",
      targetLanguage: "Target language",
      translateButton: "Translate",
      statusIdle: "Waiting for a file to translate.",
      statusProcessing: "Processing translation (demo)...",
      statusResultTitle: "Translation result (demo)",
      statusPlaceholder:
        "A preview of the translated text will appear here once we connect the real service.",
    },
    video: {
      pageTitle: "Video call room",
      pageSubtitle:
        "Connect by camera with your trusted professional. This is a demo without real video yet.",
      startCall: "Start video call",
      endCall: "End call",
      connecting: "Connecting to the room...",
      inCall: "In video call",
      callEnded: "The call has ended.",
    },
  },
  pt: {
    nav: {
      inicio: "Início",
      profesionales: "Profissionais",
      gestores: "Gestores",
      ujieres: "Ujieres",
      casos: "Casos",
      migraciones: "Migrações",
      mensajes: "Mensagens",
      traduccion: "Tradução",
      soyProfesional: "Sou profissional",
      publicarCaso: "Publicar caso",
    },
    footer: {
      copyright: "©",
      demo: "Demo para investidores",
      seguridad: "Segurança",
      privacidad: "Privacidade",
      cumplimiento: "Conformidade",
      soporte: "Suporte multilíngue",
    },
    bottomNav: {
      inicio: "Início",
      buscar: "Buscar",
      agenda: "Agenda",
      mensajes: "Mensagens",
      perfil: "Perfil",
    },
    common: {
      buscar: "Buscar",
      verMas: "Ver mais",
      cerrar: "Fechar",
      volver: "Voltar",
    },
    home: {
      heroTitlePrefix: "Encontre o profissional jurídico que",
      heroTitleHighlight: "você precisa",
      heroSubtitle:
        "Encontre profissionais verificados, gestores e oficiais de justiça. Publique seu caso, envie documentos, receba notificações e acompanhe tudo em um só lugar.",
      searchPlaceholder: "Que serviço jurídico você precisa?",
      locationPlaceholder: "Localização",
      servicesTitle: "Serviços principais",
      featuredTitle: "Destaques",
      featuredViewAll: "Ver todos →",
      featuredViewProfile: "Ver Perfil →",
      casesTitle: "Acompanhamento de casos",
      casesViewAll: "Ver todos →",
      casesViewDetails: "Ver Detalhes →",
      quickAccessTitle: "Acessos rápidos",
      quickChatTitle: "Consulta rápida",
      quickChatSubtitle: "Converse com um advogado agora",
      quickCourierTitle: "Courier jurídico",
      quickCourierSubtitle: "Envio ou legalização de documentos",
      quickAuctionsTitle: "Leilão de casos",
      quickAuctionsSubtitle: "Publique seu caso e receba propostas",
    },
    professionals: {
      listTitle: "Profissionais",
      listSubtitle: "Lista demo de perfis fictícios verificados.",
      actionsChat: "Iniciar chat",
      actionsViewProfile: "Ver perfil",
      actionsBook: "Agendar consulta",
      bookConsultation: "Agendar Consulta",
      videoCall: "Chamada de vídeo",
    },
    translation: {
      pageTitle: "Tradução de documentos legais",
      pageSubtitle:
        "Envie seus documentos e obtenha uma tradução jurídica pronta para revisão profissional.",
      uploadLabel: "Enviar arquivo (PDF, DOCX)",
      sourceLanguage: "Idioma de origem",
      targetLanguage: "Idioma de destino",
      translateButton: "Traduzir",
      statusIdle: "Aguardando arquivo para traduzir.",
      statusProcessing: "Processando tradução (demo)...",
      statusResultTitle: "Resultado da tradução (demo)",
      statusPlaceholder:
        "Uma prévia do texto traduzido aparecerá aqui quando conectarmos o serviço real.",
    },
    video: {
      pageTitle: "Sala de videoconferência",
      pageSubtitle:
        "Conecte-se por vídeo com o seu profissional de confiança. Esta é uma demo sem vídeo real ainda.",
      startCall: "Iniciar chamada de vídeo",
      endCall: "Encerrar chamada",
      connecting: "Conectando à sala...",
      inCall: "Em chamada de vídeo",
      callEnded: "A chamada foi encerrada.",
    },
  },
};

// Helper function para obtener traducciones
export function t(idioma: Idioma, key: string): string {
  const keys = key.split(".");
  let value: any = diccionarios[idioma];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback a español si no existe la clave
      value = diccionarios.es;
      for (const k2 of keys) {
        value = value?.[k2];
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}

// Obtener diccionario completo
export function getDiccionario(idioma: Idioma): Diccionario {
  return diccionarios[idioma] || diccionarios.es;
}

// Idiomas disponibles
export const idiomasDisponibles: Array<{ codigo: Idioma; nombre: string; bandera: string }> = [
  { codigo: "es", nombre: "Español", bandera: "🇪🇸" },
  { codigo: "gn", nombre: "Guaraní", bandera: "🇵🇾" },
  { codigo: "en", nombre: "English", bandera: "🇺🇸" },
  { codigo: "pt", nombre: "Português", bandera: "🇧🇷" },
];

// Idioma por defecto
export const idiomaPorDefecto: Idioma = "es";
