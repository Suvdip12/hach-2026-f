"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading,
  Card,
  Flex,
  Text,
  Box,
  Button as RadixButton,
  Avatar,
} from "@radix-ui/themes";
import { getServerSession } from "@/util/auth/server";
import { signOut } from "@/util/auth";
import { User, Settings, LogOut } from "lucide-react";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [session, setSession] = useState<{ user: UserWithRole } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await getServerSession();
        if (!sessionData?.user) {
          router.push("/controller");
          return;
        }

        const userRole = (sessionData.user as UserWithRole)?.role;
        if (
          userRole !== "admin" &&
          userRole !== "parent" &&
          userRole !== "superAdmin"
        ) {
          router.push("/student/dashboard");
          return;
        }

        setIsSuperAdmin(userRole === "superAdmin");
        setSession(sessionData as { user: UserWithRole });
      } catch (error) {
        console.error("Session check failed:", error);
        router.push("/controller");
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
            router.push("/controller");
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
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <Avatar
                src={session.user.image}
                alt={session.user.name || "User"}
                size="4"
                radius="full"
                fallback={session.user.name?.[0] || "A"}
              />
              <Flex direction="column" gap="1">
                <Heading size="6">{session.user.name}</Heading>
                <Text size="2" color="gray">
                  {session.user.email}
                </Text>
                <Text size="1" color="orange" weight="bold">
                  {session.user.role === "parent" ? "Parent" : "School Admin"}
                </Text>
              </Flex>
            </Flex>
            <Flex gap="2">
              <RadixButton
                onClick={() => router.push("/controller/profile")}
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

        {/* Dashboard Content */}
        <Card>
          <Box p="6">
            <Flex direction="column" gap="4">
              <Heading size="7">Admin Dashboard</Heading>
              <Text color="gray">
                Welcome to your administration dashboard. Manage students, view
                reports, and more.
              </Text>

              <Flex gap="4" wrap="wrap" mt="4">
                {/* Students Management Card */}
                <Card style={{ flex: "1 1 300px" }}>
                  <Flex direction="column" gap="3" p="4">
                    <Heading size="5">👨‍🎓 Students</Heading>
                    <Text size="2" color="gray">
                      View, manage, ban/restrict student accounts
                    </Text>
                    <RadixButton
                      variant="soft"
                      onClick={() => router.push("/admin/students")}
                    >
                      Manage Students
                    </RadixButton>
                  </Flex>
                </Card>

                {/* Courses Card - SuperAdmin Only */}
                {isSuperAdmin && (
                  <Card style={{ flex: "1 1 300px" }}>
                    <Flex direction="column" gap="3" p="4">
                      <Heading size="5">📚 Courses</Heading>
                      <Text size="2" color="gray">
                        View and manage courses
                      </Text>
                      <RadixButton
                        variant="soft"
                        onClick={() => router.push("/admin/courses")}
                      >
                        Manage Courses
                      </RadixButton>
                    </Flex>
                  </Card>
                )}

                {/* Instructors Card - SuperAdmin Only */}
                {isSuperAdmin && (
                  <Card style={{ flex: "1 1 300px" }}>
                    <Flex direction="column" gap="3" p="4">
                      <Heading size="5">👨‍🏫 Instructors</Heading>
                      <Text size="2" color="gray">
                        View and manage instructors
                      </Text>
                      <RadixButton
                        variant="soft"
                        onClick={() => router.push("/admin/instructors")}
                      >
                        Manage Instructors
                      </RadixButton>
                    </Flex>
                  </Card>
                )}

                {/* Reports Card */}
                <Card style={{ flex: "1 1 300px" }}>
                  <Flex direction="column" gap="3" p="4">
                    <Heading size="5">📊 Reports</Heading>
                    <Text size="2" color="gray">
                      View student progress and analytics
                    </Text>
                    <RadixButton
                      variant="soft"
                      onClick={() => router.push("/admin/analytics")}
                    >
                      View Analytics
                    </RadixButton>
                  </Flex>
                </Card>

                {/* Settings Card */}
                <Card style={{ flex: "1 1 300px" }}>
                  <Flex direction="column" gap="3" p="4">
                    <Heading size="5">
                      <Settings
                        size={20}
                        style={{ display: "inline", marginRight: "8px" }}
                      />
                      Settings
                    </Heading>
                    <Text size="2" color="gray">
                      Manage your account settings
                    </Text>
                    <RadixButton
                      variant="soft"
                      onClick={() => router.push("/controller/profile")}
                    >
                      Go to Profile
                    </RadixButton>
                  </Flex>
                </Card>
              </Flex>
            </Flex>
          </Box>
        </Card>
      </Flex>
    </Container>
  );
};

export default AdminDashboard;
