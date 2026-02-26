/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Centralized API service
 * All API calls in one place for easy management and reuse
 */

import { api, ApiResponse } from "@/util/api";

// ============ API Response Types ============

// Backend API response format
export interface BackendResponse<T = unknown> {
  response: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Helper to safely extract data from API response
// Handles both direct array responses and nested backend response format
export function extractData<T>(
  res: ApiResponse<T | BackendResponse<T>>,
): T | undefined {
  if (!res.success || !res.data) return undefined;

  // Check if it's a backend response with nested data
  const data = res.data as BackendResponse<T>;
  if (
    data &&
    typeof data === "object" &&
    "response" in data &&
    "data" in data
  ) {
    return data.data as T;
  }

  // Direct data format
  return res.data as T;
}

// Helper to safely extract array data
export function extractArrayData<T>(
  res: ApiResponse<T[] | BackendResponse<T[]>>,
): T[] {
  if (!res.success || !res.data) return [];

  // Check if it's a backend response with nested data
  const data = res.data as BackendResponse<T[]>;
  if (
    data &&
    typeof data === "object" &&
    "response" in data &&
    Array.isArray(data.data)
  ) {
    return data.data;
  }

  // Direct array format
  if (Array.isArray(res.data)) {
    return res.data;
  }

  return [];
}

// ============ Types ============

export interface Student {
  id: string;
  name: string;
  email: string;
  class?: string;
  imageUrl?: string;
  role: string;
  level: number;
  enrollmentNumber?: string;
  schoolId?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  phoneNumber?: number;
  role?: string;
  schoolId?: string;
  image?: string;
}

export interface School {
  id: string;
  schoolName: string;
  domain: string;
  schoolEmail: string;
  schoolLogoUrl?: string;
  schoolAddress?: string;
  schoolZip?: string;
  schoolCity?: string;
  schoolState?: string;
  schoolCountry?: string;
  themePrimary?: string;
  themeSecondary?: string;
}

export interface Course {
  id: string;
  courseName: string;
  courseDetail: string;
  courseImage: string;
  link: Record<string, unknown>;
}

export interface Instructor {
  id: string;
  name: string;
  detail: string;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  url: string;
}
export interface CourseLecture {
  id: string;
  courseId: string;
  lectureId: string;
  courseName?: string;
  lectureTitle?: string;
  createdAt?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface QuestionAnswer {
  id: string;
  qnaId: string;
  answer: string;
  hints: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  qnaId: string;
  question: string;
  qnaType: "mcq" | "coding" | "paragraph" | "blockly";
  options?: string[];
  testCases?: TestCase[];
  keywords?: string[];
  answer?: QuestionAnswer | null;
  description?: string;
}

export interface CreateQuestionInput {
  qnaType: "mcq" | "coding" | "paragraph" | "blockly";
  question: string;
  options?: string[];
  testCases?: TestCase[];
  keywords?: string[];
  answer: string; // Answer is now required
  hints?: string[];
}

export interface CreateStudentInput {
  name: string;
  email: string;
  class: string;
  picture?: string;
  role: string;
  level: string;
  schoolId?: string | undefined;
}

export interface CreateAdminInput {
  name: string;
  email: string;
  schoolId: string;
  image?: string;
}

export interface CreateSchoolInput {
  schoolName: string;
  schoolAddress: string;
  schoolCity: string;
  schoolState: string;
  schoolZip: string;
  schoolCountry: string;
  schoolEmail: string;
  schoolLogoUrl?: string;
  themePrimary?: string;
  themeSecondary?: string;
}

export interface CreateCourseInput {
  courseName: string;
  courseDetail: string;
  courseImage: string;
  link: string[];
}

export interface CreateInstructorInput {
  name: string;
  detail: string;
}

export interface CreateLectureInput {
  title: string;
  description: string;
  url: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  picture?: string;
  phoneNumber?: string;
}

export interface ResetPasswordInput {
  token: string;
  userType: "student" | "controller";
  newPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
  userType: "student" | "admin" | "parent" | "superAdmin";
}

export interface PasswordChangeInput {
  oldPassword: string;
  newPassword: string;
}

export interface CreateSuperAdminInput {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  superAdminPass1: string;
  superAdminPass2: string;
}

// ============ Student APIs ============

export const studentApi = {
  create: (data: CreateStudentInput) =>
    api.post<Student>("/api/student/create", data),

  createFromCSV: (file: File, schoolId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (schoolId) {
      formData.append("schoolId", schoolId);
    }
    return api.post<{
      response: boolean;
      message: string;
      data: { successCount: number; failedCount: number };
    }>("/api/student/create-csv", formData);
  },

  getAll: () => api.get<Student[]>("/api/student/all"),

  getById: (id: string) => api.get<Student>(`/api/student/${id}`),

  getBySchool: (schoolId: string) =>
    api.get<Student[]>(`/api/student/school/${schoolId}`),

  update: (id: string, data: Partial<CreateStudentInput>) =>
    api.put<Student>(`/api/student/${id}`, data),

  delete: (id: string) => api.delete(`/api/student/${id}`),

  banStudent: (
    id: string,
    data: {
      banned: boolean;
      banReason: string | null;
      banExpires: string | null;
    },
  ) => api.put<Student>(`/api/student/${id}/ban`, data),
};

export const adminApi = {
  create: (
    data: CreateAdminInput & {
      phoneNumber: string;
      role?: string;
      schoolId: string;
    },
  ) => api.post<Admin>("/api/admin/create", data),

  createFromCSV: (file: File, schoolId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("schoolId", schoolId);
    return api.post<{ successCount: number; failedCount: number }>(
      "/api/admin/create-csv",
      formData,
    );
  },

  getAll: () => api.get<Admin[]>("/api/admin/all"),

  getById: (id: string) => api.get<Admin>(`/api/admin/${id}`),

  getBySchool: (schoolId: string) =>
    api.get<Admin[]>(`/api/admin/school/${schoolId}`),

  update: (
    id: string,
    data: Partial<CreateAdminInput & { phoneNumber?: string; role?: string }>,
  ) => api.put<Admin>(`/api/admin/${id}`, data),

  delete: (id: string) => api.delete(`/api/admin/${id}`),
};

export const schoolApi = {
  create: (data: CreateSchoolInput) =>
    api.post<School>("/api/school/create", data),

  createFromCSV: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{
      response: boolean;
      message: string;
      data: { successCount: number; failedCount: number };
    }>("/api/school/create-csv", formData);
  },

