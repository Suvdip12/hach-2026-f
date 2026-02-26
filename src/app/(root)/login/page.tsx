import React, { Suspense } from "react";
import LoginClient from "./LoginClient";
import { notFound } from "next/navigation";

const ROLE_CONFIG: Record<string, unknown> = {
  student: {},
  admin: {},
  "super-admin": {},
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const params = await searchParams;
  const option = (params?.option as string) || "student";
  if (!option || !ROLE_CONFIG[option]) {
    notFound();
  }

  return (
    <Suspense fallback={<div />}>
      <LoginClient option={option} />
    </Suspense>
  );
}
