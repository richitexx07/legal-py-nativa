"use client";

import { useState, useEffect } from "react";
import { getPrivacyPolicy, savePrivacyPolicy, LegalContent } from "@/lib/legal-content";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";
import Badge from "@/components/Badge";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const policy = getPrivacyPolicy();
    setContent(policy);
    setEditedContent(policy.content);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!content) return;

    setSaving(true);
    const updated: LegalContent = {
      ...content,
      content: editedContent,
      lastUpdated: new Date().toISOString(),
      version: content.version + 1,
    };

    savePrivacyPolicy(updated);
    setContent(updated);
    setIsEditing(false);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    if (content) {
      setEditedContent(content.content);
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-PY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderContent = (text: string) => {
    // Simple markdown rendering
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="text-white/90 font-semibold mt-4 mb-2">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-white/80 leading-relaxed mb-3">
          {line}
        </p>
      );
    });
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#C9A24D] border-r-transparent"></div>
          <p className="mt-4 text-white/60">Cargando política de privacidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">{content.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-white/60">
              Última actualización: {formatDate(content.lastUpdated)}
            </p>
            <Badge variant="outline" className="text-xs">
              Versión {content.version}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              ✏️ Editar
            </Button>
          )}
          <Link href="/register">
            <Button variant="ghost" size="sm">
              ← Volver
            </Button>
          </Link>
        </div>
      </div>

      {saved && (
        <div className="rounded-lg bg-green-500/20 border border-green-500/50 p-3">
          <p className="text-sm text-green-400">✓ Política actualizada correctamente</p>
        </div>
      )}

      {/* Content */}
      <Card>
        {isEditing ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Edita el contenido de la política de privacidad. Usa Markdown para formato.
            </p>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={30}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
              placeholder="Contenido de la política de privacidad..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none space-y-4">
            {renderContent(content.content)}
          </div>
        )}
      </Card>

      {/* Footer */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-400 mb-1">
              Aceptación de Políticas
            </p>
            <p className="text-xs text-white/70 leading-relaxed">
              Al registrarte en Legal PY, aceptas esta Política de Privacidad. Esta política puede
              ser actualizada periódicamente. Te notificaremos de cambios significativos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
