"use client";

import "./page.css";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import Flex from "@/component/atoms/Flex";
import Grid from "@/component/atoms/Grid";
import { mentorData } from "@/data/mentor";
import Carousel from "@/component/atoms/Carousel";
import Navbar from "@/component/organisms/Navbar";
import Footer from "@/component/organisms/Footer";
import Container from "@/component/atoms/Container";
import Typography from "@/component/atoms/Typography";
import Button from "@/component/atoms/Button";
import {
  Ruler,
  Tv2Icon,
  Lightbulb,
  Code,
  BrainCircuit,
  Bot,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import CurioSection, {
  curioSectionIds,
} from "@/component/molecules/CurioSection";
import { useTranslation } from "@/i18n";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Page() {
  const { t } = useTranslation();
  useScrollReveal();

  return (
    <div className="landing-page-wrapper">
      <div className="landing-content-container">
        <Flex
          gap={{ initial: "0", md: "2" }}
          direction="column"
          px={{ initial: "4", sm: "6", lg: "9" }}
          py={{ initial: "2", md: "4" }}
        >
          <Navbar />

          {/* Hero Section */}
          <div className="reveal">
            <Grid
              className="landing-hero-container"
              columns={{ initial: "1", md: "2" }}
              gap="8"
              my={{ initial: "4", md: "6" }}
              align="center"
            >
              {/* Left Content */}
              <Flex
                direction="column"
                gap="4"
                className="landing-hero-text-content"
              >
                <Flex direction="column" gap="3">
                  <Typography
                    variant="heading"
                    size="6"
                    align={{ initial: "center", md: "left" }}
                    className="landing-hero-title"
                  >
                    Building{" "}
                    <span className="hero-highlight-primary">
                      Future-Ready Schools{" "}
                    </span>{" "}
                    for the{" "}
                    <span className="hero-highlight-primary">AI Era</span>
                  </Typography>
                  <Typography
                    variant="text"
                    size="3"
                    align={{ initial: "center", md: "left" }}
                    className="landing-hero-subtitle"
                  >
                    {t("hero.subheadline")}
                  </Typography>

                  {/* Feature Bullets */}
                  <Flex
                    direction="column"
                    gap="2"
                    mt="2"
                    align={{ initial: "center", md: "start" }}
                    className="landing-hero-features"
                  >
                    {[
                      t("hero.feature1"),
                      t("hero.feature2"),
                      t("hero.feature3"),
                    ].map((feature, i) => (
                      <Flex key={i} gap="2" align="center">
                        <CheckCircle2
                          size={18}
                          className="feature-check-icon"
                        />
                        <Typography
                          variant="text"
                          size="2"
                          style={{ color: "var(--gray-11)" }}
                        >
                          {feature}
                        </Typography>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>

                <Flex
                  gap="3"
                  mt="3"
                  direction={{ initial: "column", sm: "row" }}
                  align="center"
                  justify={{ initial: "center", md: "start" }}
                >
                  <button className="landing-btn-primary">
                    {t("hero.cta")}
                  </button>
                  <button className="landing-btn-secondary">
                    {t("hero.secondaryCta")}
                  </button>
                </Flex>
              </Flex>

              {/* Right Image */}
              <Flex justify="center" className="landing-hero-image-container">
                <div className="landing-hero-blob"></div>
                <Image
                  src={IMAGES.hero}
                  alt="Hero Image showcasing coding learning platform"
                  priority
                  width={500}
                  height={500}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 2,
                  }}
                />
              </Flex>
            </Grid>
          </div>

          {/* Our Learning Areas */}
          <Flex
            direction="column"
            gap="6"
            align="center"
            mt="9"
            className="reveal section-heading-wrapper"
          >
            <Flex direction="column" align="center">
              <span className="section-label">Learning Ecosystem</span>
              <Typography variant="heading" size="8" align="center">
                {t("learningAreas.title")}
              </Typography>
            </Flex>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "2rem",
                width: "100%",
                marginTop: "2rem",
              }}
            >
              {[
                { key: "curioCode", icon: Code, href: "/curiocode" },
                { key: "curioAI", icon: BrainCircuit, href: "/curioai" },
                { key: "curioBot", icon: Bot, href: "/curiobot" },
                { key: "curioThink", icon: Lightbulb, href: "/curiothink" },
              ].map((area) => (
                <Link
                  key={area.key}
                  href={area.href}
                  style={{ textDecoration: "none", height: "100%" }}
                >
                  <div className="learning-area-card">
                    <div className="learning-area-icon-wrapper">
                      <area.icon size={40} strokeWidth={1.5} />
                    </div>
                    <Flex direction="column" gap="3" align="start">
                      <Typography
                        variant="heading"
                        size="5"
                        className="learning-area-title"
                      >
                        {t(`learningAreas.${area.key}.title`)}
                      </Typography>
                      <Typography
                        variant="text"
                        size="2"
                        className="learning-area-subtitle"
                        style={{
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "4px",
                        }}
                      >
                        {t(`learningAreas.${area.key}.subtitle`)}
                      </Typography>
                      <Typography
                        variant="text"
                        size="3"
                        className="learning-area-description"
                        align="left"
                      >
                        {t(`learningAreas.${area.key}.description`)}
                      </Typography>
                    </Flex>
                  </div>
                </Link>
              ))}
            </div>
          </Flex>

          {/* Backers*/}
          <Grid
            columns={{ initial: "1", md: "2" }}
            mt="9"
            gap="8"
            className="reveal"
          >
            <Flex
              direction="column"
              align="center"
              gap="4"
              className="brand-logo-container"
            >
              <span className="section-label">Backed By Government Bodies</span>
              <Flex gap="5" wrap="wrap" justify="center" align="center">
                <Image
                  src={IMAGES.brands.mca}
                  width={180}
                  height={90}
                  alt="Ministry of Corporate Affairs"
                  className="brand-logo"
                  style={{ objectFit: "contain" }}
                />
                <Image
                  src={IMAGES.brands.dpiit}
                  width={200}
                  height={90}
                  alt="DPIIT"
                  className="brand-logo"
                  style={{ objectFit: "contain" }}
                />
              </Flex>
            </Flex>

            <Flex
              direction="column"
              align="center"
              gap="4"
              className="brand-logo-container"
            >
              <span className="section-label">Mentors Alumni Of</span>
              <Flex gap="6" wrap="wrap" justify="center" align="center">
                <Image
                  src={IMAGES.brands.google}
                  width={100}
                  height={80}
                  alt="Google"
                  className="brand-logo"
                  style={{ objectFit: "contain" }}
                />
                <Image
                  src={IMAGES.brands.microsoft}
                  width={100}
                  height={80}
                  alt="Microsoft"
                  className="brand-logo"
                  style={{ objectFit: "contain" }}
                />
                <Image
                  src={IMAGES.brands.flipkart}
                  width={100}
                  height={80}
                  alt="Flipkart"
                  className="brand-logo"
                  style={{ objectFit: "contain" }}
                />
              </Flex>
            </Flex>
          </Grid>

          {/* Curio Sections*/}
          <div className="reveal" style={{ marginTop: "4rem" }}>
            {curioSectionIds.map((sectionId) => (
              <div key={sectionId} style={{ marginBottom: "6rem" }}>
                <CurioSection sectionId={sectionId} />
              </div>
            ))}
          </div>

          {/* Team Section */}
          <Flex
            direction="column"
            gap="6"
            align="center"
            mt="9"
            className="reveal section-heading-wrapper"
          >
            <Flex direction="column" gap="3" align="center">
              <span className="section-label">Meet The Experts</span>
              <Typography variant="heading" size="8" align="center">
                {t("team.title")}
              </Typography>
              <Typography
                variant="text"
                size="4"
                align="center"
                style={{
                  color: "var(--gray-11)",
                  maxWidth: "600px",
                  lineHeight: "1.6",
                }}
              >
                {t("team.description")}
              </Typography>
            </Flex>

            <Flex
              width="100%"
              justify="center"
              className="team-carousel-container"
              mt="15"
            >
              <Carousel
                slides={mentorData.map((mentor, idx) => (
                  <div key={mentor.name} className="team-member">
                    <div className="team-member-image">
                      <Image
                        src={mentor.image}
                        alt={`${mentor.name} - ${t(`team.mentor${idx + 1}Title`)}`}
                        width={160}
                        height={160}
                        className="team-avatar"
                      />
                    </div>
                    <Flex direction="column" align="center" gap="1">
                      <Typography
                        variant="heading"
                        size="5"
                        align="center"
                        className="team-name"
                      >
                        {mentor.name}
                      </Typography>
                      <Typography
                        variant="text"
                        align="center"
                        className="team-role"
                      >
                        {t(`team.mentor${idx + 1}Title`)}
                      </Typography>
                      <Typography
                        variant="text"
                        size="2"
                        style={{
                          color: "var(--gray-11)",
                          marginBottom: "16px",
                          lineHeight: "1.5",
                          minHeight: "80px",
                        }}
                      >
                        {t(`team.mentor${idx + 1}Description`)}
                      </Typography>

                      {mentor.skills && (
                        <Flex gap="2" wrap="wrap" justify="center">
                          {mentor.skills.slice(0, 3).map((_, skillIndex) => (
                            <span key={skillIndex} className="team-skill-tag">
                              {t(`team.mentor${idx + 1}Skill${skillIndex + 1}`)}
                            </span>
                          ))}
                        </Flex>
                      )}
                    </Flex>

                    <div className="team-social">
                      <Link
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-social-link"
                        aria-label={t("accessibility.linkedinProfile", {
                          name: mentor.name,
                        })}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </Link>
                      {mentor.github && (
                        <Link
                          href={mentor.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="team-social-link"
                          aria-label={t("accessibility.githubProfile", {
                            name: mentor.name,
                          })}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
                options={{
                  align: "center",
                  loop: true,
                  slidesToScroll: 1,
                  containScroll: "trimSnaps",
                }}
              />
            </Flex>
          </Flex>
          <Footer />
        </Flex>
      </div>
    </div>
  );
}
