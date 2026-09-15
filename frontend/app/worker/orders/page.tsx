"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Package,
  Search,
  RefreshCw,
  AlertTriangle,
  Activity,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import api from "@/src/axios";
import { toast } from "sonner";

interface Status {
  id: number;
  name: string;
  is_final: boolean;
}

interface Address {
  country: string;
  city: string;
  street: string;
  house_number: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: Status;
  shipping_address: Address;
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statusesRes] = await Promise.all([
        api.get("/api/getOrders"),
        api.get("/api/getOrderStatuses"),
      ]);
      setOrders(ordersRes.data.data || []);
      setStatuses(statusesRes.data.data || []);
    } catch (err) {
      console.error("DATA_SYNC_FAILED", err);
      toast.error("DATABASE_LINK_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        activeStatusFilter === "ALL" ||
        order.status.name === activeStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, activeStatusFilter]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
      case "SHIPPED":
        return "text-amber-500 border-amber-500/20 bg-amber-500/5";
      case "PROCESSING":
        return "text-cyan-500 border-cyan-500/20 bg-cyan-500/5";
      default:
        return "text-slate-500 border-slate-800 bg-slate-900/50";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center font-mono text-cyan-500">
        <Activity className="animate-spin mb-4" size={32} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-black">
          Syncing_Logistics_Data...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-50 opacity-20" />

      <div className="max-w-6xl mx-auto space-y-10 relative">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-cyan-600 pl-6">
          <div>
            <div className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.4em]">
              Logistics_Control // Node_01
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
              Order_
              <span className="text-cyan-500 underline decoration-cyan-500/20">
                Manifest
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700"
                size={16}
              />
              <input
                type="text"
                placeholder="SEARCH_BY_ORDER_OR_NAME..."
                className="w-full bg-slate-950 border border-slate-900 py-3 pl-12 pr-4 rounded-xl text-[10px] text-white focus:border-cyan-500/50 transition-all uppercase tracking-widest"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => fetchData()}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-700 hover:text-cyan-500 hover:border-cyan-500/30 transition-all"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveStatusFilter("ALL")}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
              activeStatusFilter === "ALL"
                ? "bg-cyan-600 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600"
            }`}
          >
            [ All_Deployments ]
          </button>
          {statuses?.map((stat, index) => (
            <button
              key={stat.id || `status-${index}`}
              onClick={() => setActiveStatusFilter(stat.name)}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                activeStatusFilter === stat.name
                  ? "bg-cyan-600 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-600"
              }`}
            >
              {stat.name}
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="group bg-slate-950 border border-slate-900 hover:border-cyan-500/30 rounded-[2rem] p-6 transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-6"
              >
                {/* ID & ICON */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-500 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all">
                    <Package size={22} />
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em]">
                      Registry_ID
                    </div>
                    <div className="text-[12px] text-white font-bold italic">
                      #{order.order_number}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">
                    Shipping_Recipient
                  </div>
                  <div className="text-sm font-black text-white uppercase italic tracking-tight">
                    {order.customer_name || "GUEST_USER"}
                    <span className="mx-2 text-slate-800">{"//"}</span>
                    <span className="text-slate-400 font-medium">
                      {order.shipping_address?.country +
                        " " +
                        order.shipping_address?.city +
                        " " +
                        order.shipping_address.street +
                        " " +
                        order.shipping_address.house_number}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <div
                    className={`px-4 py-2 border rounded-full text-[9px] font-black uppercase tracking-widest text-center ${getStatusColor(order.status.name)}`}
                  >
                    {order.status.name}
                  </div>
                </div>
                {!order.status.is_final && (
                  <Link
                    href={`/worker/order-by-id/${order.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 bg-cyan-600 text-slate-950 rounded-2xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20 group/btn min-w-[140px]"
                  >
                    <div className="flex items-center gap-4 ml-auto lg:border-l lg:border-slate-900 lg:pl-8">
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[7px] font-black uppercase tracking-[0.3em] leading-none mb-1.5 opacity-80">
                          Process_Data
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                          Open_Order
                        </span>
                      </div>

                      <div className="bg-slate-950/10 p-1.5 rounded-lg group-hover/btn:bg-slate-950/20 transition-colors">
                        <ChevronRight
                          size={18}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="py-24 border-2 border-dashed border-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-slate-700">
              <AlertTriangle size={40} className="mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                No_Matching_Shipments_Found
              </p>
            </div>
          )}
        </div>

        <footer className="pt-10 border-t border-slate-900 flex justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            Active_Logistics_Entries: {filteredOrders.length}
          </div>
          <div>Secure_Worker_Layer_v1.2</div>
        </footer>
      </div>
    </div>
  );
}
