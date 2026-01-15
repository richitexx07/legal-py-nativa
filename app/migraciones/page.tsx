"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface Requisito {
  id: string;
  label: string;
  obligatorio: boolean;
  descripcion?: string;
}

interface TipoTramite {
  id: string;
  titulo: string;
  descripcion: string;
  requisitos: Requisito[];
  costo: string;
  tiempo: string;
  icono: string;
}

const tiposTramite: TipoTramite[] = [
  {
    id: "temporaria",
    titulo: "Residencia Temporaria",
    descripcion: "Para extranjeros que desean residir en Paraguay por un período determinado",
    icono: "📅",
    requisitos: [
      {
        id: "1",
        label: "Pasaporte vigente (mínimo 6 meses)",
        obligatorio: true,
        descripcion: "Original y copia",
      },
      {
        id: "2",
        label: "Certificado de antecedentes penales del país de origen",
        obligatorio: true,
        descripcion: "Debe estar apostillado o legalizado",
      },
      {
        id: "3",
        label: "Certificado médico",
        obligatorio: true,
        descripcion: "Emitido en Paraguay",
      },
      {
        id: "4",
        label: "Comprobante de ingresos",
        obligatorio: true,
        descripcion: "Últimos 3 meses",
      },
      {
        id: "5",
        label: "Comprobante de domicilio en Paraguay",
        obligatorio: true,
      },
      {
        id: "6",
        label: "Fotografías 4x4",
        obligatorio: true,
        descripcion: "2 fotografías recientes",
      },
    ],
    costo: "Gs. 500.000 - 800.000",
    tiempo: "15-30 días hábiles",
  },
  {
    id: "permanente",
    titulo: "Residencia Permanente",
    descripcion: "Para extranjeros que desean establecerse permanentemente en Paraguay",
    icono: "🏠",
    requisitos: [
      {
        id: "1",
        label: "Todos los requisitos de residencia temporaria",
        obligatorio: true,
      },
      {
        id: "2",
        label: "Certificado de nacimiento apostillado",
        obligatorio: true,
      },
      {
        id: "3",
        label: "Certificado de matrimonio (si aplica)",
        obligatorio: false,
        descripcion: "Si está casado/a",
      },
      {
        id: "4",
        label: "Antecedentes penales de Paraguay",
        obligatorio: true,
        descripcion: "Si ya tiene residencia temporaria",
      },
      {
        id: "5",
        label: "Comprobante de 2 años de residencia temporaria",
        obligatorio: true,
      },
    ],
    costo: "Gs. 800.000 - 1.200.000",
    tiempo: "30-90 días hábiles",
  },
  {
    id: "cedula",
    titulo: "Cédula Paraguaya",
    descripcion: "Documento de identidad nacional para extranjeros con residencia permanente",
    icono: "🆔",
    requisitos: [
      {
        id: "1",
        label: "Residencia permanente vigente",
        obligatorio: true,
      },
      {
        id: "2",
        label: "Certificado de nacimiento original apostillado",
        obligatorio: true,
      },
      {
        id: "3",
        label: "Certificado de matrimonio (si aplica)",
        obligatorio: false,
      },
      {
        id: "4",
        label: "Fotografías 4x4",
        obligatorio: true,
        descripcion: "4 fotografías recientes",
      },
      {
        id: "5",
        label: "Comprobante de domicilio",
        obligatorio: true,
      },
      {
        id: "6",
        label: "Turno en Registro Civil",
        obligatorio: true,
        descripcion: "Se gestiona a través del sistema",
      },
    ],
    costo: "Gs. 300.000 - 500.000",
    tiempo: "7-20 días hábiles",
  },
  {
    id: "inversion",
    titulo: "Residencia por Inversión",
    descripcion: "Para extranjeros que realizan inversiones significativas en Paraguay",
    icono: "💼",
    requisitos: [
      {
        id: "1",
        label: "Comprobante de inversión mínima de USD 5.000",
        obligatorio: true,
        descripcion: "En bienes raíces, empresa o depósito bancario",
      },
      {
        id: "2",
        label: "Documentación de la inversión",
        obligatorio: true,
        descripcion: "Escritura, contrato o certificado bancario",
      },
      {
        id: "3",
        label: "Pasaporte vigente",
        obligatorio: true,
      },
      {
        id: "4",
        label: "Certificado de antecedentes penales",
        obligatorio: true,
        descripcion: "Apostillado o legalizado",
      },
      {
        id: "5",
        label: "Certificado médico",
        obligatorio: true,
      },
      {
        id: "6",
        label: "Comprobante de ingresos",
        obligatorio: true,
      },
    ],
    costo: "Gs. 1.000.000 - 1.500.000",
    tiempo: "20-45 días hábiles",
  },
];

