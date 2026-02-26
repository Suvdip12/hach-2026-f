import { createAuthClient } from "better-auth/react";
import { getSchoolDomain } from "../tenant.util";

const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  basePath: "/api/auth",
  fetchOptions: {
    credentials: "include",
    headers: {
      "x-school-domain": getSchoolDomain(),
    },
  },
});

export const authClient = client;

export const { signIn, signOut, signUp, useSession, $Infer } = client;
