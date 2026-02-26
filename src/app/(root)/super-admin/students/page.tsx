"use client";

import {
  Container,
  Heading,
  Card,
  Flex,
  Button,
  Table,
  Dialog,
  TextField,
  Text,
  Select,
  IconButton,
  Badge,
} from "@radix-ui/themes";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  studentApi,
  schoolApi,
  extractArrayData,
  type Student,
  type School,
} from "@/services/api.service";
import { Trash2Icon, EditIcon, PlusIcon, FilterIcon } from "lucide-react";
import toast from "react-hot-toast";

const CreateStudentForm = dynamic(
  () => import("@/component/organisms/CreateStudentFormEnhanced"),
  { ssr: false },
);

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [filterSchoolId, setFilterSchoolId] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    schoolId: "",
  });

  useEffect(() => {
    fetchSchools();
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSchoolId]);

  const fetchSchools = async () => {
    try {
      const res = await schoolApi.getAll();
      setSchools(extractArrayData(res));
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res =
        filterSchoolId && filterSchoolId !== "all"
          ? await studentApi.getBySchool(filterSchoolId)
          : await studentApi.getAll();
      setStudents(extractArrayData(res));
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingStudent || !formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await studentApi.update(editingStudent.id, formData);
      toast.success("Student updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to update student",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This will also delete their account.",
      )
    )
      return;

    try {
      setLoading(true);
      await studentApi.delete(id);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to delete student",
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      schoolId: student.schoolId || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      schoolId: "",
    });
    setEditingStudent(null);
  };

  const getSchoolName = (schoolId: string | undefined) => {
    if (!schoolId) return "N/A";
    const school = schools.find((s) => s.id === schoolId);
    return school?.schoolName || "N/A";
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        {/* Create Student Dialog */}
        <Dialog.Root
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Create New Student</Dialog.Title>
            <CreateStudentForm
              onSuccess={fetchStudents}
              onClose={() => setIsCreateDialogOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Root>

        {/* Edit Student Dialog */}
        <Dialog.Root
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Edit Student</Dialog.Title>
            <Flex direction="column" gap="4" mt="4">
              <label>
                <Text size="2" weight="bold">
                  Name*
                </Text>
                <TextField.Root
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter student name"
                />
              </label>

              <label>
                <Text size="2" weight="bold">
                  Email*
                </Text>
                <TextField.Root
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter student email"
                />
              </label>

              <label>
                <Text size="2" weight="bold">
                  School (optional)
                </Text>
                <Select.Root
                  value={formData.schoolId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, schoolId: value })
                  }
                >
                  <Select.Trigger placeholder="Select a school" />
                  <Select.Content>
                    {schools.map((school) => (
                      <Select.Item key={school.id} value={school.id}>
                        {school.schoolName}
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
                <Button onClick={handleEdit} disabled={loading}>
                  Update Student
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Main Content */}
        <Card>
          <Flex direction="column" gap="4" p="4">
            <Flex justify="between" align="center">
              <Heading size="6">Manage Students</Heading>
              <Flex gap="2">
                <Select.Root
                  value={filterSchoolId}
                  onValueChange={setFilterSchoolId}
                >
                  <Select.Trigger placeholder="Filter by School">
                    <FilterIcon size={16} />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="all">All Schools</Select.Item>
                    {schools.map((school) => (
                      <Select.Item key={school.id} value={school.id}>
                        {school.schoolName}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusIcon size={16} />
                  Create Student
                </Button>
              </Flex>
            </Flex>

            {filterSchoolId && filterSchoolId !== "all" && (
              <Badge color="blue">
                Filtered: {getSchoolName(filterSchoolId)}
              </Badge>
            )}

            {loading && <Text>Loading...</Text>}

            {!loading && students.length === 0 && (
              <Text color="gray">
                No students yet. Create one to get started.
              </Text>
            )}

            {!loading && students.length > 0 && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>School</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {students.map((student) => (
                    <Table.Row key={student.id}>
                      <Table.Cell>{student.name}</Table.Cell>
                      <Table.Cell>{student.email}</Table.Cell>
                      <Table.Cell>{getSchoolName(student.schoolId)}</Table.Cell>
                      <Table.Cell>
                        <Flex gap="2">
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="green"
                            onClick={() => openEditDialog(student)}
                          >
                            <EditIcon size={16} />
                          </IconButton>
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="red"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2Icon size={16} />
                          </IconButton>
                        </Flex>
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
