"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  Activity,
  Box,
} from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

interface Status {
  id: number;
  name: string;
  is_active: boolean;
}
interface OrderItem {
  id: number;
  name: string;
  variant_sku: string;
  quantity: number;
  unit_price: number;
}
interface Order {
  id: number;
  status: Status;
  order_number: string;
  total_amount: number;
  customer_name: string;
  items: OrderItem[];
  shipping_address: Address;
  created_at: Date;
}

interface Address {
  country: string;
  city: string;
  street: string;
  house_number: string;
  postal_code: string;
}
export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order>();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const [orderRes, statusRes] = await Promise.all([
        api.get(`/api/getOrderById/${id}`),
        api.get("/api/getOrderStatuses"),
      ]);
      setOrder(orderRes.data.data);
      setStatuses(statusRes.data.data);
    } catch (error) {
      console.log(error);
      toast.error("PROTOCOL_ERROR: DATA_UNREACHABLE");
      router.push("/worker/orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    console.log(order);
  }, [order]);

  const updateStatus = async (stat: Status) => {
    console.log(order?.id);
    console.log(stat);
    const promise = api.put("/api/changeOrderStatus", {
      id: order?.id,
      status_id: stat.id,
    });

    toast.promise(promise, {
      loading: "UPDATING_ORDER...",
      success: (res) => {
        const updatedStatus = statuses.find((s) => s.id === stat.id);
        setOrder({ ...order, status: updatedStatus });
        fetchData();
        return res.data.msg;
      },
      error: (err) => {
        console.log(err);
        return err.response?.data.errors[0] || "ERROR_DURING_UPDATE";
      },
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#020203] flex items-center justify-center font-mono text-cyan-500">
        <Activity className="animate-spin mr-3" /> LOADING_SECURE_MANIFEST...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Return_To_Registry
          </button>

          <div className="text-right">
            <div className="text-[10px] text-cyan-700 font-black tracking-[0.3em] uppercase">
              Manifest_ID
            </div>
            <h1 className="text-3xl font-black text-white italic">
              #{order?.order_number}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/20 border border-slate-900 rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-900 bg-slate-900/40 flex items-center gap-3">
                <Box className="text-cyan-500" size={20} />
                <h2 className="text-[12px] font-black uppercase tracking-widest text-white">
                  Consignment_Contents
                </h2>
              </div>

              <div className="p-8 space-y-6">
                {order?.items?.map((item: OrderItem, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-slate-800/50 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-600">
                        {/* Itt lehetne termék kép: <img src={item.image} /> */}
                        <Package size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white italic">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-black">
                          SKU: {item.variant_sku || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-cyan-500">
                        {item.quantity}x
                      </div>
                      <div className="text-sm font-bold text-slate-300">
                        ${item.unit_price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-8 py-6 bg-cyan-500/5 border-t border-slate-900 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Total_Value
                </span>
                <span className="text-2xl font-black text-white italic">
                  ${order?.total_amount}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-950 border-2 border-cyan-500/20 rounded-[2rem] p-6 space-y-4">
              <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={14} /> System_Status
              </div>

              <div className="grid grid-cols-1 gap-2">
                {statuses.map((stat) => (
                  <button
                    key={stat.id}
                    onClick={() => {
                      updateStatus(stat);
                    }}
                    className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      order?.status?.id === stat.id
                        ? "bg-cyan-600 border-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {stat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/20 border border-slate-900 rounded-[2rem] p-8 space-y-6">
              <div className="space-y-1">
                <div className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <User size={12} /> Recipient_Identity
                </div>
                <div className="text-sm font-bold text-white uppercase italic">
                  {order?.customer_name}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <MapPin size={12} /> Deployment_Zone
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {order?.shipping_address?.street}
                  <br />
                  {order?.shipping_address?.city},{" "}
                  {order?.shipping_address?.postal_code}
                  <br />
                  {order?.shipping_address?.country}
                </div>
              </div>

              <div className="space-y-1 pt-4 border-t border-slate-800/50">
                <div className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Calendar size={12} /> Registry_Date
                </div>
                <div className="text-xs text-slate-400">
                  {order?.created_at.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
