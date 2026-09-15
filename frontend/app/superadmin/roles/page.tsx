"use client";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Search,
  Plus,
  Loader2,
  Settings2,
  Fingerprint,
  ShieldX,
  Activity,
  Check,
  X,
} from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";
import { Role } from "@/src/interfaces/user";
import CreateRoleModal from "@/src/components/superadmin/create_role_modal";
import StatusToggleModal from "@/src/components/superadmin/toggle_role_modal";
import EditRoleModal from "@/src/components/superadmin/edit_role_modal";

interface Permission {
  id: number;
  key: string;
  name: string;
  role: { role_id: number }[];
}

export default function SuperadminRolesPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "matrix">("roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get("/api/getRoles"),
        api.get("/api/getPermissions"),
      ]);
      setRoles(rolesRes.data.data || []);
      setPermissions(permsRes.data.data || []);
    } catch (error) {
      console.error("SYNC_ERROR", error);
      toast.error("DATA_SYNC_FAILURE: Access_Denied");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = (role: Role | null) => {
    if (!role) return;
    const promise = api.patch("/api/changeRoleActiveness", { id: role.id });
    toast.promise(promise, {
      loading: "UPDATING_PROTOCOL...",
      success: (res) => {
        fetchData();
        return res.data.msg;
      },
      error: (err) => err.response?.data?.error || "Update_Failed",
    });
  };

  const togglePermissionMapping = async (
    roleId: number,
    permId: number,
    isAssigned: boolean,
  ) => {
    const endpoint = isAssigned
      ? "/api/removePermissionRole"
      : "/api/addPermissionRole";
    const method = isAssigned ? "put" : "post";

    try {
      await api[method](endpoint, { role_id: roleId, permission_id: permId });
      toast.success("MATRIX_BIT_FLIPPED");
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error("MATRIX_SYNC_FAILED");
    }
  };
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-cyan-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <span className="tracking-[0.5em] uppercase text-[10px] font-black">
          Analyzing_Clearance_Levels...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-cyan-500" size={24} />
              <span className="text-[10px] text-cyan-500/50 tracking-[0.4em] font-black uppercase italic">
                Access_Control_Unit
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              Clearance <span className="text-cyan-500">_PROTOCOLS_</span>
            </h1>
          </div>

          <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("roles")}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "roles" ? "bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-500/20" : "text-slate-500 hover:text-white"}`}
            >
              Clearance_Layers
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "matrix" ? "bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-500/20" : "text-slate-500 hover:text-white"}`}
            >
              Permission_Matrix
            </button>
          </div>
        </div>

        {activeTab === "roles" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
              <div className="max-w-md relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  id="RolePage.filterInput"
                  type="text"
                  placeholder="Filter_by_protocol_name..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                id="RolePage.addRoleBtn"
                onClick={() => setIsAddRoleModalOpen(true)}
                className="flex items-center gap-3 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 group"
              >
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform"
                />
                Initialize_New_Protocol
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles
                .filter((r) =>
                  r.name.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((role: Role) => (
                  <div
                    key={role.id}
                    className={`relative group border rounded-[2rem] p-8 transition-all duration-500 ${role.is_active ? "bg-slate-900/30 border-slate-800 hover:border-cyan-500/30" : "bg-slate-950/50 border-rose-900/20 grayscale-[0.5]"}`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                      {role.is_active ? (
                        <Fingerprint size={80} />
                      ) : (
                        <ShieldX size={80} />
                      )}
                    </div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-2">
                        <div
                          className={`px-3 py-1 rounded-lg border font-black text-[9px] tracking-[0.2em] uppercase ${role.is_active ? "text-cyan-400 border-cyan-400/20 bg-cyan-400/5" : "text-slate-500 border-slate-800 bg-slate-800/20"}`}
                        >
                          ID: {role.id} - KEY: {role.key}
                        </div>
                        <div
                          className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest ${role.is_active ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          <div
                            className={`w-1 h-1 rounded-full ${role.is_active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                          />
                          {role.is_active ? "Online_Protocol" : "Deactivated"}
                        </div>
                      </div>
                      <button
                        id={`RolePage.editBtn-${role.name}`}
                        onClick={() => {
                          console.log("CLICKED");
                          setSelectedRole(role);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 hover:bg-slate-800 rounded-xl text-slate-600 hover:text-white transition-all"
                      >
                        <Settings2 size={18} />
                      </button>
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                      {role.name}
                    </h3>
                    <button
                      id={`RolePage.statusBtn-${role.name}`}
                      onClick={() => {
                        setSelectedRole(role);
                        setIsStatusModalOpen(true);
                      }}
                      className={`text-[9px] font-black uppercase tracking-widest py-2 px-4 rounded-xl border transition-all mt-4 ${role.is_active ? "border-rose-500/20 text-rose-500 hover:bg-rose-500/10" : "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"}`}
                    >
                      {role.is_active
                        ? "Emergency_Shutdown"
                        : "Initialize_Layer"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "matrix" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto bg-slate-900/30 border border-slate-800 rounded-[2rem] backdrop-blur-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 w-1/4">
                      Capability_Node
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.id}
                        className="p-6 text-[10px] font-black uppercase tracking-widest text-center text-cyan-500 border-l border-slate-800/50"
                      >
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm) => (
                    <tr
                      key={perm.id}
                      className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-cyan-500 transition-colors">
                            <Activity size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic">
                              {perm.name}
                            </span>
                            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter font-mono">
                              {perm.key}
                            </span>
                          </div>
                        </div>
                      </td>
                      {roles.map((role) => {
                        const isAssigned = perm.role.some(
                          (r) => r.role_id === parseInt(role.id),
                        );
                        return (
                          <td
                            key={role.id}
                            className="p-6 text-center border-l border-slate-800/30"
                          >
                            <button
                              onClick={() =>
                                togglePermissionMapping(
                                  parseInt(role.id),
                                  perm.id,
                                  isAssigned,
                                )
                              }
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-all border group/btn
                                ${
                                  isAssigned
                                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                                    : "bg-slate-950 border-slate-800 text-slate-800 hover:border-slate-600 hover:text-slate-400"
                                }`}
                            >
                              {isAssigned ? (
                                <Check size={20} strokeWidth={3} />
                              ) : (
                                <X size={16} />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <CreateRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setIsAddRoleModalOpen(false);
        }}
      />
      <StatusToggleModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={() => {
          handleToggleStatus(selectedRole);
          setIsStatusModalOpen(false);
        }}
        role={selectedRole}
      />
      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setIsEditModalOpen(false);
        }}
        role={selectedRole}
      />
    </div>
  );
}
