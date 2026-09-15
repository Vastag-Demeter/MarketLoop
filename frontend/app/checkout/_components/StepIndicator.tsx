import { ChevronRight } from "lucide-react";

export default function StepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  const steps = [
    { num: "01", label: "Inventory" },
    { num: "02", label: "Logistics" },
    { num: "03", label: "Execution" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div
            className={`flex items-center gap-3 transition-opacity ${currentStep >= i + 1 ? "opacity-100" : "opacity-30"}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${currentStep === i + 1 ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-white"}`}
            >
              {s.num}
            </div>
            <span
              className={`text-[10px] uppercase font-black ${currentStep === i + 1 ? "text-cyan-500" : "text-slate-500"}`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight size={14} className="text-slate-800" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
import React from "react";
