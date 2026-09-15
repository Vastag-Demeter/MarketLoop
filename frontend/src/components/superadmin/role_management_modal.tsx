"use client";
import { useState } from "react";
import { X, ShieldCheck, Plus, Key } from "lucide-react";
import { Role, User } from "@/src/interfaces/user";
import { toast } from "sonner";
import api from "@/src/axios";
interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  allRoles: Role[] | undefined;
  getRoleStyle: (role: string) => string;
}

export default function RoleManagementModal({
  isOpen,
  onClose,
  user,
  allRoles,
  getRoleStyle,
}: RoleManagementModalProps) {
  const [currentRoles, setCurrentRoles] = useState<Role[]>(user.roles || []);
  if (!isOpen) return null;

  console.log("USER_ROLES: ", user.roles);
  console.log("CURRENT_ROLES", currentRoles);

  const handleAddRole = (role: Role) => {
    const promise = api.post("/api/addUserRole", {
      user_id: parseInt(user.id),
      role_id: parseInt(role.id),
    });

    toast.promise(promise, {
      loading: "ADDING_USER_ROLE...",
      success: (res) => {
        const newRoleEntry = {
          id: role.id,
          name: role.name,
          key: role.key,
          is_active: true,
        };

        setCurrentRoles((prev) => [...prev, newRoleEntry]);

        return res.data.msg;
      },
      error: (err) => {
        return err.response.data.error;
      },
    });
  };

  const handleRemoveRole = (role: Role) => {
    console.log("ROLE: ", role);
    const promise = api.delete("/api/deleteUserRole", {
      data: { user_id: user.id, role_id: role.id },
    });
    toast.promise(promise, {
      loading: "DELETING_USER_ROLE...",
      success: (res) => {
        setCurrentRoles((prev) => prev.filter((r) => r.name !== role.name));
        return res.data.msg;
      },
      error: (err) =>
        err.response?.data?.error || err.response?.data?.errors[0],
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] text-cyan-500/50 font-black uppercase tracking-[0.3em]">
                Clearance_Update
              </span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                {user.firstName} <span className="text-cyan-500">_MOD_</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <ShieldCheck size={12} className="text-cyan-500" />{" "}
            Active_Permissions
          </h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {currentRoles.length > 0 ? (
              currentRoles.map((r: Role, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black text-[10px] tracking-widest animate-in zoom-in duration-200 ${getRoleStyle(r.name)}`}
                >
                  {r.name}
                  <button
                    id={"RoleManagement.removeRoleBtn-" + r.key}
                    onClick={() => handleRemoveRole(r)}
                    className="hover:text-white opacity-50 hover:opacity-100 transition-opacity ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-slate-700 italic font-bold">
                NO_PERMISSIONS_ASSIGNED
              </span>
            )}
          </div>

          <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Plus size={12} className="text-cyan-500" /> Assign_New_Clearance
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {allRoles
              ?.filter(
                (roleFromAll) =>
                  !currentRoles.some(
                    (ur: Role) => ur.name === roleFromAll.name,
                  ) && roleFromAll.is_active,
              )
              .map((role) => (
                <button
                  id={"RoleManagement.addRoleBtn-" + role.key}
                  key={role.id}
                  onClick={() => handleAddRole(role)}
                  className="flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all group text-left"
                >
                  {role.name}
                  <Plus
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end">
          <button
            id="RoleManagement.close"
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
