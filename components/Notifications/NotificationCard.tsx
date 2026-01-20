"use client";

import { Notification } from "@/lib/notifications";
import Badge from "../Badge";
import Button from "../Button";
import Link from "next/link";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
  onClose?: () => void;
}

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationCardProps) {
  const isUnread = notification.status !== "read";
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} d`;
    return date.toLocaleDateString("es-PY", { month: "short", day: "numeric" });
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return "📧";
      case "whatsapp":
        return "💬";
      case "app":
        return "📱";
      default:
        return "🔔";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "";
    }
  };

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`p-4 hover:bg-white/5 transition cursor-pointer ${
        isUnread ? "bg-white/5" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">{getChannelIcon(notification.channel)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-sm ${isUnread ? "text-white" : "text-white/80"}`}>
              {notification.title}
            </h4>
            {notification.priority !== "low" && (
              <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                {notification.priority}
              </Badge>
            )}
          </div>
          <p className={`text-sm mb-2 ${isUnread ? "text-white/90" : "text-white/70"}`}>
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">{formatDate(notification.createdAt)}</span>
            {notification.actionUrl && (
              <Link href={notification.actionUrl} onClick={onClose}>
                <Button variant="ghost" size="sm" className="text-xs">
                  {notification.actionLabel || "Ver más"} →
                </Button>
              </Link>
            )}
          </div>
        </div>
        {isUnread && (
          <div className="h-2 w-2 rounded-full bg-[#C9A24D] shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
}
