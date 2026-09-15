import { useState, useEffect } from "react";
import { Truck, CreditCard, MapPin, CheckCircle2 } from "lucide-react";
import api from "@/src/axios";
import DataInput from "./DataInput";
import { useAuth } from "@/src/context/AuthContext";

interface FormData {
  id: number;
  full_name: string;
  city: City;
  street: Street;
  house_number: number;
  phone: string;
  email: string;
  postal_code: string;
  selected_card_last_four: string;
}
interface PhoneNumber {
  id: number;
  phone_number: string;
}
interface PaymentMethod {
  id: number;
  name: string;
}
interface CreditCard {
  id: number;
  last_four: string;
}

interface City {
  id: number;
  name: string;
  postal_code: string;
}
interface Street {
  id: number;
  name: string;
}
export default function StepLogistics({
  formData,
  setFormData,
  onBack,
  onNext,
}: any) {
  const [savedAddresses, setSavedAddresses] = useState<FormData[]>([]);
  const [savedPhones, setSavedPhones] = useState<PhoneNumber[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [savedCards, setSavedCards] = useState<CreditCard[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const { user } = useAuth();
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    holder: "",
  });

  useEffect(() => {
    api
      .get("/api/getPaymentMethods")
      .then((payRes) => {
        if (payRes.data.data) {
          setPaymentMethods(payRes.data.data);
          if (payRes.data.data.length > 0) {
            setSelectedMethod(payRes.data.data[0]);
          }
        }
      })
      .catch((err) => console.error("PAYMENT_METHODS_FETCH_ERROR", err));

    if (user) {
      Promise.all([
        api.get("/api/getAddress"),
        api.get("/api/getCreditCards"),
        api.get("/api/getPhoneNumbers"),
      ])
        .then(([addrRes, cardRes, phoneRes]) => {
          if (addrRes.data.data) setSavedAddresses(addrRes.data.data);
          if (cardRes.data.data) setSavedCards(cardRes.data.data);
          if (phoneRes.data.data) setSavedPhones(phoneRes.data.data);
        })
        .catch((err) => console.error("AUTH_DATA_FETCH_ERROR", err));
    }
  }, [user]);

  const selectAddress = (data: FormData) => {
    setFormData((prev: any) => ({
      ...prev,
      full_name: data.full_name || prev.full_name,
      city: data.city?.name || "",
      postal_code: data.city?.postal_code || "",
      street: data.street?.name || "",
      house_number: data.house_number || "",
      phone: data.phone || prev.phone,
    }));
  };

  const selectPhone = (phoneNum: string) => {
    setFormData((prev: any) => ({
      ...prev,
      phone: phoneNum,
    }));
  };

  const handleNextAction = () => {
    setFormData({
      ...formData,
      payment_method: selectedMethod,
      selected_card_id: selectedCardId,
      new_card_data: selectedCardId ? null : cardDetails,
    });
    onNext();
  };

  const isCardPayment = selectedMethod?.name?.toLowerCase().includes("card");

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10 font-mono">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
        <Truck className="text-cyan-500" /> Logistics{" "}
        <span className="text-cyan-500">_SETUP_</span>
      </h2>

      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 font-black uppercase tracking-widest">
            Shipping_&_Customer_Data
          </span>
          <div className="h-[1px] flex-1 bg-slate-900"></div>
        </div>

        {savedAddresses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => selectAddress(addr)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  formData.street === addr.street?.name
                    ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <p className="font-black text-[10px] text-white uppercase mb-1 flex items-center gap-2">
                  <MapPin size={10} className="text-cyan-500" />{" "}
                  {addr.full_name || "Saved Profile"}
                </p>
                <p className="text-[9px] text-slate-500 uppercase leading-relaxed">
                  {addr.city?.postal_code} {addr.city?.name},{" "}
                  {addr.street?.name} {addr.house_number}.
                </p>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataInput
              label="Full_Name"
              value={formData.full_name}
              onChange={(v: FormData) =>
                setFormData({ ...formData, full_name: v })
              }
            />
            <DataInput
              label="Email"
              value={formData.email}
              onChange={(v: FormData) => setFormData({ ...formData, email: v })}
            />

            <div className="space-y-3">
              <DataInput
                label="Customer_Phone"
                placeholder="+36..."
                value={formData.phone}
                onChange={(v: FormData) =>
                  setFormData({ ...formData, phone: v })
                }
              />

              {savedPhones.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                  {savedPhones.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectPhone(p.phone_number)}
                      className={`text-[8px] font-black uppercase px-2 py-1 rounded border transition-all ${
                        formData.phone === p.phone_number
                          ? "bg-cyan-500 text-slate-950 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                          : "bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      {p.phone_number}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataInput
            label="City"
            value={formData.city}
            onChange={(v: FormData) => setFormData({ ...formData, city: v })}
          />
          <DataInput
            label="Postal_Code"
            value={formData.postal_code}
            onChange={(v: FormData) =>
              setFormData({ ...formData, postal_code: v })
            }
          />
          <DataInput
            label="Country"
            value={formData.country || "Hungary"}
            onChange={(v: FormData) => setFormData({ ...formData, country: v })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <DataInput
              label="Street"
              value={formData.street}
              onChange={(v: FormData) =>
                setFormData({ ...formData, street: v })
              }
            />
          </div>
          <DataInput
            label="Nr."
            value={formData.house_number}
            onChange={(v: FormData) =>
              setFormData({ ...formData, house_number: v })
            }
          />
        </div>
      </section>

      <section className="space-y-6 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] bg-cyan-500 text-slate-950 px-2 py-0.5 font-black uppercase tracking-widest">
            Payment_Selection
          </span>
          <div className="h-[1px] flex-1 bg-slate-900"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method)}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                selectedMethod?.id === method.id
                  ? "bg-cyan-500/10 border-cyan-500 shadow-lg"
                  : "bg-slate-900/50 border-slate-800"
              }`}
            >
              <div
                className={
                  selectedMethod?.id === method.id
                    ? "text-cyan-500"
                    : "text-slate-600"
                }
              >
                {method.name.toLowerCase().includes("card") ? (
                  <CreditCard size={24} />
                ) : (
                  <Truck size={24} />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {method.name}
              </span>
            </button>
          ))}
        </div>

        {isCardPayment && (
          <div className="animate-in slide-in-from-top-4 duration-300 space-y-6">
            {savedCards.length > 0 && (
              <div className="space-y-3">
                <p className="text-[9px] text-slate-500 font-black uppercase">
                  Vaulted_Methods:
                </p>
                {savedCards.map((card: CreditCard) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setSelectedCardId(card.id);
                      setFormData((p: FormData) => ({
                        ...p,
                        selected_card_last_four: card.last_four,
                      }));
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedCardId === card.id
                        ? "bg-cyan-500/10 border-cyan-500"
                        : "bg-slate-900/50 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard
                        size={18}
                        className={
                          selectedCardId === card.id
                            ? "text-cyan-500"
                            : "text-slate-600"
                        }
                      />
                      <span className="text-xs font-black text-white tracking-widest uppercase">
                        **** {card.last_four}
                      </span>
                    </div>
                    {selectedCardId === card.id && (
                      <CheckCircle2 size={16} className="text-cyan-500" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div
              className={`bg-slate-900/40 border p-8 rounded-[2.5rem] space-y-6 transition-all ${selectedCardId ? "opacity-30 pointer-events-none grayscale" : "opacity-100 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.3)]"}`}
            >
              <DataInput
                label="Card_Holder"
                placeholder="NAME ON CARD"
                value={cardDetails.holder}
                onChange={(v: string) =>
                  setCardDetails({ ...cardDetails, holder: v })
                }
              />
              <DataInput
                label="Number"
                placeholder="0000 0000 0000 0000"
                value={cardDetails.number}
                onChange={(v: string) =>
                  setCardDetails({ ...cardDetails, number: v })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <DataInput
                  label="Expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(v: string) =>
                    setCardDetails({ ...cardDetails, expiry: v })
                  }
                />
                <DataInput
                  label="CVC"
                  placeholder="***"
                  value={cardDetails.cvc}
                  onChange={(v: string) =>
                    setCardDetails({ ...cardDetails, cvc: v })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          &larr; Back
        </button>
        <button
          onClick={handleNextAction}
          className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
        >
          order_summary <CheckCircle2 size={16} />
        </button>
      </div>
    </div>
  );
}
