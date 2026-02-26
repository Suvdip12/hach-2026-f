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
  adminApi,
  schoolApi,
  extractArrayData,
  type Admin,
  type School,
} from "@/services/api.service";
import { Trash2Icon, EditIcon, PlusIcon, FilterIcon } from "lucide-react";
import toast from "react-hot-toast";

const CreateAdminForm = dynamic(
  () => import("@/component/organisms/CreateAdminFormEnhanced"),
  { ssr: false },
);

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [filterSchoolId, setFilterSchoolId] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    schoolId: "",
    image: "",
  });

  useEffect(() => {
    fetchSchools();
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAdmins();
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

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res =
        filterSchoolId !== "all"
          ? await adminApi.getBySchool(filterSchoolId)
          : await adminApi.getAll();
      setAdmins(extractArrayData(res));
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (
      !editingAdmin ||
      !formData.name ||
      !formData.phoneNumber ||
      !formData.schoolId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }

    if (formData.image && !/^https?:\/\/.+/.test(formData.image)) {
      toast.error("Please enter a valid image URL");
      return;
    }

    try {
      setLoading(true);
      const { success, error } = await adminApi.update(editingAdmin.id, {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        schoolId: formData.schoolId,
        image: formData.image || undefined,
      });

      if (success) {
        toast.success("Admin updated successfully");
        setIsEditDialogOpen(false);
        resetForm();
        fetchAdmins();
      } else {
        toast.error(error || "Failed to update admin");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update admin");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      setLoading(true);
      await adminApi.delete(id);
      toast.success("Admin deleted successfully");
      fetchAdmins();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      phoneNumber: admin.phoneNumber?.toString() || "",
      schoolId: admin.schoolId || "",
      image: admin.image || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      schoolId: "",
      image: "",
    });
    setEditingAdmin(null);
  };

  const getSchoolName = (schoolId: string) =>
    schools.find((s) => s.id === schoolId)?.schoolName || "Unknown School";

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />

      <Flex direction="column" gap="6">
        {/* CREATE ADMIN */}
        <Dialog.Root
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Create New Admin</Dialog.Title>
            <CreateAdminForm
              onSuccess={fetchAdmins}
              onClose={() => setIsCreateDialogOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Root>

        {/* EDIT ADMIN */}
        <Dialog.Root
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>Edit Admin</Dialog.Title>

            <Flex direction="column" gap="4" mt="4">
              <label>
                <Text weight="bold">Name*</Text>
                <TextField.Root
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </label>

              <label>
                <Text weight="bold">Phone Number*</Text>
                <TextField.Root
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    if (v.length <= 10) {
                      setFormData({ ...formData, phoneNumber: v });
                    }
                  }}
                />
              </label>

              <label>
                <Text weight="bold">Image URL</Text>
                <TextField.Root
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </label>

              <label>
                <Text weight="bold">School*</Text>
                <Select.Root
                  value={formData.schoolId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, schoolId: v })
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    {schools.map((s) => (
                      <Select.Item key={s.id} value={s.id}>
                        {s.schoolName}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </label>

              <Flex justify="end" gap="3">
                <Dialog.Close>
                  <Button variant="soft">Cancel</Button>
                </Dialog.Close>
                <Button onClick={handleEdit} disabled={loading}>
                  Update Admin
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* TABLE */}
        <Card>
          <Flex direction="column" gap="4" p="4">
            <Flex justify="between" align="center">
              <Heading size="6">Manage Admins</Heading>

              <Flex gap="2">
                <Select.Root
                  value={filterSchoolId}
                  onValueChange={setFilterSchoolId}
                >
                  <Select.Trigger>
                    <FilterIcon size={16} />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="all">All Schools</Select.Item>
                    {schools.map((s) => (
                      <Select.Item key={s.id} value={s.id}>
                        {s.schoolName}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusIcon size={16} />
                  Create Admin
                </Button>
              </Flex>
            </Flex>

            {filterSchoolId !== "all" && (
              <Badge>Filtered: {getSchoolName(filterSchoolId)}</Badge>
            )}

            {loading && <Text>Loading...</Text>}
            {!loading && admins.length === 0 && (
              <Text color="gray">No admins yet.</Text>
            )}

            {!loading && admins.length > 0 && (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>School</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {admins.map((a) => (
                    <Table.Row key={a.id}>
                      <Table.Cell>{a.name}</Table.Cell>
                      <Table.Cell>{a.email}</Table.Cell>
                      <Table.Cell>{a.phoneNumber || "N/A"}</Table.Cell>
                      <Table.Cell>{getSchoolName(a.schoolId || "")}</Table.Cell>
                      <Table.Cell>
                        <Flex gap="2">
                          <IconButton
                            variant="ghost"
                            onClick={() => openEditDialog(a)}
                          >
                            <EditIcon size={16} />
                          </IconButton>
                          <IconButton
                            variant="ghost"
                            color="red"
                            onClick={() => handleDelete(a.id)}
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
