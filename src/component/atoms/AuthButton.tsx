"use client";

import { useSession, signIn, signOut } from "@/util/auth";
import { Button } from "@radix-ui/themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login?option=student");
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Don't redirect on error - let user see the error and try again
    }
  };

  if (isPending) {
    return (
      <Button disabled variant="soft">
        Loading...
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button
        onClick={() => signIn.social({ provider: "email" })}
        variant="solid"
      >
        Sign In with Email
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
      )}
      <span className="text-sm">{session.user.name || session.user.email}</span>
      <Button onClick={handleSignOut} variant="soft" color="red">
        Sign Out
      </Button>
    </div>
  );
}
