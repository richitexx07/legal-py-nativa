"use client";

import { useState, useEffect } from "react";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  Notification,
  NotificationChannel,
  NotificationType,
} from "@/lib/notifications";
import NotificationCard from "./NotificationCard";
import Card from "../Card";
import Button from "../Button";
import Badge from "../Badge";

interface NotificationListProps {
  userId: string;
}

export default function NotificationList({ userId }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterChannel, setFilterChannel] = useState<NotificationChannel | "all">("all");
  const [filterType, setFilterType] = useState<NotificationType | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [userId, filterChannel, filterType, showUnreadOnly]);

  const loadNotifications = () => {
    const filters: any = {};
    if (filterChannel !== "all") filters.channel = filterChannel;
    if (filterType !== "all") filters.type = filterType;
    if (showUnreadOnly) filters.unreadOnly = true;

    const notifs = getUserNotifications(userId, filters);
    setNotifications(notifs);
    setLoading(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(userId);
    loadNotifications();
  };

  const handleDelete = (notificationId: string) => {
    if (confirm("¿Estás seguro de eliminar esta notificación?")) {
      deleteNotification(notificationId);
      loadNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => n.status !== "read").length;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Canal:</span>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: "dark" }}
            >
              <option value="all">Todos</option>
              <option value="email">📧 Email</option>
              <option value="whatsapp">💬 WhatsApp</option>
              <option value="app">📱 App</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Tipo:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
              style={{ colorScheme: "dark" }}
            >
              <option value="all">Todos</option>
              <option value="case_created">Caso creado</option>
              <option value="case_updated">Caso actualizado</option>
              <option value="payment_registered">Pago registrado</option>
              <option value="international_case_created">Caso internacional</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/10 text-[#C9A24D] focus:ring-[#C9A24D]"
            />
            <span className="text-sm text-white/80">Solo no leídas</span>
          </label>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Marcar todas como leídas ({unreadCount})
            </Button>
          )}
        </div>
      </Card>

      {/* Lista */}
      {loading ? (
        <Card>
          <div className="p-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#C9A24D] border-r-transparent"></div>
            <p className="mt-2 text-sm text-white/60">Cargando notificaciones...</p>
          </div>
        </Card>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} hover>
              <NotificationCard
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(notification.id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
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
            {showUnreadOnly && (
              <p className="text-sm text-white/50 mt-1">
                No hay notificaciones no leídas con estos filtros.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
