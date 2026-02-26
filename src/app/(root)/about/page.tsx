"use client";

import Flex from "@/component/atoms/Flex";
import Typography from "@/component/atoms/Typography";
import Image from "next/image";
import Container from "@/component/atoms/Container";
import Navbar from "@/component/organisms/Navbar";
import { useTranslation } from "@/i18n";
import { IMAGES } from "@/constants/images";
import "./style.css";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <Container
        maxWidth="1800px"
        px={{ initial: "4", sm: "6", lg: "9" }}
        py={{ initial: "6", md: "7" }}
      >
        <Flex direction="column" gap="8" mt="0" py="6">
          {/* Why Curiotech Exists Section */}
          <Flex direction="column" gap="4" align="start">
            <Typography
              variant="heading"
              size="8"
              align="center"
              mb="9"
              className="section-heading"
            >
              {t("about.pageTitle")}
            </Typography>
            <Typography variant="heading" size="6" className="subtitle">
              {t("about.whyWeExist")}
            </Typography>
            <Flex
              direction="row"
              gap="6"
              align="center"
              justify="between"
              className="content-section"
            >
              <Flex
                direction="column"
                gap="4"
                className="text-content"
                style={{ flex: 1 }}
              >
                <Typography variant="text" size="4" className="intro-text">
                  {t("about.intro1")}
                </Typography>
                <Typography variant="text" size="4" className="intro-text">
                  {t("about.intro2")}
                </Typography>
              </Flex>
              <div className="image-container">
                <Image
                  src={IMAGES.about.curiotech}
                  alt="CurioTech Education"
                  width={550}
                  height={300}
                  className="responsive-image"
                />
              </div>
            </Flex>
          </Flex>

          {/* Founder's Section */}
          <Flex direction="column" gap="4" align="start" pt="5">
            <Flex
              direction="row"
              gap="6"
              align="start"
              className="founder-section"
            >
              <div className="founder-image-container">
                <Image
                  src={IMAGES.about.founder}
                  alt="Founder"
                  width={300}
                  height={300}
                  className="founder-image"
                />
              </div>
              <Flex
                direction="column"
                gap="4"
                className="founder-text-content"
                style={{ flex: 1 }}
              >
                <Typography variant="heading" size="6" className="subtitle">
                  {t("about.foundersVision")}
                </Typography>
                <Typography variant="text" size="4" className="intro-text">
                  {t("about.foundersVisionText1")}
                </Typography>
                <Typography variant="text" size="4" className="intro-text">
                  {t("about.foundersVisionText2")}
                </Typography>
                {/* Quote - Desktop */}
                <Typography variant="text" size="4" className="quote-desktop">
                  <strong>{t("about.foundersQuote")}</strong>
                </Typography>
              </Flex>
            </Flex>
            {/* Quote - Mobile */}
            <Typography variant="text" size="4" className="quote-mobile">
              <strong>{t("about.foundersQuote")}</strong>
            </Typography>
          </Flex>

          {/* Our Vision Section */}
          <div>
            <Typography
              variant="heading"
              size="6"
              className="subtitle"
              style={{
                paddingTop: "10px",
                textAlign: "left",
                marginBottom: "15px",
              }}
            >
              {t("about.ourVision")}
            </Typography>

            <Typography variant="text" size="4" className="intro-text">
              {t("about.ourVisionText")}
              <br /> <br />
              <strong>{t("about.ourVisionQuote")}</strong>
            </Typography>
          </div>

          {/* Our Philosophy Section */}
          <div>
            <Typography
              variant="heading"
              size="6"
              className="subtitle"
              style={{
                paddingTop: "10px",
                textAlign: "left",
                marginBottom: "15px",
              }}
            >
              {t("about.educationPhilosophy")}
            </Typography>
            <Typography variant="text" size="4" className="intro-text">
              {t("about.educationPhilosophyText1")}
            </Typography>
            <Typography variant="text" size="4" className="intro-text">
              {t("about.educationPhilosophyText2")}
            </Typography>
          </div>
        </Flex>
      </Container>
    </>
  );
}
