"use client";

import "./curiothink.css";
import Navbar from "@/component/organisms/Navbar";
import { useTranslation } from "@/i18n";

export default function EasyThinkPage() {
  const { t } = useTranslation();

  return (
    <div className="curiothink-page">
      {/* Navbar */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="curiothink-hero">
          <div className="curiothink-container">
            <div className="curiothink-hero-content">
              <h1 className="curiothink-hero-title">
                {t("curioThinkPage.heroTitle")}
              </h1>
              <p className="curiothink-hero-subtitle">
                {t("curioThinkPage.heroSubtitle")}
              </p>
              <p className="curiothink-hero-description">
                {t("curioThinkPage.heroDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="curiothink-coming-soon">
          <div className="curiothink-container">
            <div className="coming-soon-content">
              <div className="coming-soon-icon">💡</div>
              <h2 className="coming-soon-title">
                {t("curioThinkPage.comingSoon")}
              </h2>
              <p className="coming-soon-text">
                {t("curioThinkPage.comingSoonText")}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
