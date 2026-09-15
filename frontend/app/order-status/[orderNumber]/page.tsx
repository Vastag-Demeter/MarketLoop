"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { CheckCircle2, Truck, Home, Activity, Trash2 } from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

interface Order {
  id: number;
  cancel_token: string;
  status: Status;
  customer_name: string;
  customer_phone: string;
  shipping_address: Address;
  total_amount: number;
  items: OrderItem[];
}
interface Status {
  id: number;
  name: string;
  is_final: boolean;
}
interface Address {
  id: number;
  city: string;
  country: string;
  street: string;
  house_number: string;
}
interface OrderItem {
  id: number;
  name: string;
  unit_price: number;
  quantity: number;
}
export default function OrderStatusPage() {
  const { orderNumber } = useParams();
  console.log("OrderNumber: ", orderNumber);
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    api
      .get(`/api/order/${orderNumber}`)
      .then((res) => {
        setOrder(res.data.data);
        setLoading(false);
        console.log(res.data.data);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  const handleCancelOrder = async () => {
    const promise = api.delete(
      `/api/cancelOrder/${order?.cancel_token}/${orderNumber}`,
    );

    toast.promise(promise, {
      loading: "CANCELLING_ORDER...",
      success: (res) => {
        router.push("/profile/orders");
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.errors[0];
      },
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-mono animate-pulse uppercase tracking-[0.5em]">
        Fetching_Registry_Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />

      <div className="max-w-3xl mx-auto space-y-8 relative">
        <div className="text-center space-y-4 py-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-4">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">
            Transaction <span className="text-emerald-500">_CONFIRMED_</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
            Order_ID: <span className="text-cyan-500">{orderNumber}</span>{" "}
            {"//"}
            Status: {order?.status.name}
          </p>
        </div>

        <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Truck size={12} /> Shipping_To
                </span>
                <div className="text-sm font-bold uppercase leading-relaxed">
                  <p className="text-white text-lg">
                    {order?.customer_name || "N/A"}
                  </p>
                  <p>
                    {order?.shipping_address?.city},{" "}
                    {order?.shipping_address?.street}{" "}
                    {order?.shipping_address?.house_number}
                  </p>
                  <p className="text-cyan-500/70">{order?.customer_phone}</p>
                </div>
              </div>
              <div className="text-right space-y-4">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                  Logistics_Status <Activity size={12} />
                </span>
                <div className="inline-block px-4 py-1 border border-cyan-500/30 bg-cyan-500/10 rounded-full">
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">
                    {order?.status?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-4">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Manifest_Contents
            </span>
            {order?.items?.map((item: OrderItem, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-2"
              >
                <div className="flex gap-4">
                  <span className="text-cyan-500 font-black">
                    {item.quantity}X
                  </span>
                  <span className="text-slate-300 uppercase italic font-bold">
                    {item.name}
                  </span>
                </div>
                <span className="text-white font-black">
                  ${item.unit_price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="p-8 bg-cyan-500/5 border-t border-slate-800 flex justify-between items-end">
            <div>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">
                Total_Value_Exchanged
              </p>
              <p className="text-4xl font-black italic text-white tracking-tighter">
                ${order?.total_amount?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="text-right flex gap-3 font-black text-[9px] uppercase text-slate-500 italic">
              <span>Vat_Incl</span>
              <span>/</span>
              <span>Tax_Paid_In_Full</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center pt-6 pb-20">
          {!order?.status.is_final && (
            <button
              onClick={() => handleCancelOrder()}
              className="flex items-center gap-2 px-6 py-3 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-black transition-all"
            >
              <Trash2 size={14} /> Cancel_Order
            </button>
          )}
          <button
            onClick={() => (window.location.href = "/products")}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Home size={14} /> Return_To_Nexus
          </button>
        </div>

        <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>
    </div>
  );
}
