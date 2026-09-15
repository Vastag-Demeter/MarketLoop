"use client";
import { useEffect, useState } from "react";
import api from "@/src/axios";
import { toast } from "sonner";
import {
  Building2,
  Edit3,
  Power,
  Activity,
  Save,
  X,
  Plus,
  ShieldCheck,
  Mail,
  ChevronDown,
} from "lucide-react";
import TerminalModal from "@/src/components/add_modal";

interface VendorEmail {
  id: number;
  email: string;
  is_active: boolean;
}

interface Vendor {
  id: number;
  name: string;
  is_active: boolean;
  emails: VendorEmail[];
}

export default function VendorManager() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedVendor, setExpandedVendor] = useState<number | null>(null);

  const [editingEmailId, setEditingEmailId] = useState<number | null>(null);
  const [editEmailValue, setEditEmailValue] = useState("");
  const [newEmailValues, setNewEmailValues] = useState<{
    [key: number]: string;
  }>({});

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/getAllVendors");
      setVendors(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("SYSTEM_ERROR: VENDOR_REGISTRY_FETCH_FAILED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCreateVendor = async (name: string) => {
    const promise = api.post("/api/addVendor", { name });
    toast.promise(promise, {
      loading: "AUTHORIZING_NEW_VENDOR...",
      success: (res) => {
        fetchVendors();
        setIsModalOpen(false);
        return res.data.msg || "VENDOR_AUTHORIZED";
      },
      error: (err) => err.response?.data?.errors?.[0] || "AUTH_FAILED",
    });
  };

  const handleToggleActive = async (vendor: Vendor) => {
    const promise = api.patch(`/api/changeVendorActiveness`, { id: vendor.id });
    toast.promise(promise, {
      loading: "SYNCING_STATUS...",
      success: (res) => {
        fetchVendors();
        return res.data.msg;
      },
      error: (err) => err.response?.data?.errors?.[0] || "SYNC_FAILED",
    });
  };

  const handleUpdateName = async (id: number) => {
    if (!editName.trim()) return;
    const promise = api.put(`/api/updateVendor`, { name: editName, id: id });
    toast.promise(promise, {
      loading: "RECONFIGURING_NAME...",
      success: (res) => {
        fetchVendors();
        setEditingId(null);
        return res.data.msg;
      },
      error: (err) => err.response?.data?.errors?.[0] || "UPDATE_FAILED",
    });
  };

  const handleAddEmail = async (vendorId: number) => {
    const email = newEmailValues[vendorId];
    if (!email || !email.trim()) return;

    const promise = api.post("/api/addVendorEmail", {
      vendor_id: vendorId,
      email,
      is_primary: false,
    });
    toast.promise(promise, {
      loading: "INJECTING_EMAIL_ENDPOINT...",
      success: (res) => {
        fetchVendors();
        setNewEmailValues((prev) => ({ ...prev, [vendorId]: "" }));
        return res.data.msg;
      },
      error: (err) => err.response?.data?.errors?.[0] || "INJECTION_FAILED",
    });
  };

  const handleToggleEmailActive = async (emailId: number) => {
    const promise = api.patch(`/api/changeVendorEmailActiveness`, {
      id: emailId,
    });
    toast.promise(promise, {
      loading: "SWITCHING_ENDPOINT_STATE...",
      success: (res) => {
        fetchVendors();
        return res.data.msg;
      },
      error: (err) => err.response?.data?.errors?.[0] || "STATE_CHANGE_FAILED",
    });
  };

  const handleUpdateEmail = async (emailId: number) => {
    if (!editEmailValue.trim()) return;
    const promise = api.put(`/api/updateVendorEmail`, {
      id: emailId,
      email: editEmailValue,
    });
    toast.promise(promise, {
      loading: "REPATCHING_ENDPOINT...",
      success: (res) => {
        fetchVendors();
        setEditingEmailId(null);
        return res.data.msg;
      },
      error: (err) => err.response?.data?.errors?.[0] || "PATCH_FAILED",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pt-24 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-l-4 border-emerald-600 pl-6">
          <div>
            <div className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.4em] mb-1">
              Supply_Chain // Vendor_Management
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              Authorized_<span className="text-emerald-500">Vendors</span>
            </h1>
          </div>

          <button
            id="VendorPage.addBtn"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-white rounded-2xl transition-all group shadow-lg"
          >
            <Plus
              size={20}
              className="text-emerald-500 group-hover:rotate-90 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Register_New
            </span>
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center gap-3 text-emerald-500 animate-pulse uppercase text-[10px] font-black tracking-widest">
              <Activity size={18} /> Syncing_Registry...
            </div>
          ) : (
            vendors.map((v) => (
              <div key={v.id} className="flex flex-col">
                <div
                  className={`group bg-slate-900/30 border border-slate-800/60 backdrop-blur-md p-6 flex items-center justify-between transition-all hover:border-emerald-500/30 shadow-lg relative z-10 ${expandedVendor === v.id ? "rounded-t-2xl border-b-emerald-500/20" : "rounded-2xl"}`}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-2 h-2 rounded-full ${v.is_active ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-700"}`}
                    />

                    {editingId === v.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          id={"VendorPage.editInput-" + v.name}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-slate-950 border border-emerald-500/50 px-4 py-2 rounded-xl text-sm text-white focus:outline-none w-64"
                          autoFocus
                        />
                        <button
                          id={`VendorPage.saveVendor-${v.name}`}
                          onClick={() => handleUpdateName(v.id)}
                          className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedVendor(
                            expandedVendor === v.id ? null : v.id,
                          )
                        }
                      >
                        <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                          <ShieldCheck size={10} /> Node_Verified
                        </div>
                        <div className="text-lg font-bold text-white tracking-tight italic uppercase flex items-center gap-2">
                          <Building2 size={16} className="text-slate-700" />{" "}
                          {v.name}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      id={"VendorPage.editBtn-" + v.name}
                      onClick={() => {
                        setEditingId(v.id);
                        setEditName(v.name);
                      }}
                      className="p-3 bg-slate-800/50 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      id={"VendorPage.activenessBtn-" + v.name}
                      onClick={() => handleToggleActive(v)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        v.is_active
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                      }`}
                    >
                      <Power size={14} />
                      {v.is_active ? "Active" : "Inactive"}
                    </button>

                    <button
                      id={"VendorPage.emailsBtn-" + v.name}
                      onClick={() =>
                        setExpandedVendor(expandedVendor === v.id ? null : v.id)
                      }
                      className={`p-2 text-slate-500 transition-transform duration-300 ${expandedVendor === v.id ? "rotate-180 text-emerald-500" : ""}`}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </div>

                {expandedVendor === v.id && (
                  <div className="bg-slate-900/10 border-x border-b border-slate-800/60 rounded-b-2xl p-6 pt-8 -mt-2 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 mb-6">
                      <Mail size={14} className="text-emerald-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Communication_Endpoints
                      </span>
                    </div>

                    <div className="grid gap-3 mb-6">
                      {v.emails && v.emails.length > 0 ? (
                        v.emails.map((email) => (
                          <div
                            key={email.id}
                            className="group/email flex items-center justify-between bg-slate-950/40 border border-slate-800/40 p-4 rounded-xl hover:border-emerald-500/20 transition-all"
                          >
                            {editingEmailId === email.id ? (
                              <div className="flex items-center gap-2 w-full">
                                <input
                                  id={
                                    "VendorPage.editEmailInput-" + email.email
                                  }
                                  value={editEmailValue}
                                  onChange={(e) =>
                                    setEditEmailValue(e.target.value)
                                  }
                                  className="bg-slate-900 border border-emerald-500/50 px-3 py-1.5 rounded-lg text-sm text-white focus:outline-none flex-1"
                                  autoFocus
                                />
                                <button
                                  id={"VendorPage.saveEmailBtn-" + email.email}
                                  onClick={() => handleUpdateEmail(email.id)}
                                  className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                                >
                                  <Save size={16} />
                                </button>
                                <button
                                  onClick={() => setEditingEmailId(null)}
                                  className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${email.is_active ? "bg-emerald-500" : "bg-slate-800"}`}
                                  />
                                  <span
                                    className={`text-sm tracking-tight ${email.is_active ? "text-slate-200" : "text-slate-600 italic line-through"}`}
                                  >
                                    {email.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover/email:opacity-100 transition-opacity">
                                  <button
                                    id={
                                      "VendorPage.editEmailBtn-" + email.email
                                    }
                                    onClick={() => {
                                      setEditingEmailId(email.id);
                                      setEditEmailValue(email.email);
                                    }}
                                    className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-slate-800/50 rounded-lg transition-all"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    id={
                                      "VendorPage.changeEmailStatusBtn-" +
                                      email.email
                                    }
                                    onClick={() =>
                                      handleToggleEmailActive(email.id)
                                    }
                                    className={`p-2 rounded-lg transition-all ${email.is_active ? "text-emerald-600 hover:bg-emerald-500/10" : "text-slate-600 hover:bg-slate-800"}`}
                                  >
                                    <Power size={14} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-slate-700 italic uppercase py-4 text-center border border-dashed border-slate-800 rounded-xl">
                          No_Endpoints_Configured
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 p-2 bg-slate-950/60 rounded-2xl border border-slate-800/50 focus-within:border-emerald-500/30 transition-all">
                      <input
                        id={`VendorPage.emailNameInput-${v.name}`}
                        placeholder="ADD_NEW_ENDPOINT_ADDR..."
                        value={newEmailValues[v.id] || ""}
                        onChange={(e) =>
                          setNewEmailValues({
                            ...newEmailValues,
                            [v.id]: e.target.value,
                          })
                        }
                        className="bg-transparent border-none px-4 py-2 text-xs text-white focus:outline-none flex-1 font-mono"
                      />
                      <button
                        id={`VendorPage.addEmailBtn-${v.name}`}
                        onClick={() => handleAddEmail(v.id)}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        Add_Node
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <TerminalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateVendor}
          title="Register_Vendor"
          label="Vendor_Designation"
          placeholder="ENTER_VENDOR_NAME..."
        />

        <div className="mt-12 pt-8 border-t border-slate-900 flex justify-between items-center text-[8px] font-black text-slate-800 uppercase tracking-[0.5em]">
          <span>Core_Subsystem: Supply_Chain</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Security_Audit_Passed
          </div>
        </div>
      </div>
    </div>
  );
}
