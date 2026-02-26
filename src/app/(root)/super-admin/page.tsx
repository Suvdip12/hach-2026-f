"use client";

import "./individual-login.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/component/atoms/Button";
import { signIn, useSession } from "@/util/auth";
import { Heading, Flex, Text } from "@radix-ui/themes";
import { TextField } from "@/component/atoms/TextField";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n";
import { getTenantHeaders } from "@/util/tenant.util";

const SuperAdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    if (session?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRole = (session.user as any)?.role;
      if (userRole === "superAdmin") {
        router.push("/super-admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }
  }, [session, router]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await signIn.email(
        { email, password },
        {
          onRequest: (ctx) => {
            ctx.headers.set("x-school-domain", "system");
            return ctx;
          },
          onSuccess: (ctx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userRole = (ctx.data?.user as any)?.role;
            if (userRole === "superAdmin") {
              router.push("/super-admin/dashboard");
            } else {
              setError("Access denied. Super Admin credentials required.");
            }
          },
          onError: (ctx) => {
            setError(ctx.error.message || t("auth.invalidCredentials"));
          },
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || t("auth.invalidCredentials"));
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSignIn();
    }
  };

  if (isPending) {
    return (
      <div className="individual-login-container">
        <Flex justify="center" align="center">
          <Text>{t("auth.loading")}</Text>
        </Flex>
      </div>
    );
  }

  return (
    <div className="individual-login-container">
      <div className="individual-login-card">
        <Flex direction="column" gap="5" p="6">
          <Heading size="6" className="login-header">
            Super Admin Login
          </Heading>
          <Text size="2" align="center" color="gray">
            Platform-wide administration access
          </Text>

          <Flex direction="column" gap="4" mt="2">
            <TextField
              placeholder={t("auth.emailPlaceholder")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              className="login-input"
            />
            <div style={{ position: "relative" }}>
              <TextField
                placeholder={t("auth.passwordPlaceholder")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                className="login-input"
                style={{ paddingRight: "40px" }}
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

            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="large"
              className="login-button"
            >
              {isLoading ? t("auth.signingIn") : t("auth.loginButton")}
            </Button>

            {error && (
              <div className="login-error">
                <Text size="2">{error}</Text>
              </div>
            )}

            <Text size="2" align="center">
              <a
                href="/forgot-password"
                style={{ color: "var(--orange-10)", textDecoration: "none" }}
              >
                Forgot password?
              </a>
            </Text>

            <Text size="2" align="center" mt="2">
              <a
                href="/login"
                className="back-link"
                style={{ justifyContent: "center" }}
              >
                <ArrowLeft size={16} />
                Back to login options
              </a>
            </Text>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
