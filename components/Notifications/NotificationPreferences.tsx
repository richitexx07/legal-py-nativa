"use client";

import { useState, useEffect } from "react";
import {
  NotificationPreferences,
  getNotificationPreferences,
  saveNotificationPreferences,
  NotificationType,
  NotificationPriority,
} from "@/lib/notifications";
import Card from "../Card";
import Button from "../Button";
import FormField from "../FormField";
import Badge from "../Badge";

interface NotificationPreferencesProps {
  userId: string;
}

const ALL_NOTIFICATION_TYPES: NotificationType[] = [
  "case_created",
  "case_updated",
  "case_assigned",
  "case_status_changed",
  "document_uploaded",
  "comment_added",
  "payment_registered",
  "payment_verified",
  "timeline_event",
  "checklist_completed",
  "international_case_created",
  "gep_gold_response",
  "consortium_response",
  "case_derived_to_gep",
  "case_derived_to_tier_premium",
  "case_derived_to_tier_standard",
  "gep_evaluation_window_expiring",
  "reminder",
  "alert",
  "system",
];

const PRIORITIES: NotificationPriority[] = ["low", "medium", "high", "urgent"];

const TYPE_LABELS: Record<NotificationType, string> = {
  case_created: "Caso creado",
  case_updated: "Caso actualizado",
  case_assigned: "Caso asignado",
  case_status_changed: "Estado de caso cambiado",
  document_uploaded: "Documento subido",
  comment_added: "Comentario agregado",
  payment_registered: "Pago registrado",
  payment_verified: "Pago verificado",
  timeline_event: "Evento en timeline",
  checklist_completed: "Tarea completada",
  international_case_created: "Caso internacional creado",
  gep_gold_response: "Respuesta GEP Gold",
  consortium_response: "Respuesta de consorcio",
  case_derived_to_gep: "Derivación a GEP Gold",
  case_derived_to_tier_premium: "Derivación Tier Premium",
  case_derived_to_tier_standard: "Derivación Tier Standard",
  gep_evaluation_window_expiring: "Ventana GEP expirando",
  reminder: "Recordatorios",
  alert: "Alertas",
  system: "Sistema",
};

