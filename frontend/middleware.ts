import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./src/interfaces/user";
import Cookies from 'js-cookie';


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let roles: string[] = [];
  // const token = request.cookies.get("token")?.value;
  const token = Cookies.get("token");
  console.log("TOKEN: ", token);
  const userPublicRaw = request.cookies.get("user_public")?.value;

  let user: User | null = null;
  let permissions: string[] = [];

  if (userPublicRaw) {
    try {
      const decodedData = decodeURIComponent(userPublicRaw);
      user = JSON.parse(decodedData);
      roles = user?.roles?.map((r) => typeof r === "string" ? r : r.name) || [];
      // console.log("ROLES:", roles)
      permissions = user?.permissions || [];
    } catch (e) {
      console.error("Middleware parse error", e);
    }
  }

  const restrictedRoutes = ["/login", "/signup", "/verify-email"];
  if (token && restrictedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const protectedRoutes = ["/profile"];
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    const hasAdminAccess = permissions.some((p) =>
      [
        "PRODUCTS_FULL_ACCESS",
        "CATEGORIES_MANAGE",
        "ATTRIBUTES_MANAGE",
        "VENDORS_MANAGE",
      ].includes(p),
    );

    const isAdmin = roles.includes("ADMIN");
    // console.log("PERMISSIONS: ", permissions)
    if (!token || !isAdmin || !hasAdminAccess) {
      console.log('Has admin role: ', isAdmin ? "YES" : "NO");
      console.log("Redirecting false admin to ")
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/superadmin")) {
    const hasSuperAdminAccess = permissions.some((p) =>
      [
        "USER_MANAGEMENT",
        "ROLE_MANAGEMENT",
        "SYSTEM_CONFIG",
        "VENDORS_MANAGE",
      ].includes(p),
    );

    if (!token || !hasSuperAdminAccess) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/helpdesk")) {
    if (!token || !permissions.includes("TICKET_VIEW")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/worker")) {
    if (!token || !permissions.includes("ORDERS_MANAGE")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const customerOnlyRoutes = ["/cart", "/cancel-order", "/support"];
  if (customerOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (token && !permissions.includes("CART_MANAGE")) {
      console.log("USER_REJECTED: ", user);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/worker/:path*",
    "/helpdesk/:path*",
    "/login",
    "/signup",
    "/profile/:path*",
    "/cart",
    "/products/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
  ],
};
