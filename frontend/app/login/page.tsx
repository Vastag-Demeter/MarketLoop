"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/src/axios";
import { useAuth } from "@/src/context/AuthContext";
import Cookies from "js-cookie";
import { useCart } from "@/src/context/CartContext";
import { toast } from "sonner";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { login, config, isCustomer } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { fetchCart } = useCart();

  const [isInactive, setIsInactive] = useState(false);

  const [activationCode, setActivationCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsInactive(false);

    const loginAndSyncProcess = async () => {
      const loginRes = await api.post("/api/login", {
        email,
        password,
      });
      const loggedInUser = loginRes.data.user;
      login(loggedInUser);

      const sessionToken = Cookies.get("cart_session_id");
      if (sessionToken && isCustomer) {
        try {
          await api.put("/api/updateCart", {
            session_token: sessionToken,
          });
          await fetchCart();
        } catch (syncError) {
          console.error("CRITICAL_SYNC_FAILURE:", syncError);
        }
      }

      return loginRes.data;
    };

    toast.promise(loginAndSyncProcess(), {
      loading: "INITIALIZING_SECURE_LOGIN...",
      success: (data) => {
        router.push("/products");
        return `ACCESS_GRANTED: Welcome ${data.user.firstName + " " + data.user.lastName}`;
      },
      error: (err) => {
        console.log(err);
        const status = err.response?.status;
        const msg = err.response?.data?.error || "LOGIN_FAILED";

        if (status === 403) {
          setIsInactive(true);
          return (
            err.response.data.error || "ACCESS_DENIED: Activation Required"
          );
        }

        return msg;
      },
    });
  };

  const handleRequestActivation = async () => {
    const promise = api.put("/api/activateAccount", { email });
    toast.promise(promise, {
      loading: "TRANSMITTING_ACTIVATION_CODE...",
      success: (res) => {
        return res.data.msg || "CODE_SENT_TO_YOUR_TERMINAL";
      },
      error: (err) => {
        return err.response.data.error || "TRANSMISSION_FAILURE";
      },
    });
  };

  const handleVerifyCode = async () => {
    if (activationCode.length !== 6) {
      toast.error("INVALID_TOKEN_FORMAT");
      return;
    }

    const promise = api.put("/api/activateAccount", {
      email,
      code: activationCode,
    });
    toast.promise(promise, {
      loading: "VERIFYING_SECURITY_TOKEN...",
      success: (res) => {
        setIsInactive(false);
        setActivationCode("");
        return res.data.msg || "ACCOUNT_ACTIVATED_ACCESS_RESTORED";
      },
      error: "INVALID_OR_EXPIRED_TOKEN",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">
            System <span className="text-cyan-500">Access</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            Enter your credentials to establish connection
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Email_Address
              </label>
              <input
                type="email"
                required
                placeholder="example@network.com"
                className="w-full bg-slate-900/50 border border-slate-700/50 py-3.5 px-5 rounded-2xl text-sm focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                value={email}
                id="LoginPage.email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                id="LoginPage.password"
                className="w-full bg-slate-900/50 border border-slate-700/50 py-3.5 px-5 rounded-2xl text-sm focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              id="LoginPage.LoginBtn"
              className="w-full group mt-4 flex items-center justify-center gap-3 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98]"
            >
              Sign In
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          {isInactive && (
            <div className="mt-6 p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-1">
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em] text-center">
                  Identity_Not_Verified // Status_Locked
                </p>
                <p className="text-[9px] text-slate-500 text-center uppercase tracking-tighter">
                  Request a verification token to restore access
                </p>
              </div>
              <button
                type="button"
                onClick={handleRequestActivation}
                className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-cyan-500/30 active:scale-[0.97]"
              >
                Request_Code
              </button>
              <div className="text-center mb-8">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                  Enter the 6-digit sequence
                </p>
              </div>

              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                className="w-full bg-slate-950 border border-slate-800 py-5 px-2 rounded-2xl text-3xl text-center font-mono tracking-[0.4em] text-cyan-500 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-800 shadow-inner"
                value={activationCode}
                onChange={(e) =>
                  setActivationCode(e.target.value.replace(/\D/g, ""))
                }
                autoFocus
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-3.5 text-slate-500 text-[11px] font-bold uppercase hover:text-slate-300 transition-colors border border-transparent"
                >
                  Abort
                </button>
                <button
                  onClick={handleVerifyCode}
                  className="py-3.5 bg-cyan-600 text-slate-950 text-[11px] font-black uppercase rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20"
                >
                  Authorize
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-800/50 pt-8">
            <p className="text-sm text-slate-500">
              New to the market?{" "}
              <Link
                href="/signup"
                className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors"
              >
                Register account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
