"use client";

import { useState, useEffect } from "react";
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
} from "@radix-ui/themes";
import { Plus, Upload, Edit2, Trash2, User } from "lucide-react";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { instructorApi } from "@/services/api.service";
import { showToast } from "@/lib/toast.config";

interface Instructor {
  id: string;
  name: string;
  detail: string;
}

export default function InstructorsPage() {
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
    const fetchData = async () => {
      await fetchInstructors();
    };
    fetchData();
  }, []);

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

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: "", detail: "" });
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        <Card>
          <Flex justify="between" align="center" p="4">
            <Heading size="6">Manage Instructors</Heading>
            <Flex gap="3">
              <Button
                onClick={() => document.getElementById("csv-upload")?.click()}
                variant="soft"
                disabled={uploadingCSV}
              >
                <Upload size={16} />
                {uploadingCSV ? "Uploading..." : "Upload CSV"}
              </Button>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleCSVUpload}
              />
              <Button
                onClick={() => (isCreating ? resetForm() : setIsCreating(true))}
              >
                <Plus size={16} />
                {isCreating ? "Cancel" : "Create New Instructor"}
              </Button>
            </Flex>
          </Flex>
        </Card>

        {isCreating && (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="5">
                {editingId ? "Edit Instructor" : "Create New Instructor"}
              </Heading>
              <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="4">
                  <div>
                    <Text as="label" size="2" weight="medium">
                      Name
                    </Text>
                    <TextField.Root
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Text as="label" size="2" weight="medium">
                      Detail
                    </Text>
                    <TextArea
                      value={formData.detail}
                      onChange={(e) =>
                        setFormData({ ...formData, detail: e.target.value })
                      }
                      placeholder="Enter instructor bio, qualifications, experience, etc."
                      required
                      rows={4}
                    />
                  </div>

                  <Button type="submit">
                    {editingId ? "Update Instructor" : "Create Instructor"}
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Card>
        )}

        <Card>
          <Flex direction="column" gap="4" p="4">
            <Heading size="5">All Instructors ({instructors.length})</Heading>
            {loading ? (
              <Text
                size="2"
                color="gray"
                align="center"
                style={{ padding: "2rem 0" }}
              >
                Loading instructors...
              </Text>
            ) : instructors.length === 0 ? (
              <Text
                size="2"
                color="gray"
                align="center"
                style={{ padding: "2rem 0" }}
              >
                No instructors yet. Create your first instructor!
              </Text>
            ) : (
              <Flex direction="column" gap="3">
                {instructors.map((instructor) => (
                  <Card key={instructor.id}>
                    <Flex justify="between" align="start" p="3">
                      <Flex direction="column" gap="2" style={{ flex: 1 }}>
                        <Flex align="center" gap="2">
                          <User size={16} />
                          <Heading size="4">{instructor.name}</Heading>
                        </Flex>
                        <Text size="2" color="gray">
                          {instructor.detail}
                        </Text>
                      </Flex>
                      <Flex gap="2">
                        <IconButton
                          onClick={() => handleEdit(instructor)}
                          variant="soft"
                          color="blue"
                        >
                          <Edit2 size={16} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(instructor.id)}
                          variant="soft"
                          color="red"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
