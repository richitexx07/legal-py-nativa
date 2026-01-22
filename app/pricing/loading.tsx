export default function PricingLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#0E1B2A]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#C9A24D]/40 border-t-[#C9A24D] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/70">Cargando planes...</p>
      </div>
    </div>
  );
}
