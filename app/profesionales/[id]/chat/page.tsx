"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Image from "next/image";
import { mockProfesionales } from "@/lib/mock-data";

export default function ChatProfesional() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const profesional = mockProfesionales.find((p) => p.id === id);

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "system",
      content: `Hola, has iniciado un chat con ${profesional?.nombre || "el profesional"}.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  if (!profesional) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-white/70">Profesional no encontrado</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => router.push("/profesionales")}
            >
              Volver a Profesionales
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMsg]);

    // Simular respuesta del profesional
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "professional",
        content: `Gracias por tu mensaje. ${profesional.nombre} te responderá pronto. Esta es una demo de chat.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);

    setNewMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← Volver
        </Button>
        <div className="flex items-center gap-3 flex-1">
          {profesional.avatar ? (
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={profesional.avatar}
                alt={profesional.nombre}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#C08457] flex items-center justify-center text-white font-bold">
              {profesional.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{profesional.nombre}</h1>
            <p className="text-sm text-white/70">{profesional.titulo}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 ${
                  msg.sender === "user"
                    ? "bg-[#C9A24D] text-black"
                    : msg.sender === "system"
                    ? "bg-white/5 text-white/70 text-xs"
                    : "bg-white/10 text-white"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-white/10 p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
          />
          <Button type="submit" variant="primary">
            Enviar
          </Button>
        </form>
      </Card>
    </div>
  );
}
