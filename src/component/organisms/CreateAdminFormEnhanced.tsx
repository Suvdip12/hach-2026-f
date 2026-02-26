"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  TextField,
  Button as RadixButton,
  Tabs,
  Select,
} from "@radix-ui/themes";
import { adminApi, schoolApi } from "@/services/api.service";

export default function CreateAdminFormEnhanced({
  onSuccess,
  onClose,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const [activeTab, setActiveTab] = useState("single");
  const [schools, setSchools] = useState<
    Array<{ id: string; schoolName?: string; name?: string }>
  >([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Single admin form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "admin",
    schoolId: "",
  });

  // CSV form state
  const [file, setFile] = useState<File | null>(null);
  const [csvSchoolId, setCsvSchoolId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const { success, data, error } = await schoolApi.getAll();
        if (success && data) {
          const schoolsData = "data" in data ? data.data : data;
          setSchools(Array.isArray(schoolsData) ? schoolsData : []);
        } else {
          setMessage({
            type: "error",
            text: error || "Failed to load schools",
          });
        }
      } catch {
        setMessage({
          type: "error",
          text: "Network error loading schools",
        });
      }
      setLoadingSchools(false);
    };
    fetchSchools();
  }, []);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate required fields
    if (!formData.schoolId) {
      setMessage({
        type: "error",
        text: "Please select a school",
      });
      setLoading(false);
      return;
    }

    if (!formData.role) {
      setMessage({
        type: "error",
        text: "Please select a role",
      });
      setLoading(false);
      return;
    }

    const { success, error } = await adminApi.create(formData);

    if (success) {
      setMessage({
        type: "success",
        text: "Admin created successfully! Password sent via email.",
      });
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        role: "admin",
        schoolId: "",
      });
      onSuccess?.();
      onClose?.();
    } else {
      setMessage({
        type: "error",
        text: error || "Failed to create admin",
      });
    }

    setLoading(false);
  };

  const handleCSVSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!file) {
      setMessage({ type: "error", text: "Please select a CSV file" });
      setLoading(false);
      return;
    }

    if (!csvSchoolId) {
      setMessage({ type: "error", text: "Please select a school" });
      setLoading(false);
      return;
    }

    const { success, data, error } = await adminApi.createFromCSV(
      file,
      csvSchoolId,
    );

    if (success && data) {
      // Backend wraps response in { response, message, data } structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = (data as any).data || data;
      const successCount = responseData.successCount ?? 0;
      const failedCount = responseData.failedCount ?? 0;
      setMessage({
        type: successCount > 0 ? "success" : "error",
        text: `Admins created: ${successCount} succeeded, ${failedCount} failed. Passwords sent via email.`,
      });
      setFile(null);
      setCsvSchoolId("");
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      onSuccess?.();
      onClose?.();
    } else {
      setMessage({
        type: "error",
        text: error || "Failed to create admins",
      });
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="single">Single Admin</Tabs.Trigger>
          <Tabs.Trigger value="csv">CSV Upload</Tabs.Trigger>
        </Tabs.List>

        <Box pt="4">
          {/* Single Admin Form */}
          <Tabs.Content value="single">
            <form onSubmit={handleSingleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Full Name *
                  </Text>
                  <TextField.Root
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Email Address *
                  </Text>
                  <TextField.Root
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@school.com"
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Phone Number *
                  </Text>
                  <TextField.Root
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="1234567890"
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    School *
                  </Text>
                  <Select.Root
                    value={formData.schoolId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, schoolId: value })
                    }
                    disabled={loadingSchools}
                    required
                  >
                    <Select.Trigger
                      placeholder={
                        loadingSchools ? "Loading schools..." : "Select school"
                      }
                      style={{
                        borderColor:
                          !formData.schoolId && message?.type === "error"
                            ? "#ef4444"
                            : undefined,
                      }}
                    />
                    <Select.Content>
                      {schools.map((school) => (
                        <Select.Item key={school.id} value={school.id}>
                          {school.schoolName || school.name || "Unnamed School"}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Role *
                  </Text>
                  <Select.Root
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                    required
                  >
                    <Select.Trigger
                      placeholder="Select role"
                      style={{
                        borderColor:
                          !formData.role && message?.type === "error"
                            ? "#ef4444"
                            : undefined,
                      }}
                    />
                    <Select.Content>
                      <Select.Item value="admin">Admin</Select.Item>
                      <Select.Item value="parent">Parent</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                {message && (
                  <Box
                    p="3"
                    style={{
                      backgroundColor:
                        message.type === "success" ? "#16a34a" : "#dc2626",
                      borderRadius: "8px",
                      border: `1px solid ${
                        message.type === "success" ? "#15803d" : "#b91c1c"
                      }`,
                    }}
                  >
                    <Text size="2" weight="medium" style={{ color: "#ffffff" }}>
                      {message.text}
                    </Text>
                  </Box>
                )}

                <RadixButton type="submit" size="3" disabled={loading}>
                  {loading ? "Creating Admin..." : "Create Admin"}
                </RadixButton>
              </Flex>
            </form>
          </Tabs.Content>

          {/* CSV Upload Form */}
          <Tabs.Content value="csv">
            <Flex direction="column" gap="4">
              <Box>
                <Text size="3" weight="bold" mb="3">
                  Upload CSV File
                </Text>
                <Text size="2" color="gray" mb="3">
                  CSV should have columns: name, email, phoneNumber, role
                  (admin/parent)
                </Text>
              </Box>

              <form onSubmit={handleCSVSubmit}>
                <Flex direction="column" gap="4">
                  <Box>
                    <Text size="2" weight="medium" mb="1">
                      School *
                    </Text>
                    <Select.Root
                      value={csvSchoolId}
                      onValueChange={setCsvSchoolId}
                      disabled={loadingSchools}
                    >
                      <Select.Trigger
                        placeholder={
                          loadingSchools
                            ? "Loading schools..."
                            : "Select school for admins"
                        }
                      />
                      <Select.Content>
                        {schools.map((school) => (
                          <Select.Item key={school.id} value={school.id}>
                            {school.schoolName ||
                              school.name ||
                              "Unnamed School"}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Box>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        width: "100%",
                      }}
                    />
                  </Box>

                  {message && (
                    <Box
                      p="3"
                      style={{
                        backgroundColor:
                          message.type === "success" ? "#dcfce7" : "#fee2e2",
                        borderRadius: "6px",
                      }}
                    >
                      <Text
                        size="2"
                        color={message.type === "success" ? "green" : "red"}
                      >
                        {message.text}
                      </Text>
                    </Box>
                  )}

                  <RadixButton
                    type="submit"
                    size="3"
                    disabled={loading || !file || !csvSchoolId}
                  >
                    {loading ? "Creating Admins..." : "Upload & Create Admins"}
                  </RadixButton>
                </Flex>
              </form>

              <Box
                mt="4"
                p="4"
                style={{ backgroundColor: "#f8fafc", borderRadius: "6px" }}
              >
                <Text size="2" weight="bold" mb="2">
                  CSV Format Example:
                </Text>
                <Text size="1" style={{ fontFamily: "monospace" }}>
                  name,email,phoneNumber,role
                  <br />
                  John Doe,john@school.com,1234567890,admin
                  <br />
                  Jane Smith,jane@school.com,0987654321,parent
                </Text>
              </Box>
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
