"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";

import StepIndicator from "./_components/StepIndicator";
import StepInventory from "./_components/StepInventory";
import StepLogistics from "./_components/StepLogisctics";
import StepExecution from "./_components/StepExecution";
import OrderSummary from "./_components/OrderSummary";

export default function CheckoutPage() {
  const { cart, loading, fetchCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    full_name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: "",
    country: "Hungary",
    city: "",
    postal_code: "",
    street: "",
    house_number: "",
    floor: "",
    door: "",
    payment_method: null,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-cyan-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <span className="tracking-[0.5em] uppercase text-[10px] font-black">
          Syncing_Secure_Cart...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {step === 1 && (
              <StepInventory cart={cart} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <StepLogistics
                formData={formData}
                setFormData={setFormData}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <StepExecution
                formData={formData}
                cart={cart}
                onBack={() => setStep(2)}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}
