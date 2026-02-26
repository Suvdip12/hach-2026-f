import { Metadata } from "next";
import { IMAGES } from "@/constants/images";

export const siteUrl = "https://www.curiotech.co/";
export const imagePreview = IMAGES.icons.screenshot;

export const metadata: Metadata = {
  title: {
    default: "CurioTech",
    template: "%s | CurioTech",
  },
  description:
    "We help you prepare for the job with all the latest technologies required in the industry.",
  keywords: [
    "AI",
    "cloud",
    "CurioTech",
    "industry skills",
    "web development",
    "job preparation",
    "machine learning",
    "technology skills",
    "career development",
    "coding for children",
    "software engineering",
  ],
  metadataBase: new URL(siteUrl),
  authors: [{ name: "CurioTech Team", url: siteUrl }],
  openGraph: {
    title: "CurioTech",
    description:
      "We help you prepare for the job with all the latest technologies required in the industry.",
    url: siteUrl,
    siteName: "CurioTech",
    images: [
      {
        url: imagePreview,
        width: 1200,
        height: 630,
        alt: "CurioTech Desktop Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CurioTech",
    description:
      "We help you prepare for the job with all the latest technologies required in the industry.",
    images: [imagePreview],
  },
  icons: {
    icon: IMAGES.logo.icon,
    shortcut: IMAGES.icons.size96,
    apple: [
      { url: IMAGES.icons.size152, sizes: "152x152", type: "image/webp" },
      { url: IMAGES.icons.size144, sizes: "144x144", type: "image/webp" },
      { url: IMAGES.icons.size180, sizes: "180x180", type: "image/webp" },
    ],
    other: [
      { rel: "icon", url: IMAGES.icons.size48, sizes: "48x48" },
      { rel: "icon", url: IMAGES.icons.size72, sizes: "72x72" },
      { rel: "icon", url: IMAGES.icons.size192, sizes: "192x192" },
      { rel: "icon", url: IMAGES.icons.size384, sizes: "384x384" },
      { rel: "icon", url: IMAGES.icons.size512, sizes: "512x512" },
      { rel: "icon", url: IMAGES.icons.size256, sizes: "256x256" },
    ],
  },
  other: {
    "linkedin:profile": "https://www.linkedin.com/company/the-career-cafe",
    "instagram:profile": "https://www.instagram.com/careercafe.in/",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "CurioTech",
    "application-name": "CurioTech",
    "msapplication-TileColor": "#ff6b35",
    "theme-color": "#ff6b35",
  },
};
