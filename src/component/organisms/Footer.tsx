"use client";

import "./css/Footer.css";
import Flex from "../atoms/Flex";
import Divider from "../atoms/Divider";
import Typography from "../atoms/Typography";
import FooterBrand from "../molecules/FooterBrand";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import {
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
} from "lucide-react";
import "../molecules/css/FooterColumn.css";

const socialLinks = [
  {
    id: 1,
    href: "https://facebook.com",
    name: "Facebook",
    icon: <FacebookIcon />,
  },
  { id: 2, href: "https://twitter.com", name: "X", icon: <TwitterIcon /> },
  {
    id: 3,
    href: "https://instagram.com",
    name: "Instagram",
    icon: <InstagramIcon />,
  },
  {
    id: 4,
    href: "https://linkedin.com",
    name: "LinkedIn",
    icon: <LinkedinIcon />,
  },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const aboutLinks = [
    { id: 1, link: "about", nameKey: "footer.aboutUs" },
    { id: 2, link: "careers", nameKey: "footer.careers" },
    { id: 3, link: "contact", nameKey: "common.contact" },
    { id: 4, link: "help", nameKey: "footer.helpCenter" },
  ];

  const coursesLinks = [
    { id: 1, link: "courses", nameKey: "footer.allCourses" },
    { id: 2, link: "programming", nameKey: "footer.programming" },
    { id: 3, link: "ai-ml", nameKey: "footer.aiMl" },
    { id: 4, link: "web-development", nameKey: "footer.webDevelopment" },
  ];

  const footerLinks = [
    { id: 1, url: "/privacy", nameKey: "common.privacyPolicy" },
    { id: 2, url: "/terms", nameKey: "common.termsOfService" },
    { id: 3, url: "/cookies", nameKey: "common.cookieSettings" },
  ];

  return (
    <Flex direction="column" gap="8" className="footer-container">
      <Flex
        direction="row"
        justify="between"
        align="start"
        gap="8"
        wrap="wrap"
        className="footer-main-content"
      >
        <FooterBrand />
        <Flex
          direction="column"
          gap="3"
          align="start"
          className="footer-social-section"
        >
          <Typography variant="heading" size="4" className="follow-text">
            {t("common.followUs")}
          </Typography>
          <Flex direction="column" gap="3" className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link-item"
              >
                <Flex direction="row" gap="2" align="center">
                  {link.icon}
                  <Typography
                    variant="text"
                    size="3"
                    className="social-link-name"
                  >
                    {link.name}
                  </Typography>
                </Flex>
              </a>
            ))}
          </Flex>
        </Flex>

        <Flex direction="row" gap="6" className="footer-nav-columns">
          {/* Company Column */}
          <Flex direction="column" gap="3" className="footer-column">
            <Typography variant="heading" size="4" className="column-title">
              {t("footer.company")}
            </Typography>
            <Flex direction="column" gap="2" className="column-links">
              {aboutLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/${link.link}`}
                  className="footer-link"
                >
                  <Typography variant="text" size="2">
                    {t(link.nameKey)}
                  </Typography>
                </Link>
              ))}
            </Flex>
          </Flex>

          {/* Courses Column */}
          <Flex direction="column" gap="3" className="footer-column">
            <Typography variant="heading" size="4" className="column-title">
              {t("footer.courses")}
            </Typography>
            <Flex direction="column" gap="2" className="column-links">
              {coursesLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/${link.link}`}
                  className="footer-link"
                >
                  <Typography variant="text" size="2">
                    {t(link.nameKey)}
                  </Typography>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex justify="center" width="100%">
        <Divider size="100" />
      </Flex>

      <Flex
        direction="row"
        justify="between"
        align="center"
        className="footer-bottom-section"
      >
        <Typography variant="text" size="2" className="footer-copyright">
          © {year} EasyCode. {t("common.allRightsReserved")}
        </Typography>

        <Flex direction="row" gap="4" wrap="wrap" className="footer-links-row">
          {footerLinks.map((link) => (
            <Link key={link.id} href={link.url} className="footer-link">
              {t(link.nameKey)}
            </Link>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