export default function NotificationPreferencesComponent({ userId }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const prefs = getNotificationPreferences(userId);
    setPreferences(prefs);
    setLoading(false);
  }, [userId]);

  const handleToggleChannel = (channel: "email" | "whatsapp" | "app") => {
    if (!preferences) return;

    const newPrefs = { ...preferences };
    newPrefs[channel].enabled = !newPrefs[channel].enabled;
    setPreferences(newPrefs);
  };

  const handleToggleType = (channel: "email" | "whatsapp" | "app", type: NotificationType) => {
    if (!preferences) return;

    const newPrefs = { ...preferences };
    const types = newPrefs[channel].types;
    if (types.includes(type)) {
      newPrefs[channel].types = types.filter((t) => t !== type);
    } else {
      newPrefs[channel].types = [...types, type];
    }
    setPreferences(newPrefs);
  };

  const handleTogglePriority = (channel: "email" | "whatsapp" | "app", priority: NotificationPriority) => {
    if (!preferences) return;

    const newPrefs = { ...preferences };
    const priorities = newPrefs[channel].priority;
    if (priorities.includes(priority)) {
      newPrefs[channel].priority = priorities.filter((p) => p !== priority);
    } else {
      newPrefs[channel].priority = [...priorities, priority];
    }
    setPreferences(newPrefs);
  };

  const handleSetWhatsAppNumber = (phoneNumber: string) => {
    if (!preferences) return;

    const newPrefs = { ...preferences };
    newPrefs.whatsapp.phoneNumber = phoneNumber;
    setPreferences(newPrefs);
  };

  const handleToggleQuietHours = () => {
    if (!preferences) return;

    const newPrefs = { ...preferences };
    if (!newPrefs.quietHours) {
      newPrefs.quietHours = {
        enabled: true,
        start: "22:00",
        end: "08:00",
      };
    } else {
      newPrefs.quietHours.enabled = !newPrefs.quietHours.enabled;
    }
    setPreferences(newPrefs);
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    setSaved(false);

    const response = saveNotificationPreferences(preferences);
    if (response.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  if (loading || !preferences) {
    return (
      <Card>
        <div className="p-8 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#C9A24D] border-r-transparent"></div>
          <p className="mt-2 text-sm text-white/60">Cargando preferencias...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-white mb-4">Preferencias de Notificaciones</h2>
        <p className="text-sm text-white/70 mb-6">
          Configura cómo y cuándo recibir notificaciones. Los cambios se aplicarán a nuevas
          notificaciones.
        </p>

        {/* Email */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                📧 Email
              </h3>
              <p className="text-sm text-white/60">Recibe notificaciones por correo electrónico</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email.enabled}
                onChange={() => handleToggleChannel("email")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C9A24D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A24D]"></div>
            </label>
          </div>

          {preferences.email.enabled && (
            <div className="pl-4 space-y-4">
              <div>
                <p className="text-sm text-white/70 mb-2">Tipos de notificaciones:</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_NOTIFICATION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggleType("email", type)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition ${
                        preferences.email.types.includes(type)
                          ? "bg-[#C9A24D] text-black font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-2">Prioridades mínimas:</p>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handleTogglePriority("email", priority)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition ${
                        preferences.email.priority.includes(priority)
                          ? "bg-[#C9A24D] text-black font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {priority.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                💬 WhatsApp
              </h3>
              <p className="text-sm text-white/60">Recibe notificaciones por WhatsApp (mock)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.whatsapp.enabled}
                onChange={() => handleToggleChannel("whatsapp")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C9A24D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A24D]"></div>
            </label>
          </div>

          {preferences.whatsapp.enabled && (
            <div className="pl-4 space-y-4">
              <FormField label="Número de WhatsApp" htmlFor="whatsapp-number">
                <input
                  id="whatsapp-number"
                  type="tel"
                  value={preferences.whatsapp.phoneNumber || ""}
                  onChange={(e) => handleSetWhatsAppNumber(e.target.value)}
                  placeholder="+595 981 123456"
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
                <p className="text-xs text-white/60 mt-1">
                  Formato: +595 981 123456 (mock - no se envía realmente)
                </p>
              </FormField>

              <div>
                <p className="text-sm text-white/70 mb-2">Tipos de notificaciones:</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_NOTIFICATION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggleType("whatsapp", type)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition ${
                        preferences.whatsapp.types.includes(type)
                          ? "bg-[#C9A24D] text-black font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-2">Prioridades mínimas:</p>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handleTogglePriority("whatsapp", priority)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition ${
                        preferences.whatsapp.priority.includes(priority)
                          ? "bg-[#C9A24D] text-black font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {priority.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* App */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                📱 App (Futuro)
              </h3>
              <p className="text-sm text-white/60">Notificaciones push en la app móvil (placeholder)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.app.enabled}
                onChange={() => handleToggleChannel("app")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C9A24D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A24D]"></div>
            </label>
          </div>

          {preferences.app.enabled && (
            <div className="pl-4 space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.app.pushEnabled}
                    onChange={(e) => {
                      const newPrefs = { ...preferences };
                      newPrefs.app.pushEnabled = e.target.checked;
                      setPreferences(newPrefs);
                    }}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-[#C9A24D] focus:ring-[#C9A24D]"
                  />
                  <span className="text-sm text-white/80">Habilitar notificaciones push</span>
                </label>
                <p className="text-xs text-white/60 mt-1 ml-6">
                  (Placeholder - Funcionalidad futura)
                </p>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-2">Tipos de notificaciones:</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_NOTIFICATION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggleType("app", type)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition ${
                        preferences.app.types.includes(type)
                          ? "bg-[#C9A24D] text-black font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-2">Prioridades mínimas:</p>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handleTogglePriority("app", priority)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition ${
                        preferences.app.priority.includes(priority)
                          ? "bg-[#C9A24D] text-black font-semibold"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {priority.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Horas Silenciosas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">🌙 Horas Silenciosas</h3>
              <p className="text-sm text-white/60">
                No recibir notificaciones durante estas horas (excepto urgentes)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHours?.enabled || false}
                onChange={handleToggleQuietHours}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C9A24D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A24D]"></div>
            </label>
          </div>

          {preferences.quietHours?.enabled && (
            <div className="pl-4 grid grid-cols-2 gap-4">
              <FormField label="Inicio" htmlFor="quiet-start">
                <input
                  id="quiet-start"
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) => {
                    const newPrefs = { ...preferences };
                    if (newPrefs.quietHours) {
                      newPrefs.quietHours.start = e.target.value;
                    }
                    setPreferences(newPrefs);
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  style={{ colorScheme: "dark" }}
                />
              </FormField>
              <FormField label="Fin" htmlFor="quiet-end">
                <input
                  id="quiet-end"
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) => {
                    const newPrefs = { ...preferences };
                    if (newPrefs.quietHours) {
                      newPrefs.quietHours.end = e.target.value;
                    }
                    setPreferences(newPrefs);
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  style={{ colorScheme: "dark" }}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Botón guardar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {saved && (
            <p className="text-sm text-green-400">✓ Preferencias guardadas</p>
          )}
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar Preferencias"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
