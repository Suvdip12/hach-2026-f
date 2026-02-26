"use client";

import Image from "next/image";
import Flex from "../atoms/Flex";
import Typography from "../atoms/Typography";
import { useTranslation } from "@/i18n";
import "./css/FooterBrand.css";
import { IMAGES } from "@/constants/images";

export default function FooterBrand() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="3" align="start" className="footer-brand">
      <Flex
        direction="row"
        gap="3"
        align="center"
        className="brand-logo-wrapper"
      >
        <Image
          src={IMAGES.logo.icon}
          width={200}
          height={200}
          alt="CurioTech Logo"
          className="footer-logo"
        />
      </Flex>
      <Typography variant="text" size="3" className="brand-tagline">
        {t("common.brandTagline")}
      </Typography>
    </Flex>
  );
}