  getAll: () => api.get<School[]>("/api/school/admin/all"),

  getById: (id: string) => api.get<School>(`/api/school/${id}`),

  update: (id: string, data: Partial<CreateSchoolInput>) =>
    api.put<School>(`/api/school/${id}`, data),

  delete: (id: string) => api.delete(`/api/school/${id}`),
};

export const courseApi = {
  create: (data: CreateCourseInput) =>
    api.post<Course>("/api/course/create-course", data),

  createFromCSV: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{
      total: number;
      successful: number;
      failed: number;
      successList: Array<{ id: string; courseName: string }>;
      failedList: Array<{ courseName: string; reason: string }>;
    }>("/api/course/create-courses-csv", formData);
  },

  getAll: () => api.get<Course[]>("/api/course/all-courses"),

  getById: (id: string) => api.get<Course>(`/api/course/${id}`),

  update: (id: string, data: Partial<CreateCourseInput>) =>
    api.put<Course>(`/api/course/update-course/${id}`, data),

  delete: (id: string) => api.delete(`/api/course/delete-course/${id}`),
};

export const instructorApi = {
  create: (data: CreateInstructorInput) =>
    api.post<Instructor>("/api/instructor/create-instructor", data),

  createFromCSV: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{
      total: number;
      successful: number;
      failed: number;
      successList: Array<{ id: string; name: string }>;
      failedList: Array<{ name: string; reason: string }>;
    }>("/api/instructor/create-instructors-csv", formData);
  },

  getAll: () => api.get<Instructor[]>("/api/instructor/all-instructors"),

  getById: (id: string) => api.get<Instructor>(`/api/instructor/${id}`),

  update: (id: string, data: Partial<CreateInstructorInput>) =>
    api.put<Instructor>(`/api/instructor/update-instructor/${id}`, data),

  delete: (id: string) => api.delete(`/api/instructor/delete-instructor/${id}`),
};

