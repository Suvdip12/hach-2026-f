"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  TextField,
  Button as RadixButton,
  Tabs,
} from "@radix-ui/themes";
import { schoolApi } from "@/services/api.service";

export default function CreateSchoolFormEnhanced() {
  const [activeTab, setActiveTab] = useState("single");

  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolCity: "",
    schoolState: "",
    schoolZip: "",
    schoolCountry: "",
    schoolEmail: "",
    schoolLogoUrl: "",
    themePrimary: "#4F46E5",
    themeSecondary: "#7C3AED",
  });

  // CSV form state
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { success, data, error } = await schoolApi.create(formData);
    console.log("error", error, data, success);
    if (success && data) {
      setMessage({
        type: "success",
        text: `School created successfully! Domain: ${data.domain || "N/A"}`,
      });
      setFormData({
        schoolName: "",
        schoolAddress: "",
        schoolCity: "",
        schoolState: "",
        schoolZip: "",
        schoolCountry: "",
        schoolEmail: "",
        schoolLogoUrl: "",
        themePrimary: "#4F46E5",
        themeSecondary: "#7C3AED",
      });
    } else {
      setMessage({
        type: "error",
        text: error || "Failed to create school",
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

    const { success, data, error } = await schoolApi.createFromCSV(file);

    if (success && data) {
      const { successCount, failedCount } = data.data || {};
      setMessage({
        type: successCount > 0 ? "success" : "error",
        text: `Schools created: ${successCount} succeeded, ${failedCount} failed.`,
      });
      setFile(null);
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      setMessage({
        type: "error",
        text: error || "Failed to create schools",
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
          <Tabs.Trigger value="single">Single School</Tabs.Trigger>
          <Tabs.Trigger value="csv">CSV Upload</Tabs.Trigger>
        </Tabs.List>

        <Box pt="4">
          {/* Single School Form */}
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
                    School Name *
                  </Text>
                  <TextField.Root
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="Enter school name"
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Address *
                  </Text>
                  <TextField.Root
                    name="schoolAddress"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    placeholder="Enter address"
                    required
                  />
                </Box>

                <Flex gap="4">
                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      City *
                    </Text>
                    <TextField.Root
                      name="schoolCity"
                      value={formData.schoolCity}
                      onChange={handleChange}
                      placeholder="City"
                      required
                    />
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      State *
                    </Text>
                    <TextField.Root
                      name="schoolState"
                      value={formData.schoolState}
                      onChange={handleChange}
                      placeholder="State"
                      required
                    />
                  </Box>
                </Flex>

                <Flex gap="4">
                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      ZIP Code *
                    </Text>
                    <TextField.Root
                      name="schoolZip"
                      value={formData.schoolZip}
                      onChange={handleChange}
                      placeholder="ZIP"
                      required
                    />
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      Country *
                    </Text>
                    <TextField.Root
                      name="schoolCountry"
                      value={formData.schoolCountry}
                      onChange={handleChange}
                      placeholder="Country"
                      required
                    />
                  </Box>
                </Flex>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    School Email *
                  </Text>
                  <TextField.Root
                    name="schoolEmail"
                    type="email"
                    value={formData.schoolEmail}
                    onChange={handleChange}
                    placeholder="school@example.com"
                    required
                  />
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">
                    Logo URL (optional)
                  </Text>
                  <TextField.Root
                    name="schoolLogoUrl"
                    value={formData.schoolLogoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />
                </Box>

                <Flex gap="4">
                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      Primary Theme Color
                    </Text>
                    <input
                      name="themePrimary"
                      type="color"
                      value={formData.themePrimary}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        height: "36px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <Text size="2" weight="medium" mb="1">
                      Secondary Theme Color
                    </Text>
                    <input
                      name="themeSecondary"
                      type="color"
                      value={formData.themeSecondary}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        height: "36px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                </Flex>

                <RadixButton type="submit" size="3" disabled={loading}>
                  {loading ? "Creating School..." : "Create School"}
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
                  CSV should have columns: schoolName, schoolAddress,
                  schoolCity, schoolState, schoolZip, schoolCountry,
                  schoolEmail, schoolLogoUrl (optional), themePrimary
                  (optional), themeSecondary (optional)
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
                    disabled={loading || !file}
                  >
                    {loading
                      ? "Creating Schools..."
                      : "Upload & Create Schools"}
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
                  schoolName,schoolAddress,schoolCity,schoolState,schoolZip,schoolCountry
                  <br />
                  Delhi Public School,123 Main St,New Delhi,Delhi,110001,India
                  <br />
                  Modern High School,456 Park
                  Ave,Mumbai,Maharashtra,400001,India
                </Text>
              </Box>
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
