"use client";

import { useState, useEffect } from "react";
import { getUserNotifications, markAllNotificationsAsRead } from "@/lib/notifications";
import { Notification } from "@/lib/notifications";
import NotificationCard from "./NotificationCard";
import Button from "../Button";
import Card from "../Card";
import Link from "next/link";

interface NotificationPanelProps {
  userId: string;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
}

export default function NotificationPanel({
  userId,
  onClose,
  onMarkAsRead,
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = () => {
    const notifs = getUserNotifications(userId, { limit: 10 });
    setNotifications(notifs);
    setLoading(false);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(userId);
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => n.status !== "read").length;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] z-50">
      <Card className="max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Notificaciones</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Marcar todas como leídas
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition"
              aria-label="Cerrar"
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
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#C9A24D] border-r-transparent"></div>
              <p className="mt-2 text-sm text-white/60">Cargando notificaciones...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-white/10">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onClose={onClose}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <svg className="h-8 w-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <p className="text-white/60">No hay notificaciones</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <Link href="/notificaciones">
              <Button variant="outline" size="sm" className="w-full" onClick={onClose}>
                Ver todas las notificaciones
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
