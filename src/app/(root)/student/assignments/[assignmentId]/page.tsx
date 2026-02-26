"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  RadioGroup,
  Tabs,
  Text,
  TextArea,
} from "@radix-ui/themes";
import {
  assignmentApi,
  extractData,
  qnaCompletedApi,
  type Assignment,
  type Question,
  type QnaCompleted,
} from "@/services/api.service";
import { useSession } from "@/util/auth";
import { ArrowLeft, CheckCircle2, Clock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

type AssignmentWithQuestion = Assignment & {
  questionDetails?: Question;
};

export default function StudentAssignmentPage() {
  const params = useParams<{ assignmentId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [assignment, setAssignment] = useState<AssignmentWithQuestion | null>(
    null,
  );
  const [status, setStatus] = useState<QnaCompleted | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mcqAnswer, setMcqAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [showTestCases, setShowTestCases] = useState(false);
  const [lectureAssignments, setLectureAssignments] = useState<Assignment[]>(
    [],
  );

  const assignmentId = params.assignmentId;
  const lectureId = searchParams.get("lectureId");
  const studentId = session?.user?.id as string | undefined;

  const ensureStudent = useCallback(() => {
    if (!session?.user) return;
    const role = (session.user as { role?: string }).role;
    if (role !== "student" && role !== "individual" && role !== "school") {
      router.push("/login?option=student");
    }
  }, [session, router]);

  const loadAssignment = useCallback(async () => {
    if (!studentId || !assignmentId) return;

    try {
      setLoading(true);

      const [assignmentRes, lectureAssignmentsRes] = await Promise.all([
        assignmentApi.getWithProgress(assignmentId, studentId),
        lectureId
          ? assignmentApi.getByLecture(lectureId)
          : Promise.resolve(null),
      ]);

      const assignmentData = extractData<AssignmentWithQuestion>(assignmentRes);
      setAssignment(assignmentData ?? null);

      if (assignmentData?.qnaId) {
        const statusRes = await qnaCompletedApi.getStatus(
          studentId,
          assignmentData.qnaId,
        );
        setStatus(extractData<QnaCompleted>(statusRes) ?? null);
      }

      if (lectureAssignmentsRes) {
        const lectureAssignmentsData = extractData<{
          assignments: Assignment[];
        }>(lectureAssignmentsRes);
        setLectureAssignments(lectureAssignmentsData?.assignments ?? []);
      }
    } catch {
      toast.error("Failed to load assignment");
    } finally {
      setLoading(false);
    }
  }, [studentId, assignmentId, lectureId]);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login?option=student");
      return;
    }
    ensureStudent();
    loadAssignment();
  }, [session, isPending, router, ensureStudent, loadAssignment]);

  const question = assignment?.questionDetails;

  const isCompleted =
    status?.status === "completed" ||
    status?.isCompleted === true ||
    assignment?.isAssignmentCompleted === true ||
    assignment?.isQuestionCompleted === true;

  const isInProgress = status?.status === "inProgress";

  const nextAssignmentId = useMemo(() => {
    if (!lectureAssignments.length || !assignment) return null;
    const sorted = [...lectureAssignments].sort(
      (a, b) => a.assignmentLevel - b.assignmentLevel,
    );
    const idx = sorted.findIndex((a) => a.id === assignment.id);
    if (idx === -1 || idx === sorted.length - 1) return null;
    return sorted[idx + 1]?.id;
  }, [lectureAssignments, assignment]);

  const handleMarkInProgress = async () => {
    if (!studentId || !assignment?.qnaId) return;
    try {
      setSubmitting(true);
      const res = await qnaCompletedApi.markInProgress(assignment.qnaId);
      setStatus(extractData<QnaCompleted>(res) ?? null);
      toast.success("Marked as in progress");
    } catch {
      toast.error("Unable to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!studentId || !assignment?.qnaId) return;

    try {
      setSubmitting(true);

      const res = await qnaCompletedApi.markCompleted(
        assignment.qnaId,
        "completed",
      );

      if (res.success) {
        const completedData = extractData<
          QnaCompleted & { assignmentAutoCompleted: boolean }
        >(res);
        setStatus(completedData ?? null);
        toast.success("Assignment marked as completed!");
      } else {
        const errorMsg =
          res.error || "Failed to mark as completed. Please try again.";
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message;
      toast.error(errorMessage || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!studentId || !assignment?.qnaId) return;

    const questionType = (assignment?.qnaType || question?.qnaType) as string;

    if (questionType === "mcq") {
      if (!mcqAnswer) {
        toast.error("Please select an answer");
        return;
      }

      const correctAnswer = question?.answer?.answer;

      if (mcqAnswer !== correctAnswer) {
        toast.error("Incorrect answer. Please try again!");
        return;
      }
    }

    if (
      (questionType === "paragraph" ||
        questionType === "coding" ||
        questionType === "blockly") &&
      !textAnswer.trim()
    ) {
      toast.error("Please enter your answer");
      return;
    }

    try {
      setSubmitting(true);

      const res = await qnaCompletedApi.markCompleted(
        assignment.qnaId,
        "completed",
      );

      if (res.success) {
        const completedData = extractData<
          QnaCompleted & { assignmentAutoCompleted: boolean }
        >(res);
        setStatus(completedData ?? null);
        toast.success("Assignment submitted successfully!");
      } else {
        const errorMsg =
          res.error || "Failed to submit assignment. Please try again.";
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message;
      toast.error(
        errorMessage || "An error occurred while submitting. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = useMemo(() => {
    if (!question) {
      return (
        <Text size="2" color="gray">
          No question details available.
        </Text>
      );
    }

    const questionType = (assignment?.qnaType || question.qnaType) as string;
    const hints = question.answer?.hints || question.hints || [];
    const hasHints = hints.length > 0;

    if (questionType === "mcq") {
      return (
        <Flex direction="column" gap="4">
          <Text size="2" color="gray">
            Select the correct answer:
          </Text>

          {question.options && question.options.length > 0 ? (
            <RadioGroup.Root
              value={mcqAnswer}
              onValueChange={setMcqAnswer}
              disabled={isCompleted}
            >
              <Flex direction="column" gap="3">
                {question.options.map((opt: string, idx: number) => (
                  <Flex key={`${opt}-${idx}`} asChild gap="2" align="center">
                    <Text as="label" size="3">
                      <RadioGroup.Item value={opt} />
                      {opt}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </RadioGroup.Root>
          ) : (
            <Text size="2" color="red">
              No options available for this question.
            </Text>
          )}

          {hasHints && (
            <Box>
              <Button
                variant="soft"
                color="gray"
                onClick={() => setShowHints(!showHints)}
                style={{ marginBottom: "12px" }}
              >
                {showHints ? <EyeOff size={16} /> : <Eye size={16} />}
                {showHints ? "Hide Hints" : "Show Hints"}
              </Button>

              {showHints && (
                <Card>
                  <Flex direction="column" gap="2" p="3">
                    <Text weight="medium" size="3">
                      💡 Hints
                    </Text>
                    {hints.map((hint: string, idx: number) => (
                      <Text key={idx} size="2" color="gray">
                        • {hint}
                      </Text>
                    ))}
                  </Flex>
                </Card>
              )}
            </Box>
          )}

          <Flex gap="2" wrap="wrap">
            <Button
              variant="soft"
              onClick={handleMarkInProgress}
              disabled={submitting || isCompleted || isInProgress}
            >
              <Clock size={16} />
              {isInProgress ? "In Progress" : "Mark In Progress"}
            </Button>
            <Button
              variant="soft"
              color="green"
              onClick={handleMarkCompleted}
              disabled={submitting || isCompleted}
            >
              <CheckCircle2 size={16} />
              {isCompleted ? "Completed" : "Mark as Completed"}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || isCompleted || !mcqAnswer}
              size="3"
            >
              {submitting
                ? "Submitting..."
                : isCompleted
                  ? "Submitted"
                  : "Submit Answer"}
            </Button>
          </Flex>
        </Flex>
      );
    }

    if (questionType === "coding" || questionType === "blockly") {
      const testCases = question.testCases || [];
      const hasTestCases = testCases.length > 0;

      return (
        <Flex direction="column" gap="4">
          <Text size="2" color="gray">
            Provide your code solution below.
          </Text>

          <Flex gap="2" wrap="wrap" style={{ marginBottom: "12px" }}>
            {hasHints && (
              <Button
                variant="soft"
                color="gray"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? <EyeOff size={16} /> : <Eye size={16} />}
                {showHints ? "Hide Hints" : "Show Hints"}
              </Button>
            )}

            {hasTestCases && (
              <Button
                variant="soft"
                color="gray"
                onClick={() => setShowTestCases(!showTestCases)}
              >
                {showTestCases ? <EyeOff size={16} /> : <Eye size={16} />}
                {showTestCases ? "Hide Test Cases" : "Show Test Cases"}
              </Button>
            )}
          </Flex>

          {hasHints && showHints && (
            <Card>
              <Flex direction="column" gap="2" p="3">
                <Text weight="medium" size="3">
                  💡 Hints
                </Text>
                {hints.map((hint: string, idx: number) => (
                  <Text key={idx} size="2" color="gray">
                    • {hint}
                  </Text>
                ))}
              </Flex>
            </Card>
          )}

          <TextArea
            placeholder="Write your code here..."
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            rows={10}
            disabled={isCompleted}
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          />

          {hasTestCases && showTestCases && (
            <Card>
              <Flex direction="column" gap="3" p="3">
                <Text weight="medium" size="3">
                  🧪 Sample Test Cases
                </Text>
                {testCases.map(
                  (
                    tc: { input: string; expectedOutput: string },
                    idx: number,
                  ) => (
                    <Card key={`testcase-${idx}`} variant="surface">
                      <Flex direction="column" gap="2" p="3">
                        <Flex direction="column" gap="1">
                          <Text size="2" weight="medium" color="gray">
                            Input:
                          </Text>
                          <Box
                            style={{
                              backgroundColor: "var(--gray-3)",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontFamily: "monospace",
                              fontSize: "13px",
                            }}
                          >
                            <Text size="2">{tc.input || "null"}</Text>
                          </Box>
                        </Flex>
                        <Flex direction="column" gap="1">
                          <Text size="2" weight="medium" color="gray">
                            Expected Output:
                          </Text>
                          <Box
                            style={{
                              backgroundColor: "var(--gray-3)",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              fontFamily: "monospace",
                              fontSize: "13px",
                            }}
                          >
                            <Text size="2">{tc.expectedOutput || "null"}</Text>
                          </Box>
                        </Flex>
                      </Flex>
                    </Card>
                  ),
                )}
              </Flex>
            </Card>
          )}

          <Flex gap="2" wrap="wrap">
            <Button
              variant="soft"
              onClick={handleMarkInProgress}
              disabled={submitting || isCompleted || isInProgress}
            >
              <Clock size={16} />
              {isInProgress ? "In Progress" : "Mark In Progress"}
            </Button>
            <Button
              variant="soft"
              color="green"
              onClick={handleMarkCompleted}
              disabled={submitting || isCompleted}
            >
              <CheckCircle2 size={16} />
              {isCompleted ? "Completed" : "Mark as Completed"}
            </Button>
            <Button
              variant="soft"
              onClick={() => {
                const baseUrl = `/student/playground${
                  lectureId ? `?lectureId=${lectureId}` : ""
                }`;
                // const baseUrl = `/student/playground?assignmentId=${assignmentId}${
                //   lectureId ? `&lectureId=${lectureId}` : ""
                // }`;

                const url =
                  questionType === "coding" ? `${baseUrl}&tab=editor` : baseUrl;

                router.push(url);
              }}
            >
              Open in Playground
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || isCompleted || !textAnswer.trim()}
              size="3"
            >
              {submitting
                ? "Submitting..."
                : isCompleted
                  ? "Submitted"
                  : "Submit Answer"}
            </Button>
          </Flex>
        </Flex>
      );
    }

    return (
      <Flex direction="column" gap="4">
        <Text size="2" color="gray">
          Write your response.
        </Text>

        {hasHints && (
          <Box>
            <Button
              variant="soft"
              color="gray"
              onClick={() => setShowHints(!showHints)}
              style={{ marginBottom: "12px" }}
            >
              {showHints ? <EyeOff size={16} /> : <Eye size={16} />}
              {showHints ? "Hide Hints" : "Show Hints"}
            </Button>

            {showHints && (
              <Card>
                <Flex direction="column" gap="2" p="3">
                  <Text weight="medium" size="3">
                    💡 Hints
                  </Text>
                  {hints.map((hint: string, idx: number) => (
                    <Text key={idx} size="2" color="gray">
                      • {hint}
                    </Text>
                  ))}
                </Flex>
              </Card>
            )}
          </Box>
        )}

        <TextArea
          placeholder="Type your answer..."
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          rows={8}
          disabled={isCompleted}
        />

        <Flex gap="2" wrap="wrap">
          <Button
            variant="soft"
            onClick={handleMarkInProgress}
            disabled={submitting || isCompleted || isInProgress}
          >
            <Clock size={16} />
            {isInProgress ? "In Progress" : "Mark In Progress"}
          </Button>
          <Button
            variant="soft"
            color="green"
            onClick={handleMarkCompleted}
            disabled={submitting || isCompleted}
          >
            <CheckCircle2 size={16} />
            {isCompleted ? "Completed" : "Mark as Completed"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || isCompleted || !textAnswer.trim()}
            size="3"
          >
            {submitting
              ? "Submitting..."
              : isCompleted
                ? "Submitted"
                : "Submit Answer"}
          </Button>
        </Flex>
      </Flex>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    question,
    mcqAnswer,
    textAnswer,
    isCompleted,
    isInProgress,
    assignmentId,
    lectureId,
    router,
    status,
    submitting,
    assignment?.qnaType,
    showHints,
    showTestCases,
  ]);

  if (loading || isPending || !assignment) {
    return (
      <Container size="4" className="student-assignment-page">
        <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
          <Text size="4">Loading assignment...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" className="student-assignment-page">
      <Flex direction="column" gap="5">
        <Flex gap="2">
          <Button
            variant="ghost"
            onClick={() =>
              router.push(
                lectureId
                  ? `/student/courses/${lectureId}`
                  : "/student/courses",
              )
            }
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </Flex>

        <Card>
          <Flex direction="column" gap="3" p="4">
            <Flex justify="between" align="center" wrap="wrap" gap="3">
              <Heading size="6">Assignment</Heading>
              <Flex gap="2" align="center" wrap="wrap">
                <Badge variant="soft">
                  Level {assignment.assignmentLevel} ·{" "}
                  {assignment.qnaType.toUpperCase()}
                </Badge>
                <Badge
                  color={
                    assignment.difficultyLevel === "hard"
                      ? "red"
                      : assignment.difficultyLevel === "medium"
                        ? "yellow"
                        : "green"
                  }
                >
                  {assignment.difficultyLevel}
                </Badge>
                {isCompleted && (
                  <Badge color="green">
                    <CheckCircle2 size={12} />
                    Completed
                  </Badge>
                )}
                {isInProgress && !isCompleted && (
                  <Badge color="blue">
                    <Clock size={12} />
                    In Progress
                  </Badge>
                )}
              </Flex>
            </Flex>
            <Text color="gray">
              {assignment.questionDetails?.question ??
                "Work on the assignment and mark it complete once done."}
            </Text>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="4" p="4">
            <Tabs.Root defaultValue="question">
              <Tabs.List>
                <Tabs.Trigger value="question">Question</Tabs.Trigger>
                <Tabs.Trigger value="status">Status</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="question">
                <Flex direction="column" gap="3" pt="3">
                  {renderQuestion}
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="status">
                <Flex direction="column" gap="3" pt="3">
                  <Text>
                    Current status:{" "}
                    <Badge
                      color={
                        isCompleted ? "green" : isInProgress ? "blue" : "gray"
                      }
                    >
                      {isCompleted
                        ? "completed"
                        : isInProgress
                          ? "in progress"
                          : (status?.status ?? "pending")}
                    </Badge>
                  </Text>
                  <Text size="2" color="gray">
                    {isCompleted
                      ? "You have completed this assignment!"
                      : isInProgress
                        ? "Keep working on this assignment."
                        : "Complete the assignment in the Question tab to mark it as done."}
                  </Text>
                  {nextAssignmentId && (
                    <Button
                      variant="soft"
                      onClick={() =>
                        router.push(
                          `/student/assignments/${nextAssignmentId}${
                            lectureId ? `?lectureId=${lectureId}` : ""
                          }`,
                        )
                      }
                    >
                      Next Assignment
                    </Button>
                  )}
                </Flex>
              </Tabs.Content>
            </Tabs.Root>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
