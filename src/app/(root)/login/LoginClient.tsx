"use client";

import "./login.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Text, Heading, Box } from "@radix-ui/themes";
import Button from "@/component/atoms/Button";
import { TextField } from "@/component/atoms/TextField";
import { signIn, useSession } from "@/util/auth";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n";
import { getSchoolDomain } from "@/util/tenant.util";

import { IMAGES } from "@/constants/images";

const ROLE_CONFIG: Record<
  string,
  { title: string; image: string; description: string }
> = {
  student: {
    title: "Student Login",
    description: "Access your courses and assignments",
    image: IMAGES.login.kids1,
  },
  admin: {
    title: "Admin / Parent Login",
    description: "Manage operations and view reports",
    image: IMAGES.login.kids2,
  },
  "super-admin": {
    title: "Super Admin Login",
    description: "System administration access",
    image: IMAGES.login.kids3,
  },
};

export default function LoginClient({ option }: { option: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, isPending } = useSession();
  const activeConfig = ROLE_CONFIG[option] || ROLE_CONFIG["student"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    const logoutFlag = sessionStorage.getItem("justLoggedOut");
    if (logoutFlag) {
      setJustLoggedOut(true);
      sessionStorage.removeItem("justLoggedOut");
      setTimeout(() => setJustLoggedOut(false), 1000);
    }
  }, []);

  useEffect(() => {
    if (isPending || justLoggedOut) return;

    if (session?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = (session.user as any)?.role;
      if (["student", "individual", "school"].includes(role))
        router.replace("/student/dashboard");
      else if (["admin", "parent"].includes(role))
        router.replace("/controller/dashboard");
      else if (role === "superAdmin") router.replace("/super-admin/dashboard");
    }
  }, [session, isPending, justLoggedOut, router]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await signIn.email(
        { email, password },
        {
          onRequest: (ctx) => {
            ctx.headers.set("x-school-domain", getSchoolDomain());
            return ctx;
          },
          onSuccess: (ctx) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const user = ctx.data?.user as any;
            const userRole = user?.role;

            // Ban Check
            if (user?.banned) {
              const expires = user.banExpires
                ? new Date(user.banExpires)
                : null;
              if (!expires || expires > new Date()) {
                setError(
                  user.banReason
                    ? `Suspended: ${user.banReason}`
                    : "Account suspended.",
                );
                return;
              }
            }

            // Role Validation
            let isValid = false;
            if (option === "student")
              isValid = ["student", "individual", "school", "teacher"].includes(
                userRole,
              );
            else if (option === "admin")
              isValid = ["admin", "parent"].includes(userRole);
            else if (option === "super-admin")
              isValid = userRole === "superAdmin";

            if (!isValid) {
              setError(
                `Access denied. You cannot login as ${activeConfig.title}.`,
              );
              return;
            }

            // Redirect
            if (option === "student") router.push("/student/dashboard");
            else if (option === "admin") router.push("/controller/dashboard");
            else router.push("/super-admin/dashboard");
          },
          onError: (ctx) =>
            setError(ctx.error.message || t("auth.invalidCredentials")),
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || t("auth.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) handleSignIn();
  };

  if (isPending) {
    return (
      <div className="login-page-wrapper">
        <Text>Loading...</Text>
      </div>
    );
  }

  return (
    <main className="login-page-wrapper">
      <div className="login-card">
        <div className="login-form-container">
          <Flex direction="column" gap="5" className="login-form-content">
            <Box>
              <Heading size="7" align="center" className="login-title">
                {activeConfig.title}
              </Heading>
            </Box>

            {error && (
              <Flex
                gap="2"
                p="3"
                style={{
                  background: "var(--red-3)",
                  borderRadius: "6px",
                  color: "var(--red-11)",
                }}
                align="center"
              >
                <AlertCircle size={16} />
                <Text size="2">{error}</Text>
              </Flex>
            )}

            <Flex direction="column" gap="4">
              <TextField
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                size="small"
                className="login-input"
              />

              <div style={{ position: "relative" }}>
                <TextField
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  size="small"
                  className="login-input"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                size="small"
                onClick={handleSignIn}
                disabled={isLoading}
                style={{ width: "100%", cursor: "pointer" }}
              >
                {isLoading ? t("auth.signingIn") : t("auth.loginButton")}
              </Button>
            </Flex>

            <Flex direction="column" gap="3" align="center" mt="0">
              <a
                href="/forgot-password"
                style={{
                  fontSize: "14px",
                  color: "var(--orange-10)",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </a>
            </Flex>
          </Flex>
        </div>

        <div className="login-image-container">
          <Image
            src={activeConfig.image}
            alt={activeConfig.title}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </div>
    </main>
  );
}
