"use client";

import "@/app/(root)/curiocode/curiocode.css";
import { Code, Monitor, PenTool } from "lucide-react";
import { Flex, Box, Text, Card } from "@radix-ui/themes";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";
import EditorComponent from "@/component/organisms/editor/EditorComponent";
import BlocklyComponent from "@/component/organisms/blockly/BlocklyComponent";
import TurtleComponent from "@/component/organisms/turtle/TurtleComponent";
import { useTranslation } from "@/i18n";
import { useSession } from "@/util/auth";

interface UserWithRole {
  id: string;
  name: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: string;
}

function PlaygroundContent() {
  const { t } = useTranslation();
  const { data: session, isPending } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  // Assignment detection
  const assignmentId = searchParams.get("assignmentId");
  const tabParam = searchParams.get("tab");
  const isAssignmentMode = !!assignmentId;
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/login?option=student");
      return;
    }

    const user = session.user as UserWithRole;
    const role = user.role;

    if (role !== "student" && role !== "individual" && role !== "school") {
      router.push("/");
      return;
    }

    if (user.banned) {
      const banExpires = user.banExpires ? new Date(user.banExpires) : null;
      if (!banExpires || banExpires > new Date()) {
        router.push("/student/dashboard");
      }
    }
  }, [session, isPending, router]);

  const tabs = useMemo(
    () => [
      {
        id: "blockly",
        label: t("schools.visualProgramming"),
        icon: Monitor,
        description: t("schools.visualProgrammingDesc"),
        shortLabel: t("schools.blockly"),
      },
      {
        id: "editor",
        label: t("schools.codeEditor"),
        icon: Code,
        description: t("schools.codeEditorDesc"),
        shortLabel: t("schools.editor"),
      },
      {
        id: "turtle",
        label: t("schools.turtleGraphics"),
        icon: PenTool,
        description: t("schools.turtleGraphicsDesc"),
        shortLabel: t("schools.turtle"),
      },
    ],
    [t],
  );

  const resolvedTab = useMemo(() => {
    // If a tab is explicitly requested (e.g. via URL from course page), honor it.
    if (tabParam && tabs.some((t) => t.id === tabParam)) {
      return tabParam;
    }

    // Default fallbacks if no tab is specified but assignment is present
    // This is less likely now that we pass the tab, but good for safety.
    // If we don't know the type here (we don't), we default to editor if assignment is present
    // UNLESS we are navigating to blockly specifically.
    // But since we are fixing the course page to send &tab=blockly, valid assignments should have it.

    if (isAssignmentMode) return "editor";

    return "blockly";
  }, [isAssignmentMode, tabParam, tabs]);

  const [activeTab, setActiveTab] = useState(resolvedTab);

  useEffect(() => {
    setActiveTab(resolvedTab);
  }, [resolvedTab]);

  const renderContent = () => {
    let content;

    if (activeTab === "blockly") {
      content = <BlocklyComponent />;
    } else if (activeTab === "turtle") {
      content = <TurtleComponent />;
    } else {
      content = <EditorComponent />;
    }

    return (
      <div
        className={`content-wrapper ${isTransitioning ? "transitioning" : ""}`}
      >
        {content}
      </div>
    );
  };

  if (isPending || !session) {
    return (
      <Box className="curiocode-container">
        <Flex align="center" justify="center" style={{ minHeight: "50vh" }}>
          <Text size="4">Loading...</Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Box className="curiocode-container">
      <Box className="curiocode-main-content">
        {/* <Card> use  */}
        <div className="curiocode-content-card">
          <Box className="curiocode-editor-wrapper">{renderContent()}</Box>
        </div>
      </Box>
    </Box>
  );
}

export default function StudentPlaygroundPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <Box className="curiocode-container">
          <Flex align="center" justify="center" className="h-full w-full">
            <Card className="curiocode-loading">
              <Box className="curiocode-loading-spinner" />
              <Flex direction="column" align="center" gap="2">
                <Text size="5" weight="bold">
                  {t("schools.loadingStudio")}
                </Text>
                <Text size="2" style={{ opacity: 0.8 }}>
                  {t("schools.preparingEnv")}
                </Text>
              </Flex>
            </Card>
          </Flex>
        </Box>
      }
    >
      <PlaygroundContent />
    </Suspense>
  );
}
