"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, Trash2, Loader2, Key } from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";

export default function CancelOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("number") || "",
  );
  const [cancelToken, setCancelToken] = useState(
    searchParams.get("token") || "",
  );
  const [isPending, setIsPending] = useState(false);
  console.log(cancelToken);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const promise = api.delete(
      `/api/cancelOrder/${cancelToken}/${orderNumber}`,
    );

    toast.promise(promise, {
      loading: "CANCELLING_ORDER...",
      success: (res) => {
        router.push("/products");
        return res.data.msg;
      },
      error: (error) => {
        return error.response.data.error;
      },
    });
    setIsPending(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/50 text-red-500 animate-pulse mb-2">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Order <span className="text-red-500">_Abort_</span>
          </h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            After the execution of this action the processing of the order will
            stop immediately.
          </p>
        </div>

        <form onSubmit={handleCancel} className="space-y-4">
          <div className="space-y-4 bg-slate-900/20 p-6 rounded-[2rem] border border-slate-800">
            {/* ORDER NUMBER */}
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-600 uppercase ml-2">
                Registry_ID
              </label>
              <input
                required
                type="text"
                placeholder="E.G. #123456"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-red-500/50 transition-all font-bold uppercase text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-600 uppercase ml-2">
                Authorization_Token
              </label>
              <div className="relative">
                <Key
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700"
                />
                <input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  value={cancelToken}
                  onChange={(e) => setCancelToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-red-500/50 transition-all font-bold text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-20 text-slate-950 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-red-500/20"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            Confirm_Termination
          </button>
        </form>

        <button
          onClick={() => router.back()}
          className="w-full text-center text-[10px] font-black text-slate-600 uppercase hover:text-white transition-colors"
        >
          &larr; Return_To_Safety
        </button>
      </div>
    </div>
  );
}
