"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AssistantId = "justo" | "victoria";

interface SpeakOptions {
  assistant: AssistantId;
  text: string;
}

/**
 * Hook mock para demo de ElevenLabs (voz).
 * - Simula "hablar" con estado isSpeaking
 * - Reproduce un tono suave (WebAudio) para dar feedback
 * - NO integra servicios reales
 */
export function useElevenLabs() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopAudio = useCallback(() => {
    try {
      oscRef.current?.stop();
    } catch {
      // noop
    }
    oscRef.current = null;
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch {
        // noop
      }
    }
    gainRef.current = null;
    setIsSpeaking(false);
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const speak = useCallback(
    async ({ assistant, text }: SpeakOptions) => {

      stopAudio();
      setIsSpeaking(true);

      // Demo: tono distinto por asistente (grave vs. clara)
      const ctx = ensureAudioContext();
      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {
          // noop
        }
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = assistant === "justo" ? 130 : 220;
      gain.gain.value = 0.0001;

      osc.connect(gain);
      gain.connect(ctx.destination);

      // fade-in/out suave
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;

      // Parar automáticamente
      window.setTimeout(() => stopAudio(), 1200);
    },
    [ensureAudioContext, stopAudio]
  );

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
      try {
        audioCtxRef.current?.close();
      } catch {
        // noop
      }
      audioCtxRef.current = null;
    };
  }, [stopAudio]);

  return {
    isSpeaking,
    isRecording,
    speak,
    startRecording,
    stopRecording,
    stopAudio,
  };
}

