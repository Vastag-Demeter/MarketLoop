"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout, isLoading, hasPermission, hasAnyPermission } =
    useAuth();

  const dropdownRef = useRef<HTMLLIElement>(null);

  const closeMenus = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  if (isLoading)
    return <div className="h-20 bg-slate-950 border-b border-slate-900"></div>;

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-mono
        ${
          isScrolled
            ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-900 py-0 shadow-2xl"
            : "bg-transparent border-b border-transparent py-2"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex items-center gap-2 z-[110]"
        >
          <div className="w-8 h-8 rounded-full border-2 border-dashed border-cyan-500 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
            <span className="text-cyan-500 font-bold text-xs">∞</span>
          </div>
          <div className="text-2xl font-black tracking-tighter uppercase">
            <span className="text-white group-hover:text-cyan-400 transition-colors">
              MARKET
            </span>
            <span className="text-cyan-500 ml-1">LOOP</span>
          </div>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden z-[110] p-2 text-slate-300"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span
              className={`h-0.5 w-full bg-current transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`h-0.5 w-full bg-current ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-full bg-current transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>

        <div
          className={`
            fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-8 transition-all duration-500
            lg:static lg:flex lg:flex-row lg:bg-transparent lg:inset-auto lg:w-auto lg:opacity-100 lg:visible
            lg:h-full z-[100] ${isOpen ? "opacity-100 visible translate-x-0" : "opacity-0 invisible translate-x-full lg:translate-x-0"}
          `}
        >
          <ul className="flex flex-col lg:flex-row items-center gap-8">
            {user ? (
              <>
                {hasAnyPermission([
                  "PRODUCTS_FULL_ACCESS",
                  "CATEGORIES_MANAGE",
                  "ATTRIBUTES_MANAGE",
                ]) && (
                  <>
                    <li>
                      <Link
                        href="/admin/categories"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest"
                      >
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/products"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/products/images"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest"
                      >
                        Product_Images
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/attributes"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest"
                      >
                        Attributes
                      </Link>
                    </li>
                  </>
                )}
                {hasAnyPermission([
                  "PROFILE_DEACTIVATE",
                  "PROFILE_ACTIVATE",
                  "CART_MANAGE",
                ]) && (
                  <>
                    <Link
                      href="/support"
                      onClick={closeMenus}
                      className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                    >
                      Support
                    </Link>
                    <Link
                      href="/products"
                      onClick={closeMenus}
                      className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                    >
                      Products
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeMenus}
                      className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                    >
                      Cart
                    </Link>
                  </>
                )}

                {hasAnyPermission([
                  "USER_MANAGEMENT",
                  "ROLE_MANAGEMENT",
                  "SYSTEM_CONFIG",
                ]) && (
                  <>
                    {hasPermission("EMAIL_LOGS_VIEW") && (
                      <Link
                        href="/superadmin/email-logs"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                      >
                        Email_logs
                      </Link>
                    )}
                    {hasPermission("USER_MANAGEMENT") && (
                      <Link
                        id="Profile.addStaffBtn"
                        href="/superadmin/add-staff"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                      >
                        Add_Staff
                      </Link>
                    )}
                    {hasPermission("EMAIL_TYPES_MANAGEMENT") && (
                      <Link
                        id="Profile.emailTypesBtn"
                        href="/superadmin/email-types"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                      >
                        EMAIL_TYPES
                      </Link>
                    )}
                    {hasPermission("TICKET_STATUS_MANAGE") && (
                      <Link
                        id="Profile.ticketStatusesBtn"
                        href="/superadmin/ticket-statuses"
                        onClick={closeMenus}
                        className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                      >
                        TICKET_STATUSES
                      </Link>
                    )}
                  </>
                )}

                {hasPermission("TICKET_VIEW") && (
                  <Link
                    href="/helpdesk/tickets"
                    onClick={closeMenus}
                    className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                  >
                    Tickets
                  </Link>
                )}

                {hasPermission("ORDERS_MANAGE") && (
                  <Link
                    href="/worker/orders"
                    onClick={closeMenus}
                    className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                  >
                    Orders
                  </Link>
                )}

                <li className="relative" ref={dropdownRef}>
                  <button
                    id="Profile.btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">
                      {user.firstName} {user.lastName}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-3 z-[120] animate-in fade-in zoom-in duration-200">
                      <div className="px-5 py-4 border-b border-slate-800/50 mb-2 bg-slate-900/30 rounded-t-xl text-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black block mb-1">
                          System_Authorized
                        </span>
                        <p className="text-xs text-cyan-400 font-bold truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        id="Profile.profileBtn"
                        onClick={closeMenus}
                        className="block px-5 py-3 text-xs font-bold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl uppercase transition-all text-center"
                      >
                        Profile
                      </Link>

                      {hasAnyPermission([
                        "PROFILE_DEACTIVATE",
                        "PROFILE_ACTIVATE",
                        "CART_MANAGE",
                      ]) && (
                        <>
                          {" "}
                          <Link
                            href="/profile/cards"
                            onClick={closeMenus}
                            className="block px-5 py-3 text-xs font-bold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl uppercase transition-all text-center"
                          >
                            My Cards
                          </Link>
                          <Link
                            href="/profile/addresses"
                            onClick={closeMenus}
                            className="block px-5 py-3 text-xs font-bold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl uppercase transition-all text-center"
                          >
                            My Addresses
                          </Link>
                          <Link
                            href="/profile/orders"
                            onClick={closeMenus}
                            className="block px-5 py-3 text-xs font-bold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl uppercase transition-all text-center"
                          >
                            My orders
                          </Link>
                        </>
                      )}

                      {hasPermission("ROLE_MANAGEMENT") && (
                        <Link
                          id="Profile.rolesBtn"
                          href="/superadmin/roles"
                          onClick={closeMenus}
                          className="block px-5 py-3 text-xs font-bold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl uppercase transition-all text-center"
                        >
                          Roles
                        </Link>
                      )}
                      {hasPermission("USER_MANAGEMENT") && (
                        <Link
                          id="Profile.usersBtn"
                          href="/superadmin/users"
                          onClick={closeMenus}
                          className="block px-5 py-3 text-xs font-bold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl uppercase transition-all text-center"
                        >
                          Users
                        </Link>
                      )}
                      {hasPermission("VENDORS_MANAGE") && (
                        <Link
                          id="Profile.vendorsBtn"
                          href="/superadmin/vendors"
                          onClick={closeMenus}
                          className="block px-5 py-3 text-xs font-bold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl uppercase transition-all text-center"
                        >
                          Vendors
                        </Link>
                      )}

                      <div className="h-px bg-slate-800 my-2" />
                      <button
                        onClick={() => {
                          logout();
                          closeMenus();
                        }}
                        className="w-full px-5 py-3 text-xs font-black text-rose-500 hover:bg-rose-500/10 rounded-xl uppercase transition-all"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                  <div className="lg:hidden flex flex-col items-center gap-6 mt-8">
                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      className="text-2xl font-bold text-slate-300 uppercase"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenus();
                      }}
                      className="text-2xl font-bold text-rose-500 uppercase"
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <Link
                  href="/support"
                  onClick={closeMenus}
                  className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                >
                  Support
                </Link>
                <Link
                  href="/products"
                  onClick={closeMenus}
                  className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                >
                  Products
                </Link>
                <Link
                  href="/cart"
                  onClick={closeMenus}
                  className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                >
                  Cart
                </Link>
                <Link
                  id="Profile.logInBtn"
                  href="/login"
                  onClick={closeMenus}
                  className="text-sm font-bold text-slate-400 hover:text-white uppercase"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenus}
                  className="px-6 py-2.5 bg-cyan-600 text-white text-[10px] font-black rounded-xl uppercase hover:bg-cyan-500 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
