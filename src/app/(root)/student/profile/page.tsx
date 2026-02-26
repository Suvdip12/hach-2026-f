"use client";

import { useEffect, useState, useCallback } from "react";
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
  Grid,
  Badge,
  IconButton,
  Button,
} from "@radix-ui/themes";
import { useSession, signOut } from "@/util/auth";
import { TextField } from "@/component/atoms/TextField";
import {
  Save,
  Eye,
  EyeOff,
  User,
  Mail,
  GraduationCap,
  AlertTriangle,
  LogOut,
  Trophy,
  Zap,
  Target,
  Shield,
  Calendar,
  Medal,
  Flame,
} from "lucide-react";
import { getTenantHeaders } from "@/util/tenant.util";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  createdAt?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function StudentProfile() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [saving, setSaving] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banMessage, setBanMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const checkBanStatus = useCallback((user: UserWithRole) => {
    if (user.banned) {
      const banExpires = user.banExpires ? new Date(user.banExpires) : null;
      if (!banExpires || banExpires > new Date()) {
        setIsBanned(true);
        setBanMessage(
          banExpires
            ? `Suspended until ${banExpires.toLocaleDateString()}. ${user.banReason || ""}`
            : `Permanently suspended. ${user.banReason || ""}`,
        );
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login?option=student");
      return;
    }

    const user = session.user as unknown as UserWithRole;

    if (
      user.role !== "student" &&
      user.role !== "individual" &&
      user.role !== "school"
    ) {
      if (user.role === "superAdmin") router.push("/super-admin/profile");
      else if (user.role === "admin") router.push("/controller/profile");
      else router.push("/");
      return;
    }

    checkBanStatus(user);
  }, [session, isPending, router, checkBanStatus]);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be 6+ chars" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/student/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getTenantHeaders(),
          },
          credentials: "include",
          body: JSON.stringify({ oldPassword, newPassword }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Password updated!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordChange(false);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error updating password" });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => window.location.replace("/login?option=student"),
      },
    });
  };

  if (isPending)
    return (
      <Flex justify="center" align="center" style={{ height: "50vh" }}>
        <Text>Loading...</Text>
      </Flex>
    );
  if (!session?.user) return null;

  const user = session.user as unknown as UserWithRole;

  if (isBanned) {
    return (
      <Container size="2" className="py-8">
        <Card style={{ borderLeft: "4px solid var(--red-9)" }}>
          <Flex direction="column" gap="4" align="center" p="6">
            <AlertTriangle size={48} color="var(--red-9)" />
            <Heading color="red">Account Suspended</Heading>
            <Text align="center">{banMessage}</Text>
            <RadixButton onClick={handleSignOut} color="red" variant="soft">
              Sign Out
            </RadixButton>
          </Flex>
        </Card>
      </Container>
    );
  }

  const getRoleLabel = () => {
    if (user.role === "individual") return "Individual Learner";
    if (user.role === "school") return "School Student";
    return "Student";
  };

  return (
    <Container size="2" className="py-8">
      <Flex direction="column" gap="5" style={{ marginBottom: "8px" }}>
        <Card>
          <Flex
            direction={{ initial: "column", sm: "row" }}
            align="center"
            gap="5"
            p="4"
          >
            <Avatar
              src={user.image}
              size="8"
              radius="full"
              fallback={user.name?.[0] || "S"}
              style={{ border: "2px solid var(--gray-4)" }}
            />
            <Flex
              direction="column"
              align={{ initial: "center", sm: "start" }}
              style={{ flex: 1 }}
            >
              <Heading size="6">{user.name}</Heading>
              <Text size="2" color="gray">
                {user.email}
              </Text>
              <Flex gap="2" mt="2">
                <Badge color="green" radius="full">
                  {getRoleLabel()}
                </Badge>
                <Badge color="gray" radius="full">
                  Joined{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : "2024"}
                </Badge>
              </Flex>
            </Flex>

            <RadixButton variant="soft" color="red" onClick={handleSignOut}>
              <LogOut size={16} /> Sign Out
            </RadixButton>
          </Flex>
        </Card>

        <Grid columns={{ initial: "1", md: "3" }} gap="5">
          <Box style={{ gridColumn: "span 2" }}>
            <Flex direction="column" gap="5">
              <Card>
                <Flex direction="column" gap="4" p="4">
                  <Flex align="center" gap="2">
                    <User size={18} color="var(--gray-11)" />
                    <Heading size="4">Personal Details</Heading>
                  </Flex>

                  <Grid columns={{ initial: "1", sm: "2" }} gap="3">
                    <Box
                      p="3"
                      style={{
                        background: "var(--gray-2)",
                        borderRadius: "8px",
                      }}
                    >
                      <Text size="1" color="gray" weight="bold">
                        FULL NAME
                      </Text>
                      <Text size="2" weight="medium" as="div">
                        {user.name}
                      </Text>
                    </Box>

                    <Box
                      p="3"
                      style={{
                        background: "var(--gray-2)",
                        borderRadius: "8px",
                      }}
                    >
                      <Text size="1" color="gray" weight="bold">
                        EMAIL
                      </Text>
                      <Text size="2" weight="medium" as="div">
                        {user.email}
                      </Text>
                    </Box>

                    <Box
                      p="3"
                      style={{
                        background: "var(--gray-2)",
                        borderRadius: "8px",
                      }}
                    >
                      <Text size="1" color="gray" weight="bold">
                        ROLE
                      </Text>
                      <Text size="2" weight="medium" as="div">
                        {getRoleLabel()}
                      </Text>
                    </Box>

                    <Box
                      p="3"
                      style={{
                        background: "var(--gray-2)",
                        borderRadius: "8px",
                      }}
                    >
                      <Text size="1" color="gray" weight="bold">
                        JOINED
                      </Text>
                      <Text size="2" weight="medium" as="div">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </Box>
                  </Grid>
                </Flex>
              </Card>

              <Card>
                <Box p="4">
                  <Flex justify="between" align="center" mb="2">
                    <Flex align="center" gap="2">
                      <Shield size={18} color="var(--gray-11)" />
                      <Heading size="4">Security</Heading>
                    </Flex>
                    {!showPasswordChange && (
                      <RadixButton
                        variant="soft"
                        color="gray"
                        onClick={() => setShowPasswordChange(true)}
                      >
                        Update Password
                      </RadixButton>
                    )}
                  </Flex>

                  {!showPasswordChange ? (
                    <Text size="2" color="gray" mt="1">
                      Manage your password securely. Keep your account safe by
                      updating it periodically.
                    </Text>
                  ) : (
                    <Flex
                      direction="column"
                      gap="3"
                      mt="4"
                      p="4"
                      style={{
                        background: "var(--gray-2)",
                        borderRadius: "8px",
                        border: "1px solid var(--gray-4)",
                      }}
                    >
                      <Grid columns={{ initial: "1", sm: "2" }} gap="3">
                        <Box style={{ gridColumn: "span 2" }}>
                          <Text size="2" weight="bold" mb="1" as="div">
                            Current Password
                          </Text>
                          <div style={{ position: "relative" }}>
                            <TextField
                              type={showOldPassword ? "text" : "password"}
                              placeholder="Current Password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              style={{ background: "white" }}
                            />
                            <IconButton
                              variant="ghost"
                              color="gray"
                              style={{
                                position: "absolute",
                                right: 8,
                                bottom: 8,
                              }}
                              onClick={() =>
                                setShowOldPassword(!showOldPassword)
                              }
                            >
                              {showOldPassword ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                            </IconButton>
                          </div>
                        </Box>

                        <Box>
                          <Text size="2" weight="bold" mb="1" as="div">
                            New Password
                          </Text>
                          <div style={{ position: "relative" }}>
                            <TextField
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Type new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              style={{ background: "white" }}
                            />
                            <IconButton
                              variant="ghost"
                              color="gray"
                              style={{
                                position: "absolute",
                                right: 8,
                                bottom: 8,
                              }}
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                            </IconButton>
                          </div>
                        </Box>

                        <Box>
                          <Text size="2" weight="bold" mb="1" as="div">
                            Confirm
                          </Text>
                          <TextField
                            type="password"
                            placeholder="Repeat new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ background: "white" }}
                          />
                        </Box>
                      </Grid>

                      <Flex gap="3" justify="end" align="center" mt="2">
                        <RadixButton
                          variant="ghost"
                          color="gray"
                          onClick={() => setShowPasswordChange(false)}
                        >
                          Cancel
                        </RadixButton>
                        <RadixButton
                          onClick={handlePasswordChange}
                          disabled={saving}
                        >
                          <Save size={16} />{" "}
                          {saving ? "Saving..." : "Save Changes"}
                        </RadixButton>
                      </Flex>
                    </Flex>
                  )}

                  {message && (
                    <Box
                      mt="3"
                      p="2"
                      style={{
                        borderRadius: "6px",
                        background:
                          message.type === "success"
                            ? "var(--green-3)"
                            : "var(--red-3)",
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
            </Flex>
          </Box>

          <Flex direction="column" gap="5">
            <Card>
              <Box p="4">
                <Flex align="center" justify="between" mb="4">
                  <Heading size="3">Recent Achievements</Heading>
                  <Trophy size={18} color="var(--orange-9)" />
                </Flex>

                <Flex direction="column" gap="3">
                  <Flex
                    align="center"
                    gap="3"
                    p="2"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid var(--gray-4)",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--yellow-3)",
                        borderRadius: "50%",
                      }}
                    >
                      <Medal size={18} color="var(--yellow-11)" />
                    </Flex>
                    <Box>
                      <Text size="2" weight="bold" as="div">
                        Fast Learner
                      </Text>
                      <Text size="1" color="gray">
                        Completed 5 lessons
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    align="center"
                    gap="3"
                    p="2"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid var(--gray-4)",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--blue-3)",
                        borderRadius: "50%",
                      }}
                    >
                      <Target size={18} color="var(--blue-11)" />
                    </Flex>
                    <Box>
                      <Text size="2" weight="bold" as="div">
                        Goal Getter
                      </Text>
                      <Text size="1" color="gray">
                        Hit weekly target
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    align="center"
                    gap="3"
                    p="2"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid var(--gray-4)",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--red-3)",
                        borderRadius: "50%",
                      }}
                    >
                      <Flame size={18} color="var(--red-11)" />
                    </Flex>
                    <Box>
                      <Text size="2" weight="bold" as="div">
                        On Fire!
                      </Text>
                      <Text size="1" color="gray">
                        3 Day Streak
                      </Text>
                    </Box>
                  </Flex>
                </Flex>

                <Button
                  variant="soft"
                  color="gray"
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    cursor: "pointer",
                    justifyContent: "center",
                    padding: "10px 20px",
                  }}
                >
                  View All Achievements
                </Button>
              </Box>
            </Card>
          </Flex>
        </Grid>
      </Flex>
    </Container>
  );
}
