"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading,
  Card,
  Flex,
  Button,
  TextArea,
  TextField,
  Text,
  IconButton,
  Table,
} from "@radix-ui/themes";
import { Plus, Upload, Edit2, Trash2, User, ArrowLeft } from "lucide-react";
import { instructorApi } from "@/services/api.service";
import { showToast } from "@/lib/toast.config";
import { getServerSession } from "@/util/auth/server";

interface Instructor {
  id: string;
  name: string;
  detail: string;
}

interface UserWithRole {
  id: string;
  role?: string;
}

export default function AdminInstructorsPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingCSV, setUploadingCSV] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    detail: "",
  });

  const fetchInstructors = async () => {
    setLoading(true);
    const { success, data } = await instructorApi.getAll();
    if (success && data) {
      const responseData = data as unknown as { data: Instructor[] };
      setInstructors(responseData.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const sessionData = await getServerSession();
        if (!sessionData?.user) {
          router.push("/controller");
          return;
        }

        const user = sessionData.user as UserWithRole;
        // Only superAdmin can manage instructors
        if (user.role !== "admin") {
          router.push("/controller/dashboard");
          return;
        }

        // Fetch instructors after session check passes
        if (isMounted) {
          setLoading(true);
          const { success, data } = await instructorApi.getAll();
          if (success && data && isMounted) {
            const responseData = data as unknown as { data: Instructor[] };
            setInstructors(responseData.data || []);
          }
          if (isMounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        router.push("/controller");
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success } = editingId
      ? await instructorApi.update(editingId, formData)
      : await instructorApi.create(formData);

    if (success) {
      showToast.success(
        `Instructor ${editingId ? "updated" : "created"} successfully!`,
      );
      setIsCreating(false);
      setEditingId(null);
      setFormData({ name: "", detail: "" });
      await fetchInstructors();
    } else {
      showToast.error("Failed to save instructor");
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCSV(true);
    const { success, data } = await instructorApi.createFromCSV(file);

    if (success && data) {
      const result = data as unknown as {
        data: {
          total: number;
          successful: number;
          failed: number;
          successList: Array<{ id: string; name: string }>;
          failedList: Array<{ name: string; reason: string }>;
        };
      };
      const bulkData = result.data;
      showToast.success(
        `Uploaded ${bulkData.successful} out of ${bulkData.total} instructors`,
      );
      if (bulkData.failed > 0) {
        console.warn("Failed instructors:", bulkData.failedList);
      }
      await fetchInstructors();
    } else {
      showToast.error("Failed to upload CSV");
    }
    setUploadingCSV(false);
    e.target.value = "";
  };

  const handleEdit = (instructor: Instructor) => {
    setFormData({
      name: instructor.name,
      detail: instructor.detail,
    });
    setEditingId(instructor.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this instructor?")) return;

    const { success } = await instructorApi.delete(id);
    if (success) {
      showToast.success("Instructor deleted successfully!");
      await fetchInstructors();
    } else {
      showToast.error("Failed to delete instructor");
    }
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

        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Heading size="6">Manage Instructors</Heading>
            <Flex gap="2">
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ display: "none" }}
                  disabled={uploadingCSV}
                />
                <Button
                  variant="soft"
                  disabled={uploadingCSV}
                  style={{ cursor: "pointer" }}
                  asChild
                >
                  <span>
                    <Upload size={16} />
                    {uploadingCSV ? "Uploading..." : "Upload CSV"}
                  </span>
                </Button>
              </label>
              <Button onClick={() => setIsCreating(true)}>
                <Plus size={16} />
                Add Instructor
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Create/Edit Form */}
        {isCreating && (
          <Card>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4" p="4">
                <Heading size="5">
                  {editingId ? "Edit Instructor" : "Create New Instructor"}
                </Heading>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    Name *
                  </Text>
                  <TextField.Root
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter instructor name"
                    required
                  />
                </Flex>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    Details / Bio *
                  </Text>
                  <TextArea
                    value={formData.detail}
                    onChange={(e) =>
                      setFormData({ ...formData, detail: e.target.value })
                    }
                    placeholder="Enter instructor details and biography"
                    rows={4}
                    required
                  />
                </Flex>

                <Flex gap="2" justify="end">
                  <Button
                    type="button"
                    variant="soft"
                    color="gray"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setFormData({ name: "", detail: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Update Instructor" : "Create Instructor"}
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Card>
        )}

        {/* Instructors List */}
        <Card>
          <Flex direction="column" gap="4" p="4">
            {loading && <Text>Loading instructors...</Text>}

            {!loading && instructors.length === 0 && (
              <Text color="gray">
                No instructors yet. Create one to get started.
              </Text>
            )}

            {!loading && instructors.length > 0 && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell
                      style={{ width: "60px" }}
                    ></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{ width: "100px" }}>
                      Actions
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {instructors.map((instructor) => (
                    <Table.Row key={instructor.id}>
                      <Table.Cell>
                        <Flex
                          align="center"
                          justify="center"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "var(--accent-4)",
                          }}
                        >
                          <User size={20} />
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        <Text weight="bold">{instructor.name}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="2" color="gray">
                          {instructor.detail.length > 100
                            ? `${instructor.detail.substring(0, 100)}...`
                            : instructor.detail}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Flex gap="2">
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="blue"
                            onClick={() => handleEdit(instructor)}
                          >
                            <Edit2 size={16} />
                          </IconButton>
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="red"
                            onClick={() => handleDelete(instructor.id)}
                          >
                            <Trash2 size={16} />
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
