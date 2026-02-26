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
  Separator,
} from "@radix-ui/themes";
import { getServerSession } from "@/util/auth/server";
import { signOut } from "@/util/auth";
import { TextField } from "@/component/atoms/TextField";
import { ArrowLeft, Save, Eye, EyeOff, User, Mail, Shield } from "lucide-react";
import { superAdminApi, BackendResponse } from "@/services/api.service";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  createdAt?: string;
  controllerId?: string;
}

const SuperAdminProfile = () => {
  const router = useRouter();
  const [session, setSession] = useState<{ user: UserWithRole } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All password fields are required" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await superAdminApi.changePassword({
        oldPassword,
        newPassword,
      });

      if (response.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordChange(false);
      } else {
        // Extract error message from response
        const errorData = response.data as BackendResponse | undefined;
        const errorMessage =
          response.error || errorData?.message || "Failed to change password";
        setMessage({
          type: "error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      setMessage({
        type: "error",
        text: "An error occurred while changing password",
      });
    } finally {
      setSaving(false);
    }
  };

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
      <Container size="3" className="py-20">
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
    <Container size="3" className="py-20">
      <Flex direction="column" gap="6">
        {/* Back Button */}
        <RadixButton
          variant="ghost"
          onClick={() => router.push("/super-admin/dashboard")}
          style={{ width: "fit-content" }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </RadixButton>

        {/* Profile Header */}
        <Card>
          <Flex direction="column" align="center" gap="4" p="6">
            <Avatar
              src={session.user.image}
              alt={session.user.name || "Super Admin"}
              size="7"
              radius="full"
              fallback={session.user.name?.[0] || "S"}
            />
            <Flex direction="column" align="center" gap="1">
              <Heading size="7">{session.user.name}</Heading>
              <Text size="3" color="gray">
                {session.user.email}
              </Text>
              <Flex align="center" gap="2" mt="2">
                <Shield size={16} color="var(--orange-9)" />
                <Text size="2" color="orange" weight="bold">
                  Super Admin
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>

        {/* Profile Details */}
        <Card>
          <Box p="6">
            <Heading size="5" mb="4">
              Profile Information
            </Heading>
            <Flex direction="column" gap="4">
              <Flex align="center" gap="3">
                <User size={20} color="var(--gray-9)" />
                <Box>
                  <Text size="1" color="gray">
                    Full Name
                  </Text>
                  <Text size="3" weight="medium">
                    {session.user.name}
                  </Text>
                </Box>
              </Flex>

              <Separator size="4" />

              <Flex align="center" gap="3">
                <Mail size={20} color="var(--gray-9)" />
                <Box>
                  <Text size="1" color="gray">
                    Email Address
                  </Text>
                  <Text size="3" weight="medium">
                    {session.user.email}
                  </Text>
                </Box>
              </Flex>

              <Separator size="4" />

              <Flex align="center" gap="3">
                <Shield size={20} color="var(--gray-9)" />
                <Box>
                  <Text size="1" color="gray">
                    Role
                  </Text>
                  <Text size="3" weight="medium">
                    Super Administrator
                  </Text>
                </Box>
              </Flex>

              {session.user.createdAt && (
                <>
                  <Separator size="4" />
                  <Box>
                    <Text size="1" color="gray">
                      Account Created
                    </Text>
                    <Text size="3" weight="medium">
                      {new Date(session.user.createdAt).toLocaleDateString()}
                    </Text>
                  </Box>
                </>
              )}
            </Flex>
          </Box>
        </Card>

        {/* Password Change Section */}
        <Card>
          <Box p="6">
            <Flex justify="between" align="center" mb="4">
              <Heading size="5">Security</Heading>
              <RadixButton
                variant="soft"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                {showPasswordChange ? "Cancel" : "Change Password"}
              </RadixButton>
            </Flex>

            {showPasswordChange && (
              <Flex direction="column" gap="4" mt="4">
                <Box>
                  <Text size="2" weight="medium" mb="2">
                    Current Password
                  </Text>
                  <div style={{ position: "relative" }}>
                    <TextField
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        color: "#666",
                      }}
                    >
                      {showOldPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="2">
                    New Password
                  </Text>
                  <div style={{ position: "relative" }}>
                    <TextField
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        color: "#666",
                      }}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="2">
                    Confirm New Password
                  </Text>
                  <TextField
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </Box>

                <RadixButton
                  onClick={handlePasswordChange}
                  disabled={saving}
                  size="3"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Update Password"}
                </RadixButton>
              </Flex>
            )}

            {message && (
              <Box
                mt="4"
                p="3"
                style={{
                  backgroundColor:
                    message.type === "success" ? "#dcfce7" : "#fee2e2",
                  borderRadius: "6px",
                }}
              >
                <Text
                  size="2"
                  color={message.type === "success" ? "green" : "red"}
                >
                  {message.text}
                </Text>
              </Box>
            )}
          </Box>
        </Card>

        {/* Sign Out */}
        <Card>
          <Flex justify="between" align="center" p="6">
            <Box>
              <Text size="3" weight="medium">
                Sign Out
              </Text>
              <Text size="2" color="gray">
                Sign out from your account
              </Text>
            </Box>
            <RadixButton onClick={handleSignOut} variant="outline" color="red">
              Sign Out
            </RadixButton>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default SuperAdminProfile;
