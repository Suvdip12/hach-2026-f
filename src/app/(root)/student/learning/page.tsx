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
} from "@radix-ui/themes";
import { useState, useEffect, useCallback } from "react";
import {
  assignmentCompletedApi,
  lectureWatchedApi,
  extractData,
  type StudentOverallProgress,
} from "@/services/api.service";
import { useSession } from "@/util/auth";
import {
  BookOpen,
  Video,
  CheckCircle2,
  Clock,
  Play,
  Award,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";

interface WatchHistory {
  id: string;
  lectureId: string;
  watchedTime: number;
  lastUpdated: string;
  lectureTitle: string;
  lectureDescription: string;
  lectureUrl: string;
}

export default function StudentLearningPage() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<StudentOverallProgress | null>(null);
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const studentId = session?.user?.id;

  const fetchStudentData = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const [progressRes, watchRes] = await Promise.all([
        assignmentCompletedApi.getStudentOverallProgress(studentId),
        lectureWatchedApi.getStudentHistory(studentId),
      ]);

      setProgress(extractData(progressRes) ?? null);
      const watchData = extractData(watchRes) as
        | { history: WatchHistory[] }
        | undefined;
      setWatchHistory(watchData?.history ?? []);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load your progress");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId, fetchStudentData]);

  const getProgressColor = (
    value: number,
  ): "green" | "yellow" | "orange" | "red" => {
    if (value >= 80) return "green";
    if (value >= 50) return "yellow";
    if (value >= 20) return "orange";
    return "red";
  };

  const formatWatchTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <Container size="4" className="py-20">
        <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
          <Text>Loading your progress...</Text>
        </Flex>
      </Container>
    );
  }

  const overallProgress = progress?.overallStats?.overallProgress ?? 0;
  const completedLectures = progress?.overallStats?.completedLectures ?? 0;
  const totalLectures = progress?.overallStats?.totalLectures ?? 0;

  return (
    <Container size="4" className="py-20">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <BookOpen size={24} />
              <Heading size="6">My Learning Journey</Heading>
            </Flex>
            <Badge size="2" color={getProgressColor(overallProgress)}>
              {overallProgress}% Complete
            </Badge>
          </Flex>
        </Card>

        {/* Main Progress Card */}
        <Card>
          <Flex direction="column" gap="4" p="6">
            <Flex align="center" gap="2">
              <Target size={20} />
              <Heading size="5">Overall Progress</Heading>
            </Flex>
            <Progress
              value={overallProgress}
              size="3"
              color={getProgressColor(overallProgress)}
            />
            <Flex justify="between">
              <Text color="gray">
                Keep going! You&apos;re making great progress.
              </Text>
              <Text weight="bold">{overallProgress}%</Text>
            </Flex>
          </Flex>
        </Card>

        {/* Stats Grid */}
        <Grid columns="4" gap="4">
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <CheckCircle2 size={32} color="var(--green-9)" />
              <Text size="6" weight="bold">
                {completedLectures}
              </Text>
              <Text size="2" color="gray">
                Lectures Done
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <BookOpen size={32} color="var(--blue-9)" />
              <Text size="6" weight="bold">
                {totalLectures}
              </Text>
              <Text size="2" color="gray">
                Total Lectures
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Video size={32} color="var(--purple-9)" />
              <Text size="6" weight="bold">
                {watchHistory.length}
              </Text>
              <Text size="2" color="gray">
                Videos Started
              </Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" align="center" gap="2" p="4">
              <Clock size={32} color="var(--yellow-9)" />
              <Text size="6" weight="bold">
                {Math.round(
                  watchHistory.reduce((sum, w) => sum + w.watchedTime, 0) / 60,
                )}
              </Text>
              <Text size="2" color="gray">
                Mins Watched
              </Text>
            </Flex>
          </Card>
        </Grid>

        {/* Achievements */}
        <Card>
          <Flex direction="column" gap="4" p="4">
            <Flex align="center" gap="2">
              <Award size={20} color="var(--gold-9)" />
              <Heading size="5">Achievements</Heading>
            </Flex>
            <Grid columns="4" gap="3">
              <Card>
                <Flex direction="column" align="center" gap="2" p="3">
                  <Badge
                    size="3"
                    color={watchHistory.length >= 1 ? "green" : "gray"}
                  >
                    🎬
                  </Badge>
                  <Text size="2" weight="medium">
                    First Video
                  </Text>
                  <Text size="1" color="gray">
                    {watchHistory.length >= 1 ? "Unlocked!" : "Watch 1 video"}
                  </Text>
                </Flex>
              </Card>
              <Card>
                <Flex direction="column" align="center" gap="2" p="3">
                  <Badge
                    size="3"
                    color={completedLectures >= 1 ? "green" : "gray"}
                  >
                    ✅
                  </Badge>
                  <Text size="2" weight="medium">
                    First Complete
                  </Text>
                  <Text size="1" color="gray">
                    {completedLectures >= 1
                      ? "Unlocked!"
                      : "Complete 1 lecture"}
                  </Text>
                </Flex>
              </Card>
              <Card>
                <Flex direction="column" align="center" gap="2" p="3">
                  <Badge
                    size="3"
                    color={watchHistory.length >= 5 ? "green" : "gray"}
                  >
                    📚
                  </Badge>
                  <Text size="2" weight="medium">
                    Eager Learner
                  </Text>
                  <Text size="1" color="gray">
                    {watchHistory.length >= 5 ? "Unlocked!" : "Watch 5 videos"}
                  </Text>
                </Flex>
              </Card>
              <Card>
                <Flex direction="column" align="center" gap="2" p="3">
                  <Badge
                    size="3"
                    color={overallProgress >= 50 ? "green" : "gray"}
                  >
                    🏆
                  </Badge>
                  <Text size="2" weight="medium">
                    Halfway There
                  </Text>
                  <Text size="1" color="gray">
                    {overallProgress >= 50 ? "Unlocked!" : "50% progress"}
                  </Text>
                </Flex>
              </Card>
            </Grid>
          </Flex>
        </Card>

        {/* Content Tabs */}
        <Card>
          <Tabs.Root defaultValue="lectures">
            <Flex p="4" direction="column" gap="4">
              <Heading size="5">My Progress Details</Heading>
              <Tabs.List>
                <Tabs.Trigger value="lectures">Lecture Progress</Tabs.Trigger>
                <Tabs.Trigger value="videos">Watch History</Tabs.Trigger>
              </Tabs.List>
            </Flex>

            <Tabs.Content value="lectures">
              <Flex direction="column" gap="3" p="4">
                {progress?.lectureProgress?.map((lp) => (
                  <Card key={lp.lectureId}>
                    <Flex direction="column" gap="3" p="3">
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          {lp.isCompleted ? (
                            <CheckCircle2 size={18} color="var(--green-9)" />
                          ) : (
                            <Play size={18} color="var(--blue-9)" />
                          )}
                          <Text weight="medium">{lp.lectureTitle}</Text>
                        </Flex>
                        <Badge color={lp.isCompleted ? "green" : "blue"}>
                          {lp.isCompleted ? "Complete" : `${lp.progress}%`}
                        </Badge>
                      </Flex>
                      <Progress
                        value={lp.progress}
                        color={getProgressColor(lp.progress)}
                      />
                      <Flex justify="between">
                        <Text size="1" color="gray">
                          {lp.completedAssignments} of {lp.totalAssignments}{" "}
                          assignments done
                        </Text>
                        {!lp.isCompleted && (
                          <Text size="1" color="blue">
                            {lp.totalAssignments - lp.completedAssignments}{" "}
                            remaining
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                  </Card>
                ))}
                {(!progress?.lectureProgress ||
                  progress.lectureProgress.length === 0) && (
                  <Flex justify="center" p="6">
                    <Text color="gray">
                      No lectures started yet. Start learning!
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="videos">
              <Flex direction="column" gap="2" p="4">
                {watchHistory.map((video) => (
                  <Flex
                    key={video.id}
                    justify="between"
                    align="center"
                    p="3"
                    style={{ borderBottom: "1px solid var(--gray-4)" }}
                  >
                    <Flex align="center" gap="3">
                      <Video size={18} color="var(--purple-9)" />
                      <Flex direction="column">
                        <Text weight="medium">{video.lectureTitle}</Text>
                        <Text size="1" color="gray">
                          Last watched:{" "}
                          {new Date(video.lastUpdated).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Badge variant="soft" color="purple">
                        <Clock size={12} /> {formatWatchTime(video.watchedTime)}
                      </Badge>
                    </Flex>
                  </Flex>
                ))}
                {watchHistory.length === 0 && (
                  <Flex justify="center" p="6">
                    <Text color="gray">
                      No videos watched yet. Start watching!
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Card>
      </Flex>
    </Container>
  );
}
