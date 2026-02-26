"use client";

import {
  Container,
  Heading,
  Card,
  Flex,
  Button,
  Table,
  Dialog,
  Select,
  Text,
  Badge,
  IconButton,
} from "@radix-ui/themes";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { useState, useEffect } from "react";
import {
  courseLectureApi,
  courseApi,
  lectureApi,
  extractArrayData,
  type CourseLecture,
  type Course,
  type Lecture,
} from "@/services/api.service";
import { Trash2Icon, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function CourseLecturesPage() {
  const [assignments, setAssignments] = useState<CourseLecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allLectures, setAllLectures] = useState<Lecture[]>([]);
  const [availableLectures, setAvailableLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLecture, setSelectedLecture] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [assignmentsRes, coursesRes, lecturesRes] = await Promise.all([
        courseLectureApi.getAll(),
        courseApi.getAll(),
        lectureApi.getAll(),
      ]);

      const assignmentsData = extractArrayData(assignmentsRes);
      const coursesData = extractArrayData(coursesRes);
      const lecturesData = extractArrayData(lecturesRes);

      setAssignments(assignmentsData);
      setCourses(coursesData);
      setAllLectures(lecturesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedLecture("");

    if (courseId) {
      try {
        const res = await courseLectureApi.getAvailableLectures(courseId);
        const available = extractArrayData(res);
        setAvailableLectures(available);
      } catch (error) {
        console.error("Error fetching available lectures:", error);
        toast.error("Failed to load available lectures");
        setAvailableLectures(allLectures);
      }
    } else {
      setAvailableLectures([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedCourse || !selectedLecture) {
      toast.error("Please select both course and lecture");
      return;
    }

    try {
      setLoading(true);
      await courseLectureApi.assign(selectedCourse, selectedLecture);
      toast.success("Lecture assigned successfully");
      setIsDialogOpen(false);
      setSelectedCourse("");
      setSelectedLecture("");
      fetchData();
    } catch (error) {
      console.error("Error assigning lecture:", error);
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to assign lecture",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;

    try {
      setLoading(true);
      await courseLectureApi.remove(id);
      toast.success("Assignment removed successfully");
      fetchData();
    } catch (error) {
      console.error("Error removing assignment:", error);
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to remove assignment",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        <Card>
          <Flex direction="column" gap="4" p="4">
            <Flex justify="between" align="center">
              <Heading size="6">Course-Lecture Assignments</Heading>

              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Trigger>
                  <Button>
                    <PlusIcon size={16} />
                    Assign Lecture
                  </Button>
                </Dialog.Trigger>

                <Dialog.Content>
                  <Dialog.Title>Assign Lecture to Course</Dialog.Title>

                  <Flex direction="column" gap="4" mt="4">
                    <label>
                      <Text size="2" weight="bold">
                        Select Course
                      </Text>

                      <Select.Root
                        value={selectedCourse}
                        onValueChange={handleCourseSelect}
                      >
                        <Select.Trigger placeholder="Choose a course" />
                        <Select.Content>
                          {courses.map((course) => (
                            <Select.Item key={course.id} value={course.id}>
                              {course.courseName}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </label>

                    <label>
                      <Text size="2" weight="bold">
                        Select Lecture
                      </Text>

                      <Select.Root
                        value={selectedLecture}
                        onValueChange={setSelectedLecture}
                        disabled={
                          !selectedCourse || availableLectures.length === 0
                        }
                      >
                        <Select.Trigger
                          placeholder={
                            !selectedCourse
                              ? "Select a course first"
                              : availableLectures.length === 0
                                ? "No available lectures"
                                : "Choose a lecture"
                          }
                        />

                        <Select.Content>
                          {availableLectures.map((lecture) => (
                            <Select.Item key={lecture.id} value={lecture.id}>
                              {lecture.title}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </label>

                    <Flex gap="3" justify="end" mt="4">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </Dialog.Close>

                      <Button
                        onClick={handleAssign}
                        disabled={
                          loading || !selectedCourse || !selectedLecture
                        }
                      >
                        Assign
                      </Button>
                    </Flex>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>

            {loading && <Text>Loading...</Text>}

            {!loading && assignments.length === 0 && (
              <Text color="gray">No course-lecture assignments yet.</Text>
            )}

            {!loading && assignments.length > 0 && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Course</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Lecture</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {assignments.map((assignment) => (
                    <Table.Row key={assignment.id}>
                      <Table.Cell>
                        <Text weight="bold">
                          {assignment.courseName || assignment.courseId}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge>
                          {assignment.lectureTitle || assignment.lectureId}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell>
                        {assignment.createdAt
                          ? new Date(assignment.createdAt).toLocaleDateString()
                          : "-"}
                      </Table.Cell>

                      <Table.Cell>
                        <IconButton
                          size="1"
                          variant="ghost"
                          color="red"
                          onClick={() => handleRemove(assignment.id)}
                        >
                          <Trash2Icon size={16} />
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
