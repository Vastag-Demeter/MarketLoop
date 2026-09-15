"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Shield,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";
import DataInput from "@/app/checkout/_components/DataInput";

interface Role {
  id: number;
  name: string;
  is_active: boolean;
}

export default function CreateStaffPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
  });

  useEffect(() => {
    api
      .get("/api/getRoles")
      .then((res) => setRoles(res.data.data || []))
      .catch((err) => console.error("ROLE_FETCH_ERROR", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role_id) return toast.error("SELECT_ACCESS_LEVEL_REQUIRED");

    setIsSubmitting(true);
    const promise = api.post("/api/addStaff", formData);

    toast.promise(promise, {
      loading: "ADDING_STAFF...",
      success: (res) => {
        router.push("/superadmin/users");
        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.errors[0];
      },
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#020203] text-slate-300 font-mono p-4 md:p-12">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b border-slate-900 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-cyan-600 uppercase tracking-[0.4em]">
              Administration // Security_Vault
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
              <UserPlus className="text-cyan-500" /> Create{" "}
              <span className="text-cyan-500">_Staff_</span>
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="p-3 rounded-xl border border-slate-800 hover:border-slate-600 transition-all text-slate-500 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-slate-900/20 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataInput
              label="First_Name"
              placeholder="JOHNNY"
              value={formData.first_name}
              id={"AddStaffPage.firstName"}
              onChange={(v: string) =>
                setFormData({ ...formData, first_name: v })
              }
            />
            <DataInput
              label="Last_Name"
              id="AddStaffPage.lastName"
              placeholder="SILVERHAND"
              value={formData.last_name}
              onChange={(v: string) =>
                setFormData({ ...formData, last_name: v })
              }
            />
          </div>

          <DataInput
            label="Email_Address"
            id="AddStaffPage.email"
            placeholder="agent@webshop.hu"
            value={formData.email}
            onChange={(v: string) => setFormData({ ...formData, email: v })}
          />

          <DataInput
            label="Initial_Password"
            type="password"
            id="AddStaffPage.password"
            placeholder="********"
            value={formData.password}
            onChange={(v: string) => setFormData({ ...formData, password: v })}
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
              Primary_Access_Level (Role)
            </label>
            <div className="relative group">
              <Shield
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 group-focus-within:text-cyan-500"
                size={18}
              />
              <select
                id="AddStaffPage.selectRole"
                required
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({ ...formData, role_id: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-bold uppercase text-xs appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  SELECT_PERMISSIONS...
                </option>
                {roles.map((role) => (
                  <option
                    id={"AddStaffPage.option-" + role.name}
                    key={role.id}
                    value={role.id}
                    className="bg-slate-950 text-white"
                  >
                    {role.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              id="AddStaffPage.submitBtn"
              disabled={isSubmitting}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 text-slate-950 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle2 size={20} />
              )}
              Authorize_Staff_Member
            </button>
          </div>

          <div className="absolute top-0 right-0 w-1 h-full bg-cyan-500/10" />
        </form>

        <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          Warning: Unauthorized creation of high-level accounts is logged in the
          system audit trail.
        </p>
      </div>
    </div>
  );
}
