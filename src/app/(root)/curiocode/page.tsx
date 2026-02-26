"use client";

import React, { useState } from "react";
import Flex from "@/component/atoms/Flex";
import Typography from "@/component/atoms/Typography";
import Container from "@/component/atoms/Container";
import Navbar from "@/component/organisms/Navbar";
import { Button } from "@radix-ui/themes";
import { Plus, Minus } from "lucide-react";
import { useTranslation } from "@/i18n";
import "./curiocode.css";

export default function CurioCodePage() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<number>(1);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: t("curioCodePage.faq1Question"),
      answer: t("curioCodePage.faq1Answer"),
    },
    {
      question: t("curioCodePage.faq2Question"),
      answer: t("curioCodePage.faq2Answer"),
    },
    {
      question: t("curioCodePage.faq3Question"),
      answer: t("curioCodePage.faq3Answer"),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="curiocode-page">
        {/* Hero Section */}
        <section className="curiocode-hero">
          <Container maxWidth="1400px" px={{ initial: "4", sm: "6", lg: "8" }}>
            <Flex direction="column" align="center" gap="6" py="9">
              <Typography
                variant="heading"
                size="9"
                align="center"
                className="hero-title"
              >
                {t("curioCodePage.heroTitle")}
              </Typography>
              <Typography
                variant="text"
                size="6"
                align="center"
                className="hero-subtitle"
              >
                {t("curioCodePage.heroSubtitle")}
              </Typography>
              <Typography
                variant="text"
                size="4"
                align="center"
                className="hero-description"
                style={{ maxWidth: "900px" }}
              >
                {t("curioCodePage.heroDescription")}
              </Typography>

              {/* Stats */}
              <Flex
                gap="8"
                mt="6"
                className="stats-container"
                wrap="wrap"
                justify="center"
              >
                <Flex direction="column" align="center" gap="2">
                  <Typography
                    variant="heading"
                    size="8"
                    className="stat-number"
                  >
                    3
                  </Typography>
                  <Typography variant="text" size="3" className="stat-label">
                    {t("curioCodePage.progressiveStages")}
                  </Typography>
                </Flex>
                <Flex direction="column" align="center" gap="2">
                  <Typography
                    variant="heading"
                    size="8"
                    className="stat-number"
                  >
                    8+
                  </Typography>
                  <Typography variant="text" size="3" className="stat-label">
                    {t("curioCodePage.startingAge")}
                  </Typography>
                </Flex>
                <Flex direction="column" align="center" gap="2">
                  <Typography
                    variant="heading"
                    size="8"
                    className="stat-number"
                  >
                    100%
                  </Typography>
                  <Typography variant="text" size="3" className="stat-label">
                    {t("curioCodePage.handsOnProjects")}
                  </Typography>
                </Flex>
              </Flex>

              <Button size="4" className="cta-button" mt="4">
                {t("curioCodePage.exploreJourney")}
              </Button>
            </Flex>
          </Container>
        </section>

        {/* Learning Path Section */}
        <section className="learning-path-section">
          <Container maxWidth="1400px" px={{ initial: "4", sm: "6", lg: "8" }}>
            <Flex direction="column" align="center" gap="6" py="9">
              <Typography
                variant="heading"
                size="8"
                align="center"
                className="section-title"
              >
                {t("curioCodePage.learningPathTitle")}
              </Typography>
              <Typography
                variant="text"
                size="4"
                align="center"
                className="section-subtitle"
              >
                {t("curioCodePage.learningPathSubtitle")}
              </Typography>

              {/* Stage Cards */}
              <div className="stages-grid">
                {/* Stage 1 */}
                <div
                  className={`stage-card stage-1 ${selectedStage === 1 ? "active" : ""}`}
                  onClick={() => setSelectedStage(1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedStage(1)}
                >
                  <div className="stage-icon">🧩</div>
                  <Typography variant="heading" size="6" className="stage-name">
                    {t("curioCodePage.stage1")}
                  </Typography>
                  <Typography variant="text" size="4" className="stage-title">
                    {t("curioCodePage.stage1Title")}
                  </Typography>
                  <Typography variant="text" size="3" className="stage-age">
                    {t("curioCodePage.stage1Age")}
                  </Typography>
                </div>

                {/* Stage 2 */}
                <div
                  className={`stage-card stage-2 ${selectedStage === 2 ? "active" : ""}`}
                  onClick={() => setSelectedStage(2)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedStage(2)}
                >
                  <div className="stage-icon">🐢</div>
                  <Typography variant="heading" size="6" className="stage-name">
                    {t("curioCodePage.stage2")}
                  </Typography>
                  <Typography variant="text" size="4" className="stage-title">
                    {t("curioCodePage.stage2Title")}
                  </Typography>
                  <Typography variant="text" size="3" className="stage-age">
                    {t("curioCodePage.stage2Age")}
                  </Typography>
                </div>

                {/* Stage 3 */}
                <div
                  className={`stage-card stage-3 ${selectedStage === 3 ? "active" : ""}`}
                  onClick={() => setSelectedStage(3)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedStage(3)}
                >
                  <div className="stage-icon">💻</div>
                  <Typography variant="heading" size="6" className="stage-name">
                    {t("curioCodePage.stage3")}
                  </Typography>
                  <Typography variant="text" size="4" className="stage-title">
                    {t("curioCodePage.stage3Title")}
                  </Typography>
                  <Typography variant="text" size="3" className="stage-age">
                    {t("curioCodePage.stage3Age")}
                  </Typography>
                </div>
              </div>
            </Flex>
          </Container>
        </section>

        {/* Detailed Stage Sections */}
        {/* Stage 1 Detail */}
        {selectedStage === 1 && (
          <section className="stage-detail stage-1-detail">
            <Container
              maxWidth="1400px"
              px={{ initial: "4", sm: "6", lg: "8" }}
            >
              <Flex direction="column" gap="6" py="9">
                <Flex direction="row" gap="4" align="center" wrap="wrap">
                  <Typography
                    variant="heading"
                    size="8"
                    className="stage-detail-title"
                  >
                    {t("curioCodePage.stage1DetailTitle")}
                  </Typography>
                  <div className="stage-badges">
                    <span className="badge">
                      {t("curioCodePage.stage1Ages")}
                    </span>
                    <span className="badge">
                      {t("curioCodePage.stage1Duration")}
                    </span>
                    <span className="badge">
                      {t("curioCodePage.stage1Level")}
                    </span>
                  </div>
                </Flex>

                <div className="stage-content-grid">
                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.stage1WhatLearn")}
                    </Typography>
                    <Typography variant="text" size="4" mb="4">
                      {t("curioCodePage.stage1Description")}
                    </Typography>
                    <ul className="feature-list">
                      <li>{t("curioCodePage.stage1Feature1")}</li>
                      <li>{t("curioCodePage.stage1Feature2")}</li>
                      <li>{t("curioCodePage.stage1Feature3")}</li>
                      <li>{t("curioCodePage.stage1Feature4")}</li>
                    </ul>
                  </div>

                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.skillsDeveloped")}
                    </Typography>
                    <div className="skills-grid">
                      <span className="skill-tag">
                        {t("curioCodePage.stage1Skill1")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage1Skill2")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage1Skill3")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage1Skill4")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage1Skill5")}
                      </span>
                    </div>
                  </div>

                  <div className="content-block outcome-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.parentOutcome")}
                    </Typography>
                    <Typography
                      variant="text"
                      size="4"
                      className="outcome-text"
                    >
                      &ldquo;{t("curioCodePage.stage1Outcome")}&rdquo;
                    </Typography>
                  </div>

                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.sampleProjects")}
                    </Typography>
                    <div className="projects-grid">
                      <div className="project-card">
                        {t("curioCodePage.stage1Project1")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage1Project2")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage1Project3")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage1Project4")}
                      </div>
                    </div>
                  </div>
                </div>
              </Flex>
            </Container>
          </section>
        )}

        {/* Stage 2 Detail */}
        {selectedStage === 2 && (
          <section className="stage-detail stage-2-detail">
            <Container
              maxWidth="1400px"
              px={{ initial: "4", sm: "6", lg: "8" }}
            >
              <Flex direction="column" gap="6" py="9">
                <Flex direction="row" gap="4" align="center" wrap="wrap">
                  <Typography
                    variant="heading"
                    size="8"
                    className="stage-detail-title"
                  >
                    {t("curioCodePage.stage2DetailTitle")}
                  </Typography>
                  <div className="stage-badges">
                    <span className="badge">
                      {t("curioCodePage.stage2Ages")}
                    </span>
                    <span className="badge">
                      {t("curioCodePage.stage2Duration")}
                    </span>
                    <span className="badge">
                      {t("curioCodePage.stage2Level")}
                    </span>
                  </div>
                </Flex>

                <div className="stage-content-grid">
                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.stage1WhatLearn")}
                    </Typography>
                    <Typography variant="text" size="4" mb="4">
                      {t("curioCodePage.stage2Description")}
                    </Typography>
                    <ul className="feature-list">
                      <li>{t("curioCodePage.stage2Feature1")}</li>
                      <li>{t("curioCodePage.stage2Feature2")}</li>
                      <li>{t("curioCodePage.stage2Feature3")}</li>
                      <li>{t("curioCodePage.stage2Feature4")}</li>
                    </ul>
                  </div>

                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.skillsDeveloped")}
                    </Typography>
                    <div className="skills-grid">
                      <span className="skill-tag">
                        {t("curioCodePage.stage2Skill1")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage2Skill2")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage2Skill3")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage2Skill4")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage2Skill5")}
                      </span>
                    </div>
                  </div>

                  <div className="content-block outcome-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.parentOutcome")}
                    </Typography>
                    <Typography
                      variant="text"
                      size="4"
                      className="outcome-text"
                    >
                      &ldquo;{t("curioCodePage.stage2Outcome")}&rdquo;
                    </Typography>
                  </div>

                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.sampleProjects")}
                    </Typography>
                    <div className="projects-grid">
                      <div className="project-card">
                        {t("curioCodePage.stage2Project1")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage2Project2")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage2Project3")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage2Project4")}
                      </div>
                    </div>
                  </div>
                </div>
              </Flex>
            </Container>
          </section>
        )}

        {/* Stage 3 Detail */}
        {selectedStage === 3 && (
          <section className="stage-detail stage-3-detail">
            <Container
              maxWidth="1400px"
              px={{ initial: "4", sm: "6", lg: "8" }}
            >
              <Flex direction="column" gap="6" py="9">
                <Flex direction="row" gap="4" align="center" wrap="wrap">
                  <Typography
                    variant="heading"
                    size="8"
                    className="stage-detail-title"
                  >
                    {t("curioCodePage.stage3DetailTitle")}
                  </Typography>
                  <div className="stage-badges">
                    <span className="badge">
                      {t("curioCodePage.stage3Ages")}
                    </span>
                    <span className="badge">
                      {t("curioCodePage.stage3Duration")}
                    </span>
                    <span className="badge">
                      {t("curioCodePage.stage3Level")}
                    </span>
                  </div>
                </Flex>

                <div className="stage-content-grid">
                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.stage1WhatLearn")}
                    </Typography>
                    <Typography variant="text" size="4" mb="4">
                      {t("curioCodePage.stage3Description")}
                    </Typography>
                    <ul className="feature-list">
                      <li>{t("curioCodePage.stage3Feature1")}</li>
                      <li>{t("curioCodePage.stage3Feature2")}</li>
                      <li>{t("curioCodePage.stage3Feature3")}</li>
                      <li>{t("curioCodePage.stage3Feature4")}</li>
                    </ul>
                  </div>

                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.skillsDeveloped")}
                    </Typography>
                    <div className="skills-grid">
                      <span className="skill-tag">
                        {t("curioCodePage.stage3Skill1")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage3Skill2")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage3Skill3")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage3Skill4")}
                      </span>
                      <span className="skill-tag">
                        {t("curioCodePage.stage3Skill5")}
                      </span>
                    </div>
                  </div>

                  <div className="content-block outcome-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.parentOutcome")}
                    </Typography>
                    <Typography
                      variant="text"
                      size="4"
                      className="outcome-text"
                    >
                      &ldquo;{t("curioCodePage.stage3Outcome")}&rdquo;
                    </Typography>
                  </div>

                  <div className="content-block">
                    <Typography variant="heading" size="5" mb="3">
                      {t("curioCodePage.sampleProjects")}
                    </Typography>
                    <div className="projects-grid">
                      <div className="project-card">
                        {t("curioCodePage.stage3Project1")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage3Project2")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage3Project3")}
                      </div>
                      <div className="project-card">
                        {t("curioCodePage.stage3Project4")}
                      </div>
                    </div>
                  </div>
                </div>
              </Flex>
            </Container>
          </section>
        )}

        {/* FAQ Section */}
        <section className="faq-section">
          <Container maxWidth="1200px" px={{ initial: "4", sm: "6", lg: "8" }}>
            <Flex direction="column" gap="6" py="9">
              <Typography
                variant="heading"
                size="8"
                align="center"
                className="section-title"
                mb="6"
              >
                {t("curioCodePage.faqTitle")}
              </Typography>

              <div className="faq-container">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => toggleFaq(index)}
                    >
                      <Typography variant="text" size="5">
                        {faq.question}
                      </Typography>
                      {openFaq === index ? (
                        <Minus size={24} className="faq-icon" />
                      ) : (
                        <Plus size={24} className="faq-icon" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="faq-answer">
                        <Typography variant="text" size="4">
                          {faq.answer}
                        </Typography>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Flex>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <Container maxWidth="1200px" px={{ initial: "4", sm: "6", lg: "8" }}>
            <Flex direction="column" align="center" gap="6" py="9">
              <Typography
                variant="heading"
                size="8"
                align="center"
                className="cta-title"
              >
                {t("curioCodePage.ctaTitle")}
              </Typography>
              <Typography
                variant="text"
                size="4"
                align="center"
                className="cta-subtitle"
              >
                {t("curioCodePage.ctaSubtitle")}
              </Typography>

              <Flex gap="4" mt="4" wrap="wrap" justify="center">
                <Button size="4" className="cta-button-primary">
                  {t("curioCodePage.startFreeTrial")}
                </Button>
                <Button
                  size="4"
                  variant="outline"
                  className="cta-button-secondary"
                >
                  {t("curioCodePage.scheduleConsultation")}
                </Button>
              </Flex>

              <Typography
                variant="text"
                size="2"
                align="center"
                className="cta-disclaimer"
                mt="4"
              >
                {t("curioCodePage.ctaDisclaimer")}
              </Typography>
            </Flex>
          </Container>
        </section>
      </main>
    </>
  );
}
