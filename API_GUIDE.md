# API Service - Usage Guide

## Overview

All API calls are centralized in `/src/services/api.service.ts` for easy management and reuse across the application.

## Quick Start

```tsx
import { studentApi, courseApi } from "@/services/api.service";

// Create a student
const handleCreate = async () => {
  const { success, data, error } = await studentApi.create({
    name: "John Doe",
    email: "john@example.com",
    class: "10A",
    role: "individual",
    level: "0"
  });

  if (success) {
    console.log("Student created:", data);
  } else {
    console.error("Error:", error);
  }
};
```

## Available Services

### Student API
```tsx
studentApi.create(data)           // Create single student
studentApi.createFromCSV(file)    // Upload CSV of students
studentApi.getAll()               // Get all students
studentApi.getById(id)            // Get student by ID
studentApi.update(id, data)       // Update student
studentApi.delete(id)             // Delete student
```

### Admin API
```tsx
adminApi.create(data)
adminApi.createFromCSV(file)
adminApi.getAll()
adminApi.getById(id)
adminApi.update(id, data)
adminApi.delete(id)
```

### School API
```tsx
schoolApi.create(data)
schoolApi.createFromCSV(file)
schoolApi.getAll()
schoolApi.getById(id)
schoolApi.update(id, data)
schoolApi.delete(id)
```

### Course API
```tsx
courseApi.create(data)
courseApi.getAll()
courseApi.getById(id)
courseApi.update(id, data)
courseApi.delete(id)
```

### Instructor API
```tsx
instructorApi.create(data)
instructorApi.getAll()
instructorApi.getById(id)
instructorApi.update(id, data)
instructorApi.delete(id)
```

### Lecture API
```tsx
lectureApi.create(data)
lectureApi.getAll()
lectureApi.getById(id)
lectureApi.update(id, data)
lectureApi.delete(id)
```

### Question API
```tsx
questionApi.create(data)
questionApi.getAll()
questionApi.getById(id)
questionApi.update(id, data)
questionApi.delete(id)
```

### Auth API
```tsx
authApi.forgotPassword({ email })
authApi.resetPassword({ token, password })
authApi.createSuperAdmin({ name, email, password })
```

### Profile API
```tsx
profileApi.get()
profileApi.update({ name, email, picture })
profileApi.updatePassword({ currentPassword, newPassword })
```

## Features

✅ **Auto Headers** - Automatically adds `x-school-domain` and `Content-Type`  
✅ **TypeScript** - Full type safety with interfaces  
✅ **FormData** - Handles file uploads correctly  
✅ **Simple API** - Clean async/await pattern  
✅ **Error Handling** - Consistent error responses  

## Response Format

All API calls return:
```typescript
{
  success: boolean,
  data?: T,           // Response data (if successful)
  error?: string      // Error message (if failed)
}
```

## Examples

### Creating a Course
```tsx
const handleCreateCourse = async () => {
  const { success, error } = await courseApi.create({
    courseName: "Introduction to React",
    courseDetail: "Learn React fundamentals",
    courseImage: "https://example.com/image.jpg",
    link: { url: "https://course.com" }
  });

  if (success) {
    alert("Course created!");
  } else {
    alert(error);
  }
};
```

### Uploading CSV
```tsx
const handleCSVUpload = async (file: File) => {
  const { success, data, error } = await studentApi.createFromCSV(file);

  if (success && data) {
    console.log(`${data.successCount} succeeded, ${data.failedCount} failed`);
  }
};
```

### Deleting a Resource
```tsx
const handleDelete = async (id: string) => {
  const { success } = await courseApi.delete(id);
  
  if (success) {
    // Remove from local state
    setCourses(courses.filter(c => c.id !== id));
  }
};
```

## API Client Utils

The underlying API client (`@/util/api`) provides:

```tsx
import { api } from "@/util/api";

// Direct API calls if needed
api.get<User[]>("/api/users")
api.post("/api/users", data)
api.put("/api/users/1", data)
api.patch("/api/users/1", partialData)
api.delete("/api/users/1")
```

This is useful for one-off API calls not in the service file.
