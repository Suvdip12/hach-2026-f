"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, Box } from "@radix-ui/themes";

export default function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Students", href: "/admin/students" },
    { name: "Courses", href: "/admin/courses" },
    { name: "Progress", href: "/admin/student-progress" },
    { name: "Analytics", href: "/admin/analytics" },
    { name: "Instructors", href: "/admin/instructors" },
  ];

  return (
    <Box mb="6">
      <Tabs.Root value={pathname}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href}>
              <Tabs.Trigger value={tab.href}>{tab.name}</Tabs.Trigger>
            </Link>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </Box>
  );
}