export const lectureApi = {
  create: (data: CreateLectureInput) =>
    api.post<Lecture>("/api/lecture/create-lecture", data),

  createFromCSV: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{
      total: number;
      successful: number;
      failed: number;
      successList: Array<{ id: string; title: string }>;
      failedList: Array<{ title: string; reason: string }>;
    }>("/api/lecture/create-lectures-csv", formData);
  },

  getAll: () => api.get<Lecture[]>("/api/lecture/all-lectures"),

  getById: (id: string) => api.get<Lecture>(`/api/lecture/${id}`),

  update: (id: string, data: Partial<CreateLectureInput>) =>
    api.put<Lecture>(`/api/lecture/update-lecture/${id}`, data),

  delete: (id: string) => api.delete(`/api/lecture/delete-lecture/${id}`),
};

export const questionApi = {
  create: (data: CreateQuestionInput) =>
    api.post<{
      question: Question;
      qna: { id: string };
      answer: QuestionAnswer;
    }>("/api/question/create-question", data),

  createFromCSV: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{
      total: number;
      successful: number;
      failed: number;
      successList: Array<{
        type: string;
        questionId: string;
        qnaId: string;
        answerId: string;
      }>;
      failedList: Array<{ question: string; reason: string }>;
    }>("/api/question/create-question-csv", formData);
  },

  getAll: () => api.get<Question[]>("/api/question/get-all-questions"),

  getAllMcq: () => api.get<Question[]>("/api/question/get-all-mcq"),

  getAllCoding: () => api.get<Question[]>("/api/question/get-all-coding"),

  getAllPara: () => api.get<Question[]>("/api/question/get-all-para"),

  getById: (id: string) => api.get<Question>(`/api/question/${id}`),

  update: (
    id: string,
    data: Partial<CreateQuestionInput> & {
      qnaType: "mcq" | "coding" | "paragraph" | "blockly";
    },
  ) =>
    api.put<{ question: Question; answer: QuestionAnswer | null }>(
      `/api/question/update-question/${id}`,
      data,
    ),

  delete: (id: string, qnaType: string) =>
    api.delete(`/api/question/delete-question/${id}?qnaType=${qnaType}`),
};

export interface CourseInstructor {
  id: string;
  courseId: string;
  instructorId: string;
  courseName?: string;
  instructorName?: string;
  createdAt?: string;
}

export const courseInstructorApi = {
  getAll: () => api.get<CourseInstructor[]>("/api/course-instructor/all"),

  getByCourse: (courseId: string) =>
    api.get<CourseInstructor[]>(
      `/api/course-instructor/course/${courseId}/instructors`,
    ),

  getByInstructor: (instructorId: string) =>
    api.get<CourseInstructor[]>(
      `/api/course-instructor/instructor/${instructorId}/courses`,
    ),

  getAvailableInstructors: (courseId: string) =>
    api.get<Instructor[]>(
      `/api/course-instructor/course/${courseId}/available-instructors`,
    ),

  assign: (courseId: string, instructorId: string) =>
    api.post<CourseInstructor>("/api/course-instructor/assign", {
      courseId,
      instructorId,
    }),

  assignMultiple: (courseId: string, instructorIds: string[]) =>
    api.post<{ successCount: number; failedCount: number }>(
      "/api/course-instructor/assign-multiple",
      { courseId, instructorIds },
    ),

  update: (id: string, instructorId: string) =>
    api.put<CourseInstructor>(`/api/course-instructor/update/${id}`, {
      instructorId,
    }),

  remove: (id: string) => api.delete(`/api/course-instructor/remove/${id}`),

  removeByIds: (courseId: string, instructorId: string) =>
    api.delete(
      `/api/course-instructor/remove-by-ids?courseId=${courseId}&instructorId=${instructorId}`,
    ),
};

