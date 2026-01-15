"use client";

import { useState, useRef, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

interface Mensaje {
  id: string;
  remitente: string;
  contenido: string;
  fecha: string;
  leido: boolean;
  tipo?: "texto" | "documento" | "sistema";
  estado?: "enviado" | "entregado" | "leido" | "escribiendo";
  archivo?: {
    nombre: string;
    tipo: string;
    tamaño: string;
  };
}

interface Conversacion {
  id: string;
  nombre: string;
  ultimoMensaje: string;
  fecha: string;
  noLeidos: number;
  online?: boolean;
  tipo: "profesional" | "bot" | "gestor";
}

const conversacionesMock: Conversacion[] = [
  {
    id: "1",
    nombre: "Bot Legal Py",
    ultimoMensaje: "¿En qué puedo ayudarte hoy?",
    fecha: "Ahora",
    noLeidos: 0,
    online: true,
    tipo: "bot",
  },
  {
    id: "2",
    nombre: "Dra. Sofía Benítez",
    ultimoMensaje: "He revisado tu caso, podemos continuar...",
    fecha: "Hace 2 horas",
    noLeidos: 2,
    online: false,
    tipo: "profesional",
  },
  {
    id: "3",
    nombre: "Gestor Carlos Giménez",
    ultimoMensaje: "El trámite está en proceso",
    fecha: "Ayer",
    noLeidos: 0,
    online: true,
    tipo: "gestor",
  },
  {
    id: "4",
    nombre: "Dr. Mario Gómez",
    ultimoMensaje: "Documentos recibidos correctamente",
    fecha: "Hace 3 días",
    noLeidos: 1,
    online: false,
    tipo: "profesional",
  },
];

const mensajesIniciales: Record<string, Mensaje[]> = {
  "1": [
    {
      id: "1",
      remitente: "Bot Legal Py",
      contenido: "Hola, soy el asistente Legal Py. ¿En qué puedo ayudarte hoy?",
      fecha: "10:00",
      leido: true,
      tipo: "texto",
      estado: "leido",
    },
  ],
  "2": [
    {
      id: "1",
      remitente: "Dra. Sofía Benítez",
      contenido: "Hola, he revisado tu caso. Podemos continuar con la demanda.",
      fecha: "08:30",
      leido: true,
      tipo: "texto",
      estado: "leido",
    },
    {
      id: "2",
      remitente: "Tú",
      contenido: "Perfecto, ¿qué documentos necesitas?",
      fecha: "09:15",
      leido: true,
      tipo: "texto",
      estado: "leido",
    },
    {
      id: "3",
      remitente: "Dra. Sofía Benítez",
      contenido: "He revisado tu caso, podemos continuar con la presentación.",
      fecha: "10:00",
      leido: false,
      tipo: "texto",
      estado: "entregado",
    },
  ],
};

// Respuestas predefinidas del bot
const respuestasBot: Record<string, string> = {
  migraciones: `Para trámites migratorios en Paraguay necesitas:

📋 **Residencia Temporaria:**
- Pasaporte vigente
- Certificado de antecedentes penales
- Certificado médico
- Comprobante de ingresos
- Dirección en Paraguay

📋 **Residencia Permanente:**
- Todos los documentos anteriores
- Certificado de nacimiento apostillado
- Certificado de matrimonio (si aplica)

¿Necesitas ayuda con algún trámite específico?`,

  ruc: `Para obtener el RUC (Registro Único de Contribuyente):

📋 **Requisitos:**
- Cédula de identidad paraguaya o pasaporte
- Comprobante de domicilio
- Formulario de solicitud

📋 **Proceso:**
1. Presentar documentación en SET (Subsecretaría de Estado de Tributación)
2. Tiempo estimado: 5-10 días hábiles
3. Costo: Gs. 50.000 aproximadamente

¿Quieres que te conecte con un gestor para este trámite?`,

  sociedades: `Para constituir una sociedad en Paraguay:

📋 **Tipos de sociedades:**
- Sociedad Anónima (S.A.)
- Sociedad de Responsabilidad Limitada (S.R.L.)
- Empresa Unipersonal

📋 **Documentos necesarios:**
- Estatutos sociales
- Poder notarial
- Registro en Registro Público de Comercio
- RUC de la sociedad

📋 **Tiempo estimado:** 15-30 días hábiles

¿Necesitas asesoría para constituir tu sociedad?`,

  poderes: `Para otorgar un poder notarial:

📋 **Tipos de poderes:**
- Poder general
- Poder especial (para trámite específico)
- Poder para pleitos y cobranzas

📋 **Requisitos:**
- Cédula de identidad o pasaporte
- Presencia física del poderdante
- Escribano público

📋 **Tiempo:** Mismo día (si hay disponibilidad del escribano)
📋 **Costo:** Desde Gs. 200.000

¿Quieres que te conecte con un escribano?`,
};

const detectarIntencion = (mensaje: string): string | null => {
  const texto = mensaje.toLowerCase();
  if (texto.includes("migra") || texto.includes("residencia") || texto.includes("visa")) {
    return "migraciones";
  }
  if (texto.includes("ruc") || texto.includes("tributario") || texto.includes("set")) {
    return "ruc";
  }
  if (texto.includes("sociedad") || texto.includes("empresa") || texto.includes("constituir")) {
    return "sociedades";
  }
  if (texto.includes("poder") || texto.includes("notarial") || texto.includes("escribano")) {
    return "poderes";
  }
  return null;
};

export default function Chat() {
  const [conversacionActiva, setConversacionActiva] = useState<string>("1");
  const [mensajes, setMensajes] = useState<Record<string, Mensaje[]>>(mensajesIniciales);
  const [mensajeInput, setMensajeInput] = useState("");
  const [mostrarAdjuntos, setMostrarAdjuntos] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{
    nombre: string;
    tipo: string;
    tamaño: string;
  } | null>(null);
  const [escribiendo, setEscribiendo] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const conversacionActual = conversacionesMock.find((c) => c.id === conversacionActiva);
  const mensajesActuales = mensajes[conversacionActiva] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajesActuales]);

  const handleEnviarMensaje = () => {
    if (!mensajeInput.trim() && !archivoSeleccionado) return;

    const nuevoMensaje: Mensaje = {
      id: Date.now().toString(),
      remitente: "Tú",
      contenido: mensajeInput,
      fecha: new Date().toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" }),
      leido: false,
      tipo: archivoSeleccionado ? "documento" : "texto",
      estado: "enviado",
      archivo: archivoSeleccionado || undefined,
    };

    setMensajes({
      ...mensajes,
      [conversacionActiva]: [...mensajesActuales, nuevoMensaje],
    });

    setMensajeInput("");
    setArchivoSeleccionado(null);
    setMostrarAdjuntos(false);

    // Simular estado "entregado" después de 1 segundo
    setTimeout(() => {
      setMensajes((prev) => ({
        ...prev,
        [conversacionActiva]: prev[conversacionActiva].map((m) =>
          m.id === nuevoMensaje.id ? { ...m, estado: "entregado" } : m
        ),
      }));
    }, 1000);

    // Simular estado "leído" después de 2 segundos (solo si no es bot)
    if (conversacionActiva !== "1") {
      setTimeout(() => {
        setMensajes((prev) => ({
          ...prev,
          [conversacionActiva]: prev[conversacionActiva].map((m) =>
            m.id === nuevoMensaje.id ? { ...m, estado: "leido", leido: true } : m
          ),
        }));
      }, 2000);
    }

    // Respuesta del bot
    if (conversacionActiva === "1") {
      setEscribiendo(true);
      setTimeout(() => {
        const intencion = detectarIntencion(nuevoMensaje.contenido);
        const respuesta = intencion
          ? respuestasBot[intencion]
          : "Gracias por tu mensaje. Puedo ayudarte con:\n\n• Trámites migratorios\n• RUC y trámites tributarios\n• Constitución de sociedades\n• Poderes notariales\n\n¿Sobre qué tema necesitas información?";

        const respuestaBot: Mensaje = {
          id: (Date.now() + 1).toString(),
          remitente: "Bot Legal Py",
          contenido: respuesta,
          fecha: new Date().toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" }),
          leido: true,
          tipo: "texto",
          estado: "leido",
        };

        setMensajes((prev) => ({
          ...prev,
          [conversacionActiva]: [...prev[conversacionActiva], respuestaBot],
        }));

        setEscribiendo(false);
      }, 2000);
    }
  };

  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoSeleccionado({
        nombre: file.name,
        tipo: file.type || "application/pdf",
        tamaño: `${(file.size / 1024).toFixed(2)} KB`,
      });
      setMostrarAdjuntos(false);
    }
  };

  const getEstadoIcono = (estado?: string) => {
    switch (estado) {
      case "leido":
        return (
          <svg className="h-4 w-4 text-[#C9A24D]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "entregado":
        return (
          <svg className="h-4 w-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4 text-white/40" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Mensajes</h1>
        <p className="mt-2 text-white/70">
          Chat demo (sin backend). Incluye "bot legal" de asistencia con respuestas predefinidas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-250px)] min-h-[600px]">
        {/* Lista de Conversaciones */}
        <Card className="overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold text-[#C9A24D] mb-4">Conversaciones</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversacionesMock.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setConversacionActiva(conv.id)}
                className={`w-full text-left rounded-xl border p-3 transition ${
                  conversacionActiva === conv.id
                    ? "border-[#C9A24D] bg-[#C9A24D]/10"
                    : "border-white/10 bg-white/5 hover:border-[#C9A24D]/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{conv.nombre}</p>
                      {conv.online && (
                        <div className="h-2 w-2 rounded-full bg-green-500 shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-white/70 mt-1 truncate">{conv.ultimoMensaje}</p>
                    <p className="text-xs text-white/50 mt-1">{conv.fecha}</p>
                  </div>
                  {conv.noLeidos > 0 && (
                    <Badge variant="accent" className="shrink-0">
                      {conv.noLeidos}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Panel de Chat */}
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {/* Header del chat */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A24D]">
                <span className="text-sm font-bold text-black">
                  {conversacionActual?.nombre.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#C9A24D]">{conversacionActual?.nombre}</p>
                <div className="flex items-center gap-2">
                  {conversacionActual?.online ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-white/60">En línea</span>
                    </>
                  ) : (
                    <span className="text-xs text-white/60">Desconectado</span>
                  )}
                </div>
              </div>
            </div>
            {conversacionActual?.tipo === "bot" && (
              <Badge variant="accent" className="text-xs">
                🤖 Bot
              </Badge>
            )}
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {mensajesActuales.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`flex gap-2 ${
                  mensaje.remitente === "Tú" ? "justify-end" : "justify-start"
                }`}
              >
                {mensaje.remitente !== "Tú" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <span className="text-xs font-bold text-white">
                      {mensaje.remitente.charAt(0)}
                    </span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-3 ${
                    mensaje.remitente === "Tú"
                      ? "bg-[#C9A24D] text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {mensaje.archivo && (
                    <div className="mb-2 flex items-center gap-2 rounded-lg bg-black/20 p-2">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{mensaje.archivo.nombre}</p>
                        <p className="text-xs opacity-70">{mensaje.archivo.tamaño}</p>
                      </div>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{mensaje.contenido}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-70">{mensaje.fecha}</span>
                    {mensaje.remitente === "Tú" && getEstadoIcono(mensaje.estado)}
                  </div>
                </div>
              </div>
            ))}

            {escribiendo && (
              <div className="flex gap-2 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <span className="text-xs font-bold text-white">B</span>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="h-2 w-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Archivo seleccionado */}
          {archivoSeleccionado && (
            <div className="mb-2 flex items-center justify-between rounded-lg border border-[#C9A24D]/40 bg-[#C9A24D]/10 p-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg className="h-5 w-5 text-[#C9A24D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{archivoSeleccionado.nombre}</p>
                  <p className="text-xs text-white/60">{archivoSeleccionado.tamaño}</p>
                </div>
              </div>
              <button
                onClick={() => setArchivoSeleccionado(null)}
                className="text-white/60 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Input de mensaje */}
          <div className="flex gap-2 border-t border-white/10 pt-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={mensajeInput}
                onChange={(e) => setMensajeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleEnviarMensaje()}
                placeholder="Escribir mensaje..."
                className="w-full rounded-xl bg-white/10 px-4 py-2 pr-10 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60"
              />
              <button
                onClick={() => setMostrarAdjuntos(!mostrarAdjuntos)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 hover:bg-white/10 transition"
                aria-label="Adjuntar archivo"
              >
                <svg
                  className="h-5 w-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
            </div>
            <Button variant="primary" size="md" onClick={handleEnviarMensaje}>
              Enviar
            </Button>
          </div>

          {/* Panel de adjuntos */}
          {mostrarAdjuntos && (
            <div className="absolute bottom-20 left-4 right-4 rounded-xl border border-white/10 bg-[#13253A] p-4 shadow-lg">
              <p className="text-sm font-medium text-white mb-3">Adjuntar archivo</p>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 p-3 hover:bg-white/10 transition">
                <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-white/80">Seleccionar archivo</span>
                <input
                  type="file"
                  onChange={handleSeleccionarArchivo}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              <p className="mt-2 text-xs text-white/50">
                Formatos: PDF, DOC, DOCX, JPG, PNG (demo - no se sube realmente)
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
