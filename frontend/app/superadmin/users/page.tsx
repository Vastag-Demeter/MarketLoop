"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserMinus,
  UserCheck,
  MoreVertical,
  UserCog,
  Loader2,
  ChevronDown,
} from "lucide-react";
import api from "@/src/axios";
import { toast } from "sonner";
import { Role, User } from "@/src/interfaces/user";
import RoleManagementModal from "@/src/components/superadmin/role_management_modal";

interface UserApiResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  roles: RoleApiResponse[];
  active: boolean | null;
}

interface RoleApiResponse {
  role: Role;
  role_id: number;
}


export default function SuperadminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [roles, setRoles] = useState<Role[]>([]);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const transformUserData = (apiUser: UserApiResponse): User => {
    return {
      id: apiUser.id.toString(),
      firstName: apiUser.first_name,
      lastName: apiUser.last_name,
      email: apiUser.email,
      active: apiUser.active,
      roles: apiUser.roles.map((item: RoleApiResponse) => item.role),
      permissions: [],
    };
  };
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/getUsers");
      const users = res.data.data.map((item: UserApiResponse) =>
        transformUserData(item),
      );
      setUsers(users || []);
    } catch (err) {
      console.error("USER_FETCH_ERROR", err);
      toast.error("Failed to fetch operatives");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get("/api/getRoles");
      setRoles(res.data.data || []);
    } catch (error) {
      console.error("ROLE_FETCH_ERROR", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers]);

  const toggleStatus = async (userId: number) => {
    setActionLoading(userId);
    const promise = api.patch("/api/toggleUserStatus", { user_id: userId });

    toast.promise(promise, {
      loading: "Synchronizing_Access_Protocols...",
      success: (res) => {
        fetchUsers();
        return res.data.msg;
      },
      error: "Critical_Error: Protocol_Override_Failed",
    });

    try {
      await promise;
    } catch (err) {
      console.error("STATUS_TOGGLE_ERROR", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const firstName = user?.firstName?.toLowerCase() || "";
    const lastName = user?.lastName?.toLowerCase() || "";
    const email = user?.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      firstName.includes(search) ||
      lastName.includes(search) ||
      email.includes(search);

    const matchesRole =
      roleFilter === "ALL" ||
      (Array.isArray(user.roles) &&
        user.roles.some((r: Role) => r.name === roleFilter));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" ? user.active : !user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "text-purple-400 border-purple-400/20 bg-purple-400/5";
      case "ADMIN":
        return "text-blue-400 border-blue-400/20 bg-blue-400/5";
      case "HELPDESK":
        return "text-emerald-400 border-emerald-400/20 bg-emerald-400/5";
      case "WORKER":
        return "text-amber-400 border-amber-400/20 bg-amber-400/5";
      default:
        return "text-slate-400 border-slate-400/20 bg-slate-400/5";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-cyan-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <span className="tracking-[0.5em] uppercase text-[10px] font-black">
          Decrypting_User_Files...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-cyan-500" size={24} />
            <span className="text-[10px] text-cyan-500/50 tracking-[0.4em] font-black uppercase italic">
              Global_User_Registry
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            System <span className="text-cyan-500">_OPERATIVES_</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
          <div className="lg:col-span-3 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              id="UserPage.filterInput"
              type="text"
              placeholder="Search_by_identity..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lg:col-span-1.5 relative">
            <ShieldCheck
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest focus:border-cyan-500 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All_Clearances</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              size={14}
            />
          </div>

          <div className="lg:col-span-1.5 relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest focus:border-cyan-500 outline-none transition-all cursor-pointer"
            >
              <option value="ALL">All_Statuses</option>
              <option value="ACTIVE">Online</option>
              <option value="INACTIVE">Terminated</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              size={14}
            />
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-500">
                <th className="p-6 text-[10px] uppercase tracking-widest font-black">
                  Operative
                </th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-center">
                  Status
                </th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black">
                  Clearance_Level
                </th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-right">
                  Commands
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-cyan-500/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-200 uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${user.active ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : "text-rose-500 border-rose-500/20 bg-rose-500/5"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${user.active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                        />
                        <span className="text-[9px] font-black uppercase tracking-tighter">
                          {user.active ? "Online" : "Terminated"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(user.roles) &&
                          user.roles.map((roleContainer: Role, idx) => (
                            <div
                              key={idx}
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border font-black text-[9px] tracking-[0.1em] ${getRoleStyle(roleContainer.name)}`}
                            >
                              {roleContainer.name}
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          id={"UserPage.toggleStatusBtn-" + user.email}
                          onClick={() => toggleStatus(parseInt(user.id) || 0)}
                          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white"
                          disabled={actionLoading === parseInt(user.id)}
                        >
                          {actionLoading === parseInt(user.id) ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : user.active ? (
                            <UserMinus size={18} />
                          ) : (
                            <UserCheck size={18} />
                          )}
                        </button>
                        <div className="relative">
                          <button
                            id={"UserPage.toggleMenuBtn-" + user.email}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(
                                activeMenu === parseInt(user.id)
                                  ? null
                                  : parseInt(user.id),
                              );
                            }}
                            className={`p-2 rounded-xl transition-all ${activeMenu === parseInt(user.id) ? "bg-cyan-500 text-slate-950" : "hover:bg-slate-800 text-slate-600 hover:text-white"}`}
                          >
                            <MoreVertical size={18} />
                          </button>
                          {activeMenu === parseInt(user.id) && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-[100] overflow-hidden">
                              <div className="p-2">
                                <button
                                  id={"UserPage.changeRoleBtn-" + user.email}
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsRoleModalOpen(true);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all uppercase tracking-widest"
                                >
                                  <UserCog size={14} /> Change_Role
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-12 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]"
                  >
                    No_Operatives_Found_In_Registry
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isRoleModalOpen && selectedUser && (
          <RoleManagementModal
            isOpen={isRoleModalOpen}
            onClose={() => {
              fetchUsers();
              setIsRoleModalOpen(false);
            }}
            user={selectedUser}
            allRoles={roles}
            getRoleStyle={getRoleStyle}
          />
        )}
      </div>
    </div>
  );
}