export const authApi = {
  forgotPassword: (data: ForgotPasswordInput) =>
    api.post<BackendResponse>("/api/password/forgot-password", data),

  resetPassword: (data: ResetPasswordInput) =>
    api.post<BackendResponse>("/api/password/reset-password", data),
};

export const superAdminApi = {
  create: (data: CreateSuperAdminInput) =>
    api.post<BackendResponse>("/api/superAdmin/create-super-admin", data),

  changePassword: (data: PasswordChangeInput) =>
    api.post<BackendResponse>("/api/superAdmin/change-password", data),

  updateProfile: (data: Partial<UpdateProfileInput>) =>
    api.put<BackendResponse>("/api/superAdmin/profile", data),
};

export interface SchoolPackage {
  id: string;
  schoolId: string;
  curioCode: boolean;
  curioAi: boolean;
  curioBot: boolean;
  curioThink: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolWithPackages {
  schoolId: string;
  schoolName: string;
  domain: string;
  curioCode: boolean | null;
  curioAi: boolean | null;
  curioBot: boolean | null;
  curioThink: boolean | null;
}

export const packagesApi = {
  getAllSchoolsWithPackages: () =>
    api.get<SchoolWithPackages[]>("/api/packages/all-schools"),

  getBySchool: (schoolId: string) =>
    api.get<SchoolPackage>(`/api/packages/${schoolId}`),

  update: (
    schoolId: string,
    data: Partial<{
      curioCode: boolean;
      curioAi: boolean;
      curioBot: boolean;
      curioThink: boolean;
    }>,
  ) => api.put<SchoolPackage>(`/api/packages/${schoolId}`, data),

  toggle: (schoolId: string, packageName: string, enabled: boolean) =>
    api.post<SchoolPackage>(`/api/packages/${schoolId}/toggle`, {
      packageName,
      enabled,
    }),
};

// ============ Lecture Watched APIs ============

export interface LectureWatchProgress {
  id: string;
  studentId: string;
  lectureId: string;
  watchedTime: number;
  lastUpdated: string;
  lectureTitle?: string;
  lectureDescription?: string;
  lectureUrl?: string;
}

export const lectureWatchedApi = {
  updateProgress: (studentId: string, lectureId: string, watchedTime: number) =>
    api.post<LectureWatchProgress>("/api/lecture-watched/update", {
      studentId,
      lectureId,
      watchedTime,
    }),

  getProgress: (studentId: string, lectureId: string) =>
    api.get<LectureWatchProgress>(
      `/api/lecture-watched/progress/${studentId}/${lectureId}`,
    ),

  getStudentHistory: (studentId: string) =>
    api.get<{
      studentId: string;
      totalVideos: number;
      history: LectureWatchProgress[];
    }>(`/api/lecture-watched/history/${studentId}`),

  getRecentlyWatched: (studentId: string, limit?: number) =>
    api.get<LectureWatchProgress[]>(
      `/api/lecture-watched/recent/${studentId}${limit ? `?limit=${limit}` : ""}`,
    ),

  getLectureViewers: (lectureId: string) =>
    api.get<{ lectureId: string; totalViewers: number; viewers: any[] }>(
      `/api/lecture-watched/viewers/${lectureId}`,
    ),

  deleteProgress: (studentId: string, lectureId: string) =>
    api.delete(`/api/lecture-watched/${studentId}/${lectureId}`),
};

export const courseLectureApi = {
  getAll: () => api.get<CourseLecture[]>("/api/course-lecture/all"),

  getByCourse: (courseId: string) =>
    api.get<CourseLecture[]>(`/api/course-lecture/course/${courseId}/lectures`),

  getByLecture: (lectureId: string) =>
    api.get<CourseLecture[]>(
      `/api/course-lecture/lecture/${lectureId}/courses`,
    ),

  getAvailableLectures: (courseId: string) =>
    api.get<Lecture[]>(
      `/api/course-lecture/course/${courseId}/available-lectures`,
    ),

  assign: (courseId: string, lectureId: string) =>
    api.post<CourseLecture>("/api/course-lecture/assign", {
      courseId,
      lectureId,
    }),

  assignMultiple: (courseId: string, lectureIds: string[]) =>
    api.post<{ successCount: number; failedCount: number }>(
      "/api/course-lecture/assign-multiple",
      { courseId, lectureIds },
    ),

  update: (id: string, lectureId: string) =>
    api.put<CourseLecture>(`/api/course-lecture/update/${id}`, {
      lectureId,
    }),

  remove: (id: string) => api.delete(`/api/course-lecture/remove/${id}`),

  removeByIds: (courseId: string, lectureId: string) =>
    api.delete(
      `/api/course-lecture/remove-by-ids?courseId=${courseId}&lectureId=${lectureId}`,
    ),
};

// ============ Assignment APIs ============

export interface Assignment {
  id: string;
  lectureId: string;
  lectureTitle?: string;
  qnaId: string;
  difficultyLevel: "easy" | "medium" | "hard";
  qnaType: "mcq" | "coding" | "paragraph" | "blockly" | "blockly";
  assignmentLevel: number;
  createdAt?: string;
  questionDetails?: any;
  isQuestionCompleted?: boolean;
  isAssignmentCompleted?: boolean;
  description?: string;
}

export interface CreateAssignmentInput {
  lectureId: string;
  qnaId: string;
  difficultyLevel: "easy" | "medium" | "hard";
  qnaType: "mcq" | "coding" | "paragraph" | "blockly" | "blockly";
  assignmentLevel: number;
}

export const assignmentApi = {
  create: (data: CreateAssignmentInput) =>
    api.post<Assignment>("/api/assignment/create", data),

  createBulk: (
    lectureId: string,
    assignments: Omit<CreateAssignmentInput, "lectureId">[],
  ) =>
    api.post<{
      created: Assignment[];
      failed: any[];
      successCount: number;
      failedCount: number;
    }>("/api/assignment/create-bulk", { lectureId, assignments }),

  getAll: () => api.get<Assignment[]>("/api/assignment/"),

  getByLecture: (lectureId: string) =>
    api.get<{
      lectureId: string;
      lectureName: string;
      totalAssignments: number;
      assignments: Assignment[];
    }>(`/api/assignment/lecture/${lectureId}`),

  getById: (id: string) => api.get<Assignment>(`/api/assignment/${id}`),

  getWithProgress: (assignmentId: string, studentId: string) =>
    api.get<Assignment>(
      `/api/assignment/${assignmentId}/progress/${studentId}`,
    ),

  update: (
    id: string,
    data: Partial<{ difficultyLevel: string; assignmentLevel: number }>,
  ) => api.put<Assignment>(`/api/assignment/${id}`, data),

  delete: (id: string) => api.delete(`/api/assignment/${id}`),
};

// ============ QNA Completed APIs ============

export interface QnaCompleted {
  id: string;
  qnaId: string;
  studentId: string;
  status: "pending" | "completed" | "inProgress";
  qnaType?: string;
  completedAt?: string;
  isCompleted?: boolean;
  canSubmit?: boolean;
}

export interface StudentLectureProgress {
  lectureId: string;
  studentId: string;
  totalQuestions: number;
  completedQuestions: number;
  progress: number;
  isLectureCompleted: boolean;
  assignments: Array<
    Assignment & {
      isCompleted: boolean;
      status: string | null;
      canSubmit: boolean;
    }
  >;
}

export const qnaCompletedApi = {
  markInProgress: (qnaId: string) =>
    api.post<QnaCompleted>("/api/qna-completed/in-progress", {
      qnaId,
    }),

  markCompleted: (qnaId: string, status?: string) =>
    api.post<QnaCompleted & { assignmentAutoCompleted: boolean }>(
      "/api/qna-completed/complete",
      { qnaId, status: status || "completed" },
    ),

  getStatus: (studentId: string, qnaId: string) =>
    api.get<QnaCompleted>(`/api/qna-completed/status/${studentId}/${qnaId}`),

  getStudentCompletedQnas: (studentId: string) =>
    api.get<{ studentId: string; stats: any; qnas: QnaCompleted[] }>(
      `/api/qna-completed/student/${studentId}`,
    ),

  getStudentLectureProgress: (studentId: string, lectureId: string) =>
    api.get<StudentLectureProgress>(
      `/api/qna-completed/progress/${studentId}/${lectureId}`,
    ),
};

// ============ Assignment Completed APIs ============

export interface AssignmentCompleted {
  id: string;
  assignmentId: string;
  studentId: string;
  status: "pending" | "completed" | "inProgress";
  completedAt?: string;
  lectureId?: string;
  lectureTitle?: string;
  difficultyLevel?: string;
  qnaType?: string;
  assignmentLevel?: number;
}

export interface StudentOverallProgress {
  studentId: string;
  overallStats: {
    totalLectures: number;
    completedLectures: number;
    overallProgress: number;
  };
  lectureProgress: Array<{
    lectureId: string;
    lectureTitle: string;
    totalAssignments: number;
    completedAssignments: number;
    progress: number;
    isCompleted: boolean;
    updatedAt?: string;
  }>;
}

export const assignmentCompletedApi = {
  getStatus: (studentId: string, assignmentId: string) =>
    api.get<AssignmentCompleted>(
      `/api/assignment-completed/status/${studentId}/${assignmentId}`,
    ),

  getStudentCompletedAssignments: (studentId: string) =>
    api.get<{
      studentId: string;
      stats: any;
      assignments: AssignmentCompleted[];
    }>(`/api/assignment-completed/student/${studentId}`),

  getStudentOverallProgress: (studentId: string) =>
    api.get<StudentOverallProgress>(
      `/api/assignment-completed/student/${studentId}/overall`,
    ),

  getAssignmentAnalytics: (assignmentId: string) =>
    api.get<{
      assignmentId: string;
      totalCompletions: number;
      completedCount: number;
      completions: any[];
    }>(`/api/assignment-completed/analytics/assignment/${assignmentId}`),

  getLectureAnalytics: (lectureId: string) =>
    api.get<{
      lectureId: string;
      lectureName: string;
      totalAssignments: number;
      totalStudentsAttempted: number;
      studentsCompleted: number;
      studentProgress: any[];
    }>(`/api/assignment-completed/analytics/lecture/${lectureId}`),
};

export interface Comment {
  id: string;
  content: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  studentImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const commentApi = {
  create: (assignmentId: string, content: string) =>
    api.post<Comment>("/api/comment/create", {
      assignmentId,
      content,
    }),

  getByAssignment: (assignmentId: string) =>
    api.get<{
      assignmentId: string;
      totalComments: number;
      comments: Comment[];
    }>(`/api/comment/assignment/${assignmentId}`),

  getCommentCount: (assignmentId: string) =>
    api.get<{ assignmentId: string; count: number }>(
      `/api/comment/assignment/${assignmentId}/count`,
    ),

  getByStudent: (studentId: string) =>
    api.get<{ studentId: string; totalComments: number; comments: Comment[] }>(
      `/api/comment/student/${studentId}`,
    ),

  getById: (id: string) => api.get<Comment>(`/api/comment/${id}`),

  update: (id: string, content: string) =>
    api.put<Comment>(`/api/comment/${id}`, { content }),

  delete: (id: string) => api.delete(`/api/comment/${id}`),
};

// ============ Analytics APIs ============

export interface DashboardStats {
  counts: {
    students: number;
    lectures: number;
    courses: number;
    assignments: number;
  };
  activity: {
    completedAssignments: number;
    totalAttempted: number;
    activeLearners: number;
    totalWatchTimeMinutes: number;
  };
  rates: {
    completionRate: number;
    activeRate: number;
  };
}

export interface TopPerformer {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentClass?: string;
  studentLevel: number;
  completedCount: number;
  totalWatchTimeMinutes: number;
}

export interface StudentNeedingAttention {
  id: string;
  name: string;
  email: string;
  class?: string;
  level: number;
  progress: number;
  completedAssignments: number;
  videosWatched: number;
}

export interface LectureEngagement {
  lectureId: string;
  title: string;
  description: string;
  viewerCount: number;
  totalWatchTimeMinutes: number;
  averageWatchTime: number;
  assignmentCount: number;
  completedAssignments: number;
}

export interface DifficultyAnalysis {
  byDifficulty: {
    difficulty: string;
    totalAssignments: number;
    totalAttempts: number;
    completedCount: number;
    completionRate: number;
  }[];
  byType: {
    type: string;
    totalAssignments: number;
    completedCount: number;
  }[];
}

export interface SchoolStats {
  schoolId: string;
  schoolName: string;
  domain: string;
  studentCount: number;
  completedAssignments: number;
  totalWatchTimeMinutes: number;
  activeStudents: number;
  activeRate: number;
}

export interface ActivityItem {
  type: "assignment_completed" | "video_watched" | "comment_added";
  studentId: string;
  studentName: string;
  detail: string;
  timestamp: string;
}

export interface ClassBreakdown {
  class: string;
  studentCount: number;
  averageLevel: number;
  totalCompletedAssignments: number;
  averageCompletedPerStudent: number;
  totalWatchTimeMinutes: number;
  averageWatchTimePerStudent: number;
}

export interface LevelProgression {
  totalStudents: number;
  averageLevel: number;
  distribution: {
    level: number;
    studentCount: number;
    percentage: number;
  }[];
}

export const analyticsApi = {
  getDashboardStats: (schoolId?: string) =>
    api.get<DashboardStats>(
      `/api/analytics/dashboard${schoolId ? `?schoolId=${schoolId}` : ""}`,
    ),

  getTopPerformers: (limit?: number, schoolId?: string) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (schoolId) params.append("schoolId", schoolId);
    return api.get<TopPerformer[]>(
      `/api/analytics/top-performers${params.toString() ? `?${params.toString()}` : ""}`,
    );
  },

