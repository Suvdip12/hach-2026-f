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
  TextArea,
} from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  studentApi,
  schoolApi,
  extractArrayData,
  type Student,
  type School,
} from "@/services/api.service";
import {
  EditIcon,
  PlusIcon,
  FilterIcon,
  BanIcon,
  CheckCircleIcon,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { getServerSession } from "@/util/auth/server";

const CreateStudentForm = dynamic(
  () => import("@/component/organisms/CreateStudentFormEnhanced"),
  { ssr: false },
);

interface UserWithRole {
  id: string;
  role?: string;
  schoolId?: string;
}

interface StudentWithBan extends Student {
  banned?: boolean;
  banReason?: string | null;
  banExpires?: string | null;
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentWithBan[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentWithBan | null>(
    null,
  );
  const [banningStudent, setBanningStudent] = useState<StudentWithBan | null>(
    null,
  );
  const [filterSchoolId, setFilterSchoolId] = useState<string>("all");
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollmentNumber: "",
    schoolId: "",
  });
  const [banData, setBanData] = useState({
    reason: "",
    duration: "permanent", // permanent, 1day, 7days, 30days
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await getServerSession();
        if (!sessionData?.user) {
          router.push("/controller");
          return;
        }

        const user = sessionData.user as UserWithRole;
        if (user.role !== "admin" && user.role !== "superAdmin") {
          router.push("/");
          return;
        }

        // If admin, restrict to their school
        if (user.role === "admin" && user.schoolId) {
          setUserSchoolId(user.schoolId);
          setFilterSchoolId(user.schoolId);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        router.push("/controller");
      }
    };

    checkSession();
    fetchSchools();
  }, [router]);

  useEffect(() => {
    if (filterSchoolId) {
      fetchStudents();
    }
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
      toast.error("Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleBanStudent = async () => {
    if (!banningStudent) return;

    try {
      setLoading(true);
      let banExpires: Date | null = null;

      if (banData.duration !== "permanent") {
        const days = parseInt(
          banData.duration.replace("days", "").replace("day", ""),
        );
        banExpires = new Date();
        banExpires.setDate(banExpires.getDate() + days);
      }

      await studentApi.banStudent(banningStudent.id, {
        banned: true,
        banReason: banData.reason,
        banExpires: banExpires?.toISOString() || null,
      });

      toast.success("Student banned successfully");
      setIsBanDialogOpen(false);
      setBanningStudent(null);
      setBanData({ reason: "", duration: "permanent" });
      fetchStudents();
    } catch (error) {
      console.error("Error banning student:", error);
      toast.error("Failed to ban student");
    } finally {
      setLoading(false);
    }
  };

  const handleUnbanStudent = async (studentId: string) => {
    try {
      setLoading(true);
      await studentApi.banStudent(studentId, {
        banned: false,
        banReason: null,
        banExpires: null,
      });
      toast.success("Student unbanned successfully");
      fetchStudents();
    } catch (error) {
      console.error("Error unbanning student:", error);
      toast.error("Failed to unban student");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      enrollmentNumber: student.enrollmentNumber || "",
      schoolId: student.schoolId || "",
    });
    setIsEditDialogOpen(true);
  };

  const openBanDialog = (student: Student) => {
    setBanningStudent(student);
    setIsBanDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      enrollmentNumber: "",
      schoolId: "",
    });
    setEditingStudent(null);
  };

  const getSchoolName = (schoolId: string) => {
    return (
      schools.find((s) => s.id === schoolId)?.schoolName || "Unknown School"
    );
  };

  return (
    <Container size="4" className="py-20">
      <Flex direction="column" gap="6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/controller/dashboard")}
          style={{ width: "fit-content" }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>

        {/* Create Student Dialog */}
        <Dialog.Root
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Create New Student</Dialog.Title>
            <CreateStudentForm />
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

        {/* Ban Student Dialog */}
        <Dialog.Root
          open={isBanDialogOpen}
          onOpenChange={(open) => {
            setIsBanDialogOpen(open);
            if (!open) {
              setBanningStudent(null);
              setBanData({ reason: "", duration: "permanent" });
            }
          }}
        >
          <Dialog.Content style={{ maxWidth: 500 }}>
            <Dialog.Title>Ban Student</Dialog.Title>
            <Text color="gray" size="2">
              Banning {banningStudent?.name} ({banningStudent?.email})
            </Text>
            <Flex direction="column" gap="4" mt="4">
              <label>
                <Text size="2" weight="bold">
                  Ban Duration
                </Text>
                <Select.Root
                  value={banData.duration}
                  onValueChange={(value) =>
                    setBanData({ ...banData, duration: value })
                  }
                >
                  <Select.Trigger placeholder="Select duration" />
                  <Select.Content>
                    <Select.Item value="1day">1 Day</Select.Item>
                    <Select.Item value="7days">7 Days</Select.Item>
                    <Select.Item value="30days">30 Days</Select.Item>
                    <Select.Item value="permanent">Permanent</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>

              <label>
                <Text size="2" weight="bold">
                  Reason for Ban
                </Text>
                <TextArea
                  value={banData.reason}
                  onChange={(e) =>
                    setBanData({ ...banData, reason: e.target.value })
                  }
                  placeholder="Enter reason for banning this student..."
                  rows={3}
                />
              </label>

              <Flex gap="3" justify="end" mt="4">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  color="red"
                  onClick={handleBanStudent}
                  disabled={loading}
                >
                  <BanIcon size={16} />
                  Ban Student
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
                {!userSchoolId && (
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
                )}
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusIcon size={16} />
                  Create Student
                </Button>
              </Flex>
            </Flex>

            {filterSchoolId && filterSchoolId !== "all" && (
              <Badge color="blue">
                School: {getSchoolName(filterSchoolId)}
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
                    <Table.ColumnHeaderCell>Level</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {students.map((student) => (
                    <Table.Row key={student.id}>
                      <Table.Cell>{student.name}</Table.Cell>
                      <Table.Cell>{student.email}</Table.Cell>
                      <Table.Cell>Level {student.level || 1}</Table.Cell>
                      <Table.Cell>
                        {student.banned ? (
                          <Badge color="red">Banned</Badge>
                        ) : (
                          <Badge color="green">Active</Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="2">
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="green"
                            onClick={() => openEditDialog(student)}
                            title="Edit"
                          >
                            <EditIcon size={16} />
                          </IconButton>
                          {student.banned ? (
                            <IconButton
                              size="1"
                              variant="ghost"
                              color="green"
                              onClick={() => handleUnbanStudent(student.id)}
                              title="Unban"
                            >
                              <CheckCircleIcon size={16} />
                            </IconButton>
                          ) : (
                            <IconButton
                              size="1"
                              variant="ghost"
                              color="orange"
                              onClick={() => openBanDialog(student)}
                              title="Ban"
                            >
                              <BanIcon size={16} />
                            </IconButton>
                          )}
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
