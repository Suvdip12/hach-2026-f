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
  courseInstructorApi,
  courseApi,
  instructorApi,
  extractArrayData,
  type CourseInstructor,
  type Course,
  type Instructor,
} from "@/services/api.service";
import { Trash2Icon, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function CourseInstructorsPage() {
  const [assignments, setAssignments] = useState<CourseInstructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [availableInstructors, setAvailableInstructors] = useState<
    Instructor[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, coursesRes, instructorsRes] = await Promise.all([
        courseInstructorApi.getAll(),
        courseApi.getAll(),
        instructorApi.getAll(),
      ]);
      const assignmentsData = extractArrayData(assignmentsRes);
      const coursesData = extractArrayData(coursesRes);
      const instructorsData = extractArrayData(instructorsRes);

      console.log("Fetched assignments:", assignmentsData);
      console.log("Fetched courses:", coursesData);
      console.log("Fetched instructors:", instructorsData);

      setAssignments(assignmentsData);
      setCourses(coursesData);
      setAllInstructors(instructorsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedInstructor("");
    if (courseId) {
      try {
        const res = await courseInstructorApi.getAvailableInstructors(courseId);
        const available = extractArrayData(res);
        console.log("Available instructors for course:", available);
        setAvailableInstructors(available);
      } catch (error) {
        console.error("Error fetching available instructors:", error);
        toast.error("Failed to load available instructors");
        // Fallback to all instructors if API fails
        setAvailableInstructors(allInstructors);
      }
    } else {
      setAvailableInstructors([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedCourse || !selectedInstructor) {
      toast.error("Please select both course and instructor");
      return;
    }

    try {
      setLoading(true);
      await courseInstructorApi.assign(selectedCourse, selectedInstructor);
      toast.success("Instructor assigned successfully");
      setIsDialogOpen(false);
      setSelectedCourse("");
      setSelectedInstructor("");
      fetchData();
    } catch (error) {
      console.error("Error assigning instructor:", error);
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to assign instructor",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;

    try {
      setLoading(true);
      await courseInstructorApi.remove(id);
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
              <Heading size="6">Course-Instructor Assignments</Heading>
              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Trigger>
                  <Button>
                    <PlusIcon size={16} />
                    Assign Instructor
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Title>Assign Instructor to Course</Dialog.Title>
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
                        Select Instructor
                      </Text>
                      <Select.Root
                        value={selectedInstructor}
                        onValueChange={setSelectedInstructor}
                        disabled={
                          !selectedCourse || availableInstructors.length === 0
                        }
                      >
                        <Select.Trigger
                          placeholder={
                            !selectedCourse
                              ? "Select a course first"
                              : availableInstructors.length === 0
                                ? "No available instructors"
                                : "Choose an instructor"
                          }
                        />
                        <Select.Content>
                          {availableInstructors.map((instructor) => (
                            <Select.Item
                              key={instructor.id}
                              value={instructor.id}
                            >
                              {instructor.name}
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
                          loading || !selectedCourse || !selectedInstructor
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
              <Text color="gray">No course-instructor assignments yet.</Text>
            )}

            {!loading && assignments.length > 0 && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Course</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Instructor</Table.ColumnHeaderCell>
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
                          {assignment.instructorName || assignment.instructorId}
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
