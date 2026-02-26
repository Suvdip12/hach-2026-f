"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading,
  Card,
  Flex,
  Text,
  Button as RadixButton,
  Avatar,
} from "@radix-ui/themes";
import { getServerSession } from "@/util/auth/server";
import { signOut } from "@/util/auth";
import { User, LogOut } from "lucide-react";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
}

const SuperAdminDashboard = () => {
  const router = useRouter();
  const [session, setSession] = useState<{ user: UserWithRole } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await getServerSession();
        if (!sessionData?.user) {
          router.push("/super-admin");
          return;
        }

        const userRole = (sessionData.user as UserWithRole)?.role;
        if (userRole !== "superAdmin") {
          router.push("/student/dashboard");
          return;
        }

        setSession(sessionData as { user: UserWithRole });
      } catch (error) {
        console.error("Session check failed:", error);
        router.push("/super-admin");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/super-admin");
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <Container size="4" className="py-20">
        <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
          <Text size="4">Loading...</Text>
        </Flex>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <Avatar
                src={session.user.image}
                alt={session.user.name || "Super Admin"}
                size="4"
                radius="full"
                fallback={session.user.name?.[0] || "S"}
              />
              <Flex direction="column" gap="1">
                <Heading size="6">Super Admin Dashboard</Heading>
                <Text size="2" color="gray">
                  Welcome, {session.user.name}
                </Text>
              </Flex>
            </Flex>
            <Flex gap="2">
              <RadixButton
                onClick={() => router.push("/super-admin/profile")}
                variant="soft"
              >
                <User size={16} />
                Profile
              </RadixButton>
              <RadixButton
                onClick={handleSignOut}
                variant="outline"
                color="red"
              >
                <LogOut size={16} />
                Sign Out
              </RadixButton>
            </Flex>
          </Flex>
        </Card>

        {/* Overview */}
        <Flex direction="column" gap="4">
          <Heading size="6">Management Overview</Heading>
          <Text size="2" color="gray">
            Select a category below to manage system resources
          </Text>

          <Flex gap="4" wrap="wrap">
            {/* Schools Card */}
            <Card style={{ flex: "1 1 300px" }}>
              <Flex direction="column" gap="3" p="4">
                <Heading size="5">Schools</Heading>
                <Text size="2" color="gray">
                  Create schools individually or via CSV upload
                </Text>
                <RadixButton
                  onClick={() => router.push("/super-admin/schools-management")}
                  variant="soft"
                >
                  Manage Schools
                </RadixButton>
              </Flex>
            </Card>

            {/* Admins Card */}
            <Card style={{ flex: "1 1 300px" }}>
              <Flex direction="column" gap="3" p="4">
                <Heading size="5">Admins</Heading>
                <Text size="2" color="gray">
                  Create admins individually or via CSV upload
                </Text>
                <RadixButton
                  onClick={() => router.push("/super-admin/admins")}
                  variant="soft"
                >
                  Manage Admins
                </RadixButton>
              </Flex>
            </Card>

            {/* Students Card */}
            <Card style={{ flex: "1 1 300px" }}>
              <Flex direction="column" gap="3" p="4">
                <Heading size="5">Students</Heading>
                <Text size="2" color="gray">
                  Create students individually or via CSV upload
                </Text>
                <RadixButton
                  onClick={() => router.push("/super-admin/students")}
                  variant="soft"
                >
                  Manage Students
                </RadixButton>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default SuperAdminDashboard;
