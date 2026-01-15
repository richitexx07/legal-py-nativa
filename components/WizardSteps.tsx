interface WizardStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export default function WizardSteps({ steps, currentStep, className = "" }: WizardStepsProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                  isCompleted
                    ? "bg-[#C9A24D] text-black"
                    : isActive
                    ? "bg-[#C9A24D] text-black ring-4 ring-[#C9A24D]/30"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center ${
                  isActive ? "text-[#C9A24D] font-semibold" : "text-white/60"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  isCompleted ? "bg-[#C9A24D]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