  getStudentsNeedingAttention: (threshold?: number, schoolId?: string) => {
    const params = new URLSearchParams();
    if (threshold) params.append("threshold", threshold.toString());
    if (schoolId) params.append("schoolId", schoolId);
    return api.get<{
      threshold: number;
      count: number;
      students: StudentNeedingAttention[];
    }>(
      `/api/analytics/needs-attention${params.toString() ? `?${params.toString()}` : ""}`,
    );
  },

  getLectureEngagement: () =>
    api.get<LectureEngagement[]>("/api/analytics/lecture-engagement"),

  getAssignmentDifficultyAnalysis: () =>
    api.get<DifficultyAnalysis>("/api/analytics/assignment-difficulty"),

  getSchoolWiseStats: () =>
    api.get<SchoolStats[]>("/api/analytics/school-stats"),

  getRecentActivity: (limit?: number, schoolId?: string) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (schoolId) params.append("schoolId", schoolId);
    return api.get<ActivityItem[]>(
      `/api/analytics/recent-activity${params.toString() ? `?${params.toString()}` : ""}`,
    );
  },

  getClassBreakdown: (schoolId: string) =>
    api.get<ClassBreakdown[]>(
      `/api/analytics/class-breakdown?schoolId=${schoolId}`,
    ),

  getLevelProgression: (schoolId?: string) =>
    api.get<LevelProgression>(
      `/api/analytics/level-progression${schoolId ? `?schoolId=${schoolId}` : ""}`,
    ),
};

// ============ Profile APIs ============

export const profileApi = {
  get: () => api.get("/api/me"),

  update: (data: UpdateProfileInput) => api.put("/api/me", data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/api/me/password", data),
};

// Export all as a single object for convenience
export const apiService = {
  student: studentApi,
  admin: adminApi,
  school: schoolApi,
  course: courseApi,
  instructor: instructorApi,
  lecture: lectureApi,
  courseLecture: courseLectureApi,
  question: questionApi,
  courseInstructor: courseInstructorApi,
  auth: authApi,
  superAdmin: superAdminApi,
  profile: profileApi,
  packages: packagesApi,
  lectureWatched: lectureWatchedApi,
  assignment: assignmentApi,
  qnaCompleted: qnaCompletedApi,
  assignmentCompleted: assignmentCompletedApi,
  comment: commentApi,
  analytics: analyticsApi,
};

export default apiService;
