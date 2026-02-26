"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Container,
  Heading,
  Card,
  Flex,
  Button,
  TextArea,
  TextField,
  Text,
  Grid,
  IconButton,
  Badge,
} from "@radix-ui/themes";
import {
  Plus,
  Upload,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { courseApi } from "@/services/api.service";
import { showToast } from "@/lib/toast.config";
import { getServerSession } from "@/util/auth/server";

interface Course {
  id: string;
  courseName: string;
  courseDetail: string;
  courseImage: string;
  link: string[];
}

interface UserWithRole {
  id: string;
  role?: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();
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
    let isMounted = true;

    const initialize = async () => {
      try {
        const sessionData = await getServerSession();
        if (!sessionData?.user) {
          router.push("/controller");
          return;
        }

        const user = sessionData.user as UserWithRole;
        // Only superAdmin can manage courses
        if (user.role !== "admin") {
          router.push("/controller/dashboard");
          return;
        }

        // Fetch courses after session check passes
        if (isMounted) {
          setLoading(true);
          const { success, data } = await courseApi.getAll();
          if (success && data && isMounted) {
            const responseData = data as unknown as { data: Course[] };
            setCourses(responseData.data || []);
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

    // Filter out empty links
    const validLinks = links.filter((link) => link.trim() !== "");

    if (validLinks.length === 0) {
      showToast.error("At least one valid link is required");
      return;
    }

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
        };
      };
      showToast.success(
        `Uploaded ${result.data.successful} out of ${result.data.total} courses`,
      );
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

  const addLinkEntry = () => {
    setLinks([...links, ""]);
  };

  const updateLinkEntry = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const removeLinkEntry = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
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
            <Heading size="6">Manage Courses</Heading>
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
                Add Course
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
                  {editingId ? "Edit Course" : "Create New Course"}
                </Heading>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    Course Name *
                  </Text>
                  <TextField.Root
                    value={formData.courseName}
                    onChange={(e) =>
                      setFormData({ ...formData, courseName: e.target.value })
                    }
                    placeholder="Enter course name"
                    required
                  />
                </Flex>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    Course Description *
                  </Text>
                  <TextArea
                    value={formData.courseDetail}
                    onChange={(e) =>
                      setFormData({ ...formData, courseDetail: e.target.value })
                    }
                    placeholder="Enter course description"
                    rows={4}
                    required
                  />
                </Flex>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    Course Image URL *
                  </Text>
                  <TextField.Root
                    value={formData.courseImage}
                    onChange={(e) =>
                      setFormData({ ...formData, courseImage: e.target.value })
                    }
                    placeholder="Enter image URL"
                    required
                  />
                </Flex>

                <Flex direction="column" gap="2">
                  <Flex justify="between" align="center">
                    <Text size="2" weight="bold">
                      Links (optional)
                    </Text>
                    <Button
                      type="button"
                      variant="soft"
                      size="1"
                      onClick={addLinkEntry}
                    >
                      <Plus size={14} />
                      Add Link
                    </Button>
                  </Flex>
                  {links.map((link, index) => (
                    <Flex key={index} gap="2" align="center">
                      <TextField.Root
                        type="url"
                        value={link}
                        onChange={(e) => updateLinkEntry(index, e.target.value)}
                        placeholder="https://example.com"
                        style={{ flex: 1 }}
                      />
                      {links.length > 1 && (
                        <IconButton
                          type="button"
                          variant="ghost"
                          color="red"
                          onClick={() => removeLinkEntry(index)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </Flex>
                  ))}
                </Flex>

                <Flex gap="2" justify="end">
                  <Button
                    type="button"
                    variant="soft"
                    color="gray"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      setFormData({
                        courseName: "",
                        courseDetail: "",
                        courseImage: "",
                      });
                      setLinks([""]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Update Course" : "Create Course"}
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Card>
        )}

        {/* Courses List */}
        <Card>
          <Flex direction="column" gap="4" p="4">
            {loading && <Text>Loading courses...</Text>}

            {!loading && courses.length === 0 && (
              <Text color="gray">
                No courses yet. Create one to get started.
              </Text>
            )}

            {!loading && courses.length > 0 && (
              <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4">
                {courses.map((course) => (
                  <Card key={course.id}>
                    <Flex direction="column" gap="3" p="3">
                      {course.courseImage ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "150px",
                          }}
                        >
                          <Image
                            src={course.courseImage}
                            alt={course.courseName}
                            fill
                            style={{
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            unoptimized
                          />
                        </div>
                      ) : (
                        <Flex
                          align="center"
                          justify="center"
                          style={{
                            width: "100%",
                            height: "150px",
                            background: "var(--gray-3)",
                            borderRadius: "8px",
                          }}
                        >
                          <ImageIcon size={48} color="var(--gray-8)" />
                        </Flex>
                      )}
                      <Heading size="4">{course.courseName}</Heading>
                      <Text size="2" color="gray" style={{ lineClamp: 2 }}>
                        {course.courseDetail.substring(0, 100)}...
                      </Text>
                      {Object.keys(course.link || {}).length > 0 && (
                        <Badge color="blue">
                          {Object.keys(course.link).length} link(s)
                        </Badge>
                      )}
                      <Flex gap="2" justify="end">
                        <IconButton
                          variant="soft"
                          color="blue"
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
                ))}
              </Grid>
            )}
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
