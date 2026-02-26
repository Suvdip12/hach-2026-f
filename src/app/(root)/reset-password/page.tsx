"use client";

import "../login/individual-login.css";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/component/atoms/Button";
import { Heading, Flex, Text } from "@radix-ui/themes";
import { TextField } from "@/component/atoms/TextField";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import {
  authApi,
  ResetPasswordInput,
  BackendResponse,
} from "@/services/api.service";

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const userType = searchParams.get("type");

  useEffect(() => {
    if (!token || !userType) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please request a new password reset.",
      });
    }
  }, [token, userType]);

  const handleSubmit = async () => {
    if (!token || !userType) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please request a new password reset.",
      });
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Map userType for backend - backend expects 'student' or 'controller'
      const backendUserType: "student" | "controller" =
        userType === "student" ? "student" : "controller";

      const payload: ResetPasswordInput = {
        token,
        userType: backendUserType,
        newPassword,
      };

      const response = await authApi.resetPassword(payload);

      if (response.success) {
        setIsSuccess(true);
        setMessage({
          type: "success",
          text: "Password reset successfully! You can now login with your new password.",
        });
      } else {
        // Extract error message from response
        const errorData = response.data as BackendResponse | undefined;
        const errorMessage =
          response.error || errorData?.message || "Failed to reset password";
        setMessage({
          type: "error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const getLoginLink = () => {
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

  if (isSuccess) {
    return (
      <div className="individual-login-container">
        <div className="individual-login-card">
          <Flex direction="column" gap="5" p="6" align="center">
            <CheckCircle size={64} color="var(--green-9)" />
            <Heading size="6" className="login-header">
              Password Reset Successful!
            </Heading>
            <Text size="2" align="center" color="gray">
              Your password has been reset successfully. You can now login with
              your new password.
            </Text>
            <Button
              onClick={() => router.push(getLoginLink())}
              size="large"
              className="login-button"
            >
              Go to Login
            </Button>
          </Flex>
        </div>
      </div>
    );
  }

  return (
    <div className="individual-login-container">
      <div className="individual-login-card">
        <Flex direction="column" gap="5" p="6">
          <Heading size="6" className="login-header">
            Reset Password
          </Heading>
          <Text size="2" align="center" color="gray">
            Enter your new password below
          </Text>

          <Flex direction="column" gap="4" mt="2">
            <div style={{ position: "relative" }}>
              <TextField
                placeholder="New password (min 6 characters)"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                className="login-input"
                icon={<Lock size={16} />}
                style={{ paddingRight: "40px" }}
                disabled={!token || !userType}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <TextField
                placeholder="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                className="login-input"
                icon={<Lock size={16} />}
                style={{ paddingRight: "40px" }}
                disabled={!token || !userType}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !token || !userType}
              size="large"
              className="login-button"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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

            <Text size="2" align="center" color="gray">
              <a
                href="/forgot-password"
                style={{ color: "var(--orange-10)", textDecoration: "none" }}
              >
                Request a new reset link
              </a>
            </Text>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="individual-login-container">
          <div className="individual-login-card">
            <Flex justify="center" align="center" p="6">
              <Text>Loading...</Text>
            </Flex>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
