"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading,
  Card,
  Flex,
  Text,
  Box,
  Grid,
  Badge,
  Button,
  Separator,
} from "@radix-ui/themes";
import { useSession } from "@/util/auth";
import {
  assignmentCompletedApi,
  extractData,
  type StudentOverallProgress,
} from "@/services/api.service";
import {
  BookOpen,
  Trophy,
  Target,
  Flame,
  ArrowRight,
  PlayCircle,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

//  Types
interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  banned?: boolean;
}

const ACTIVITY_DATA = [
  { name: "Mon", minutes: 20 },
  { name: "Tue", minutes: 45 },
  { name: "Wed", minutes: 30 },
  { name: "Thu", minutes: 60 },
  { name: "Fri", minutes: 55 },
  { name: "Sat", minutes: 90 },
  { name: "Sun", minutes: 35 },
];

export default function StudentDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [progress, setProgress] = useState<StudentOverallProgress | null>(null);
  const [loading, setLoading] = useState(true);

  //  Auth Check
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login?option=student");
      return;
    }
    const user = session.user as UserWithRole;
    if (
      user.role !== "student" &&
      user.role !== "individual" &&
      user.role !== "school"
    ) {
      // Handle role redirection if needed
    }
  }, [session, isPending, router]);

  //  Fetch Data
  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const res = await assignmentCompletedApi.getStudentOverallProgress(
        session.user.id,
      );
      setProgress(extractData(res) ?? null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) fetchData();
  }, [fetchData, session]);

  if (isPending || loading) {
    return (
      <Flex justify="center" align="center" style={{ height: "60vh" }}>
        <Text color="gray">Loading Dashboard...</Text>
      </Flex>
    );
  }

  const user = session?.user;
  const stats = progress?.overallStats;

  // Sort by updatedAt if available to get the true most recent
  const sortedLectures = progress?.lectureProgress
    ? [...progress.lectureProgress].sort((a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        return 0;
      })
    : [];

  const recentCourse =
    sortedLectures.length > 0
      ? sortedLectures[sortedLectures.length - 1]
      : null;

  return (
    <Container size="4" className="py-6">
      <Flex direction="column" gap="6">
        {/* Top Section: Welcome & Quick Stats  */}
        <Flex justify="between" align="end" wrap="wrap" gap="4">
          <Box>
            <Heading size="8" style={{ color: "var(--gray-12)" }}>
              Dashboard
            </Heading>
            <Text size="3" color="gray">
              Welcome back, {user?.name}! You&apos;ve got this. 🚀
            </Text>
          </Box>
          <Flex gap="3">
            <Button variant="soft" color="gray" style={{ cursor: "pointer" }}>
              <CalendarDays size={16} /> {new Date().toLocaleDateString()}
            </Button>
            <Button
              onClick={() =>
                router.push(`/student/courses/${recentCourse?.lectureId}`)
              }
              style={{ cursor: "pointer" }}
            >
              Resume Learning <ArrowRight size={16} />
            </Button>
          </Flex>
        </Flex>

        {/*  Key Metrics Grid */}
        <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4">
          <Card
            style={{ padding: "20px", borderTop: "4px solid var(--orange-9)" }}
          >
            <Flex justify="between" align="start">
              <Box>
                <Text size="2" color="gray" weight="medium">
                  Courses in Progress
                </Text>
                <Heading size="7" mt="2">
                  {stats?.totalLectures || 0}
                </Heading>
              </Box>
              <Box
                p="2"
                style={{ background: "var(--orange-3)", borderRadius: "8px" }}
              >
                <BookOpen size={20} color="var(--orange-11)" />
              </Box>
            </Flex>
            <Text size="1" color="gray" mt="2">
              +2 new this week
            </Text>
          </Card>

          <Card
            style={{ padding: "20px", borderTop: "4px solid var(--green-9)" }}
          >
            <Flex justify="between" align="start">
              <Box>
                <Text size="2" color="gray" weight="medium">
                  Completed
                </Text>
                <Heading size="7" mt="2">
                  {stats?.completedLectures || 0}
                </Heading>
              </Box>
              <Box
                p="2"
                style={{ background: "var(--green-3)", borderRadius: "8px" }}
              >
                <Trophy size={20} color="var(--green-11)" />
              </Box>
            </Flex>
            <Text
              size="1"
              color="green"
              mt="2"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <TrendingUp size={12} /> 12% increase
            </Text>
          </Card>

          <Card
            style={{ padding: "20px", borderTop: "4px solid var(--blue-9)" }}
          >
            <Flex justify="between" align="start">
              <Box>
                <Text size="2" color="gray" weight="medium">
                  Avg. Score
                </Text>
                <Heading size="7" mt="2">
                  {Math.round(stats?.overallProgress || 0)}%
                </Heading>
              </Box>
              <Box
                p="2"
                style={{ background: "var(--blue-3)", borderRadius: "8px" }}
              >
                <Target size={20} color="var(--blue-11)" />
              </Box>
            </Flex>
            <Text size="1" color="gray" mt="2">
              Keep pushing!
            </Text>
          </Card>

          <Card
            style={{ padding: "20px", borderTop: "4px solid var(--red-9)" }}
          >
            <Flex justify="between" align="start">
              <Box>
                <Text size="2" color="gray" weight="medium">
                  Streak
                </Text>
                <Heading size="7" mt="2">
                  3{" "}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "var(--gray-10)",
                    }}
                  >
                    Days
                  </span>
                </Heading>
              </Box>
              <Box
                p="2"
                style={{ background: "var(--red-3)", borderRadius: "8px" }}
              >
                <Flame size={20} color="var(--red-11)" />
              </Box>
            </Flex>
            <Text size="1" color="gray" mt="2">
              You&apos;re on fire!
            </Text>
          </Card>
        </Grid>

        {/*  Charts & Activity Section  */}
        <Grid columns={{ initial: "1", md: "3" }} gap="4">
          {/* Activity Chart (Span 2) */}
          <Card style={{ gridColumn: "span 2", padding: "24px" }}>
            <Flex justify="between" align="center" mb="6">
              <Box>
                <Heading size="4">Weekly Activity</Heading>
                <Text size="2" color="gray">
                  Time spent learning this week
                </Text>
              </Box>
              <Button variant="ghost" color="gray">
                Last 7 Days
              </Button>
            </Flex>

            <div style={{ width: "100%", height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ACTIVITY_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--gray-5)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--gray-10)", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--gray-10)", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--gray-3)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      backgroundColor: "var(--color-panel-solid)",
                    }}
                  />
                  <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                    {ACTIVITY_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 5 ? "var(--orange-9)" : "var(--orange-5)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Continue Learning / Current Course */}
          <Flex direction="column" gap="4">
            <Card style={{ padding: "0", overflow: "hidden", height: "100%" }}>
              <Box p="4" style={{ background: "var(--accent-3)" }}>
                <Flex justify="between" align="center">
                  <Heading size="4" style={{ color: "var(--accent-11)" }}>
                    Continue Learning
                  </Heading>
                  <PlayCircle size={20} color="var(--accent-11)" />
                </Flex>
              </Box>

              {recentCourse ? (
                <Box p="5">
                  <Badge
                    color={recentCourse.isCompleted ? "green" : "blue"}
                    mb="2"
                  >
                    {recentCourse.isCompleted ? "Completed" : "In Progress"}
                  </Badge>
                  <Heading size="3" mb="2">
                    {recentCourse.lectureTitle}
                  </Heading>
                  <Text size="2" color="gray" mb="4">
                    You&apos;ve completed {recentCourse.completedAssignments} of{" "}
                    {recentCourse.totalAssignments} assignments.
                  </Text>

                  <Flex direction="column" gap="2" mb="4">
                    <Flex justify="between">
                      <Text size="1" weight="bold">
                        {recentCourse.progress}%
                      </Text>
                    </Flex>
                    <Box
                      style={{
                        width: "100%",
                        height: "6px",
                        background: "var(--gray-4)",
                        borderRadius: "10px",
                      }}
                    >
                      <Box
                        style={{
                          width: `${recentCourse.progress}%`,
                          height: "100%",
                          background: "var(--accent-9)",
                          borderRadius: "10px",
                        }}
                      />
                    </Box>
                  </Flex>

                  <Button
                    style={{ width: "100%", cursor: "pointer" }}
                    onClick={() =>
                      router.push(`/student/courses/${recentCourse.lectureId}`)
                    }
                  >
                    Continue Lesson
                  </Button>
                </Box>
              ) : (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  p="6"
                  gap="3"
                  style={{ height: "200px" }}
                >
                  <BookOpen size={32} color="var(--gray-8)" />
                  <Text align="center" color="gray">
                    No active courses.
                  </Text>
                  <Button
                    variant="soft"
                    onClick={() => router.push("/student/learning")}
                  >
                    Browse Catalog
                  </Button>
                </Flex>
              )}
            </Card>
          </Flex>
        </Grid>

        {/* Recent History List */}
        <Box>
          <Heading size="4" mb="4">
            Recent History
          </Heading>
          <Card style={{ padding: 0 }}>
            {progress?.lectureProgress?.slice(0, 3).map((lecture, i) => (
              <Box key={lecture.lectureId}>
                <Flex
                  p="4"
                  align="center"
                  justify="between"
                  style={{ cursor: "pointer", transition: "background 0.2s" }}
                  className="hover:bg-[var(--gray-2)]"
                >
                  <Flex gap="3" align="center">
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        background: lecture.isCompleted
                          ? "var(--green-3)"
                          : "var(--blue-3)",
                      }}
                    >
                      {lecture.isCompleted ? (
                        <Trophy size={18} color="var(--green-11)" />
                      ) : (
                        <PlayCircle size={18} color="var(--blue-11)" />
                      )}
                    </Flex>
                    <Box>
                      <Text weight="bold" size="2" as="div">
                        {lecture.lectureTitle}
                      </Text>
                      <Text size="1" color="gray">
                        Visual Programming • Assignment{" "}
                        {lecture.completedAssignments}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center" gap="4">
                    <Badge variant="surface" color="gray">
                      {lecture.progress}%
                    </Badge>
                    <ArrowRight size={16} color="var(--gray-8)" />
                  </Flex>
                </Flex>
                {i < 2 && <Separator size="4" />}
              </Box>
            ))}

            {(!progress?.lectureProgress ||
              progress.lectureProgress.length === 0) && (
              <Box p="4">
                <Text color="gray" size="2">
                  No recent history available.
                </Text>
              </Box>
            )}
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}
