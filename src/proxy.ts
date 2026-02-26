import api from "./util/api";
import { getSchoolDomain } from "./util/tenant.util";
import { NextResponse, NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

async function getSession(request: NextRequest) {
  try {
    const cookieString = request.headers.get("cookie") || "";

    if (!cookieString) {
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/api/me`, {
      method: "GET",
      headers: {
        cookie: cookieString,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function checkDomainExists(): Promise<boolean> {
  try {
    const response = await api.get<{ exists: boolean; domain: string }>(
      `/api/domain/verify`,
    );
    return response.success && response.data?.exists === true;
  } catch {
    return false;
  }
}

function getRoleDashboard(role: string): string {
  switch (role) {
    case "superAdmin":
      return "/super-admin";
    case "admin":
    case "parent":
      return "/controller";
    case "student":
    case "individual":
    case "school":
      return "/student";
    default:
      return "/";
  }
}

export async function proxy(request: NextRequest) {
  const domain = getSchoolDomain();
  const { pathname } = request.nextUrl;
  const session = await getSession(request);
  const authenticated = !!session;
  const role = session?.user?.role;

  if (domain && domain !== "system") {
    const domainExist = await checkDomainExists();
    if (!domainExist) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  const unProtectedPaths = [
    "/",
    "/about",
    "/contact",
    "/curioai",
    "/curiobot",
    "/curiothink",
    "/create-super-admin",
  ];

  const authPaths = [
    "/login",
    "/reset-password",
    "/forgot-password",
    "/login?option=student",
  ];

  const loginPages = ["/controller", "/super-admin", "/login?option=student"];

  const isUnprotectedPath = unProtectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  const isLoginPage = loginPages.some((path) => pathname === path);

  if (isUnprotectedPath) {
    return NextResponse.next();
  }

  if (isAuthPath || isLoginPage) {
    if (authenticated && !isLoginPage) {
      const dashboardPath = getRoleDashboard(role);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    if (authenticated && isLoginPage) {
      const dashboardPath = getRoleDashboard(role);
      // Allow access to login page but redirect if already logged in with correct role
      if (
        pathname === "/controller" &&
        (role === "admin" || role === "parent")
      ) {
        return NextResponse.redirect(
          new URL("/controller/dashboard", request.url),
        );
      }
      if (pathname === "/super-admin" && role === "superAdmin") {
        return NextResponse.redirect(
          new URL("/super-admin/dashboard", request.url),
        );
      }
      if (
        pathname === "/login?option=student" &&
        (role === "student" || role === "individual" || role === "school")
      ) {
        return NextResponse.redirect(
          new URL("/student/dashboard", request.url),
        );
      }
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL("/login?option=student", request.url));
  }

  if (pathname.startsWith("/super-admin")) {
    if (role !== "superAdmin") {
      const dashboardPath = getRoleDashboard(role);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/controller")) {
    if (role !== "admin" && role !== "parent") {
      const dashboardPath = getRoleDashboard(role);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/student")) {
    if (role !== "student" && role !== "individual" && role !== "school") {
      const dashboardPath = getRoleDashboard(role);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};
