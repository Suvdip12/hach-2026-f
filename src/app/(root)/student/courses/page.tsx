"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Progress,
  Text,
  TextField,
  Button,
  Tabs,
} from "@radix-ui/themes";
import {
  BookOpen,
  Play,
  Search,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import {
  assignmentCompletedApi,
  courseApi,
  extractArrayData,
  extractData,
  lectureApi,
  type Lecture,
  type StudentOverallProgress,
  type Course,
} from "@/services/api.service";
import { useSession } from "@/util/auth";
import toast from "react-hot-toast";

type LectureWithProgress = Lecture & {
  progress?: StudentOverallProgress["lectureProgress"][number];
  courseId?: string;
};

type CourseWithLectures = Course & {
  lectures: LectureWithProgress[];
  totalLectures: number;
  completedLectures: number;
  overallProgress: number;
};

export default function StudentCoursesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [courses, setCourses] = useState<CourseWithLectures[]>([]);
  const [progress, setProgress] = useState<StudentOverallProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const studentId = session?.user?.id as string | undefined;

  const ensureStudent = useCallback(() => {
    if (!session?.user) return;
    const role = (session.user as { role?: string }).role;
    if (role !== "student" && role !== "individual" && role !== "school") {
      router.push("/login?option=student");
    }
  }, [session, router]);

  const fetchData = useCallback(async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      const [lecturesRes, progressRes, coursesRes] = await Promise.all([
        lectureApi.getAll(),
        assignmentCompletedApi.getStudentOverallProgress(studentId),
        courseApi.getAll(),
      ]);

      const lectureList = extractArrayData<Lecture>(lecturesRes);
      const progressData = extractData<StudentOverallProgress>(progressRes);
      const coursesList = extractArrayData<Course>(coursesRes);

      console.log("progressData", progressData);

      const progressMap =
        progressData?.lectureProgress?.reduce<
          Record<string, StudentOverallProgress["lectureProgress"][number]>
        >((acc, lp) => {
          acc[lp.lectureId] = lp;
          return acc;
        }, {}) || {};

      setProgress(progressData ?? null);

      const coursesWithLectures: CourseWithLectures[] = coursesList.map(
        (course, idx) => {
          const courseLectures = lectureList
            .filter((_, i) => i % coursesList.length === idx)
            .map((lec) => {
              const lp = progressMap[lec.id];
              return {
                ...lec,
                courseId: course.id,
                progress: lp,
              };
            });

          const completedCount = courseLectures.filter(
            (lec) => lec.progress?.isCompleted,
          ).length;

          const totalProgress = courseLectures.reduce(
            (sum, lec) => sum + (lec.progress?.progress || 0),
            0,
          );

          return {
            ...course,
            lectures: courseLectures,
            totalLectures: courseLectures.length,
            completedLectures: completedCount,
            overallProgress:
              courseLectures.length > 0
                ? Math.round(totalProgress / courseLectures.length)
                : 0,
          };
        },
      );

      setCourses(coursesWithLectures);
      if (coursesWithLectures.length > 0) {
        setSelectedCourseId((prev) => prev || coursesWithLectures[0].id);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login?option=student");
      return;
    }
    ensureStudent();
    fetchData();
  }, [session, isPending, router, ensureStudent, fetchData]);

  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId);
  }, [courses, selectedCourseId]);

  const filteredLectures = useMemo(() => {
    if (!selectedCourse) return [];
    if (!query.trim()) return selectedCourse.lectures;
    return selectedCourse.lectures.filter((lec) =>
      `${lec.title} ${lec.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [selectedCourse, query]);

  // Removed getProgressColor logic to keep everything strictly one color

  if (isPending || loading) {
    return (
      <Container size="4" className="py-20">
        <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
          <Text size="4">Loading your courses...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" className="py-20">
      <Flex direction="column" gap="5">
        {/* Overall Progress Card */}
        <Card>
          <Flex justify="between" align="center" p="4" wrap="wrap" gap="3">
            <Flex align="center" gap="3">
              <GraduationCap size={24} />
              <Heading size="6">My Learning Progress</Heading>
            </Flex>
            <Flex align="center" gap="2">
              <Badge size="2" color="blue">
                {progress?.overallStats?.overallProgress ?? 0}% overall
              </Badge>
              <Badge size="2" variant="soft">
                {progress?.overallStats?.completedLectures ?? 0} of{" "}
                {progress?.overallStats?.totalLectures ?? 0} lectures completed
              </Badge>
            </Flex>
          </Flex>
        </Card>

        {/* Course Tabs */}
        <Tabs.Root value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <Tabs.List>
            {courses.map((course) => (
              <Tabs.Trigger key={course.id} value={course.id}>
                <Flex align="center" gap="2">
                  {course.courseName}
                  <Badge size="1" color="orange">
                    {course.overallProgress}%
                  </Badge>
                </Flex>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {courses.map((course) => (
            <Tabs.Content key={course.id} value={course.id}>
              <Flex direction="column" gap="4" mt="4">
                {/* Course Info Card */}
                <Card>
                  <Flex direction="column" gap="3" p="4">
                    <Heading size="7">{course.courseName}</Heading>
                    <Text color="gray">{course.courseDetail}</Text>
                    <Flex gap="3" wrap="wrap">
                      <Badge variant="soft">Child-friendly curriculum</Badge>
                      <Badge variant="soft">Self-paced lessons</Badge>
                    </Flex>
                    <Flex direction="column" gap="2" mt="2">
                      <Flex justify="between">
                        <Text size="2" color="gray">
                          Course Progress
                        </Text>
                        <Text size="2" weight="bold">
                          {course.completedLectures} / {course.totalLectures}{" "}
                          completed
                        </Text>
                      </Flex>
                      {/* Top Bar - Fixed to Orange */}
                      <Progress value={course.overallProgress} color="orange" />
                    </Flex>
                  </Flex>
                </Card>

                {/* Lectures Section */}
                <Card>
                  <Flex
                    justify="between"
                    align="center"
                    p="4"
                    wrap="wrap"
                    gap="3"
                  >
                    <Flex align="center" gap="3">
                      <BookOpen size={24} />
                      <Heading size="6">Lectures</Heading>
                    </Flex>
                    <Badge size="2" variant="soft">
                      {course.totalLectures} lectures
                    </Badge>
                  </Flex>
                </Card>

                {/* Search */}
                <Card>
                  <Flex p="4" gap="2" align="center">
                    <Search size={16} />
                    <TextField.Root
                      placeholder="Search lectures..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </Flex>
                </Card>

                {/* Lectures Grid */}
                <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
                  {filteredLectures.map((lecture) => {
                    const lp = lecture.progress;
                    const progressValue = lp?.progress ?? 0;
                    const isCompleted = lp?.isCompleted;

                    return (
                      <Card key={lecture.id} style={{ height: "100%" }}>
                        <Flex
                          direction="column"
                          gap="3"
                          p="4"
                          style={{ height: "100%" }}
                        >
                          <Flex justify="between" align="center">
                            <Heading size="4">{lecture.title}</Heading>
                            {isCompleted ? (
                              <Badge color="green">
                                <CheckCircle2 size={14} />
                                Completed
                              </Badge>
                            ) : (
                              <Badge color="orange">
                                {progressValue}% done
                              </Badge>
                            )}
                          </Flex>
                          <Text
                            size="2"
                            color="gray"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {lecture.description}
                          </Text>
                          <Flex direction="column" gap="2" mt="auto">
                            {/* Lecture Bar - Fixed to Orange */}
                            <Progress value={progressValue} color="orange" />
                            <Text size="1" color="gray">
                              {lp?.completedAssignments ?? 0} of{" "}
                              {lp?.totalAssignments ?? 0} assignments completed
                            </Text>
                          </Flex>
                          <Flex gap="4" align="center">
                            <Button
                              variant="soft"
                              onClick={() =>
                                router.push(`/student/courses/${lecture.id}`)
                              }
                            >
                              <Play size={14} />
                              Open Lecture
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => router.push(lecture.url)}
                            >
                              Watch
                            </Button>
                          </Flex>
                        </Flex>
                      </Card>
                    );
                  })}
                </Grid>

                {filteredLectures.length === 0 && (
                  <Card>
                    <Flex align="center" justify="center" p="6">
                      <Text color="gray">No lectures found.</Text>
                    </Flex>
                  </Card>
                )}
              </Flex>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Flex>
    </Container>
  );
}
