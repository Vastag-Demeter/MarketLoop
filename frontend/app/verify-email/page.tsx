"use client";
import api from "@/src/axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!token) {
        setStatus("error");
        return;
      }
    }, 0);

    const verifyToken = async () => {
      if (!token) return;

      const promise = api.post("/api/verifyEmail", { token: token });

      toast.promise(promise, {
        loading: "VERIFYING_EMAIL...",
        success: (res) => {
          setStatus("success");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return res.data.msg;
        },
        error: (error: any) => {
          const err = error.response?.data?.error || "VERIFICATION_FAILED";
          setStatus("error");
          return err;
        },
      });
    };

    verifyToken();
    return () => clearTimeout(timeout);
  }, [token, router]);

  const handleSendNewToken = async () => {
    if (!email) return;

    const promise = api.post("/api/sendNewToken", { email: email });

    toast.promise(promise, {
      loading: "SENDING_NEW_TOKEN...",
      success: (res) => {
        setStatus("success");
        setTimeout(() => {
          router.push("/");
        }, 3000);
        return res.data.msg;
      },
      error: (err: any) => {
        setStatus("error");
        return err.response?.data?.error || "FAILED_TO_SEND_TOKEN";
      },
    });
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center">
          <h1 className="text-2xl font-black text-white mb-4 italic uppercase">
            Loop <span className="text-cyan-500">Verify</span>()
          </h1>

          {status === "verifying" && (
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-400 font-mono text-sm tracking-widest animate-pulse">
                EXECUTING_VERIFICATION...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-green-400 space-y-4">
              <p className="font-bold">Email verified successfully!</p>
              <p className="text-slate-500 text-sm italic">
                Redirecting to login...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="ENTER_EMAIL_FOR_RECOVERY..."
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border border-slate-900 px-4 py-3 rounded-xl text-[11px] text-white focus:border-red-500/50 outline-none transition-all placeholder:text-slate-700 font-mono tracking-widest"
              />

              <button
                onClick={() => handleSendNewToken()}
                className="w-fit px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-900 rounded-lg hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
              >
                {">"} REQUEST_NEW_ACCESS_TOKEN
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-[10px] text-slate-600 font-mono break-all">
            TOKEN: {token || "NULL"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
