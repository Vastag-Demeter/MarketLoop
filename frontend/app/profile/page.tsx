"use client";
import { useEffect, useState } from "react";
import api from "@/src/axios";
import { useRouter } from "next/navigation";
import ConfirmDisableModal from "@/src/components/confirm_disable_modal";
import DeactivatedModal from "@/src/components/deactivated_modal";
import EditIdentityModal from "@/src/components/edit_identity_modal";
import { useAuth } from "@/src/context/AuthContext";
interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  verified_at: string;
}

export default function ProfilePage() {
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isCustomer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(profileUser);
    console.log(user);
  }, [profileUser, user]);
  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/getProfileData");
      console.log(response.data.data);
      setProfileUser(response.data.data);
    } catch (error: any) {
      const msg =
        error.response?.data?.error || "Error during loading profile.";
      return msg;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDisabledOpen, setIsDisabledOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profileUser?.first_name || "",
    lastName: profileUser?.last_name || "",
  });

  const handleUpdate = async () => {
    try {
      await api.put("/api/editProfile", formData);
      fetchUserData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error during update: ", error);
    }
  };

  const handleDisable = async () => {
    try {
      const response = await api.delete("/api/disableAccount");
      if (response.status === 201) {
        localStorage.clear();
        setIsConfirmOpen(false);
        setIsDisabledOpen(true);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  if (loading) return <div className="text-white p-10">Loading...</div>;

  return (
    <div>
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 font-mono flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {" "}
          {/* Konténer szélessége korlátozva a fókusz miatt */}
          {/* Fő fejléc - Középre igazítva */}
          <div className="mb-16 flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
              <div className="text-[10px] text-cyan-500 tracking-[0.5em] animate-pulse uppercase font-black">
                Security_Protocol_v2.0
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              Terminal <span className="text-cyan-500">_Identity_</span>
            </h1>
          </div>
          {/* KÖZÉPSŐ PANEL */}
          <div className="relative group">
            {/* Külső dekoratív keret elemek (Sci-fi sarkok) */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-lg" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-slate-800 rounded-br-lg" />

            <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(6,182,212,0.1)] backdrop-blur-sm relative overflow-hidden">
              {/* Háttér ID vízjel */}
              <div className="absolute top-8 right-8 opacity-[0.03] text-8xl font-black italic uppercase select-none pointer-events-none">
                USER_01
              </div>

              <div className="relative z-10">
                <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                  <span className="w-8 h-px bg-cyan-500/30" />
                  Core_Identity_Parameters
                </h2>

                {/* Adat rács - 2 oszlopos elrendezés nagyobb kijelzőn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: "First_Name", value: profileUser?.first_name },
                    { label: "Last_Name", value: profileUser?.last_name },
                    {
                      label: "Email_Address",
                      value: profileUser?.email,
                      fullWidth: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={item.fullWidth ? "md:col-span-2" : ""}
                    >
                      <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1">
                        {item.label}
                      </label>
                      <div className="text-base font-bold text-slate-200 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 group-hover:border-cyan-500/20 transition-all duration-500 shadow-inner">
                        {item.value || "NULL_DATA"}
                      </div>
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label className="text-[9px] text-slate-500 uppercase tracking-[0.3em] block mb-2 ml-1">
                      Access_Authorization_Status
                    </label>
                    {profileUser?.verified_at == null ? (
                      <div className="flex items-center gap-3 text-xs text-amber-500 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 font-black tracking-widest uppercase">
                        <div className="w-2 h-2 rounded-full bg-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        Uncertified_Connection
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-xs text-emerald-500 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20 font-black tracking-widest uppercase">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Verified_Access_Clearance_At:{" "}
                        {profileUser?.verified_at
                          ? new Date(profileUser.verified_at)
                              .toLocaleString("hu-HU", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                              .replace(/\s/g, "")
                          : "PENDING_VERIFICATION"}
                      </div>
                    )}
                  </div>
                </div>

                {/* AKCIÓ GOMBOK - Egymás mellett/alatt stílusosan */}
                <div className="mt-16 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setFormData({
                        firstName: profileUser?.first_name || "",
                        lastName: profileUser?.last_name || "",
                      });
                      setIsModalOpen(true);
                    }}
                    className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.4)] active:scale-95"
                  >
                    Modify_Identity_Keys
                  </button>

                  {isCustomer && (
                    <button
                      onClick={() => setIsConfirmOpen(true)}
                      className="px-8 py-4 bg-transparent border border-red-500/20 text-red-500/40 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:border-red-500 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300"
                    >
                      Deactivate_Node
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Alsó technikai log */}
          <div className="mt-12 text-center">
            <p className="text-[8px] text-slate-700 font-mono uppercase tracking-[1em]">
              End_To_End_Hardware_Encryption_Active
            </p>
          </div>
        </div>
      </div>
      <EditIdentityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleUpdate}
      />
      <ConfirmDisableModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDisable}
      />
      <DeactivatedModal
        isOpen={isDisabledOpen}
        onExit={() => {
          setIsDisabledOpen(false);
          window.location.href = "/";
        }}
      />
    </div>
  );
}
