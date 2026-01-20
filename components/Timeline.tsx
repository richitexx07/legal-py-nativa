import { ReactNode } from "react";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  status?: "pending" | "completed" | "in-progress" | "cancelled";
  metadata?: Record<string, string>;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export default function Timeline({ events, className = "" }: TimelineProps) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A24D]">
            <svg className="h-4 w-4 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C08457]">
            <div className="h-3 w-3 rounded-full bg-white"></div>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500">
            <svg className="h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#C9A24D] bg-transparent">
            <div className="h-2 w-2 rounded-full bg-[#C9A24D]"></div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4">
          {/* Timeline line */}
          {index < events.length - 1 && (
            <div className="absolute left-3 top-8 h-full w-0.5 bg-white/10"></div>
          )}

          {/* Icon */}
          <div className="relative z-10">{getStatusIcon(event.status)}</div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-white/60">{event.date}</p>
                <h4 className="mt-1 font-semibold text-white">{event.title}</h4>
                {event.description && (
                  <p className="mt-2 text-sm text-white/70">{event.description}</p>
                )}
                {event.metadata && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <p key={key} className="text-xs text-white/50">
                        {key}: {value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
