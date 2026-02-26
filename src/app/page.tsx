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
              <Flex gap="6" wrap="wrap" justify="center" align="center"></Flex>
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
          <Footer />
        </Flex>
      </div>
    </div>
  );
}
