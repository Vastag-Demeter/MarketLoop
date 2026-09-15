"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Smartphone,
  Trash2,
  Loader2,
  Radio,
  Activity,
} from "lucide-react";
import api from "@/src/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddPhoneModal from "@/src/components/customer/add_phone_modal";
import EditPhoneModal from "@/src/components/customer/modals/edit_phone_modal";

interface PhoneNode {
  id?: number;
  phone_number: string;
}

export default function PhonePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [phones, setPhones] = useState<PhoneNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState<PhoneNode>({
    id: 0,
    phone_number: "",
  });

  const fetchPhones = async () => {
    try {
      const response = await api.get("/api/getPhoneNumbers");
      setPhones(response.data.data || []);
    } catch (error: any) {
      setError("UPLINK_SYNC_ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, [router]);

  const handleAddPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = api.post("/api/addPhoneNumber", {
      phone_number: formData.phone_number,
    });

    toast.promise(promise, {
      loading: "ESTABLISHING_FREQUENCY_LINK...",
      success: (response) => {
        setIsModalOpen(false);
        fetchPhones();
        return response.data.msg || `COMM_NODE_ESTABLISHED`;
      },
      error: (err) =>
        `CONNECTION_FAILED: ${err.response?.data?.errors[0] || "SIGNAL_LOST"}`,
    });
  };

  const handleDeletePhone = async (id: number) => {
    const promise = api.delete("/api/deletePhoneNumber", { data: { id } });

    toast.promise(promise, {
      loading: "TERMINATING_UPLINK...",
      success: (res) => {
        fetchPhones();
        return res.data.msg || "NODE_DECOMMISSIONED";
      },
      error: "TERMINATION_FAILED",
    });
  };

  const handleUpdatePhone = async () => {
    const promise = api.put("/api/updatePhoneNumber", {
      id: formData.id,
      phone_number: formData.phone_number,
    });

    toast.promise(promise, {
      loading: "UPDATING_UPLINK...",
      success: (res) => {
        fetchPhones();
        setIsEditModalOpen(false);
        return res.data.msg || "NODE_UPDATED";
      },
      error: (err) => {
        return (
          err.response.data.error ||
          err.response.data.errors[0] ||
          "UPDATION_FAILED..."
        );
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono">
        <div className="relative">
          <Loader2 className="text-cyan-500 animate-spin mb-4" size={48} />
          <div className="absolute inset-0 blur-xl bg-cyan-500/20 animate-pulse" />
        </div>
        <div className="text-[10px] text-cyan-500 tracking-[0.5em] uppercase font-black animate-pulse">
          Scanning_Frequencies...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 font-mono flex flex-col items-center text-sm relative overflow-hidden">
      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-50" />

      <div className="w-full max-w-5xl z-10">
        {/* HEADER */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4 text-[10px] text-cyan-500 tracking-[0.5em] font-black uppercase">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <Radio size={14} className="animate-pulse" />
            COMM_REGISTRY
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">
            Comm{" "}
            <span className="text-cyan-500 underline decoration-cyan-500/20 underline-offset-8">
              _Channels_
            </span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-4">
            Authorized Telecommunication Nodes only.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] uppercase tracking-widest text-center italic flex items-center justify-center gap-2">
            <Activity size={14} /> ALERT: {error}
          </div>
        )}

        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)] active:scale-95 group"
          >
            <Plus
              size={18}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Register_Frequency
          </button>
        </div>

        {/* PHONE LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {phones.length > 0 ? (
            phones.map((phone) => (
              <div
                key={phone.id}
                className="group relative bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-cyan-500/50 transition-all duration-500"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="text-3xl font-black text-white tracking-tighter italic uppercase group-hover:text-cyan-400 transition-colors">
                      {phone.phone_number}
                    </div>
                    <div className="flex gap-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                      <span>
                        Node_ID: {phone?.id.toString().padStart(4, "0")}
                      </span>
                      <span>Type: Mobile_Unit</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePhone(phone.id)}
                    className="p-4 bg-slate-950 text-slate-600 hover:text-red-500 border border-slate-900 rounded-2xl transition-all hover:border-red-500/30"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <button
                    onClick={() => {
                      setFormData(phone);
                      setIsEditModalOpen(true);
                    }}
                    className="w-full py-3 bg-cyan-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-cyan-600 hover:text-black transition-all"
                  >
                    UPDATE_NUMBER
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 border-2 border-dashed border-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-slate-700">
              <Smartphone size={48} className="mb-4 opacity-20" />
              <p className="text-xs font-black uppercase tracking-[0.3em]">
                No_Active_Uplinks_Found
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 opacity-20 text-[8px] tracking-[1em] text-slate-500 uppercase">
        NEO_CORP_SYSTEM_COMM_PROTOCOL_V.4.2.0
      </div>


      <AddPhoneModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
              }}
              onSave={handleAddPhone}
              formData={formData}
              setFormData={setFormData as any}
            />

            <EditPhoneModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              formData={formData}
              setFormData={setFormData as any}
              onUpdate={() => {
                handleUpdatePhone();
              }}
            />
    </div>
  );
}
