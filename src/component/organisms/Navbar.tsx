"use client";

import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/constants/images";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "../atoms/Button";
import { curioRoutes } from "@/data/routes";
import {
  ChevronDown,
  Menu,
  X,
  LogIn,
  User,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Code,
  ChartSplineIcon,
} from "lucide-react";
import Flex from "@/component/atoms/Flex";
import "@/component/organisms/css/Navbar.css";
import Typography from "@/component/atoms/Typography";
import ThemeSwitcher from "@/component/molecules/ThemeSwitcher";
import IconButton from "@/component/atoms/IconButton";
import { useI18n } from "@/i18n";
import { useSession, signOut } from "@/util/auth";
import { Avatar, HoverCard, Box, Separator, Text } from "@radix-ui/themes";

interface NavTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  description?: string;
  shortLabel?: string;
}

interface NavbarProps {
  tabs?: NavTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

function NavButton({
  title,
  href,
  isActive,
  onClick,
  icon: Icon,
}: {
  title: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Button
        className={`nav-button ${isActive ? "active-style" : ""}`}
        onClick={onClick}
      >
        {Icon && <Icon size={16} />}
        {title}
      </Button>
    </Link>
  );
}

export default function Navbar({ tabs, activeTab, onTabChange }: NavbarProps) {
  const pathname = usePathname();
  // const router = useRouter();
  const { t } = useI18n();
  const { data: session, isPending } = useSession();
  const [isCurioMenuOpen, setIsCurioMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = !!session?.user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session?.user as any)?.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;

  const isStudentPage = pathname?.startsWith("/student");
  const isLandingPage = pathname === "/";

  const getDashboardLink = () => {
    if (userRole === "superAdmin") return "/super-admin/dashboard";
    if (userRole === "admin" || userRole === "parent")
      return "/controller/dashboard";
    return "/student/dashboard";
  };

  const handleSignOut = async () => {
    try {
      sessionStorage.setItem("justLoggedOut", "true");
      await signOut();
      window.location.replace(
        `/login?option=${userRole === "school" ? "student" : userRole || "student"}`,
      );
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const landingRoutes = [
    { path: "/", label: t("common.home") },
    { path: "/about", label: t("common.about") },
    { path: "/contact", label: t("common.contact") },
    { path: getDashboardLink(), label: t("common.dashboard") },
  ];

  const studentRoutes = [
    { path: getDashboardLink(), label: "Dashboard", icon: LayoutDashboard },
    { path: "/student/courses", label: "My Courses", icon: BookOpen },
    { path: "/student/learning", label: "My Learning", icon: ChartSplineIcon },
    { path: "/student/playground", label: "Playground", icon: Code },
  ];

  const currentNavLinks = isStudentPage ? studentRoutes : landingRoutes;

  // Curio Products Logic
  const translatedCurioRoutes = curioRoutes.map((route) => {
    const keyMap: Record<string, string> = {
      "/curiocode": "curioCode",
      "/curioai": "curioAI",
      "/curiobot": "curioBot",
      "/curiothink": "curioThink",
    };
    const key = keyMap[route.path] || "curioCode";
    return {
      ...route,
      label: t(`products.${key}.label`),
      description: t(`products.${key}.description`),
    };
  });

  const currentProduct = translatedCurioRoutes.find((route) =>
    pathname.startsWith(route.path),
  );

  const toggleCurioMenu = () => setIsCurioMenuOpen(!isCurioMenuOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCurioMenuOpen(false);
  };

  return (
    <nav className={`navbar-wrapper ${!isLandingPage ? "internal-mode" : ""}`}>
      <Flex
        style={{
          margin: !isLandingPage ? "8px 16px" : "0",
        }}
        p={"3"}
        className="navbar-container"
        justify="between"
        align="center"
      >
        <Flex direction="row" align="center" gap="3" className="navbar-left">
          <Link
            href={isStudentPage ? "/student/dashboard" : "/"}
            className="navbar-logo-link"
          >
            <Flex
              direction="row"
              align="center"
              gap="2"
              className="navbar-logo"
            >
              <Image
                src={IMAGES.logo.icon1}
                alt="logo"
                width={50}
                height={40}
              />
              <Typography
                variant="heading"
                color="orange"
                className="brand-text"
              >
                CurioTech
              </Typography>
            </Flex>
          </Link>

          {!isLandingPage && !isStudentPage && currentProduct && (
            <Flex
              direction="row"
              align="center"
              gap="2"
              className="current-product-info"
            >
              <div className="current-product-divider"></div>
              <div className="current-product-icon">{currentProduct.icon}</div>
              <div className="current-product-details">
                <div className="current-product-name">
                  {currentProduct.label}
                </div>
                <div className="current-product-desc">
                  {currentProduct.description}
                </div>
              </div>
            </Flex>
          )}

          {!isLandingPage && tabs && tabs.length > 0 && (
            <Flex
              direction="row"
              align="center"
              gap="1"
              className="navbar-tabs"
            >
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`tab-button ${isActive ? "active" : ""}`}
                    onClick={() => onTabChange?.(tab.id)}
                  >
                    <IconComponent size={16} />
                    <span className="tab-label">{tab.label}</span>
                  </button>
                );
              })}
            </Flex>
          )}
        </Flex>

        <Flex className="desktop-nav" justify="center" gap={"4"} align="center">
          {!isLandingPage && !isStudentPage && (
            <div className="curio-dropdown-landing">
              <button
                className="curio-dropdown-trigger-landing"
                onClick={toggleCurioMenu}
              >
                <span>{t("common.ourProducts")}</span>
                <ChevronDown
                  size={16}
                  className={isCurioMenuOpen ? "rotate-180" : ""}
                />
              </button>
              {isCurioMenuOpen && (
                <div className="curio-dropdown-menu-landing">
                  {translatedCurioRoutes.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="curio-dropdown-item-landing"
                      onClick={() => setIsCurioMenuOpen(false)}
                    >
                      <div className="curio-dropdown-icon-landing">
                        {item.icon}
                      </div>
                      <div className="curio-dropdown-content-landing">
                        <div className="curio-dropdown-label-landing">
                          {item.label}
                        </div>
                        <div className="curio-dropdown-description-landing">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentNavLinks.map((item) => (
            <NavButton
              key={item.path}
              title={item.label}
              href={item.path}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              icon={(item as any).icon}
              isActive={pathname === item.path}
            />
          ))}
        </Flex>

        <Flex direction="row" align="center" gap="3" className="navbar-actions">
          {/* <div className="desktop-only-theme">
            <LanguageSwitcher />
          </div> */}
          <div className="desktop-only-theme">
            <ThemeSwitcher />
          </div>

          {/* User Auth Section (Moved to Right) */}
          {!isPending && isAuthenticated ? (
            <HoverCard.Root>
              <HoverCard.Trigger>
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "8px",
                  }}
                >
                  <Avatar
                    src={user?.image || "/default-avatar.png"}
                    fallback={user?.name?.[0] || "S"}
                    size="4"
                    radius="full"
                    style={{ border: "2px solid var(--orange-5)" }}
                  />
                </div>
              </HoverCard.Trigger>
              <HoverCard.Content maxWidth="240px">
                <Flex direction="column" gap="3">
                  <Flex gap="3" align="center">
                    <Avatar
                      size="3"
                      src={user?.image || IMAGES.defaults.avatar}
                      fallback={user?.name?.[0] || "S"}
                      radius="full"
                    />
                    <Box>
                      <Text as="div" size="2" weight="bold">
                        {user?.name}
                      </Text>
                      <Text as="div" size="1" color="gray">
                        {user?.email}
                      </Text>
                    </Box>
                  </Flex>
                  <Separator size="4" />
                  <Box>
                    {/* {!isStudentPage && (
                       <Link href={getDashboardLink()} style={{textDecoration: 'none'}}>
                          <div className="dropdown-item">
                             <LayoutDashboard size={16} /> <span>Dashboard</span>
                          </div>
                       </Link>
                    )} */}
                    <Link
                      href="/student/profile"
                      style={{ textDecoration: "none" }}
                    >
                      <div className="dropdown-item">
                        <User size={16} /> <span>Profile</span>
                      </div>
                    </Link>
                    <div
                      className="dropdown-item logout"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} /> <span>Sign Out</span>
                    </div>
                  </Box>
                </Flex>
              </HoverCard.Content>
            </HoverCard.Root>
          ) : (
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button className="login-nav-button">
                <LogIn size={16} />
                {t("common.login")}
              </button>
            </Link>
          )}

          <IconButton
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="mobile-menu-btn"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </IconButton>
        </Flex>
      </Flex>

      {/* --- MOBILE MENU (Unchanged logic) --- */}
      <div
        className={`mobile-nav-menu ${isMenuOpen ? "mobile-nav-menu--open" : ""}`}
      >
        <div className="mobile-menu-container">
          {/* ... existing mobile menu content ... */}
          <div className="mobile-section">
            <div className="mobile-section-title">{t("common.navigation")}</div>
            {currentNavLinks.map((item) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Icon = (item as any).icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`mobile-tab-button ${
                    pathname === item.path ? "active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  {Icon && <Icon size={18} />}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
