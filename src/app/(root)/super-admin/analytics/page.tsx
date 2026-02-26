"use client";

import {
  Container,
  Heading,
  Card,
  Flex,
  Text,
  Badge,
  Grid,
  Progress,
  Tabs,
  Table,
  Select,
} from "@radix-ui/themes";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { useState, useEffect } from "react";
import {
  analyticsApi,
  schoolApi,
  extractData,
  extractArrayData,
  type DashboardStats,
  type TopPerformer,
  type LectureEngagement,
  type DifficultyAnalysis,
  type SchoolStats,
  type ActivityItem,
  type School,
} from "@/services/api.service";
import {
  BarChart3,
  Users,
  Video,
  CheckCircle2,
  TrendingUp,
  Clock,
  Activity,
  Building2,
  Code,
  FileText,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SuperAdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [lectureEngagement, setLectureEngagement] = useState<
    LectureEngagement[]
  >([]);
  const [difficultyAnalysis, setDifficultyAnalysis] =
    useState<DifficultyAnalysis | null>(null);
  const [schoolStats, setSchoolStats] = useState<SchoolStats[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
    fetchAllAnalytics();
  }, []);

  useEffect(() => {
    if (selectedSchool && selectedSchool !== "all") {
      fetchSchoolSpecificData(selectedSchool);
    } else {
      fetchAllAnalytics();
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

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, topRes, lectureRes, diffRes, schoolRes, activityRes] =
        await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getTopPerformers(10),
          analyticsApi.getLectureEngagement(),
          analyticsApi.getAssignmentDifficultyAnalysis(),
          analyticsApi.getSchoolWiseStats(),
          analyticsApi.getRecentActivity(20),
        ]);

      setStats(extractData(statsRes) ?? null);
      setTopPerformers(extractArrayData(topRes));
      setLectureEngagement(extractArrayData(lectureRes));
      setDifficultyAnalysis(extractData(diffRes) ?? null);
      setSchoolStats(extractArrayData(schoolRes));
      setRecentActivity(extractArrayData(activityRes));
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolSpecificData = async (schoolId: string) => {
    try {
      setLoading(true);
      const [statsRes, topRes, activityRes] = await Promise.all([
        analyticsApi.getDashboardStats(schoolId),
        analyticsApi.getTopPerformers(10, schoolId),
        analyticsApi.getRecentActivity(20, schoolId),
      ]);

      setStats(extractData(statsRes) ?? null);
      setTopPerformers(extractArrayData(topRes));
      setRecentActivity(extractArrayData(activityRes));
    } catch (error) {
      console.error("Error fetching school data:", error);
      toast.error("Failed to load school data");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment_completed":
        return <CheckCircle2 size={16} color="var(--green-9)" />;
      case "video_watched":
        return <Video size={16} color="var(--blue-9)" />;
      case "comment_added":
        return <MessageSquare size={16} color="var(--purple-9)" />;
      default:
        return <Activity size={16} />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "green";
      case "medium":
        return "yellow";
      case "hard":
        return "red";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return <CheckCircle2 size={16} />;
      case "coding":
        return <Code size={16} />;
      case "paragraph":
        return <FileText size={16} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container size="4" className="py-20">
        <SuperAdminNav />
        <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
          <Text>Loading analytics...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <BarChart3 size={24} />
              <Heading size="6">Platform Analytics</Heading>
            </Flex>
            <Flex gap="3" align="center">
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
          </Flex>
        </Card>

        {/* Main Stats */}
        <Grid columns="4" gap="4">
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Users size={32} color="var(--blue-9)" />
              <Text size="6" weight="bold">
                {stats?.counts.students ?? 0}
              </Text>
              <Text size="2" color="gray">
                Students
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <CheckCircle2 size={32} color="var(--green-9)" />
              <Text size="6" weight="bold">
                {stats?.activity.completedAssignments ?? 0}
              </Text>
              <Text size="2" color="gray">
                Completed
              </Text>
              <Badge color="green" size="1">
                {stats?.rates.completionRate ?? 0}%
              </Badge>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <TrendingUp size={32} color="var(--yellow-9)" />
              <Text size="6" weight="bold">
                {stats?.activity.activeLearners ?? 0}
              </Text>
              <Text size="2" color="gray">
                Active Learners
              </Text>
              <Badge color="blue" size="1">
                {stats?.rates.activeRate ?? 0}%
              </Badge>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Clock size={32} color="var(--purple-9)" />
              <Text size="6" weight="bold">
                {Math.round((stats?.activity.totalWatchTimeMinutes ?? 0) / 60)}
              </Text>
              <Text size="2" color="gray">
                Hours Watched
              </Text>
            </Flex>
          </Card>
        </Grid>

        {/* School Stats */}
        {selectedSchool === "all" && schoolStats.length > 0 && (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Flex align="center" gap="2">
                <Building2 size={20} />
                <Heading size="5">School Performance</Heading>
              </Flex>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>School</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Students</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Active</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Completed</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Watch Time</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Active Rate</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {schoolStats.map((school) => (
                    <Table.Row key={school.schoolId}>
                      <Table.Cell>
                        <Text weight="medium">{school.schoolName}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft">{school.studentCount}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="green">{school.activeStudents}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{school.completedAssignments}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{school.totalWatchTimeMinutes}m</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          <Progress
                            value={school.activeRate}
                            style={{ width: 60 }}
                          />
                          <Text size="1">{school.activeRate}%</Text>
                        </Flex>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Flex>
          </Card>
        )}

        {/* Difficulty & Type Analysis */}
        {selectedSchool === "all" && difficultyAnalysis && (
          <Grid columns="2" gap="4">
            <Card>
              <Flex direction="column" gap="4" p="4">
                <Heading size="5">By Difficulty</Heading>
                {difficultyAnalysis.byDifficulty.map((diff) => (
                  <Flex key={diff.difficulty} direction="column" gap="2">
                    <Flex justify="between" align="center">
                      <Badge
                        color={
                          getDifficultyColor(diff.difficulty) as
                            | "green"
                            | "yellow"
                            | "red"
                        }
                        size="2"
                      >
                        {diff.difficulty.toUpperCase()}
                      </Badge>
                      <Text size="2" color="gray">
                        {diff.completedCount}/{diff.totalAttempts} (
                        {diff.completionRate}%)
                      </Text>
                    </Flex>
                    <Progress
                      value={diff.completionRate}
                      color={
                        getDifficultyColor(diff.difficulty) as
                          | "green"
                          | "yellow"
                          | "red"
                      }
                    />
                    <Text size="1" color="gray">
                      {diff.totalAssignments} assignments
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="4" p="4">
                <Heading size="5">By Type</Heading>
                {difficultyAnalysis.byType.map((type) => (
                  <Flex key={type.type} justify="between" align="center" p="2">
                    <Flex align="center" gap="2">
                      {getTypeIcon(type.type)}
                      <Text weight="medium">{type.type.toUpperCase()}</Text>
                    </Flex>
                    <Flex gap="2">
                      <Badge variant="soft">
                        {type.totalAssignments} total
                      </Badge>
                      <Badge color="green">{type.completedCount} done</Badge>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Card>
          </Grid>
        )}

        {/* Content Tabs */}
        <Card>
          <Tabs.Root defaultValue="performers">
            <Flex p="4" direction="column" gap="4">
              <Heading size="5">Detailed Analytics</Heading>
              <Tabs.List>
                <Tabs.Trigger value="performers">Top Performers</Tabs.Trigger>
                <Tabs.Trigger value="lectures">Lecture Stats</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity Feed</Tabs.Trigger>
              </Tabs.List>
            </Flex>

            <Tabs.Content value="performers">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Student</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Level</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Completed</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Watch Time</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {topPerformers.map((student, idx) => (
                    <Table.Row key={student.studentId}>
                      <Table.Cell>
                        <Badge variant="soft" color={idx < 3 ? "gold" : "gray"}>
                          {idx + 1}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text weight="medium">{student.studentName}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text color="gray">{student.studentEmail}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="blue">Level {student.studentLevel}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="green">{student.completedCount}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{student.totalWatchTimeMinutes}m</Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Tabs.Content>

            <Tabs.Content value="lectures">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Lecture</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Viewers</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Total Time</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Avg Time</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Assignments</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Done</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {lectureEngagement.map((lec) => (
                    <Table.Row key={lec.lectureId}>
                      <Table.Cell>
                        <Text weight="medium">{lec.title}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" color="blue">
                          {lec.viewerCount}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{lec.totalWatchTimeMinutes}m</Table.Cell>
                      <Table.Cell>{lec.averageWatchTime}m</Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft">{lec.assignmentCount}</Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="green">{lec.completedAssignments}</Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Tabs.Content>

            <Tabs.Content value="activity">
              <Flex
                direction="column"
                gap="2"
                p="4"
                style={{ maxHeight: 400, overflowY: "auto" }}
              >
                {recentActivity.map((item, idx) => (
                  <Flex key={idx} align="center" gap="3" p="2">
                    {getActivityIcon(item.type)}
                    <Flex direction="column">
                      <Text size="2">
                        <Text weight="medium">{item.studentName}</Text>{" "}
                        {item.type === "assignment_completed" &&
                          "completed an assignment"}
                        {item.type === "video_watched" &&
                          `watched ${item.detail}`}
                        {item.type === "comment_added" &&
                          `commented: "${item.detail.slice(0, 40)}..."`}
                      </Text>
                      <Text size="1" color="gray">
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Card>
      </Flex>
    </Container>
  );
}
