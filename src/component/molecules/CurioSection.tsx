"use client";

import Image from "next/image";
import Flex from "@/component/atoms/Flex";
import Typography from "@/component/atoms/Typography";
import {
  Brain,
  Lightbulb,
  Target,
  School,
  Tv2Icon,
  Ruler,
  LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/i18n";

import { IMAGES } from "@/constants/images";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Lightbulb,
  Target,
  School,
  Tv2Icon,
  Ruler,
};

type SectionId =
  | "ecosystem"
  | "curiocode"
  | "curioai"
  | "curiobot"
  | "curiothink";

interface CurioSectionData {
  id: SectionId;
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  icons: string[];
}

const curioSectionsData: CurioSectionData[] = [
  {
    id: "ecosystem",
    imageSrc: IMAGES.general.whyus,
    imageAlt: "Easy Ecosystem showcasing integrated learning",
    imagePosition: "left",
    icons: ["Brain", "Lightbulb", "Target", "School"],
  },
  {
    id: "curiocode",
    imageSrc: IMAGES.general.code1,
    imageAlt: "EasyCode showcasing block-based and Python programming",
    imagePosition: "right",
    icons: ["Brain", "Target", "Lightbulb", "School", "Ruler"],
  },
  {
    id: "curioai",
    imageSrc: IMAGES.general.ai1,
    imageAlt: "EasyAI showcasing machine learning and AI literacy",
    imagePosition: "left",
    icons: ["Brain", "Target", "Tv2Icon", "Ruler", "Lightbulb"],
  },
  {
    id: "curiobot",
    imageSrc: IMAGES.general.robot1,
    imageAlt: "EasyBot showcasing robotics and IoT learning",
    imagePosition: "right",
    icons: ["Brain", "Target", "School", "Lightbulb", "Ruler"],
  },
  {
    id: "curiothink",
    imageSrc: IMAGES.general.aptitude1,
    imageAlt: "EasyThink showcasing critical thinking and problem-solving",
    imagePosition: "left",
    icons: ["Brain", "Lightbulb", "Target", "School"],
  },
];

interface CurioSectionProps {
  sectionId: SectionId;
}

export default function CurioSection({ sectionId }: CurioSectionProps) {
  const { t, dictionary } = useTranslation();

  const sectionData = curioSectionsData.find((s) => s.id === sectionId);
  if (!sectionData) return null;

  const { imageSrc, imageAlt, imagePosition, icons } = sectionData;
  const points = dictionary.curioSections?.[sectionId]?.points || [];
  const heading = t(`curioSections.${sectionId}.heading`);

  const imageElement = (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={350}
      height={350}
      className="curio-ecosystem-image"
    />
  );

  const contentElement = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        width: "100%",
        marginTop: "16px",
      }}
    >
      {points.map((point: string, index: number) => {
        // Safe access to icons array
        const iconName = icons && icons[index] ? icons[index] : "Brain";
        const IconComponent = iconMap[iconName] || Brain;

        return (
          <div key={index} className="curio-card reveal">
            <div className="curio-card-icon">
              <IconComponent size={20} />
            </div>
            <Typography
              variant="text"
              size="2"
              style={{ fontWeight: 500, lineHeight: 1.5 }}
            >
              {point}
            </Typography>
          </div>
        );
      })}
    </div>
  );

  return (
    <Flex
      direction="column"
      align="center"
      gap="5"
      className="section-heading-wrapper"
      my="0"
    >
      <div
        className="landing-section-heading-wrapper"
        style={{ marginBottom: "30px", textAlign: "center" }}
      >
        <span className="landing-section-label">
          {sectionId.replace("curio", "Easy ")}
        </span>
        <Typography variant="heading" size="7" align="center">
          {heading}
        </Typography>
      </div>

      <Flex
        direction={{
          initial: "column",
          md: imagePosition === "left" ? "row" : "row-reverse",
        }}
        gap={{ initial: "6", md: "8" }}
        align="center"
        justify="between"
        width="100%"
      >
        {/* Image Side */}
        <Flex justify="center" style={{ flex: 1 }}>
          <div
            className="landing-hero-image-wrapper"
            style={{ maxWidth: "450px", width: "100%" }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={450}
              height={350}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "var(--radius-premium)",
              }}
            />
          </div>
        </Flex>

        {/* Content Side */}
        <Flex direction="column" style={{ flex: 1.2 }}>
          {contentElement}
        </Flex>
      </Flex>
    </Flex>
  );
}

// Export section IDs for use in pages
export const curioSectionIds: SectionId[] = [
  "ecosystem",
  "curiocode",
  "curioai",
  "curiobot",
  "curiothink",
];
export type { SectionId };
