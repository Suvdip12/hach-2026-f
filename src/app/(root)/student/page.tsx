"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/util/auth";
import { Container, Flex, Text } from "@radix-ui/themes";

export default function StudentRedirect() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      // Redirect to dashboard if logged in
      router.push("/student/dashboard");
    } else {
      // Redirect to login if not logged in
      router.push("/login?option=student");
    }
  }, [session, isPending, router]);

  return (
    <Container size="4" className="py-20">
      <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
        <Text size="4">Redirecting...</Text>
      </Flex>
    </Container>
  );
}
