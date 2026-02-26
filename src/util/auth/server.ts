"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

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
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized - Please sign in");
  }
  return session;
}
