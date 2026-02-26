"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Card,
  Flex,
  Button,
  Select,
  TextArea,
  TextField,
  Text,
  Badge,
  IconButton,
} from "@radix-ui/themes";
import { Plus, X, Edit2 } from "lucide-react";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { questionApi, QuestionAnswer } from "@/services/api.service";
import { showToast } from "@/lib/toast.config";

type QuestionType = "mcq" | "coding" | "paragraph" | "blockly" | "blockly";

interface QuestionResponse {
  id: string;
  qnaId: string;
  question: string;
  qnaType: QuestionType;
  options?: string[];
  testCases?: { input: string; output: string }[];
  keywords?: string[];
  answer?: QuestionAnswer | null;
}

interface TestCase {
  input: string;
  output: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingCSV, setUploadingCSV] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "mcq" | "coding" | "paragraph" | "blockly"
  >("all");
  const [formData, setFormData] = useState({
    qnaType: "mcq" as QuestionType,
    question: "",
    options: ["", "", "", ""], // Array for MCQ options
    keywords: [""],
    answer: "", // Answer is now required
    hints: [""],
  });
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", output: "" },
  ]);

  const fetchQuestions = async () => {
    setLoading(true);
    let apiCall;

    if (filter === "mcq") {
      apiCall = questionApi.getAllMcq();
    } else if (filter === "coding") {
      apiCall = questionApi.getAllCoding();
    } else if (filter === "paragraph") {
      apiCall = questionApi.getAllPara();
    } else {
      apiCall = questionApi.getAll();
    }

    const { success, data } = await apiCall;
    if (success && data) {
      // Backend wraps data in { response: true, message: ..., data: [...] }
      const responseData = data as unknown as { data: QuestionResponse[] };
      setQuestions(responseData.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuestions();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const updateTestCase = (
    index: number,
    field: "input" | "output",
    value: string,
  ) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addKeyword = () => {
    setFormData({
      ...formData,
      keywords: [...formData.keywords, ""],
    });
  };

  const removeKeyword = (index: number) => {
    if (formData.keywords.length > 1) {
      const newKeywords = formData.keywords.filter((_, i) => i !== index);
      setFormData({ ...formData, keywords: newKeywords });
    }
  };

  const addHint = () => {
    setFormData({
      ...formData,
      hints: [...formData.hints, ""],
    });
  };

  const removeHint = (index: number) => {
    if (formData.hints.length > 1) {
      const newHints = formData.hints.filter((_, i) => i !== index);
      setFormData({ ...formData, hints: newHints });
    }
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...formData.hints];
    newHints[index] = value;
    setFormData({ ...formData, hints: newHints });
  };
  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData({ ...formData, keywords: newKeywords });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.answer.trim()) {
      showToast.error(
        "Answer is required. Cannot create a question without an answer.",
      );
      return;
    }
    if (formData.qnaType === "mcq") {
      const nonEmptyOptions = formData.options.filter(
        (opt) => opt.trim() !== "",
      );
      if (nonEmptyOptions.length < 2) {
        showToast.error("MCQ must have at least 2 options.");
        return;
      }
      const answerMatchesOption = nonEmptyOptions.some(
        (opt) =>
          opt.trim().toLowerCase() === formData.answer.trim().toLowerCase(),
      );
      if (!answerMatchesOption) {
        showToast.error("Answer must match one of the provided options.");
        return;
      }
    }

    // FIX: Paragraph validation - keywords required
    if (formData.qnaType === "paragraph") {
      const nonEmptyKeywords = formData.keywords.filter(
        (kw) => kw.trim() !== "",
      );
      if (nonEmptyKeywords.length === 0) {
        showToast.error(
          "At least one keyword is required for paragraph questions.",
        );
        return;
      }
    }
    if (formData.qnaType === "coding") {
      const validTestCases = testCases.filter(
        (tc) => tc.input.trim() !== "" && tc.output.trim() !== "",
      );
      if (validTestCases.length === 0) {
        showToast.error(
          "At least one complete test case is required for coding questions.",
        );
        return;
      }
    }

    const payload = {
      qnaType: formData.qnaType,
      question: formData.question,
      answer: formData.answer,
      hints: formData.hints.filter((h) => h.trim() !== ""),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    if (formData.qnaType === "mcq") {
      payload.options = formData.options.filter((opt) => opt.trim() !== "");
    }
    if (formData.qnaType === "coding" || formData.qnaType === "blockly") {
      payload.testCases = testCases
        .filter((tc) => tc.input.trim() !== "" && tc.output.trim() !== "")
        .map((tc) => ({ input: tc.input, expectedOutput: tc.output }));
    }
    if (formData.qnaType === "paragraph") {
      payload.keywords = formData.keywords.filter((kw) => kw.trim() !== "");
    }

    try {
      let result;

      if (editingId) {
        result = await questionApi.update(editingId, payload);
      } else {
        result = await questionApi.create(payload);
      }
      if (result.success) {
        showToast.success(
          `Question ${editingId ? "updated" : "created"} successfully!`,
        );
        setIsCreating(false);
        setEditingId(null);
        setFormData({
          qnaType: "mcq",
          question: "",
          options: ["", "", "", ""],
          keywords: [""],
          answer: "",
          hints: [""],
        });
        setTestCases([{ input: "", output: "" }]);
        fetchQuestions(); // Refresh the list
      } else {
        showToast.error(
          `Failed to ${editingId ? "update" : "create"} question`,
        );
      }
    } catch {
      showToast.error(
        `An error occurred while ${editingId ? "updating" : "creating"} the question`,
      );
    }
  };

  const handleEdit = (q: QuestionResponse) => {
    setEditingId(q.id);
    setIsCreating(true);
    setFormData({
      qnaType: q.qnaType,
      question: q.question,
      options: q.options || ["", "", "", ""],
      keywords: q.keywords || [""],
      answer: q.answer?.answer || "",
      hints: q.answer?.hints?.length ? q.answer.hints : [""],
    });

    if (q.testCases) {
      setTestCases(
        q.testCases.map(
          (tc: {
            input: string;
            expectedOutput?: string;
            output?: string;
          }) => ({
            input: tc.input,
            output: tc.expectedOutput ?? tc.output ?? "",
          }),
        ),
      );
    } else {
      setTestCases([{ input: "", output: "" }]);
    }
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      qnaType: "mcq",
      question: "",
      options: ["", "", "", ""],
      keywords: [""],
      answer: "",
      hints: [""],
    });
    setTestCases([{ input: "", output: "" }]);
  };

  const handleDelete = async (id: string, qnaType: string) => {
    const { success } = await questionApi.delete(id, qnaType);

    if (success) {
      showToast.success("Question deleted successfully!");
      setQuestions(questions.filter((q) => q.qnaId !== id));
    } else {
      showToast.error("Failed to delete question");
    }
  };

  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      showToast.error("Please upload a CSV file");
      return;
    }

    setUploadingCSV(true);
    const { success, data } = await questionApi.createFromCSV(file);

    if (success && data) {
      const responseData = data as unknown as {
        data: {
          total: number;
          successful: number;
          failed: number;
          failedList: Array<{ question: string; reason: string }>;
        };
      };
      const result = responseData.data;

      if (result.failed > 0) {
        showToast.error(
          `Uploaded ${result.successful} questions. ${result.failed} failed. Check console for details.`,
        );
        console.error("Failed questions:", result.failedList);
      } else {
        showToast.success(
          `Successfully uploaded ${result.successful} questions!`,
        );
      }

      fetchQuestions();
    } else {
      showToast.error("Failed to upload CSV");
    }

    setUploadingCSV(false);
    // Reset file input
    event.target.value = "";
  };

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        <Card>
          <Flex justify="between" align="center" p="4">
            <Heading size="6">Manage Questions</Heading>
            <Flex gap="3" align="center">
              <Select.Root
                value={filter}
                onValueChange={(value) => setFilter(value as typeof filter)}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">All Questions</Select.Item>
                  <Select.Item value="mcq">MCQ Only</Select.Item>
                  <Select.Item value="coding">Coding Only</Select.Item>
                  <Select.Item value="paragraph">Paragraph Only</Select.Item>
                </Select.Content>
              </Select.Root>
              <Button
                variant="soft"
                disabled={uploadingCSV}
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
                {uploadingCSV ? "Uploading..." : "Upload CSV"}
              </Button>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                style={{ display: "none" }}
              />
              <Button
                onClick={() => {
                  if (isCreating && editingId) {
                    handleCancelEdit();
                  } else {
                    setIsCreating(!isCreating);
                  }
                }}
              >
                {isCreating ? "Cancel" : "Create New Question"}
              </Button>
            </Flex>
          </Flex>
        </Card>

        {isCreating && (
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Heading size="5">
                {editingId ? "Edit Question" : "Create New Question"}
              </Heading>
              <form onSubmit={handleSubmit}>
                <Flex direction="column" gap="4">
                  <div>
                    <Text as="label" size="2" weight="medium">
                      Question Type
                    </Text>
                    <Select.Root
                      value={formData.qnaType}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          qnaType: value as QuestionType,
                        })
                      }
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="mcq">
                          Multiple Choice (MCQ)
                        </Select.Item>
                        <Select.Item value="coding">Coding</Select.Item>
                        <Select.Item value="paragraph">Paragraph</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </div>

                  <div>
                    <Text as="label" size="2" weight="medium">
                      Question
                    </Text>
                    <TextArea
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>

                  {formData.qnaType === "mcq" && (
                    <div>
                      <Flex justify="between" align="center" mb="2">
                        <Text as="label" size="2" weight="medium">
                          Options
                        </Text>
                        <Button
                          type="button"
                          size="1"
                          variant="soft"
                          onClick={addOption}
                        >
                          <Plus size={16} />
                          Add Option
                        </Button>
                      </Flex>
                      <Flex direction="column" gap="2">
                        {formData.options.map((option, index) => (
                          <Flex key={index} gap="2" align="center">
                            <TextField.Root
                              value={option}
                              onChange={(e) =>
                                updateOption(index, e.target.value)
                              }
                              placeholder={`Option ${index + 1}`}
                              required
                              style={{ flex: 1 }}
                            />
                            {formData.options.length > 2 && (
                              <IconButton
                                type="button"
                                size="2"
                                variant="soft"
                                color="red"
                                onClick={() => removeOption(index)}
                              >
                                <X size={16} />
                              </IconButton>
                            )}
                          </Flex>
                        ))}
                      </Flex>
                      <Text size="1" color="gray" mt="1">
                        Note: The answer must exactly match one of the options
                        above
                      </Text>
                    </div>
                  )}

                  {formData.qnaType === "coding" && (
                    <div>
                      <Flex justify="between" align="center" mb="2">
                        <Text as="label" size="2" weight="medium">
                          Test Cases
                        </Text>
                        <Button
                          type="button"
                          size="1"
                          variant="soft"
                          onClick={addTestCase}
                        >
                          + Add Test Case
                        </Button>
                      </Flex>
                      <Flex direction="column" gap="2">
                        {testCases.map((testCase, index) => (
                          <Card key={index} variant="surface">
                            <Flex direction="column" gap="2" p="3">
                              <Flex justify="between" align="center">
                                <Text size="2" weight="bold">
                                  Test Case {index + 1}
                                </Text>
                                {testCases.length > 1 && (
                                  <IconButton
                                    type="button"
                                    size="1"
                                    variant="soft"
                                    color="red"
                                    onClick={() => removeTestCase(index)}
                                  >
                                    <X size={14} />
                                  </IconButton>
                                )}
                              </Flex>
                              <div>
                                <Text size="1" weight="medium" mb="1">
                                  Input
                                </Text>
                                <TextArea
                                  value={formData.answer}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      answer: e.target.value,
                                    })
                                  }
                                  placeholder={
                                    formData.qnaType === "mcq"
                                      ? "Enter the correct option (must match one of the options above)"
                                      : "Enter the correct answer for this question"
                                  }
                                  required
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Text size="1" weight="medium" mb="1">
                                  Expected Output
                                </Text>
                                <TextArea
                                  value={testCase.output}
                                  onChange={(e) =>
                                    updateTestCase(
                                      index,
                                      "output",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Expected output"
                                  rows={2}
                                />
                              </div>
                            </Flex>
                          </Card>
                        ))}
                      </Flex>
                    </div>
                  )}

                  {formData.qnaType === "paragraph" && (
                    <div>
                      <Flex justify="between" align="center" mb="2">
                        <Text as="label" size="2" weight="medium">
                          Keywords
                        </Text>
                        <Button
                          type="button"
                          size="1"
                          variant="soft"
                          onClick={addKeyword}
                        >
                          <Plus size={16} />
                          Add Keyword
                        </Button>
                      </Flex>
                      <Flex direction="column" gap="2">
                        {formData.keywords.map((keyword, index) => (
                          <Flex key={index} gap="2" align="center">
                            <TextField.Root
                              value={keyword}
                              onChange={(e) =>
                                updateKeyword(index, e.target.value)
                              }
                              placeholder={`Keyword ${index + 1}`}
                              required
                              style={{ flex: 1 }}
                            />
                            {formData.keywords.length > 1 && (
                              <IconButton
                                type="button"
                                size="2"
                                variant="soft"
                                color="red"
                                onClick={() => removeKeyword(index)}
                              >
                                <X size={16} />
                              </IconButton>
                            )}
                          </Flex>
                        ))}
                      </Flex>
                    </div>
                  )}

                  {/* Answer Section - Required */}
                  <Card
                    variant="surface"
                    style={{ backgroundColor: "var(--green-2)" }}
                  >
                    <Flex direction="column" gap="3" p="3">
                      <Flex align="center" gap="2">
                        <Text as="label" size="2" weight="bold" color="green">
                          Answer (Required)
                        </Text>
                        <Badge color="green" size="1">
                          Required
                        </Badge>
                      </Flex>
                      <TextArea
                        value={formData.answer}
                        onChange={(e) =>
                          setFormData({ ...formData, answer: e.target.value })
                        }
                        placeholder="Enter the correct answer for this question"
                        required
                        rows={3}
                      />

                      <Flex justify="between" align="center">
                        <Text as="label" size="2" weight="medium">
                          Hints (Optional)
                        </Text>
                        <Button
                          type="button"
                          size="1"
                          variant="soft"
                          onClick={addHint}
                        >
                          <Plus size={16} />
                          Add Hint
                        </Button>
                      </Flex>
                      <Flex direction="column" gap="2">
                        {formData.hints.map((hint, index) => (
                          <Flex key={index} gap="2" align="center">
                            <TextField.Root
                              value={hint}
                              onChange={(e) =>
                                updateHint(index, e.target.value)
                              }
                              placeholder={`Hint ${index + 1}`}
                              style={{ flex: 1 }}
                            />
                            {formData.hints.length > 1 && (
                              <IconButton
                                type="button"
                                size="2"
                                variant="soft"
                                color="red"
                                onClick={() => removeHint(index)}
                              >
                                <X size={16} />
                              </IconButton>
                            )}
                          </Flex>
                        ))}
                      </Flex>
                    </Flex>
                  </Card>

                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Update Question with Answer"
                        : "Create Question with Answer"}
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Card>
        )}

        <Card>
          <Flex direction="column" gap="4" p="4">
            <Heading size="5">All Questions</Heading>
            {loading ? (
              <Text
                size="2"
                color="gray"
                align="center"
                style={{ padding: "2rem 0" }}
              >
                Loading questions...
              </Text>
            ) : questions.length === 0 ? (
              <Text
                size="2"
                color="gray"
                align="center"
                style={{ padding: "2rem 0" }}
              >
                No questions yet. Create your first question!
              </Text>
            ) : (
              <Flex direction="column" gap="3">
                {questions.map((q) => (
                  <Card key={q.id}>
                    <Flex justify="between" align="start" p="3">
                      <Flex direction="column" gap="2" style={{ flex: 1 }}>
                        <Flex gap="2" align="center">
                          <Badge>{q.qnaType.toUpperCase()}</Badge>
                          {q.answer ? (
                            <Badge color="green" variant="soft">
                              Has Answer
                            </Badge>
                          ) : (
                            <Badge color="red" variant="soft">
                              No Answer
                            </Badge>
                          )}
                        </Flex>
                        <Text weight="medium">{q.question}</Text>
                        {q.options && (
                          <Flex direction="column" gap="1" mt="2">
                            {q.options.map((option: string, idx: number) => (
                              <Text key={idx} size="2" color="gray">
                                {idx + 1}. {option}
                              </Text>
                            ))}
                          </Flex>
                        )}
                        {q.testCases && (
                          <Flex direction="column" gap="1" mt="2">
                            <Text size="2" weight="medium">
                              Test Cases:
                            </Text>
                            {q.testCases.map(
                              (
                                tc: { input: string; output: string },
                                idx: number,
                              ) => (
                                <Text key={idx} size="2" color="gray">
                                  {idx + 1}. Input: {tc.input} → Output:{" "}
                                  {tc.output}
                                </Text>
                              ),
                            )}
                          </Flex>
                        )}
                        {q.keywords &&
                          Array.isArray(q.keywords) &&
                          q.keywords.length > 0 && (
                            <Flex direction="column" gap="1" mt="2">
                              <Text size="2" weight="medium">
                                Keywords:
                              </Text>
                              <Flex gap="2" wrap="wrap">
                                {q.keywords.map(
                                  (keyword: string, idx: number) => (
                                    <Badge key={idx} variant="soft">
                                      {keyword}
                                    </Badge>
                                  ),
                                )}
                              </Flex>
                            </Flex>
                          )}

                        {/* Display Answer */}
                        {q.answer && (
                          <Card
                            variant="surface"
                            style={{
                              marginTop: "0.5rem",
                              backgroundColor: "var(--green-2)",
                            }}
                          >
                            <Flex direction="column" gap="1" p="2">
                              <Text size="2" weight="bold" color="green">
                                Answer:
                              </Text>
                              <Text size="2">{q.answer.answer}</Text>
                              {q.answer.hints && q.answer.hints.length > 0 && (
                                <Flex direction="column" gap="1" mt="1">
                                  <Text size="1" weight="medium" color="gray">
                                    Hints:
                                  </Text>
                                  <Flex gap="1" wrap="wrap">
                                    {q.answer.hints.map(
                                      (hint: string, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          color="gray"
                                          size="1"
                                        >
                                          {hint}
                                        </Badge>
                                      ),
                                    )}
                                  </Flex>
                                </Flex>
                              )}
                            </Flex>
                          </Card>
                        )}
                      </Flex>
                      <Flex gap="2">
                        <Button
                          onClick={() => handleEdit(q)}
                          variant="soft"
                          color="blue"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(q.qnaId, q.qnaType)}
                          variant="soft"
                          color="red"
                        >
                          Delete
                        </Button>
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
