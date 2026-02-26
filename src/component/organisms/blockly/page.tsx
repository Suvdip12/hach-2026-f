"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlocklyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to student playground with blockly tab
    router.replace("/student/playground?tab=blockly");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Playground...</p>
      </div>
    </div>
  );
}
