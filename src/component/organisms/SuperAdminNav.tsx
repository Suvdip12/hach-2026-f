"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, Box } from "@radix-ui/themes";

export default function SuperAdminNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: "/super-admin/dashboard" },
    { name: "Questions", href: "/super-admin/questions" },
    { name: "Lectures", href: "/super-admin/lectures" },
    { name: "Courses", href: "/super-admin/courses" },
    { name: "Course-Lectures", href: "/super-admin/course-lectures" },
    { name: "Instructors", href: "/super-admin/instructors" },
    { name: "Course-Instructors", href: "/super-admin/course-instructors" },
    { name: "Schools", href: "/super-admin/schools-management" },
    { name: "Admins", href: "/super-admin/admins" },
    { name: "Students", href: "/super-admin/students" },
    { name: "Packages", href: "/super-admin/packages" },
    { name: "Assignments", href: "/super-admin/assignments" },
    { name: "Progress", href: "/super-admin/student-progress" },
    { name: "Analytics", href: "/super-admin/analytics" },
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
