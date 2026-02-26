"use client";

import "../login/individual-login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/component/atoms/Button";
import { Heading, Flex, Text } from "@radix-ui/themes";
import { TextField } from "@/component/atoms/TextField";
import { ArrowLeft, Mail } from "lucide-react";
import {
  authApi,
  ForgotPasswordInput,
  BackendResponse,
} from "@/services/api.service";

type UserType = "student" | "admin" | "parent" | "superAdmin";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload: ForgotPasswordInput = { email, userType };
      const response = await authApi.forgotPassword(payload);

      if (response.success) {
        setMessage({
          type: "success",
          text: "If an account with this email exists, a password reset link has been sent.",
        });
        setEmail("");
      } else {
        // Extract error message from response
        const errorData = response.data as BackendResponse | undefined;
        const errorMessage =
          response.error || errorData?.message || "Failed to send reset link";
        setMessage({
          type: "error",
          text: errorMessage,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const getBackLink = () => {
    switch (userType) {
      case "superAdmin":
        return "/super-admin";
      case "admin":
      case "parent":
        return "/controller";
      case "student":
      default:
        return "/login?option=student";
    }
  };

  return (
    <div className="individual-login-container">
      <div className="individual-login-card">
        <Flex direction="column" gap="5" p="6">
          <button
            onClick={() => router.push(getBackLink())}
            className="back-link"
            style={{ alignSelf: "flex-start" }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

          <Heading size="6" className="login-header">
            Forgot Password
          </Heading>
          <Text size="2" align="center" color="gray">
            Enter your email to receive a password reset link
          </Text>

          <Flex direction="column" gap="4" mt="2">
            <div>
              <Text
                size="2"
                weight="medium"
                style={{ marginBottom: "8px", display: "block" }}
              >
                Account Type
              </Text>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserType)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "2px solid var(--orange-7)",
                  background: "var(--color-background)",
                  fontSize: "14px",
                }}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="parent">Parent</option>
                <option value="superAdmin">Super Admin</option>
              </select>
            </div>

            <TextField
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              className="login-input"
              icon={<Mail size={16} />}
            />

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              size="large"
              className="login-button"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {message && (
              <div
                className={message.type === "error" ? "login-error" : ""}
                style={{
                  background:
                    message.type === "success" ? "#dcfce7" : undefined,
                  border:
                    message.type === "success"
                      ? "1px solid #22c55e"
                      : undefined,
                  borderRadius: "6px",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <Text
                  size="2"
                  color={message.type === "success" ? "green" : undefined}
                >
                  {message.text}
                </Text>
              </div>
            )}
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
