import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "./src/interfaces/user";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userPublicRaw = request.cookies.get("user_public")?.value;

  let user: User | null = null;
  let permissions: string[] = [];

  if (userPublicRaw) {
    try {
      const decodedData = decodeURIComponent(userPublicRaw);
      user = JSON.parse(decodedData);
      permissions = user?.permissions || [];
    } catch (e) {
      console.error("Middleware parse error", e);
    }
  }

  const restrictedRoutes = ["/login", "/signup", "/verify-email"];
  if (
    userPublicRaw &&
    restrictedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const protectedRoutes = ["/profile"];
  if (
    !userPublicRaw &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin/products/**")) {
    const canManageProduct = permissions.some((p) =>
      ["PRODUCTS_FULL_ACCESS"].includes(p),
    );
    if (!userPublicRaw || !canManageProduct) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (
    pathname.startsWith("/superadmin/users") ||
    pathname.startsWith("/superadmin/add-staff")
  ) {
    const canManageUsers = permissions.some((p) =>
      ["USER_MANAGEMENT"].includes(p),
    );
    if (!userPublicRaw || !canManageUsers) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (pathname.startsWith("/superadmin/roles")) {
    const canManageRoles = permissions.some((p) =>
      ["ROLE_MANAGEMENT"].includes(p),
    );
    if (!userPublicRaw || !canManageRoles) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/superadmin/email-logs")) {
    const canViewEmailLogs = permissions.some((p) =>
      ["EMAIL_LOGS_VIEW"].includes(p),
    );
    if (!userPublicRaw || !canViewEmailLogs) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/superadmin/vendors")) {
    const canManageVendors = permissions.some((p) =>
      ["VENDORS_MANAGE"].includes(p),
    );
    if (!userPublicRaw || !canManageVendors) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/superadmin")) {
    const hasSuperAdminAccess = permissions.some((p) =>
      ["SYSTEM_CONFIG"].includes(p),
    );

    if (!userPublicRaw || !hasSuperAdminAccess) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/helpdesk")) {
    if (!userPublicRaw || !permissions.includes("TICKET_VIEW")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/worker")) {
    if (!userPublicRaw || !permissions.includes("ORDERS_MANAGE")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const customerOnlyRoutes = ["/cart", "/cancel-order", "/support"];
  if (customerOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (userPublicRaw && !permissions.includes("CART_MANAGE")) {
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
