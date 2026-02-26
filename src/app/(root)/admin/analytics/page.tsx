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
} from "@radix-ui/themes";
import AdminNav from "@/component/organisms/AdminNav";
import { useState, useEffect } from "react";
import {
  analyticsApi,
  extractData,
  extractArrayData,
  type DashboardStats,
  type TopPerformer,
  type StudentNeedingAttention,
  type LectureEngagement,
  type ActivityItem,
  type LevelProgression,
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
  Activity,
  Layers,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [needsAttention, setNeedsAttention] = useState<
    StudentNeedingAttention[]
  >([]);
  const [lectureEngagement, setLectureEngagement] = useState<
    LectureEngagement[]
  >([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [levelProgression, setLevelProgression] =
    useState<LevelProgression | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, topRes, needsRes, lectureRes, activityRes, levelRes] =
        await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getTopPerformers(10),
          analyticsApi.getStudentsNeedingAttention(30),
          analyticsApi.getLectureEngagement(),
          analyticsApi.getRecentActivity(15),
          analyticsApi.getLevelProgression(),
        ]);

      setStats(extractData(statsRes) ?? null);
      setTopPerformers(extractArrayData(topRes));
      const needsData = extractData(needsRes);
      setNeedsAttention(needsData?.students ?? []);
      setLectureEngagement(extractArrayData(lectureRes));
      setRecentActivity(extractArrayData(activityRes));
      setLevelProgression(extractData(levelRes) ?? null);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
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

  const getActivityText = (item: ActivityItem) => {
    switch (item.type) {
      case "assignment_completed":
        return `completed an assignment in ${item.detail}`;
      case "video_watched":
        return `watched ${item.detail}`;
      case "comment_added":
        return `commented: "${item.detail.slice(0, 50)}${item.detail.length > 50 ? "..." : ""}"`;
      default:
        return item.detail;
    }
  };

  if (loading) {
    return (
      <Container size="4" className="py-20">
        <AdminNav />
        <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
          <Text>Loading analytics...</Text>
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
              <Heading size="6">Analytics Dashboard</Heading>
            </Flex>
            <Badge size="2" color="blue">
              Live Stats
            </Badge>
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
                Total Students
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <BookOpen size={32} color="var(--green-9)" />
              <Text size="6" weight="bold">
                {stats?.counts.courses ?? 0}
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
                {stats?.counts.lectures ?? 0}
              </Text>
              <Text size="2" color="gray">
                Lectures
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Layers size={32} color="var(--orange-9)" />
              <Text size="6" weight="bold">
                {stats?.counts.assignments ?? 0}
              </Text>
              <Text size="2" color="gray">
                Assignments
              </Text>
            </Flex>
          </Card>
        </Grid>

        {/* Activity Stats */}
        <Grid columns="4" gap="4">
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <CheckCircle2 size={28} color="var(--green-9)" />
              <Text size="5" weight="bold">
                {stats?.activity.completedAssignments ?? 0}
              </Text>
              <Text size="2" color="gray">
                Completed
              </Text>
              <Badge color="green" size="1">
                {stats?.rates.completionRate ?? 0}% rate
              </Badge>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <TrendingUp size={28} color="var(--blue-9)" />
              <Text size="5" weight="bold">
                {stats?.activity.activeLearners ?? 0}
              </Text>
              <Text size="2" color="gray">
                Active Learners
              </Text>
              <Badge color="blue" size="1">
                {stats?.rates.activeRate ?? 0}% of total
              </Badge>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Clock size={28} color="var(--purple-9)" />
              <Text size="5" weight="bold">
                {stats?.activity.totalWatchTimeMinutes ?? 0}
              </Text>
              <Text size="2" color="gray">
                Watch Time (min)
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <GraduationCap size={28} color="var(--yellow-9)" />
              <Text size="5" weight="bold">
                {levelProgression?.averageLevel ?? 0}
              </Text>
              <Text size="2" color="gray">
                Avg Level
              </Text>
            </Flex>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid columns="2" gap="4">
          {/* Top Performers */}
          <Card>
            <Flex direction="column" gap="3" p="4">
              <Flex align="center" gap="2">
                <TrendingUp size={20} color="var(--green-9)" />
                <Heading size="4">Top Performers</Heading>
              </Flex>
              <Flex
                direction="column"
                gap="2"
                style={{ maxHeight: 300, overflowY: "auto" }}
              >
                {topPerformers.slice(0, 8).map((student, idx) => (
                  <Flex
                    key={student.studentId}
                    justify="between"
                    align="center"
                    p="2"
                  >
                    <Flex align="center" gap="2">
                      <Badge variant="soft" color={idx < 3 ? "gold" : "gray"}>
                        {idx + 1}
                      </Badge>
                      <Text>{student.studentName}</Text>
                    </Flex>
                    <Flex gap="2">
                      <Badge color="green">{student.completedCount} done</Badge>
                      <Badge variant="soft">
                        {student.totalWatchTimeMinutes}m
                      </Badge>
                    </Flex>
                  </Flex>
                ))}
                {topPerformers.length === 0 && (
                  <Text color="gray" size="2">
                    No data yet
                  </Text>
                )}
              </Flex>
            </Flex>
          </Card>

          {/* Needs Attention */}
          <Card>
            <Flex direction="column" gap="3" p="4">
              <Flex align="center" gap="2">
                <AlertCircle size={20} color="var(--red-9)" />
                <Heading size="4">Needs Attention</Heading>
                <Badge color="red">{needsAttention.length}</Badge>
              </Flex>
              <Flex
                direction="column"
                gap="2"
                style={{ maxHeight: 300, overflowY: "auto" }}
              >
                {needsAttention.slice(0, 8).map((student) => (
                  <Flex key={student.id} justify="between" align="center" p="2">
                    <Text>{student.name}</Text>
                    <Flex gap="2" align="center">
                      <Progress
                        value={student.progress}
                        style={{ width: 60 }}
                        color="red"
                      />
                      <Text size="1">{student.progress}%</Text>
                    </Flex>
                  </Flex>
                ))}
                {needsAttention.length === 0 && (
                  <Text color="gray" size="2">
                    All students on track!
                  </Text>
                )}
              </Flex>
            </Flex>
          </Card>
        </Grid>

        {/* Lecture Engagement */}
        <Card>
          <Tabs.Root defaultValue="engagement">
            <Flex p="4" direction="column" gap="4">
              <Heading size="5">Content Analytics</Heading>
              <Tabs.List>
                <Tabs.Trigger value="engagement">
                  Lecture Engagement
                </Tabs.Trigger>
                <Tabs.Trigger value="levels">Level Distribution</Tabs.Trigger>
                <Tabs.Trigger value="activity">Recent Activity</Tabs.Trigger>
              </Tabs.List>
            </Flex>

            <Tabs.Content value="engagement">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Lecture</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Viewers</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Watch Time</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Avg Time</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Assignments</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Completed</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {lectureEngagement.slice(0, 10).map((lec) => (
                    <Table.Row key={lec.lectureId}>
                      <Table.Cell>
                        <Text weight="medium">{lec.title}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="soft" color="blue">
                          {lec.viewerCount}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{lec.totalWatchTimeMinutes}m</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text>{lec.averageWatchTime}m</Text>
                      </Table.Cell>
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

            <Tabs.Content value="levels">
              <Flex direction="column" gap="4" p="4">
                {levelProgression?.distribution.map((level) => (
                  <Flex key={level.level} direction="column" gap="1">
                    <Flex justify="between">
                      <Text weight="medium">Level {level.level}</Text>
                      <Text color="gray">
                        {level.studentCount} students ({level.percentage}%)
                      </Text>
                    </Flex>
                    <Progress value={level.percentage} color="blue" />
                  </Flex>
                ))}
                {!levelProgression?.distribution.length && (
                  <Text color="gray">No level data available</Text>
                )}
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="activity">
              <Flex direction="column" gap="2" p="4">
                {recentActivity.map((item, idx) => (
                  <Flex key={idx} align="center" gap="3" p="2">
                    {getActivityIcon(item.type)}
                    <Flex direction="column">
                      <Text size="2">
                        <Text weight="medium">{item.studentName}</Text>{" "}
                        {getActivityText(item)}
                      </Text>
                      <Text size="1" color="gray">
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
                {recentActivity.length === 0 && (
                  <Text color="gray">No recent activity</Text>
                )}
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Card>
      </Flex>
    </Container>
  );
}
