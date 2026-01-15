import { ReactNode } from "react";
import Button from "./Button";

export interface Document {
  id: string;
  name: string;
  type?: string;
  size?: string;
  uploadedAt?: string;
  price?: string;
  actions?: ReactNode;
}

interface DocumentListProps {
  documents: Document[];
  onUpload?: () => void;
  showUpload?: boolean;
  className?: string;
}

export default function DocumentList({
  documents,
  onUpload,
  showUpload = true,
  className = "",
}: DocumentListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#13253A] p-4"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <svg
                className="h-6 w-6 text-white/60"
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
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">{doc.name}</p>
              <div className="mt-1 flex gap-3 text-xs text-white/60">
                {doc.type && <span>{doc.type}</span>}
                {doc.size && <span>{doc.size}</span>}
                {doc.uploadedAt && <span>{doc.uploadedAt}</span>}
                {doc.price && <span className="text-[#C9A24D]">{doc.price}</span>}
              </div>
            </div>
          </div>
          {doc.actions || (
            <Button variant="outline" size="sm">
              Descargar
            </Button>
          )}
        </div>
      ))}

      {showUpload && onUpload && (
        <button
          onClick={onUpload}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-6 transition hover:border-[#C9A24D]/40 hover:bg-white/10"
        >
          <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-medium text-white">Subir Documento</span>
        </button>
      )}
    </div>
  );
}
