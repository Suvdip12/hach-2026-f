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
import { HeroVideoDemo } from "./_components/hero";

export default function Page() {
  const { t } = useTranslation();
  useScrollReveal();

  return (
    <div className="landing-page-wrapper">
      <div className="landing-content-container">
        <Navbar />
        <HeroVideoDemo />
      </div>
    </div>
  );
}
