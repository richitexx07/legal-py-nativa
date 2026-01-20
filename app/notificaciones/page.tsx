"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import Tabs from "@/components/Tabs";
import NotificationList from "@/components/Notifications/NotificationList";
import NotificationPreferences from "@/components/Notifications/NotificationPreferences";
import { getNotificationStats } from "@/lib/notifications";
import Card from "@/components/Card";

export default function NotificacionesPage() {
  const session = getSession();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
      return;
    }

    const notificationStats = getNotificationStats(session.user.id);
    setStats(notificationStats);
  }, [session]);

  if (!session) {
    return null;
  }

  const tabs = [
    {
      id: "list",
      label: "Notificaciones",
      content: <NotificationList userId={session.user.id} />,
    },
    {
      id: "preferences",
      label: "Preferencias",
      content: <NotificationPreferences userId={session.user.id} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Notificaciones</h1>
        <p className="mt-2 text-white/70">
          Gestiona tus notificaciones y preferencias de comunicación
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#C9A24D]">{stats.total}</p>
              <p className="text-sm text-white/70 mt-1">Total</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#C9A24D]">{stats.unread}</p>
              <p className="text-sm text-white/70 mt-1">No Leídas</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#C9A24D]">{stats.byChannel.email}</p>
              <p className="text-sm text-white/70 mt-1">📧 Email</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#C9A24D]">{stats.byChannel.whatsapp}</p>
              <p className="text-sm text-white/70 mt-1">💬 WhatsApp</p>
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Card>
        <Tabs tabs={tabs} defaultTab="list" />
      </Card>
    </div>
  );
}
