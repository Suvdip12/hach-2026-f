"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Flex from "@/component/atoms/Flex";
import { useEffect, useState } from "react";
import "@/component/molecules/css/ThemeSwitcher.css";
import IconButton from "@/component/atoms/IconButton";
import { useTranslation } from "@/i18n";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const changeTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  useEffect(() => {
    // Defer setting mounted to avoid synchronous setState in effect body
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <Flex
      align="center"
      justify="center"
      height={"48px"}
      width={"48px"}
      className="theme-switcher"
    >
      <IconButton
        onClick={changeTheme}
        aria-label={t("accessibility.toggleTheme")}
      >
        {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
      </IconButton>
    </Flex>
  );
}
