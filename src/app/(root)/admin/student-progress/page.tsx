"use client";

import {
  Container,
  Heading,
  Card,
  Flex,
  Table,
  Text,
  Badge,
  Progress,
  Tabs,
  Grid,
} from "@radix-ui/themes";
import AdminNav from "@/component/organisms/AdminNav";
import { useState, useEffect } from "react";
import {
  studentApi,
  assignmentCompletedApi,
  lectureWatchedApi,
  extractData,
  extractArrayData,
  type Student,
  type StudentOverallProgress,
} from "@/services/api.service";
import {
  BarChart3,
  Users,
  CheckCircle2,
  TrendingUp,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";

interface StudentWithProgress extends Student {
  progress?: StudentOverallProgress;
  watchHistory?: { totalVideos: number };
}

export default function AdminStudentProgressPage() {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithProgress | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // This will only fetch students from the admin's school due to tenant middleware
      const res = await studentApi.getAll();
      const studentsList = extractArrayData(res);
      await fetchProgressForStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressForStudents = async (studentsList: Student[]) => {
    const studentsWithProgress: StudentWithProgress[] = await Promise.all(
      studentsList.map(async (student) => {
        try {
          const [progressRes, watchRes] = await Promise.all([
            assignmentCompletedApi.getStudentOverallProgress(student.id),
            lectureWatchedApi.getStudentHistory(student.id),
          ]);

          return {
            ...student,
            progress: extractData(progressRes) as StudentOverallProgress,
            watchHistory: extractData(watchRes) as { totalVideos: number },
          };
        } catch {
          return { ...student };
        }
      }),
    );
    setStudents(studentsWithProgress);
  };

  const getProgressColor = (
    progress: number,
  ): "green" | "yellow" | "orange" | "red" => {
    if (progress >= 80) return "green";
    if (progress >= 50) return "yellow";
    if (progress >= 20) return "orange";
    return "red";
  };

  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, s) => sum + (s.progress?.overallStats?.overallProgress ?? 0),
            0,
          ) / students.length,
        )
      : 0;

  if (loading) {
    return (
      <Container size="4" className="py-20">
        <AdminNav />
        <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
          <Text>Loading progress data...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" className="py-20">
      <AdminNav />
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <BarChart3 size={24} />
              <Heading size="6">Student Progress</Heading>
            </Flex>
            <Badge size="2" color="blue">
              <Users size={14} /> {students.length} Students
            </Badge>
          </Flex>
        </Card>

        {/* Summary Stats */}
        <Grid columns="4" gap="4">
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Users size={32} color="var(--blue-9)" />
              <Text size="6" weight="bold">
                {students.length}
              </Text>
              <Text size="2" color="gray">
                Total Students
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <CheckCircle2 size={32} color="var(--green-9)" />
              <Text size="6" weight="bold">
                {
                  students.filter(
                    (s) =>
                      (s.progress?.overallStats?.overallProgress ?? 0) >= 80,
                  ).length
                }
              </Text>
              <Text size="2" color="gray">
                Completed 80%+
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <TrendingUp size={32} color="var(--yellow-9)" />
              <Text size="6" weight="bold">
                {avgProgress}%
              </Text>
              <Text size="2" color="gray">
                Avg Progress
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Video size={32} color="var(--purple-9)" />
              <Text size="6" weight="bold">
                {students.reduce(
                  (sum, s) => sum + (s.watchHistory?.totalVideos ?? 0),
                  0,
                )}
              </Text>
              <Text size="2" color="gray">
                Total Videos Watched
              </Text>
            </Flex>
          </Card>
        </Grid>

        {/* Students Table */}
        <Card>
          <Tabs.Root defaultValue="all">
            <Flex p="4" direction="column" gap="4">
              <Heading size="5">All Students Progress</Heading>
              <Tabs.List>
                <Tabs.Trigger value="all">All</Tabs.Trigger>
                <Tabs.Trigger value="high">High Performers</Tabs.Trigger>
                <Tabs.Trigger value="low">Needs Attention</Tabs.Trigger>
              </Tabs.List>
            </Flex>

            <Tabs.Content value="all">
              <StudentTable
                students={students}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>

            <Tabs.Content value="high">
              <StudentTable
                students={students.filter(
                  (s) => (s.progress?.overallStats?.overallProgress ?? 0) >= 80,
                )}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>

            <Tabs.Content value="low">
              <StudentTable
                students={students.filter(
                  (s) => (s.progress?.overallStats?.overallProgress ?? 0) < 50,
                )}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>
          </Tabs.Root>
        </Card>

        {/* Student Detail Card */}
        {selectedStudent && (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Flex justify="between" align="center">
                <Heading size="5">
                  {selectedStudent.name}&apos;s Details
                </Heading>
                <Flex gap="2">
                  <Badge
                    color={getProgressColor(
                      selectedStudent.progress?.overallStats?.overallProgress ??
                        0,
                    )}
                    size="2"
                  >
                    {selectedStudent.progress?.overallStats?.overallProgress ??
                      0}
                    % Complete
                  </Badge>
                  <Badge
                    variant="outline"
                    onClick={() => setSelectedStudent(null)}
                    style={{ cursor: "pointer" }}
                  >
                    Close
                  </Badge>
                </Flex>
              </Flex>

              <Grid columns="3" gap="4">
                <Card>
                  <Flex direction="column" gap="2" p="3">
                    <Text size="2" color="gray">
                      Lectures Completed
                    </Text>
                    <Text size="5" weight="bold">
                      {selectedStudent.progress?.overallStats
                        ?.completedLectures ?? 0}{" "}
                      /
                      {selectedStudent.progress?.overallStats?.totalLectures ??
                        0}
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="3">
                    <Text size="2" color="gray">
                      Videos Watched
                    </Text>
                    <Text size="5" weight="bold">
                      {selectedStudent.watchHistory?.totalVideos ?? 0}
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="3">
                    <Text size="2" color="gray">
                      Current Level
                    </Text>
                    <Text size="5" weight="bold">
                      {selectedStudent.level}
                    </Text>
                  </Flex>
                </Card>
              </Grid>

              {selectedStudent.progress?.lectureProgress && (
                <Flex direction="column" gap="3">
                  <Text weight="medium">Lecture Progress</Text>
                  {selectedStudent.progress.lectureProgress.map((lp) => (
                    <Flex key={lp.lectureId} direction="column" gap="1">
                      <Flex justify="between">
                        <Text size="2">{lp.lectureTitle}</Text>
                        <Text size="2" color="gray">
                          {lp.completedAssignments}/{lp.totalAssignments} (
                          {lp.progress}%)
                        </Text>
                      </Flex>
                      <Progress
                        value={lp.progress}
                        color={getProgressColor(lp.progress)}
                      />
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          </Card>
        )}
      </Flex>
    </Container>
  );
}

function StudentTable({
  students,
  getProgressColor,
  onSelectStudent,
}: {
  students: StudentWithProgress[];
  getProgressColor: (progress: number) => "green" | "yellow" | "orange" | "red";
  onSelectStudent: (student: StudentWithProgress) => void;
}) {
  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Class</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Level</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Videos</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {students.map((student) => (
            <Table.Row
              key={student.id}
              onClick={() => onSelectStudent(student)}
              style={{ cursor: "pointer" }}
            >
              <Table.Cell>
                <Text weight="medium">{student.name}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text color="gray">{student.email}</Text>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="soft">{student.class || "N/A"}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge color="blue">Level {student.level}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Progress
                    value={student.progress?.overallStats?.overallProgress ?? 0}
                    color={getProgressColor(
                      student.progress?.overallStats?.overallProgress ?? 0,
                    )}
                    style={{ width: 60 }}
                  />
                  <Text size="1">
                    {student.progress?.overallStats?.overallProgress ?? 0}%
                  </Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color="purple">
                  {student.watchHistory?.totalVideos ?? 0}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {students.length === 0 && (
        <Flex justify="center" align="center" p="6">
          <Text color="gray">No students found</Text>
        </Flex>
      )}
    </>
  );
}
