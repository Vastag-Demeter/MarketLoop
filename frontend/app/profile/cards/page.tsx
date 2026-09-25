"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/axios";
import { toast } from "sonner";
import AddCardModal from "@/src/components/add_credit_card_modal";
import { ICreditCard } from "@/src/interfaces/card";
import CreditCard from "@/src/components/credit_card";
import axios from "axios";

export default function CardsPage() {
  const [creditCards, setCreditCards] = useState<ICreditCard[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const cards = await api.get("/api/getCreditCards");
      setCreditCards(cards.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.error || "Error during loading assets.";
        setError(msg);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("CONFIRM_ASSET_TERMINATION: Are you sure?")) return;

    const deletePromise = api.delete(`/api/deleteCreditCard`, {
      data: { id: parseInt(id) },
    });

    toast.promise(deletePromise, {
      loading: "COMMUNICATING_WITH_VAULT...",
      success: (response) => {
        setCreditCards((prev) =>
          prev.filter((card: ICreditCard) => card.id !== Number(id)),
        );

        return `${response.data.msg || "ASSET_DE-LINKED"}`;
      },
      error: (err) => {
        return err.response?.data?.error || "TERMINATION_FAILED";
      },
    });
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 p-8 md:p-12 font-mono flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {" "}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] text-cyan-600 font-black uppercase tracking-[0.3em]">
                Vault_Access_Authorized
              </span>
            </div>
            <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
              Secure <span className="text-cyan-500">_Assets_</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-[0.2em]">
              Financial_Node_Encryption:{" "}
              <span className="text-emerald-500">ACTIVE</span>
            </p>
          </div>

          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="group relative overflow-hidden px-8 py-4 bg-cyan-600 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)] active:scale-95"
          >
            <span className="relative z-10">+ Link_New_Asset</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs uppercase tracking-widest text-center">
            Critical_Error: {error}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-56 bg-slate-900/50 border border-slate-800 rounded-2xl"
              />
            ))}
          </div>
        ) : creditCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creditCards.map((card: ICreditCard) => (
              <CreditCard
                key={card.id}
                card={card}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 border-2 border-dashed border-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4 opacity-20 text-slate-500">💳</div>
            <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px]">
              No_Assets_Linked_To_This_Node
            </p>
          </div>
        )}
        <div className="mt-16 p-8 border border-slate-900 bg-slate-900/20 rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/30" />
          <div className="space-y-3 relative z-10">
            <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-wide">
              <span className="text-cyan-500 font-bold mr-2">
                {"//"} Notice:
              </span>
              Terminal uses end-to-end hardware isolation for all linked assets.
              Private keys are never stored on-cloud.
            </p>
            <div className="flex gap-6 text-[9px] text-slate-600 font-mono uppercase">
              <span>
                Status: <span className="text-emerald-600">OPERATIONAL</span>
              </span>
              <span>
                Firewall:{" "}
                <span className="text-emerald-600">LAYER_7_ACTIVE</span>
              </span>
              <span>
                Enc: <span className="text-slate-500">AES_256_GCM</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUserData}
      />
    </div>
  );
}
