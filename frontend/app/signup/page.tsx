"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/src/axios";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("A jelszavak nem egyeznek!");
      return;
    }

    const promise = api.post("/api/signup", {
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      password: formData.password,
    });

    toast.promise(promise, {
      loading: "Fiók létrehozása...",
      success: () => {
        setTimeout(() => router.push("/login"), 2000);
        return "Sikeres regisztráció!";
      },
      error: (err) =>
        err.response?.data?.error || "Hiba történt a regisztráció során.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            JOIN THE <span className="text-cyan-500">MARKET</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            Give some information to join
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  First_Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  className="w-full bg-slate-800/50 border border-slate-700/50 py-3.5 px-5 rounded-2xl text-sm focus:border-cyan-500/50 outline-none transition-all"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Last_Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  className="w-full bg-slate-900/50 border border-slate-700/50 py-3.5 px-5 rounded-2xl text-sm focus:border-cyan-500/50 outline-none transition-all"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Email_address
              </label>
              <input
                type="email"
                required
                placeholder="example@mail.com"
                className="w-full bg-slate-900/50 border border-slate-700/50 py-3.5 px-5 rounded-2xl text-sm focus:border-cyan-500/50 outline-none transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700/50 py-3.5 px-5 rounded-2xl text-sm focus:border-cyan-500/50 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Confirm_password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700/50 py-3.5 px-5 rounded-2xl text-sm focus:border-cyan-500/50 outline-none transition-all"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Fő gomb - Modern kék */}
            <button
              type="submit"
              className="w-full group mt-6 flex items-center justify-center gap-3 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98]"
            >
              Signup
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
