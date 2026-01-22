"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import BiometricVerificationModal from "@/components/Security/BiometricVerificationModal";
import { InternshipCheckIn as CheckInType } from "@/lib/edu-types";

interface InternshipCheckInProps {
  internshipId: string;
  onCheckIn: (checkIn: CheckInType) => void;
}

export default function InternshipCheckIn({ internshipId, onCheckIn }: InternshipCheckInProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleCheckIn = async (photoDataUrl: string) => {
    setIsCheckingIn(true);
    
    // Obtener geolocalización
    let location = { latitude: 0, longitude: 0, address: "" };
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: "Ubicación verificada", // En producción, hacer reverse geocoding
      };
    } catch (error) {
      console.error("Error getting location:", error);
      // Continuar sin geolocalización si falla
    }

    const now = new Date();
    const checkIn: CheckInType = {
      id: `checkin_${Date.now()}`,
      studentId: "current_student", // En producción, obtener del session
      internshipId,
      checkInDate: now.toISOString().split("T")[0],
      checkInTime: now.toTimeString().split(" ")[0].slice(0, 5),
      location,
      photoDataUrl,
      verified: false,
    };

    // Guardar en localStorage (simulación)
    const existingCheckIns = JSON.parse(localStorage.getItem(`internship_${internshipId}_checkins`) || "[]");
    existingCheckIns.push(checkIn);
    localStorage.setItem(`internship_${internshipId}_checkins`, JSON.stringify(existingCheckIns));

    onCheckIn(checkIn);
    setIsModalOpen(false);
    setIsCheckingIn(false);
  };

  return (
    <>
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">📍 Marcar Asistencia</h3>
            <p className="text-sm text-white/70">Check-in biométrico en Juzgado/Estudio</p>
          </div>
          <span className="text-4xl">📸</span>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={isCheckingIn}
          className="w-full rounded-xl py-3"
        >
          {isCheckingIn ? "Procesando..." : "📸 Marcar Asistencia Ahora"}
        </Button>
        <p className="text-xs text-white/50 mt-3 text-center">
          Se requiere geolocalización y foto para validar tu asistencia
        </p>
      </Card>

      {isModalOpen && (
        <BiometricVerificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onVerify={handleCheckIn}
          isMandatory={false}
        />
      )}
    </>
  );
}