const idiomas = [
  { codigo: "es", nombre: "Español", bandera: "🇪🇸" },
  { codigo: "en", nombre: "English", bandera: "🇺🇸" },
  { codigo: "pt", nombre: "Português", bandera: "🇧🇷" },
  { codigo: "fr", nombre: "Français", bandera: "🇫🇷" },
];

const traducciones: Record<string, Record<string, string>> = {
  es: {
    titulo: "Trámites Migratorios",
    subtitulo: "Servicios para extranjeros: residencia, documentos, asesoría y gestoría",
    seleccionar: "Selecciona el tipo de trámite",
    requisitos: "Requisitos",
    costo: "Costo estimado",
    tiempo: "Tiempo estimado",
    iniciar: "Iniciar Trámite",
    verDetalle: "Ver Detalle",
    obligatorio: "Obligatorio",
    opcional: "Opcional",
    completados: "completados",
    de: "de",
  },
  en: {
    titulo: "Immigration Services",
    subtitulo: "Services for foreigners: residence, documents, advice and management",
    seleccionar: "Select the type of procedure",
    requisitos: "Requirements",
    costo: "Estimated cost",
    tiempo: "Estimated time",
    iniciar: "Start Procedure",
    verDetalle: "View Details",
    obligatorio: "Required",
    opcional: "Optional",
    completados: "completed",
    de: "of",
  },
  pt: {
    titulo: "Serviços de Imigração",
    subtitulo: "Serviços para estrangeiros: residência, documentos, assessoria e gestão",
    seleccionar: "Selecione o tipo de procedimento",
    requisitos: "Requisitos",
    costo: "Custo estimado",
    tiempo: "Tempo estimado",
    iniciar: "Iniciar Procedimento",
    verDetalle: "Ver Detalhes",
    obligatorio: "Obrigatório",
    opcional: "Opcional",
    completados: "completados",
    de: "de",
  },
  fr: {
    titulo: "Services d'Immigration",
    subtitulo: "Services pour étrangers: résidence, documents, conseil et gestion",
    seleccionar: "Sélectionnez le type de procédure",
    requisitos: "Exigences",
    costo: "Coût estimé",
    tiempo: "Temps estimé",
    iniciar: "Démarrer la Procédure",
    verDetalle: "Voir les Détails",
    obligatorio: "Obligatoire",
    opcional: "Optionnel",
    completados: "complétés",
    de: "de",
  },
};

