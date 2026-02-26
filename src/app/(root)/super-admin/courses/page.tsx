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
  Badge,
} from "@radix-ui/themes";
import { Plus, Upload, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { courseApi } from "@/services/api.service";
import { showToast } from "@/lib/toast.config";

interface Course {
  id: string;
  courseName: string;
  courseDetail: string;
  courseImage: string;
  link: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingCSV, setUploadingCSV] = useState(false);

  const [formData, setFormData] = useState({
    courseName: "",
    courseDetail: "",
    courseImage: "",
  });
  const [links, setLinks] = useState<string[]>([""]);

  const fetchCourses = async () => {
    setLoading(true);
    const { success, data } = await courseApi.getAll();
    if (success && data) {
      const responseData = data as unknown as { data: Course[] };
      setCourses(responseData.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCourses();
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validLinks = links.filter((link) => link.trim() !== "");
    if (validLinks.length === 0) {
      showToast.error("At least one valid link is required");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      link: validLinks,
    };

    const { success } = editingId
      ? await courseApi.update(editingId, payload)
      : await courseApi.create(payload);

    if (success) {
      showToast.success(
        `Course ${editingId ? "updated" : "created"} successfully!`,
      );
      setIsCreating(false);
      setEditingId(null);
      setFormData({
        courseName: "",
        courseDetail: "",
        courseImage: "",
      });
      setLinks([""]);
      await fetchCourses();
    } else {
      showToast.error("Failed to save course");
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCSV(true);
    const { success, data } = await courseApi.createFromCSV(file);

    if (success && data) {
      const result = data as unknown as {
        data: {
          total: number;
          successful: number;
          failed: number;
          successList: Array<{ id: string; courseName: string }>;
          failedList: Array<{ courseName: string; reason: string }>;
        };
      };
      const bulkData = result.data;
      showToast.success(
        `Uploaded ${bulkData.successful} out of ${bulkData.total} courses`,
      );
      if (bulkData.failed > 0) {
        console.warn("Failed courses:", bulkData.failedList);
      }
      await fetchCourses();
    } else {
      showToast.error("Failed to upload CSV");
    }

    setUploadingCSV(false);
    e.target.value = "";
  };

  const handleEdit = (course: Course) => {
    setFormData({
      courseName: course.courseName,
      courseDetail: course.courseDetail,
      courseImage: course.courseImage,
    });

    setLinks(course.link && course.link.length > 0 ? course.link : [""]);

    setEditingId(course.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    const { success } = await courseApi.delete(id);

    if (success) {
      showToast.success("Course deleted successfully!");
      await fetchCourses();
    } else {
      showToast.error("Failed to delete course");
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      courseName: "",
      courseDetail: "",
      courseImage: "",
    });
    setLinks([""]);
  };

  const addLinkField = () => setLinks([...links, ""]);
  const removeLinkField = (index: number) =>
    links.length > 1 && setLinks(links.filter((_, i) => i !== index));
  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />

      <Flex direction="column" gap="6">
        <Card>
          <Flex justify="between" align="center" p="4">
            <Heading size="6">Manage Courses</Heading>
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
                {isCreating ? "Cancel" : "Create New Course"}
              </Button>
            </Flex>
          </Flex>
        </Card>

        {isCreating && (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="5">
                {editingId ? "Edit Course" : "Create New Course"}
              </Heading>

              <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="4">
                  <TextField.Root
                    value={formData.courseName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseName: e.target.value,
                      })
                    }
                    placeholder="Course Name"
                    required
                  />

                  <TextArea
                    value={formData.courseDetail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseDetail: e.target.value,
                      })
                    }
                    placeholder="Course Detail"
                    rows={4}
                    required
                  />

                  <TextField.Root
                    type="url"
                    value={formData.courseImage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseImage: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    required
                  />

                  <Flex direction="column" gap="2">
                    {links.map((link, i) => (
                      <Flex key={i} gap="2">
                        <TextField.Root
                          type="url"
                          value={link}
                          onChange={(e) => updateLink(i, e.target.value)}
                          placeholder="https://example.com"
                        />
                        <IconButton
                          type="button"
                          color="red"
                          variant="soft"
                          disabled={links.length === 1}
                          onClick={() => removeLinkField(i)}
                        >
                          ✕
                        </IconButton>
                      </Flex>
                    ))}
                    <Button
                      type="button"
                      size="1"
                      variant="soft"
                      onClick={addLinkField}
                    >
                      + Add Link
                    </Button>
                  </Flex>

                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Update Course"
                        : "Create Course"}
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Card>
        )}

        <Card>
          <Flex direction="column" gap="4" p="4">
            <Heading size="5">All Courses ({courses.length})</Heading>

            {loading ? (
              <Text align="center" color="gray">
                Loading courses...
              </Text>
            ) : courses.length === 0 ? (
              <Text align="center" color="gray">
                No courses yet.
              </Text>
            ) : (
              courses.map((course) => (
                <Card key={course.id}>
                  <Flex justify="between" p="3">
                    <Flex direction="column" gap="2">
                      <Flex align="center" gap="2">
                        <ImageIcon size={16} />
                        <Heading size="4">{course.courseName}</Heading>
                      </Flex>
                      <Text size="2" color="gray">
                        {course.courseDetail}
                      </Text>
                      {course.link?.length > 0 && (
                        <Badge variant="soft" color="blue">
                          {course.link.length} link(s)
                        </Badge>
                      )}
                    </Flex>
                    <Flex gap="2">
                      <IconButton
                        variant="soft"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton
                        variant="soft"
                        color="red"
                        onClick={() => handleDelete(course.id)}
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
