"use client";

import "./curiobot.css";
import Navbar from "@/component/organisms/Navbar";
import { useTranslation } from "@/i18n";

export default function CurioBotPage() {
  const { t } = useTranslation();

  return (
    <div className="curiobot-page">
      {/* Navbar */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="curiobot-hero">
          <div className="curiobot-container">
            <div className="curiobot-hero-content">
              <h1 className="curiobot-hero-title">
                {t("curioBotPage.heroTitle")}
              </h1>
              <p className="curiobot-hero-subtitle">
                {t("curioBotPage.heroSubtitle")}
              </p>
              <p className="curiobot-hero-description">
                {t("curioBotPage.heroDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="curiobot-coming-soon">
          <div className="curiobot-container">
            <div className="coming-soon-content">
              <div className="coming-soon-icon">🤖</div>
              <h2 className="coming-soon-title">
                {t("curioBotPage.comingSoon")}
              </h2>
              <p className="coming-soon-text">
                {t("curioBotPage.comingSoonText")}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
