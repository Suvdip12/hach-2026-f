"use client";

import {
  Container,
  Heading,
  Card,
  Flex,
  Table,
  Text,
  Select,
  Badge,
  Progress,
  Tabs,
} from "@radix-ui/themes";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { useState, useEffect } from "react";
import {
  studentApi,
  schoolApi,
  assignmentCompletedApi,
  lectureWatchedApi,
  extractData,
  extractArrayData,
  type Student,
  type School,
  type StudentOverallProgress,
} from "@/services/api.service";
import {
  BarChart3,
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

interface StudentWithProgress extends Student {
  progress?: StudentOverallProgress;
  watchHistory?: { totalVideos: number };
}

export default function StudentProgressPage() {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithProgress | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool && selectedSchool !== "all") {
      fetchStudentsBySchool(selectedSchool);
    } else {
      fetchAllStudents();
    }
  }, [selectedSchool]);

  const fetchSchools = async () => {
    try {
      const res = await schoolApi.getAll();
      setSchools(extractArrayData(res));
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
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

  const fetchStudentsBySchool = async (schoolId: string) => {
    try {
      setLoading(true);
      const res = await studentApi.getBySchool(schoolId);
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
  ):
    | "green"
    | "yellow"
    | "orange"
    | "red"
    | "ruby"
    | "gray"
    | "gold"
    | "bronze"
    | "brown"
    | "amber"
    | "tomato"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "mint"
    | "lime"
    | "grass"
    | undefined => {
    if (progress >= 80) return "green";
    if (progress >= 50) return "yellow";
    if (progress >= 20) return "orange";
    return "red";
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <BarChart3 size={24} />
              <Heading size="6">Student Progress Monitoring</Heading>
            </Flex>
            <Badge size="2" color="blue">
              <Users size={14} /> {students.length} Students
            </Badge>
          </Flex>
        </Card>

        {/* Filter by School */}
        <Card>
          <Flex p="4" gap="3" align="center">
            <Text weight="medium">Filter by School:</Text>
            <Select.Root
              value={selectedSchool}
              onValueChange={setSelectedSchool}
            >
              <Select.Trigger placeholder="All Schools" />
              <Select.Content>
                <Select.Item value="all">All Schools</Select.Item>
                {schools.map((school) => (
                  <Select.Item key={school.id} value={school.id}>
                    {school.schoolName}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        {/* Summary Stats */}
        <Flex gap="4">
          <Card style={{ flex: 1 }}>
            <Flex direction="column" align="center" gap="2" p="4">
              <GraduationCap size={32} color="var(--blue-9)" />
              <Text size="6" weight="bold">
                {students.length}
              </Text>
              <Text size="2" color="gray">
                Total Students
              </Text>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
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
                High Performers (80%+)
              </Text>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
            <Flex direction="column" align="center" gap="2" p="4">
              <TrendingUp size={32} color="var(--yellow-9)" />
              <Text size="6" weight="bold">
                {Math.round(
                  students.reduce(
                    (sum, s) =>
                      sum + (s.progress?.overallStats?.overallProgress ?? 0),
                    0,
                  ) / (students.length || 1),
                )}
                %
              </Text>
              <Text size="2" color="gray">
                Avg Progress
              </Text>
            </Flex>
          </Card>
          <Card style={{ flex: 1 }}>
            <Flex direction="column" align="center" gap="2" p="4">
              <Clock size={32} color="var(--purple-9)" />
              <Text size="6" weight="bold">
                {students.reduce(
                  (sum, s) => sum + (s.watchHistory?.totalVideos ?? 0),
                  0,
                )}
              </Text>
              <Text size="2" color="gray">
                Videos Watched
              </Text>
            </Flex>
          </Card>
        </Flex>

        {/* Students Table */}
        <Card>
          <Tabs.Root defaultValue="all">
            <Tabs.List>
              <Tabs.Trigger value="all">All Students</Tabs.Trigger>
              <Tabs.Trigger value="high">High Performers</Tabs.Trigger>
              <Tabs.Trigger value="low">Needs Attention</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="all">
              <StudentTable
                students={students}
                loading={loading}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>

            <Tabs.Content value="high">
              <StudentTable
                students={students.filter(
                  (s) => (s.progress?.overallStats?.overallProgress ?? 0) >= 80,
                )}
                loading={loading}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>

            <Tabs.Content value="low">
              <StudentTable
                students={students.filter(
                  (s) => (s.progress?.overallStats?.overallProgress ?? 0) < 50,
                )}
                loading={loading}
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
                  {selectedStudent.name}&apos;s Progress Details
                </Heading>
                <Badge
                  color={getProgressColor(
                    selectedStudent.progress?.overallStats?.overallProgress ??
                      0,
                  )}
                  size="2"
                >
                  {selectedStudent.progress?.overallStats?.overallProgress ?? 0}
                  % Complete
                </Badge>
              </Flex>

              <Flex gap="4">
                <Card style={{ flex: 1 }}>
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
                <Card style={{ flex: 1 }}>
                  <Flex direction="column" gap="2" p="3">
                    <Text size="2" color="gray">
                      Videos Watched
                    </Text>
                    <Text size="5" weight="bold">
                      {selectedStudent.watchHistory?.totalVideos ?? 0}
                    </Text>
                  </Flex>
                </Card>
              </Flex>

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
  loading,
  getProgressColor,
  onSelectStudent,
}: {
  students: StudentWithProgress[];
  loading: boolean;
  getProgressColor: (
    progress: number,
  ) =>
    | "green"
    | "yellow"
    | "orange"
    | "red"
    | "ruby"
    | "gray"
    | "gold"
    | "bronze"
    | "brown"
    | "amber"
    | "tomato"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "mint"
    | "lime"
    | "grass"
    | undefined;
  onSelectStudent: (student: StudentWithProgress) => void;
}) {
  if (loading) {
    return (
      <Flex justify="center" align="center" p="6">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Student</Table.ColumnHeaderCell>
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
