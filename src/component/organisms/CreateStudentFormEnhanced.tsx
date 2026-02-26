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
import { studentApi, schoolApi } from "@/services/api.service";

export default function CreateStudentFormEnhanced({
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

  // Single student form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    picture: "",
    role: "individual",
    level: "0",
    schoolId: "",
  });

  // CSV form state
  const [file, setFile] = useState<File | null>(null);
  const [csvSchoolId, setCsvSchoolId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      setMessage(null);
      try {
        const { success, data, error } = await schoolApi.getAll();
        console.log("Schools API Response:", { success, data, error });
        if (success && data) {
          // Extract schools from nested response structure
          const schoolsData = "data" in data ? data.data : data;
          console.log("Extracted schools data:", schoolsData);
          setSchools(Array.isArray(schoolsData) ? schoolsData : []);
        } else {
          const errorMsg = error || "Failed to load schools";
          setMessage({
            type: "error",
            text:
              errorMsg.includes("Unauthorized") || errorMsg.includes("401")
                ? "Please log in to access this feature"
                : errorMsg,
          });
        }
      } catch (err) {
        setMessage({
          type: "error",
          text: "Network error. Please check if backend is running.",
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

    // Validate school selection for school role
    if (formData.role === "school" && !formData.schoolId) {
      setMessage({
        type: "error",
        text: "Please select a school for school students",
      });
      setLoading(false);
      return;
    }

    const { success, error } = await studentApi.create({
      ...formData,
      schoolId: formData.schoolId || undefined,
    });
    console.log(error);
    if (success) {
      setMessage({
        type: "success",
        text: "Student created successfully! Password sent via email.",
      });

      setFormData({
        name: "",
        email: "",
        class: "",
        picture: "",
        role: "individual",
        level: "0",
        schoolId: "",
      });
      onSuccess?.();
      onClose?.();
    } else {
      setMessage({
        type: "error",
        text: error || "Failed to create student",
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

    const { success, data, error } = await studentApi.createFromCSV(
      file,
      csvSchoolId === "individual" ? undefined : csvSchoolId,
    );
    if (success && data) {
      const { successCount, failedCount } = data.data || {};
      setMessage({
        type: successCount > 0 ? "success" : "error",
        text: `Students created: ${successCount} succeeded, ${failedCount} failed. Passwords sent via email.`,
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
        text: error || "Failed to create students",
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
          <Tabs.Trigger value="single">Single Student</Tabs.Trigger>
          <Tabs.Trigger value="csv">CSV Upload</Tabs.Trigger>
        </Tabs.List>

        <Box pt="4">
          {/* Single Student Form */}
          <Tabs.Content value="single">
            <form onSubmit={handleSingleSubmit}>
              <Flex direction="column" gap="4">
                {message && (
                  <Box
                    p="4"
                    style={{
                      backgroundColor:
                        message.type === "success" ? "#10b981" : "#ef4444",
                      borderRadius: "8px",
                      border: `2px solid ${message.type === "success" ? "#059669" : "#dc2626"}`,
                    }}
                  >
                    <Text
                      size="3"
                      weight="bold"
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      {message.text}
                    </Text>
                  </Box>
                )}
                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Student Type *
                  </Text>
                  <Select.Root
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value,
                        schoolId:
                          value === "individual" ? "" : formData.schoolId,
                      })
                    }
                  >
                    <Select.Trigger placeholder="Select type" />
                    <Select.Content>
                      <Select.Item value="individual">Individual</Select.Item>
                      <Select.Item value="school">School</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                {formData.role === "school" && (
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
                    >
                      <Select.Trigger
                        placeholder={
                          loadingSchools
                            ? "Loading schools..."
                            : "Select school"
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
                )}

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Student Name *
                  </Text>
                  <TextField.Root
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
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
                    placeholder="student@school.com"
                    required
                  />
                </Box>

                <Flex gap="4">
                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      Class *
                    </Text>
                    <TextField.Root
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      placeholder="e.g., 10A"
                      required
                    />
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      Level
                    </Text>
                    <TextField.Root
                      name="level"
                      type="number"
                      value={formData.level}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </Box>
                </Flex>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Profile Picture URL *
                  </Text>
                  <TextField.Root
                    name="picture"
                    value={formData.picture}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    required
                  />
                </Box>

                <RadixButton type="submit" size="3" disabled={loading}>
                  {loading ? "Creating Student..." : "Create Student"}
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
                  Select student type from dropdown. Required CSV columns: name,
                  email, class, picture. Optional: level.
                </Text>
              </Box>

              <form onSubmit={handleCSVSubmit}>
                <Flex direction="column" gap="4">
                  {message && (
                    <Box
                      p="4"
                      style={{
                        backgroundColor:
                          message.type === "success" ? "#10b981" : "#ef4444",
                        borderRadius: "8px",
                        border: `2px solid ${message.type === "success" ? "#059669" : "#dc2626"}`,
                      }}
                    >
                      <Text
                        size="3"
                        weight="bold"
                        style={{
                          color: "#ffffff",
                        }}
                      >
                        {message.text}
                      </Text>
                    </Box>
                  )}
                  <Box>
                    <Text size="2" weight="medium" mb="1">
                      Student Type *
                    </Text>
                    <Select.Root
                      value={csvSchoolId}
                      onValueChange={setCsvSchoolId}
                      disabled={loadingSchools}
                    >
                      <Select.Trigger
                        placeholder={
                          loadingSchools ? "Loading..." : "Select student type"
                        }
                      />
                      <Select.Content>
                        <Select.Item value="individual">
                          Individual Students
                        </Select.Item>
                        <Select.Separator />
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

                  <RadixButton
                    type="submit"
                    size="3"
                    disabled={loading || !file || !csvSchoolId}
                  >
                    {loading
                      ? "Creating Students..."
                      : "Upload & Create Students"}
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
                  name,email,class,picture,level
                  <br />
                  Alice
                  Johnson,alice@school.com,10A,https://example.com/alice.jpg,5
                  <br />
                  Bob Williams,bob@school.com,9B,https://example.com/bob.jpg,3
                </Text>
                <Text size="1" color="gray" mt="2">
                  Note: Select &quot;Individual Students&quot; for students
                  without a school, or select a specific school for school
                  students.
                </Text>
              </Box>
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
