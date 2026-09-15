import { Zap, ShieldCheck } from "lucide-react";

export default function OrderSummary({ cart }: any) {
  const items = cart?.cartItems || [];
  const subtotal = items.reduce((acc: number, item: any) => {
    const price =
      Number(item.variant.product.base_price) +
      Number(item.variant.price_modifier);
    return acc + price * item.quantity;
  }, 0);
  const shippingFee = 25;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 sticky top-12">
      <div className="flex items-center gap-2 mb-8 text-cyan-500/50">
        <Zap size={14} />{" "}
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
          Order_Summary
        </span>
      </div>
      <div className="space-y-4 mb-8 border-b border-slate-800 pb-8">
        <div className="flex justify-between text-sm font-bold uppercase">
          <span className="text-slate-500">Items</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm font-bold uppercase">
          <span className="text-slate-500">Logistics</span>
          <span>${shippingFee}</span>
        </div>
      </div>
      <div className="flex justify-between items-end mb-8">
        <span className="text-[10px] text-slate-500 uppercase font-black">
          Total_Payload
        </span>
        <span className="text-4xl font-black italic text-white">
          ${(subtotal + shippingFee).toLocaleString()}
        </span>
      </div>
      <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/10 flex items-center gap-3">
        <ShieldCheck size={20} className="text-emerald-500" />
        <span className="text-[9px] text-slate-400 uppercase font-bold leading-tight">
          Secure encryption protocol active.
        </span>
      </div>
    </div>
  );
}
