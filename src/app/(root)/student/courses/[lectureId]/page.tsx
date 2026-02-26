"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Progress,
  Text,
} from "@radix-ui/themes";
import {
  assignmentApi,
  extractData,
  lectureApi,
  qnaCompletedApi,
  type Assignment,
  type Lecture,
  type StudentLectureProgress,
} from "@/services/api.service";
import { useSession } from "@/util/auth";
import { ArrowLeft, Play, CheckCircle2 } from "lucide-react"; // Added CheckCircle2
import toast from "react-hot-toast";

export default function StudentLecturePage() {
  const router = useRouter();
  const params = useParams<{ lectureId: string }>();
  const { data: session, isPending } = useSession();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [progress, setProgress] = useState<StudentLectureProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const studentId = session?.user.id;
  const lectureId = params.lectureId;

  const ensureStudent = useCallback(() => {
    if (!session?.user) return;
    const role = (session.user as { role?: string }).role;
    if (role !== "student" && role !== "individual" && role !== "school") {
      router.push("/login?option=student");
    }
  }, [session, router]);

  const loadLecture = useCallback(async () => {
    if (!lectureId || !studentId) return;

    try {
      setLoading(true);

      const [lectureRes, assignmentsRes, progressRes] = await Promise.all([
        lectureApi.getById(lectureId),
        assignmentApi.getByLecture(lectureId),
        qnaCompletedApi.getStudentLectureProgress(studentId, lectureId),
      ]);

      const lectureData = extractData<Lecture>(lectureRes);
      console.log(lectureData);
      const assignmentData = extractData<{ assignments: Assignment[] }>(
        assignmentsRes,
      );
      console.log("assignmentData", assignmentData);
      const progressData =
        extractData<StudentLectureProgress>(progressRes) ?? null;
      console.log("progressData", progressData);
      setLecture(lectureData ?? null);
      setAssignments(assignmentData?.assignments || []);
      setProgress(progressData);
    } catch {
      toast.error("Failed to load lecture");
    } finally {
      setLoading(false);
    }
  }, [lectureId, studentId]);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/login?option=student");
      return;
    }

    ensureStudent();
    loadLecture();
  }, [session, isPending, router, ensureStudent, loadLecture]);

  // Helper to determine badge color: Green if 100%, otherwise Orange
  const getStatusColor = (value?: number) => {
    if (value === 100) return "green";
    return "orange";
  };

  if (loading || isPending || !lecture) {
    return (
      <Container size="4" className="py-20">
        <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
          <Text size="4">Loading lecture...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" className="py-20">
      <Flex direction="column" gap="5">
        <Button variant="ghost" onClick={() => router.push("/student/courses")}>
          <ArrowLeft size={16} />
          Back
        </Button>

        <Card>
          <Flex direction="column" gap="4" p="4">
            <Flex justify="between" align="start" gap="3">
              <Flex direction="column" gap="2">
                <Heading size="6">{lecture.title}</Heading>
                <Text color="gray">{lecture.description}</Text>
                <Flex gap="2">
                  <Badge size="2" color={getStatusColor(progress?.progress)}>
                    {progress?.progress === 100 && <CheckCircle2 size={12} />}
                    {progress?.progress ?? 0}% complete
                  </Badge>
                  <Badge variant="soft">
                    {progress?.completedQuestions ?? 0} /{" "}
                    {progress?.totalQuestions ?? 0} questions
                  </Badge>
                </Flex>
              </Flex>

              <Button variant="soft" onClick={() => router.push(lecture.url)}>
                <Play size={14} />
                Watch Video
              </Button>
            </Flex>

            {/* Progress Bar Section */}
            {progress && (
              <Flex direction="column" gap="2">
                {/* Fixed: Force color to "orange" */}
                <Progress value={progress.progress} color="orange" />
                <Text size="1" color="gray">
                  {progress.completedQuestions ?? 0} of{" "}
                  {progress.totalQuestions ?? 0} assignments completed
                </Text>
              </Flex>
            )}
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="4" p="4">
            <Heading size="5">Assignments ({assignments.length})</Heading>

            <Grid columns={{ initial: "1", sm: "2" }} gap="3">
              {assignments.map((assignment) => {
                const status = progress?.assignments?.find(
                  (a) => a.id === assignment.id,
                );

                const isDone =
                  status?.isCompleted || status?.status === "completed";
                const inProgress = status?.status === "inProgress";

                return (
                  <Card key={assignment.id}>
                    <Flex direction="column" gap="3" p="3">
                      <Flex justify="between" align="center">
                        <Text weight="medium">
                          Level {assignment.assignmentLevel} ·{" "}
                          {assignment.qnaType.toUpperCase()}
                        </Text>
                        {isDone && (
                          <Badge color="green" size="1">
                            <CheckCircle2 size={10} /> Done
                          </Badge>
                        )}
                      </Flex>

                      <Button
                        onClick={() => {
                          if (assignment.qnaType === "blockly") {
                            router.push(
                              `/student/playground?lectureId=${lectureId}&assignmentId=${assignment.id}&tab=blockly`,
                            );
                          } else if (assignment.qnaType === "coding") {
                            router.push(
                              `/student/playground?lectureId=${lectureId}&assignmentId=${assignment.id}&tab=editor`,
                            );
                          } else {
                            router.push(
                              `/student/assignments/${assignment.id}?lectureId=${lectureId}`,
                            );
                          }
                        }}
                        // Added soft variant for completed items to look cleaner
                        variant={isDone ? "soft" : "solid"}
                      >
                        {isDone ? "Completed" : inProgress ? "Resume" : "Solve"}
                      </Button>
                    </Flex>
                  </Card>
                );
              })}
            </Grid>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
