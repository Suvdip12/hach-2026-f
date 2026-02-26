"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/component/atoms/Button";
import {
  Container,
  Heading,
  Card,
  Flex,
  Text,
  TextField,
  Box,
} from "@radix-ui/themes";
import { superAdminApi, BackendResponse } from "@/services/api.service";

const CreateSuperAdminPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    superAdminPass1: "",
    superAdminPass2: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const response = await superAdminApi.create({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        superAdminPass1: formData.superAdminPass1,
        superAdminPass2: formData.superAdminPass2,
      });

      const data = response.data as BackendResponse;

      if (response.success) {
        setMessage({
          type: "success",
          text:
            data.message ||
            "Super Admin created successfully! Redirecting to login...",
        });
        setTimeout(() => {
          router.push("/login?option=student");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create super admin",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error creating super admin";
      setMessage({ type: "error", text: errorMessage });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container size="2" className="py-20">
      <Card>
        <Box p="6">
          <Flex direction="column" gap="6" align="center">
            <Heading size="8">Create Super Admin</Heading>
            <Text size="3" color="gray" align="center">
              Set up the first super administrator account
            </Text>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4" mt="6">
              <Box>
                <Text size="2" weight="medium" mb="1">
                  Full Name *
                </Text>
                <TextField.Root
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Email Address *
                </Text>
                <TextField.Root
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                />
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Phone Number *
                </Text>
                <TextField.Root
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  required
                />
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Password *
                </Text>
                <TextField.Root
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                />
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Confirm Password *
                </Text>
                <TextField.Root
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
              </Box>

              <Box mt="4">
                <Text size="3" weight="bold" mb="3">
                  Authorization Required
                </Text>
                <Text size="2" color="gray" mb="3">
                  Contact your system administrator for these credentials
                </Text>
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Super Admin Password 1 *
                </Text>
                <TextField.Root
                  name="superAdminPass1"
                  type="password"
                  value={formData.superAdminPass1}
                  onChange={handleChange}
                  placeholder="Enter authorization key 1"
                  required
                />
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">
                  Super Admin Password 2 *
                </Text>
                <TextField.Root
                  name="superAdminPass2"
                  type="password"
                  value={formData.superAdminPass2}
                  onChange={handleChange}
                  placeholder="Enter authorization key 2"
                  required
                />
              </Box>

              {message && (
                <Box
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

              <Button
                type="submit"
                disabled={loading}
                size="large"
                variant="solid"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                {loading
                  ? "Creating Super Admin..."
                  : "Create Super Admin Account"}
              </Button>

              <Flex justify="center" mt="4">
                <Text size="2" color="gray">
                  Already have an account?{" "}
                  <Text
                    size="2"
                    weight="bold"
                    style={{ cursor: "pointer", color: "var(--accent-9)" }}
                    onClick={() => router.push("/login?option=student")}
                  >
                    Sign In
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </form>
        </Box>
      </Card>
    </Container>
  );
};

export default CreateSuperAdminPage;
