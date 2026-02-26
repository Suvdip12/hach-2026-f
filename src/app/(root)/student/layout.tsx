"use client";

import { Navbar } from "@/component";
import "@/component/organisms/css/StudentLayout.css";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="student-layout">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <div className="student-main-content">
        <div style={{ margin: "0 auto", width: "100%" }}>{children}</div>
      </div>
    </div>
  );
}
