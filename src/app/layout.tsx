import "./globals.css";
import { I18nProvider } from "@/i18n";
import { metadata } from "./metadata";
import { Theme } from "@radix-ui/themes";
import { Urbanist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/lib/toast.config";

const urbanist = Urbanist({
  variable: "--font-urbanist-sans",
  subsets: ["latin"],
});

export const generateMetadata = () => metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={urbanist.variable}>
        <ThemeProvider attribute="class" enableSystem>
          <I18nProvider>
            <Theme
              accentColor="orange"
              grayColor="gray"
              radius="medium"
              className="default-font-family"
            >
              <Toaster position="bottom-center" />
              <Analytics />
              <SpeedInsights />
              {children}
            </Theme>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
