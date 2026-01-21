"use client";

import { useState } from "react";
import Button from "./Button";
import { useI18n } from "./I18nProvider";

interface SearchBarProps {
  onSearch?: (service: string, location: string) => void;
  placeholder?: string;
  locationPlaceholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder,
  locationPlaceholder,
}: SearchBarProps) {
  const { t } = useI18n();
  const finalPlaceholder = placeholder || t("home.search_placeholder");
  const finalLocationPlaceholder = locationPlaceholder || t("home.location_placeholder");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(service, location);
    } else {
      // Demo: búsqueda básica - redirigir a profesionales con query
      const params = new URLSearchParams();
      if (service) params.set("q", service);
      if (location) params.set("loc", location);
      window.location.href = `/profesionales?${params.toString()}`;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <input
        type="text"
        value={service}
        onChange={(e) => setService(e.target.value)}
        placeholder={finalPlaceholder}
        className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <div className="relative flex-1">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={finalLocationPlaceholder}
          className="w-full rounded-xl bg-white/10 px-4 py-3 pl-10 outline-none ring-1 ring-white/10 focus:ring-[#C9A24D]/60 text-white placeholder-white/50"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <Button onClick={handleSearch} variant="primary" size="lg">
        {t("common.search")}
      </Button>
    </div>
  );
}
