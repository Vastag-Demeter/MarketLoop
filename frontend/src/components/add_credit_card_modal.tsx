"use client";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/src/axios";
import axios from "axios";
import https from "https";
const tokenizeAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TOKENIZER_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "webshop",
  },
});

export default function AddCardModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    card_number: "",
    expiry_date: "",
    cvv: "",
    holder_name: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const processCardLinking = async () => {
      const agent = new https.Agent({ rejectUnauthorized: false });
      const tokenResponse = await tokenizeAPI.post("/tokenize", formData, {
        httpAgent: agent,
      });

      const { token, last_four, type, expiry_date } = tokenResponse.data.data;
      const dbData = {
        card_token: token,
        last_four: last_four,
        expiry: expiry_date,
        card_type: type,
      };
      const dbResponse = await api.post("/api/addCreditCard", dbData);

      return dbResponse;
    };

    toast.promise(processCardLinking(), {
      loading: "INITIATING_SECURE_VAULT_PROTOCOL...",
      success: (res) => {
        setLoading(false);
        onSuccess();
        onClose();
        setFormData({
          card_number: "",
          expiry_date: "",
          cvv: "",
          holder_name: "",
        });
        return res.data.msg || "ASSET_SECURED_SUCCESSFULLY";
      },
      error: (err) => {
        setLoading(false);

        return err.response?.data?.error || "PROTOCOL_FAILURE: Check console.";
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-mono">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-800 bg-slate-950/50">
          <div className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.3em] mb-1">
            Secure_Input_Node
          </div>
          <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">
            Link <span className="text-cyan-500">_New_Asset_</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
              Card_Holder_Name
            </label>
            <input
              required
              type="text"
              placeholder="JOHN DOE"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all uppercase font-bold"
              value={formData.holder_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  holder_name: e.target.value.toUpperCase(),
                })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
              Card_Number (16-Digit)
            </label>
            <input
              required
              type="text"
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-cyan-500 font-bold focus:border-cyan-500 outline-none transition-all"
              value={formData.card_number.replace(/(.{4})/g, "$1 ").trim()}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                if (rawValue.length <= 16) {
                  setFormData({ ...formData, card_number: rawValue });
                }
              }}
            />
          </div>

          <div className=" w-full items-center justify-center flex text-center">
            <div className="space-y-1 w-full justify-center items-center">
              <label className="text-[9px] text-slate-500 uppercase tracking-widest ml-1">
                Expiry (MM/YY)
              </label>
              <input
                required
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all text-center"
                value={formData.expiry_date}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");

                  if (value.length > 2) {
                    value = value.substring(0, 2) + "/" + value.substring(2, 4);
                  }

                  setFormData({ ...formData, expiry_date: value });
                }}
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
            >
              {loading ? "PROCESSING..." : "AUTHORIZE_&_LINK"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 bg-transparent border border-slate-800 text-slate-500 hover:text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all"
            >
              Abort_Transaction
            </button>
          </div>
        </form>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-[8px] text-slate-700 uppercase text-center tracking-[0.3em]">
          End-to-End AES-256 Bit Encryption Active
        </div>
      </div>
    </div>
  );
}
