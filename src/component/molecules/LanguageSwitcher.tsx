"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useI18n, locales, localeNames, localeFlags, Locale } from "@/i18n";
import Flex from "@/component/atoms/Flex";
import IconButton from "@/component/atoms/IconButton";
import { Languages } from "lucide-react";
import "@/component/molecules/css/LanguageSwitcher.css";

// Helper for hydration-safe mounting
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".language-switcher")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="language-switcher">
      <Flex
        align="center"
        justify="center"
        height={"48px"}
        width={"48px"}
        className="language-switcher-button"
      >
        <IconButton onClick={toggleDropdown} aria-label="Change language">
          <Languages size={20} />
        </IconButton>
      </Flex>

      {mounted && isOpen && (
        <div className="language-dropdown">
          {locales.map((loc) => (
            <button
              key={loc}
              className={`language-option ${locale === loc ? "active" : ""}`}
              onClick={() => handleLocaleChange(loc)}
            >
              <span className="language-flag">{localeFlags[loc]}</span>
              <span className="language-name">{localeNames[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
