"use client";

import {
  Container,
  Heading,
  Card,
  Flex,
  Table,
  Text,
  Button,
  Dialog,
  TextField,
  Select,
  Badge,
  IconButton,
  Tabs,
} from "@radix-ui/themes";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { useState, useEffect } from "react";
import {
  assignmentApi,
  lectureApi,
  questionApi,
  extractData,
  extractArrayData,
  type Assignment,
  type Lecture,
  type Question,
} from "@/services/api.service";
import {
  ClipboardList,
  PlusIcon,
  Trash2Icon,
  EditIcon,
  BookOpen,
  Code,
  FileText,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null,
  );
  const [selectedLectureFilter, setSelectedLectureFilter] =
    useState<string>("all");
  const [formData, setFormData] = useState({
    lectureId: "",
    qnaId: "",
    difficultyLevel: "easy" as "easy" | "medium" | "hard",
    qnaType: "mcq" as "mcq" | "coding" | "paragraph" | "blockly" | "blockly",
    assignmentLevel: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLectureFilter && selectedLectureFilter !== "all") {
      fetchAssignmentsByLecture(selectedLectureFilter);
    } else {
      fetchAllAssignments();
    }
  }, [selectedLectureFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lecturesRes, questionsRes] = await Promise.all([
        lectureApi.getAll(),
        questionApi.getAll(),
      ]);
      setLectures(extractArrayData(lecturesRes));
      setQuestions(extractArrayData(questionsRes));
      await fetchAllAssignments();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAssignments = async () => {
    try {
      const res = await assignmentApi.getAll();
      const data = extractArrayData(res);
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchAssignmentsByLecture = async (lectureId: string) => {
    try {
      setLoading(true);
      const res = await assignmentApi.getByLecture(lectureId);
      const data = extractData(res);
      if (data && "assignments" in data) {
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.lectureId || !formData.qnaId) {
      toast.error("Please select a lecture and question");
      return;
    }

    try {
      setLoading(true);
      await assignmentApi.create(formData);
      toast.success("Assignment created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingAssignment) return;

    try {
      setLoading(true);
      await assignmentApi.update(editingAssignment.id, {
        difficultyLevel: formData.difficultyLevel,
        assignmentLevel: formData.assignmentLevel,
      });
      toast.success("Assignment updated successfully");
      setIsEditDialogOpen(false);
      setEditingAssignment(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      setLoading(true);
      await assignmentApi.delete(id);
      toast.success("Assignment deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      lectureId: assignment.lectureId,
      qnaId: assignment.qnaId,
      difficultyLevel: assignment.difficultyLevel,
      qnaType: assignment.qnaType,
      assignmentLevel: assignment.assignmentLevel,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      lectureId: "",
      qnaId: "",
      difficultyLevel: "easy",
      qnaType: "mcq",
      assignmentLevel: 1,
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "green";
      case "medium":
        return "yellow";
      case "hard":
        return "red";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return <HelpCircle size={14} />;
      case "coding":
        return <Code size={14} />;
      case "paragraph":
        return <FileText size={14} />;
      default:
        return <BookOpen size={14} />;
    }
  };

  const filteredQuestions = questions.filter(
    (q) => q.qnaType === formData.qnaType,
  );

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <ClipboardList size={24} />
              <Heading size="6">Assignment Management</Heading>
            </Flex>
            <Flex gap="3" align="center">
              <Badge size="2" color="blue">
                {assignments.length} Assignments
              </Badge>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusIcon size={16} /> Add Assignment
              </Button>
            </Flex>
          </Flex>
        </Card>

        {/* Filter by Lecture */}
        <Card>
          <Flex p="4" gap="3" align="center">
            <Text weight="medium">Filter by Lecture:</Text>
            <Select.Root
              value={selectedLectureFilter}
              onValueChange={setSelectedLectureFilter}
            >
              <Select.Trigger placeholder="All Lectures" />
              <Select.Content>
                <Select.Item value="all">All Lectures</Select.Item>
                {lectures.map((lecture) => (
                  <Select.Item key={lecture.id} value={lecture.id}>
                    {lecture.title}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        {/* Assignments Table */}
        <Card>
          {loading ? (
            <Flex justify="center" align="center" p="6">
              <Text>Loading...</Text>
            </Flex>
          ) : (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Level</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Lecture</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Difficulty</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    Actions
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {assignments.map((assignment) => (
                  <Table.Row key={assignment.id}>
                    <Table.Cell>
                      <Badge variant="soft" color="blue">
                        Level {assignment.assignmentLevel}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text weight="medium">
                        {assignment.lectureTitle ||
                          lectures.find((l) => l.id === assignment.lectureId)
                            ?.title ||
                          "Unknown"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        {getTypeIcon(assignment.qnaType)}
                        <Text>{assignment.qnaType.toUpperCase()}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={getDifficultyColor(assignment.difficultyLevel)}
                      >
                        {assignment.difficultyLevel}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <Flex gap="2" justify="center">
                        <IconButton
                          variant="soft"
                          color="blue"
                          onClick={() => openEditDialog(assignment)}
                        >
                          <EditIcon size={14} />
                        </IconButton>
                        <IconButton
                          variant="soft"
                          color="red"
                          onClick={() => handleDelete(assignment.id)}
                        >
                          <Trash2Icon size={14} />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}

          {!loading && assignments.length === 0 && (
            <Flex justify="center" align="center" p="6">
              <Text color="gray">No assignments found</Text>
            </Flex>
          )}
        </Card>

        {/* Create Dialog */}
        <Dialog.Root
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <Dialog.Content style={{ maxWidth: 500 }}>
            <Dialog.Title>Create New Assignment</Dialog.Title>
            <Flex direction="column" gap="4" mt="4">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Lecture
                </Text>
                <Select.Root
                  value={formData.lectureId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, lectureId: value })
                  }
                >
                  <Select.Trigger placeholder="Select a lecture" />
                  <Select.Content>
                    {lectures.map((lecture) => (
                      <Select.Item key={lecture.id} value={lecture.id}>
                        {lecture.title}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Question Type
                </Text>
                <Tabs.Root
                  value={formData.qnaType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      qnaType: value as
                        | "mcq"
                        | "coding"
                        | "paragraph"
                        | "blockly",
                      qnaId: "",
                    })
                  }
                >
                  <Tabs.List>
                    <Tabs.Trigger value="mcq">MCQ</Tabs.Trigger>
                    <Tabs.Trigger value="coding">Coding</Tabs.Trigger>
                    <Tabs.Trigger value="paragraph">Paragraph</Tabs.Trigger>
                  </Tabs.List>
                </Tabs.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Question
                </Text>
                <Select.Root
                  value={formData.qnaId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, qnaId: value })
                  }
                >
                  <Select.Trigger placeholder="Select a question" />
                  <Select.Content>
                    {filteredQuestions.map((question) => (
                      <Select.Item key={question.qnaId} value={question.qnaId}>
                        {question.question.substring(0, 50)}...
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Difficulty Level
                </Text>
                <Select.Root
                  value={formData.difficultyLevel}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      difficultyLevel: value as "easy" | "medium" | "hard",
                    })
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="easy">Easy</Select.Item>
                    <Select.Item value="medium">Medium</Select.Item>
                    <Select.Item value="hard">Hard</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Assignment Level
                </Text>
                <TextField.Root
                  type="number"
                  min="1"
                  value={formData.assignmentLevel.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignmentLevel: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </Flex>
            </Flex>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleCreate} disabled={loading}>
                Create Assignment
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Edit Dialog */}
        <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <Dialog.Content style={{ maxWidth: 400 }}>
            <Dialog.Title>Edit Assignment</Dialog.Title>
            <Flex direction="column" gap="4" mt="4">
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Difficulty Level
                </Text>
                <Select.Root
                  value={formData.difficultyLevel}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      difficultyLevel: value as "easy" | "medium" | "hard",
                    })
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="easy">Easy</Select.Item>
                    <Select.Item value="medium">Medium</Select.Item>
                    <Select.Item value="hard">Hard</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Assignment Level
                </Text>
                <TextField.Root
                  type="number"
                  min="1"
                  value={formData.assignmentLevel.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignmentLevel: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </Flex>
            </Flex>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleEdit} disabled={loading}>
                Save Changes
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Container>
  );
}
