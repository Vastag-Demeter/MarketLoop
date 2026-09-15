"use client";
import { useEffect, useState } from "react";
import { Package, ArrowUpRight, Activity } from "lucide-react";
import api from "@/src/axios";
import Link from "next/link";

interface Order {
  id: number;
  order_number: string;
  created_at: Date;
  total_amount: number;
  status: Status;
  items: OrderItem[];
}
interface Status {
  id: number;
  name: string;
}
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}
export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/myOrders")
      .then((res) => {
        setOrders(res.data.data || []);
      })
      .catch((err) => console.error("HISTORY_SYNC_FAILED", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status: Status) => {
    const statusName = typeof status === "object" ? status?.name : status;

    switch (statusName?.toLowerCase()) {
      case "completed":
        return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
      case "processing":
        return "text-cyan-500 border-cyan-500/20 bg-cyan-500/5 animate-pulse";
      case "shipped":
        return "text-amber-500 border-amber-500/20 bg-amber-500/5";
      default:
        return "text-slate-500 border-slate-800 bg-slate-900/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center font-mono text-cyan-500">
        <Activity className="animate-spin mb-4" size={32} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-black">
          Syncing_Order_Vault...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12 relative">
      {/* SCANLINE & GRID DECOR */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-50 opacity-20" />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-cyan-600 pl-6 py-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-cyan-700 uppercase tracking-[0.4em]">
              User_Profile // Data_Archive
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
              Order <span className="text-cyan-500">_History_</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-600">
            <span>
              Total_Nodes: {orders.length.toString().padStart(2, "0")}
            </span>
            <div className="h-4 w-[1px] bg-slate-800" />
            <span>Secure_Access_Enabled</span>
          </div>
        </header>

        {/* ORDER LIST */}
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Link
                key={order.order_number}
                href={`/order-status/${order.order_number}`}
                className="group block relative bg-slate-900/20 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 overflow-hidden"
              >
                {/* ID-CARD-LIKE LAYOUT */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center p-6 gap-6">
                  {/* ICON & DATE */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-1 shrink-0">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-500 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                      <Package size={20} />
                    </div>
                    <div className="md:mt-2">
                      <p className="text-[8px] text-slate-600 font-black uppercase">
                        Registry_Date
                      </p>
                      <p className="text-[10px] text-white font-bold tracking-tighter">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* ORDER NUMBER & PREVIEW */}
                  <div className="flex-1 space-y-1">
                    <p className="text-[8px] text-cyan-700 font-black uppercase tracking-widest">
                      Transaction_ID
                    </p>
                    <h3 className="text-lg font-black text-white italic tracking-tight uppercase group-hover:text-cyan-400 transition-colors">
                      #{order.order_number}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-md">
                      {order.items
                        ?.map((i: OrderItem) => `${i.quantity}x ${i.name}`)
                        .join(", ")}
                    </p>
                  </div>

                  {/* PRICE & STATUS */}
                  <div className="flex md:flex-col justify-between items-end md:text-right gap-2">
                    <div>
                      <p className="text-[8px] text-slate-600 font-black uppercase">
                        Value_Exchange
                      </p>
                      <p className="text-xl font-black text-white italic tracking-tighter">
                        ${Number(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}
                    >
                      {order.status.name || "In_Queue"}
                    </div>
                  </div>

                  {/* ACTION ARROW */}
                  <div className="hidden md:flex items-center pl-4 border-l border-slate-800/50">
                    <ArrowUpRight
                      className="text-slate-700 group-hover:text-cyan-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                      size={20}
                    />
                  </div>
                </div>

                {/* DECORATIVE BARCODE */}
                <div className="absolute top-0 right-0 h-full w-1 bg-cyan-500/0 group-hover:bg-cyan-500 transition-all" />
              </Link>
            ))
          ) : (
            <div className="py-20 border-2 border-dashed border-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-slate-700 text-center">
              <Package size={48} className="mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">
                No_Historical_Data_Found
              </p>
              <Link
                href="/"
                className="mt-4 text-cyan-500 text-[10px] font-bold hover:underline"
              >
                INITIALIZE_COMMERCE_PROTOCOL &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* FOOTER LEGEND */}
        <footer className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
              Completed_Node
            </div>
            <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />{" "}
              Processing_Link
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