export default function Migraciones() {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
  const [idioma, setIdioma] = useState<string>("es");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const t = traducciones[idioma] || traducciones.es;
  const tramiteActual = tiposTramite.find((t) => t.id === tipoSeleccionado);

  const handleToggleCheck = (requisitoId: string) => {
    setChecklist((prev) => ({
      ...prev,
      [requisitoId]: !prev[requisitoId],
    }));
  };

  const requisitosCompletados = tramiteActual
    ? tramiteActual.requisitos.filter((r) => checklist[r.id]).length
  : 0;
  const totalRequisitos = tramiteActual ? tramiteActual.requisitos.length : 0;

  const handleIniciar = () => {
    if (tramiteActual) {
      alert(
        `Trámite de ${tramiteActual.titulo} iniciado (demo).\nRequisitos completados: ${requisitosCompletados}/${totalRequisitos}`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con selector de idioma */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{t.titulo}</h1>
          <p className="mt-2 text-white/70">{t.subtitulo}</p>
        </div>
        <div className="flex-shrink-0">
          <label className="mb-2 block text-xs font-medium text-white/60">Idioma / Language</label>
          <div className="flex gap-2">
            {idiomas.map((lang) => (
              <button
                key={lang.codigo}
                onClick={() => setIdioma(lang.codigo)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition ${
                  idioma === lang.codigo
                    ? "bg-[#C9A24D] text-black font-semibold"
                    : "bg-white/10 text-white/80 hover:bg-white/15"
                }`}
                title={lang.nombre}
              >
                <span>{lang.bandera}</span>
                <span className="hidden sm:inline">{lang.codigo.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selección de tipo de trámite */}
      {!tipoSeleccionado ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">{t.seleccionar}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiposTramite.map((tipo) => (
              <Card
                key={tipo.id}
                hover
                className="cursor-pointer"
                onClick={() => setTipoSeleccionado(tipo.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{tipo.icono}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#C9A24D] text-lg">{tipo.titulo}</h3>
                    <p className="text-sm text-white/70 mt-1">{tipo.descripcion}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                      <span>
                        <strong>{t.costo}:</strong> {tipo.costo}
                      </span>
                      <span>
                        <strong>{t.tiempo}:</strong> {tipo.tiempo}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t.verDetalle} →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Botón volver */}
          <Button variant="ghost" size="sm" onClick={() => setTipoSeleccionado(null)}>
            ← Volver a tipos de trámite
          </Button>

          {/* Detalle del trámite */}
          <Card>
            <div className="space-y-6">
              {/* Header del trámite */}
              <div className="flex items-start gap-4 pb-4 border-b border-white/10">
                <div className="text-4xl">{tramiteActual?.icono}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{tramiteActual?.titulo}</h2>
                  <p className="text-white/70 mt-1">{tramiteActual?.descripcion}</p>
                </div>
              </div>

              {/* Info rápida */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-sm text-white/60 mb-1">{t.costo}</p>
                  <p className="text-lg font-bold text-[#C9A24D]">{tramiteActual?.costo}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-sm text-white/60 mb-1">{t.tiempo}</p>
                  <p className="text-lg font-bold text-[#C08457]">{tramiteActual?.tiempo}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-sm text-white/60 mb-1">Progreso</p>
                  <p className="text-lg font-bold text-white">
                    {requisitosCompletados} {t.de} {totalRequisitos}
                  </p>
                </div>
              </div>

              {/* Checklist de requisitos */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">{t.requisitos}</h3>
                <div className="space-y-3">
                  {tramiteActual?.requisitos.map((requisito) => (
                    <label
                      key={requisito.id}
                      className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition"
                    >
                      <input
                        type="checkbox"
                        checked={checklist[requisito.id] || false}
                        onChange={() => handleToggleCheck(requisito.id)}
                        className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 text-[#C9A24D] focus:ring-[#C9A24D]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              checklist[requisito.id] ? "text-white/60 line-through" : "text-white"
                            }`}
                          >
                            {requisito.label}
                          </span>
                          {requisito.obligatorio ? (
                            <Badge variant="accent" className="text-xs">
                              {t.obligatorio}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {t.opcional}
                            </Badge>
                          )}
                        </div>
                        {requisito.descripcion && (
                          <p className="text-xs text-white/60 mt-1">{requisito.descripcion}</p>
                        )}
                      </div>
                      {checklist[requisito.id] && (
                        <svg
                          className="h-5 w-5 text-[#C9A24D] shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-white/10">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={handleIniciar}
                >
                  {t.iniciar} →
                </Button>
                <p className="text-xs text-white/50 mt-2">
                  Al iniciar, se te asignará un gestor especializado para acompañarte en el proceso.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
