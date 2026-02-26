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

import { useState, useEffect } from "react";
import {
  studentApi,
  courseApi,
  lectureApi,
  assignmentCompletedApi,
  lectureWatchedApi,
  extractData,
  extractArrayData,
  type Student,
  type Course,
  type Lecture,
  type StudentOverallProgress,
} from "@/services/api.service";
import {
  BarChart3,
  Users,
  BookOpen,
  Video,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import AdminNav from "@/component/organisms/AdminNav";

interface StudentWithProgress extends Student {
  progress?: StudentOverallProgress;
  watchHistory?: { totalVideos: number };
}

interface LectureWithViewers extends Lecture {
  viewerCount?: number;
}

export default function AdminDashboardPage() {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<LectureWithViewers[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithProgress | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [studentsRes, coursesRes, lecturesRes] = await Promise.all([
        studentApi.getAll(),
        courseApi.getAll(),
        lectureApi.getAll(),
      ]);

      const studentsList = extractArrayData(studentsRes);
      setCourses(extractArrayData(coursesRes));
      setLectures(extractArrayData(lecturesRes));

      // Fetch progress for each student
      await fetchProgressForStudents(studentsList);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
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

  const highPerformers = students.filter(
    (s) => (s.progress?.overallStats?.overallProgress ?? 0) >= 80,
  );
  const needsAttention = students.filter(
    (s) => (s.progress?.overallStats?.overallProgress ?? 0) < 30,
  );

  if (loading) {
    return (
      <Container size="4" className="py-20">
        <AdminNav />
        <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
          <Text>Loading dashboard...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" className="py-20">
      <AdminNav />
      <Flex direction="column" gap="6">
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <BarChart3 size={24} />
              <Heading size="6">School Admin Dashboard</Heading>
            </Flex>
            <Badge size="2" color="green">
              Your School Overview
            </Badge>
          </Flex>
        </Card>

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
              <BookOpen size={32} color="var(--green-9)" />
              <Text size="6" weight="bold">
                {courses.length}
              </Text>
              <Text size="2" color="gray">
                Courses
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Video size={32} color="var(--purple-9)" />
              <Text size="6" weight="bold">
                {lectures.length}
              </Text>
              <Text size="2" color="gray">
                Lectures
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
        </Grid>

        <Grid columns="2" gap="4">
          <Card>
            <Flex direction="column" gap="3" p="4">
              <Flex align="center" gap="2">
                <CheckCircle2 size={20} color="var(--green-9)" />
                <Heading size="4">High Performers</Heading>
                <Badge color="green">{highPerformers.length}</Badge>
              </Flex>
              <Text color="gray" size="2">
                Students with 80%+ progress
              </Text>
              <Flex
                direction="column"
                gap="2"
                style={{ maxHeight: 200, overflowY: "auto" }}
              >
                {highPerformers.slice(0, 5).map((student) => (
                  <Flex key={student.id} justify="between" align="center">
                    <Text>{student.name}</Text>
                    <Badge color="green">
                      {student.progress?.overallStats?.overallProgress ?? 0}%
                    </Badge>
                  </Flex>
                ))}
                {highPerformers.length === 0 && (
                  <Text color="gray" size="2">
                    No high performers yet
                  </Text>
                )}
              </Flex>
            </Flex>
          </Card>

          <Card>
            <Flex direction="column" gap="3" p="4">
              <Flex align="center" gap="2">
                <AlertCircle size={20} color="var(--red-9)" />
                <Heading size="4">Needs Attention</Heading>
                <Badge color="red">{needsAttention.length}</Badge>
              </Flex>
              <Text color="gray" size="2">
                Students with less than 30% progress
              </Text>
              <Flex
                direction="column"
                gap="2"
                style={{ maxHeight: 200, overflowY: "auto" }}
              >
                {needsAttention.slice(0, 5).map((student) => (
                  <Flex key={student.id} justify="between" align="center">
                    <Text>{student.name}</Text>
                    <Badge color="red">
                      {student.progress?.overallStats?.overallProgress ?? 0}%
                    </Badge>
                  </Flex>
                ))}
                {needsAttention.length === 0 && (
                  <Text color="gray" size="2">
                    All students are on track!
                  </Text>
                )}
              </Flex>
            </Flex>
          </Card>
        </Grid>

        {/* Students Table with Tabs */}
        <Card>
          <Tabs.Root defaultValue="all">
            <Flex p="4" direction="column" gap="4">
              <Heading size="5">Student Progress</Heading>
              <Tabs.List>
                <Tabs.Trigger value="all">All Students</Tabs.Trigger>
                <Tabs.Trigger value="active">Active Learners</Tabs.Trigger>
                <Tabs.Trigger value="inactive">Inactive</Tabs.Trigger>
              </Tabs.List>
            </Flex>

            <Tabs.Content value="all">
              <StudentTable
                students={students}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>

            <Tabs.Content value="active">
              <StudentTable
                students={students.filter(
                  (s) => (s.watchHistory?.totalVideos ?? 0) > 0,
                )}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>

            <Tabs.Content value="inactive">
              <StudentTable
                students={students.filter(
                  (s) => (s.watchHistory?.totalVideos ?? 0) === 0,
                )}
                getProgressColor={getProgressColor}
                onSelectStudent={setSelectedStudent}
              />
            </Tabs.Content>
          </Tabs.Root>
        </Card>

        {/* Student Detail Modal/Card */}
        {selectedStudent && (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Flex justify="between" align="center">
                <Heading size="5">
                  {selectedStudent.name}&apos;s Learning Journey
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
                    % Overall
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
                    <Flex align="center" gap="2">
                      <CheckCircle2 size={16} />
                      <Text size="2" color="gray">
                        Completed
                      </Text>
                    </Flex>
                    <Text size="5" weight="bold">
                      {selectedStudent.progress?.overallStats
                        ?.completedLectures ?? 0}{" "}
                      /
                      {selectedStudent.progress?.overallStats?.totalLectures ??
                        0}
                    </Text>
                    <Text size="1" color="gray">
                      Lectures
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="3">
                    <Flex align="center" gap="2">
                      <Video size={16} />
                      <Text size="2" color="gray">
                        Watched
                      </Text>
                    </Flex>
                    <Text size="5" weight="bold">
                      {selectedStudent.watchHistory?.totalVideos ?? 0}
                    </Text>
                    <Text size="1" color="gray">
                      Videos
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2" p="3">
                    <Flex align="center" gap="2">
                      <Clock size={16} />
                      <Text size="2" color="gray">
                        Level
                      </Text>
                    </Flex>
                    <Text size="5" weight="bold">
                      {selectedStudent.level}
                    </Text>
                    <Text size="1" color="gray">
                      Current
                    </Text>
                  </Flex>
                </Card>
              </Grid>

              {selectedStudent.progress?.lectureProgress && (
                <Flex direction="column" gap="3">
                  <Text weight="medium">Lecture Completion</Text>
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
            <Table.ColumnHeaderCell>Videos Watched</Table.ColumnHeaderCell>
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
