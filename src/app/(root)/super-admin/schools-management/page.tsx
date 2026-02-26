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
  IconButton,
} from "@radix-ui/themes";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  schoolApi,
  extractArrayData,
  type School,
} from "@/services/api.service";
import { Trash2Icon, EditIcon, PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

const CreateSchoolForm = dynamic(
  () => import("@/component/organisms/CreateSchoolFormEnhanced"),
  { ssr: false },
);

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    schoolName: "",
    domain: "",
    schoolEmail: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await schoolApi.getAll();
      setSchools(extractArrayData(res));
    } catch (error) {
      console.error("Error fetching schools:", error);
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingSchool || !formData.schoolName || !formData.schoolEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await schoolApi.update(editingSchool.id, formData);
      toast.success("School updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      fetchSchools();
    } catch (error: unknown) {
      console.error("Error updating school:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "Failed to update school");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this school? This will also delete all associated admins, students, and their accounts.",
      )
    )
      return;

    try {
      setLoading(true);
      await schoolApi.delete(id);
      toast.success("School deleted successfully");
      fetchSchools();
    } catch (error: unknown) {
      console.error("Error deleting school:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      toast.error(errorMessage || "Failed to delete school");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    setFormData({
      schoolName: school.schoolName,
      domain: school.domain, // Read-only, not editable
      schoolEmail: school.schoolEmail || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      schoolName: "",
      domain: "", // Kept for consistency but not editable
      schoolEmail: "",
    });
    setEditingSchool(null);
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        {/* Create School Dialog */}
        <Dialog.Root
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Create New School</Dialog.Title>
            <CreateSchoolForm />
          </Dialog.Content>
        </Dialog.Root>

        {/* Edit School Dialog */}
        <Dialog.Root
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Edit School</Dialog.Title>
            <Flex direction="column" gap="4" mt="4">
              <label>
                <Text size="2" weight="bold">
                  School Name*
                </Text>
                <TextField.Root
                  value={formData.schoolName}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolName: e.target.value })
                  }
                  placeholder="Enter school name"
                />
              </label>

              <label>
                <Text size="2" weight="bold">
                  School Domain (Read-only)
                </Text>
                <TextField.Root
                  value={formData.domain}
                  readOnly
                  disabled
                  placeholder="Domain cannot be changed"
                />
                <Text size="1" color="gray">
                  Domain is set during creation and cannot be modified
                </Text>
              </label>

              <label>
                <Text size="2" weight="bold">
                  School Email*
                </Text>
                <TextField.Root
                  type="email"
                  value={formData.schoolEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolEmail: e.target.value })
                  }
                  placeholder="Enter school email"
                />
              </label>

              <Flex gap="3" justify="end" mt="4">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button onClick={handleEdit} disabled={loading}>
                  Update School
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Main Content */}
        <Card>
          <Flex direction="column" gap="4" p="4">
            <Flex justify="between" align="center">
              <Heading size="6">Manage Schools</Heading>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusIcon size={16} />
                Create School
              </Button>
            </Flex>

            {loading && <Text>Loading...</Text>}

            {!loading && schools.length === 0 && (
              <Text color="gray">
                No schools yet. Create one to get started.
              </Text>
            )}

            {!loading && schools.length > 0 && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>School Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Domain</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {schools.map((school) => (
                    <Table.Row key={school.id}>
                      <Table.Cell>{school.schoolName}</Table.Cell>
                      <Table.Cell>{school.domain}</Table.Cell>
                      <Table.Cell>{school.schoolEmail || "N/A"}</Table.Cell>
                      <Table.Cell>
                        <Flex gap="2">
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="green"
                            onClick={() => openEditDialog(school)}
                          >
                            <EditIcon size={16} />
                          </IconButton>
                          <IconButton
                            size="1"
                            variant="ghost"
                            color="red"
                            onClick={() => handleDelete(school.id)}
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
