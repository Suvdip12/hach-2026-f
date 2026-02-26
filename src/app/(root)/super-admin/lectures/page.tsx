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
  Link,
  IconButton,
} from "@radix-ui/themes";
import { Plus, Upload, Edit2, Trash2 } from "lucide-react";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { lectureApi } from "@/services/api.service";
import { showToast } from "@/lib/toast.config";

interface Lecture {
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingCSV, setUploadingCSV] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
  });

  const fetchLectures = async () => {
    setLoading(true);
    const { success, data } = await lectureApi.getAll();
    if (success && data) {
      const responseData = data as unknown as { data: Lecture[] };
      setLectures(responseData.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLectures();
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { success } = editingId
      ? await lectureApi.update(editingId, formData)
      : await lectureApi.create(formData);

    if (success) {
      showToast.success(
        `Lecture ${editingId ? "updated" : "created"} successfully!`,
      );
      setIsCreating(false);
      setEditingId(null);
      setFormData({ title: "", description: "", url: "" });
      await fetchLectures();
    } else {
      showToast.error("Failed to save lecture");
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCSV(true);
    const { success, data } = await lectureApi.createFromCSV(file);

    if (success && data) {
      const result = data as unknown as {
        data: {
          total: number;
          successful: number;
          failed: number;
          successList: Array<{ id: string; title: string }>;
          failedList: Array<{ title: string; reason: string }>;
        };
      };
      const bulkData = result.data;
      showToast.success(
        `Uploaded ${bulkData.successful} out of ${bulkData.total} lectures`,
      );
      if (bulkData.failed > 0) {
        console.warn("Failed lectures:", bulkData.failedList);
      }
      await fetchLectures();
    } else {
      showToast.error("Failed to upload CSV");
    }
    setUploadingCSV(false);
    e.target.value = "";
  };

  const handleEdit = (lecture: Lecture) => {
    setFormData({
      title: lecture.title,
      description: lecture.description,
      url: lecture.url,
    });
    setEditingId(lecture.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;

    const { success } = await lectureApi.delete(id);

    if (success) {
      showToast.success("Lecture deleted successfully!");
      await fetchLectures();
    } else {
      showToast.error("Failed to delete lecture");
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ title: "", description: "", url: "" });
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        <Card>
          <Flex justify="between" align="center" p="4">
            <Heading size="6">Manage Lectures</Heading>
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
                hidden
                onChange={handleCSVUpload}
              />
              <Button
                onClick={() => (isCreating ? resetForm() : setIsCreating(true))}
              >
                <Plus size={16} />
                {isCreating ? "Cancel" : "Create New Lecture"}
              </Button>
            </Flex>
          </Flex>
        </Card>

        {isCreating && (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="5">
                {editingId ? "Edit Lecture" : "Create New Lecture"}
              </Heading>
              <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="4">
                  <TextField.Root
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />

                  <TextArea
                    placeholder="Description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />

                  <TextField.Root
                    placeholder="https://..."
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
                  />

                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Update Lecture"
                        : "Create Lecture"}
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Card>
        )}

        <Card>
          <Flex direction="column" gap="4" p="4">
            <Heading size="5">All Lectures ({lectures.length})</Heading>

            {loading ? (
              <Text align="center" color="gray">
                Loading lectures...
              </Text>
            ) : lectures.length === 0 ? (
              <Text align="center" color="gray">
                No lectures yet.
              </Text>
            ) : (
              lectures.map((lecture) => (
                <Card key={lecture.id}>
                  <Flex justify="between" align="start" p="3">
                    <Flex direction="column" gap="2">
                      <Heading size="4">{lecture.title}</Heading>
                      <Text size="2" color="gray">
                        {lecture.description}
                      </Text>
                      <Link href={lecture.url} target="_blank">
                        View Video →
                      </Link>
                    </Flex>
                    <Flex gap="2">
                      <IconButton
                        onClick={() => handleEdit(lecture)}
                        variant="soft"
                      >
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(lecture.id)}
                        variant="soft"
                        color="red"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Flex>
                  </Flex>
                </Card>
              ))
            )}
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
