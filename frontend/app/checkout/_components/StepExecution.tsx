import { useState } from "react";
import {
  ShieldCheck,
  Loader2,
  CreditCard,
  Package,
  MapPin,
  Phone,
  Wallet,
} from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";

interface Item {
  id: number;
  variant: Variant;
  quantity: number;
}
interface Variant {
  id: number;
  product: Product;
  variant_sku: string;
  price_modifier: number;
}
interface Product {
  id: number;
  name: string;
  base_price: number;
}

export default function StepExecution({ formData, cart, onBack }: any) {
  const [isExecuting, setIsExecuting] = useState(false);
  const router = useRouter();

  const { fetchCart } = useCart();
  const items = cart?.cartItems || [];
  const subtotal = items.reduce((acc: number, item: Item) => {
    const price =
      Number(item.variant.product.base_price) +
      Number(item.variant.price_modifier);
    return acc + price * item.quantity;
  }, 0);
  const shippingFee = 25;

  const handleCheckout = async () => {
    setIsExecuting(true);

    const address = {
      country: formData.country,
      postal_code: formData.postal_code,
      city: formData.city,
      street: formData.street,
      house_number: formData.house_number,
      floor: formData.floor || null,
      door: formData.door || null,
    };

    const payload = {
      customer_email: formData.email,
      customer_name: formData.full_name,
      customer_phone: formData.phone,
      payment_method_id: formData.payment_method?.id,
      shipping_cost: shippingFee,
      cart_id: cart.id,
      billing_address: address,
      shipping_address: address,
    };
    const promise = api.post("/api/addOrder", payload);

    toast.promise(promise, {
      loading: "ADDING_ORDER...",
      success: (res) => {
        fetchCart();
        setTimeout(() => {
          router.push(`/order-status/${res.data.order_number}`);
        }, 1500);
        return res.data.msg;
      },
      error: (err) => {
        console.log(err.response.data.errors);
        return "ERROR";
      },
    });
  };

  const getPaymentIcon = () => {
    const name = formData.payment_method_name?.toLowerCase() || "";
    if (name.includes("card")) return <CreditCard size={20} />;
    return <Wallet size={20} />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
        <ShieldCheck className="text-cyan-500" /> Final{" "}
        <span className="text-cyan-500">_EXECUTION_</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-500/50">
              <MapPin size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Delivery_&_Billing
              </span>
            </div>
            {formData.phone && (
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase italic">
                <Phone size={10} /> {formData.phone}
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-black text-white uppercase italic">
              {formData.full_name}
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase leading-relaxed">
              {formData.postal_code} {formData.city}
              <br />
              {formData.street} {formData.house_number}.<br />
              {formData.floor && `Floor: ${formData.floor}`}{" "}
              {formData.door && `Door: ${formData.door}`}
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-500/50">
            <CreditCard size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Payment_Source
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-500 shadow-inner">
                {getPaymentIcon()}
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase tracking-tighter">
                  {formData.payment_method.name || "Standard Procedure"}
                </p>
                {formData.selected_card_id ? (
                  <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase italic">
                    Vaulted **** {formData.selected_card_last_four || "XXXX"}
                  </p>
                ) : formData.new_card_data.number ? (
                  <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase italic">
                    Number:
                    {formData.new_card_data?.number?.slice(-4) || "XXXX"}
                    <br />
                    Name: {formData.new_card_data?.holder}
                    <br />
                    Expiry: {formData.new_card_data?.expiry}
                    <br />
                    CVC: {formData.new_card_data?.cvc}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 font-bold uppercase italic">
                    Ready for transmission
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-slate-800 rounded-[2rem] overflow-hidden">
        <div className="bg-slate-900/80 p-4 border-b border-slate-800 flex items-center gap-2 text-slate-400">
          <Package size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Order_Manifest
          </span>
        </div>
        <div className="max-h-60 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
          {items.map((item: Item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-xs border-b border-slate-900 pb-2"
            >
              <div className="flex gap-3 items-center">
                <span className="text-cyan-500 font-black">
                  {item.quantity}X
                </span>
                <span className="text-slate-300 font-bold uppercase italic tracking-tight">
                  {item.variant.product.name}
                </span>
              </div>
              <span className="text-white font-black">
                $
                {(
                  (Number(item.variant.product.base_price) +
                    Number(item.variant.price_modifier)) *
                  item.quantity
                ).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-900/20">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">
                Grand_Total_Secure
              </p>
              <p className="text-3xl font-black italic text-white leading-none tracking-tighter">
                ${(subtotal + shippingFee).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-slate-600 font-black uppercase italic tracking-tighter">
                Shipping (${shippingFee}) & Tax Incl.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-900">
        <button
          onClick={onBack}
          className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
        >
          &larr; Adjust_Parameters
        </button>
        <button
          onClick={handleCheckout}
          disabled={isExecuting}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-slate-950 px-10 py-5 rounded-2xl font-black uppercase text-sm flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
        >
          {isExecuting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <ShieldCheck size={18} />
          )}
          Authorize_Transaction
        </button>
      </div>
    </div>
  );
}
