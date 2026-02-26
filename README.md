# EasyCode Frontend

> A modern, interactive learning platform for kids built with Next.js 16, React 19, and TypeScript. Features include coding playgrounds, video lectures, assessments, and comprehensive course management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Key Features](#key-features)
- [Development](#development)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

EasyCode Frontend is a comprehensive learning management system designed specifically for children. It provides an engaging, interactive platform for coding education, video-based learning, assessments, and progress tracking. The application supports multi-tenancy with school-specific branding and content.

## ✨ Features

### Core Learning Features
- **Interactive Code Editor**: Monaco Editor integration with Python execution via Pyodide
- **Visual Programming**: Blockly integration for visual coding education
- **Video Lectures**: Seamless video playback with progress tracking
- **Assessment System**: MCQs, coding challenges, and paragraph-based questions
- **Progress Dashboard**: Track learning progress and completed assignments
- **Course Management**: Browse and enroll in structured learning paths

### User Experience
- **Dark/Light Theme**: System-aware theme switching with next-themes
- **Responsive Design**: Mobile-first, fully responsive design
- **Multi-tenant Support**: School-specific branding and domains
- **Authentication**: Secure authentication with Better Auth
- **Real-time Feedback**: Instant code execution and validation
- **Analytics**: Performance tracking and engagement metrics

### Admin Features
- **Content Management**: Create and manage courses, lectures, and assessments
- **User Management**: Manage students, instructors, and administrators
- **Analytics Dashboard**: Comprehensive insights into student performance
- **Bulk Import**: CSV import for students and content
- **School Configuration**: Customize branding and settings

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.1.1**: React framework with App Router and Turbopack
- **React 19.2.3**: Latest React with concurrent features
- **TypeScript 5.9.3**: Type-safe development

### UI & Styling
- **Radix UI**: Accessible component primitives (@radix-ui/themes)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, consistent icons
- **next-themes**: Theme management with dark mode support
- **Embla Carousel**: Smooth, performant carousels

### Code Editor & Execution
- **Monaco Editor**: VS Code's editor (via @monaco-editor/react)
- **Pyodide**: Python runtime in the browser
- **Blockly**: Google's visual programming library

### Forms & State
- **React Hook Form**: Performant form management
- **React Hot Toast**: Beautiful notifications
- **classnames**: Conditional className utility

### Analytics & Monitoring
- **Vercel Analytics**: Performance monitoring
- **Vercel Speed Insights**: Core Web Vitals tracking

### Authentication
- **Better Auth**: Modern authentication library

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit linting

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- pnpm (recommended) or npm
- Backend API running (see [easycode-backend](../easycode-backend))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/careercafe-in/easycode-frontend.git
cd easycode-frontend
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**
```bash
pnpm dev
```

The application will start on `http://localhost:3000` with Turbopack enabled for fast refresh.

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
easycode-frontend/
├── public/                 # Static assets
│   ├── turtle.js          # Turtle graphics library
│   ├── about/             # About page images
│   ├── brand-logo/        # Brand assets
│   ├── hero/              # Hero section images
│   ├── icon/              # App icons
│   └── logo/              # Logo variants
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── layout.tsx     # Root layout with providers
│   │   ├── page.tsx       # Home page
│   │   ├── globals.css    # Global styles
│   │   ├── metadata.ts    # SEO metadata configuration
│   │   ├── (auth)/        # Auth routes (login, signup)
│   │   ├── (dashboard)/   # Dashboard routes
│   │   ├── courses/       # Course pages
│   │   ├── lectures/      # Lecture viewer
│   │   ├── assignments/   # Assignment pages
│   │   └── ...
│   ├── component/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── forms/         # Form components
│   │   ├── layouts/       # Layout components
│   │   ├── CodeEditor/    # Monaco editor wrapper
│   │   ├── BlocklyEditor/ # Blockly integration
│   │   └── ...
│   ├── services/          # API service layer
│   │   ├── api.service.ts # Centralized API client
│   │   └── auth.service.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── ...
│   ├── lib/               # Utility libraries
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── data/              # Static data and constants
│   ├── i18n/              # Internationalization (planned)
│   └── proxy.ts           # API proxy configuration
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── postcss.config.mjs     # PostCSS configuration
└── API_GUIDE.md           # API integration guide
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# School Domain (for multi-tenancy)
NEXT_PUBLIC_SCHOOL_DOMAIN=default.easycode.com

# Analytics (Production)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_BLOCKLY=true
NEXT_PUBLIC_ENABLE_PYTHON_EDITOR=true
```

### Required Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `BETTER_AUTH_SECRET`: Secret for authentication
- `NEXT_PUBLIC_SCHOOL_DOMAIN`: School domain for tenant resolution

## 🎨 Key Features

### 1. Interactive Code Editor

The application includes a powerful code editor with real-time execution:

```typescript
import CodeEditor from '@/component/CodeEditor';

<CodeEditor
  language="python"
  defaultValue="print('Hello, World!')"
  onRun={(code) => executePython(code)}
  height="500px"
/>
```

**Features:**
- Syntax highlighting
- IntelliSense and autocomplete
- Error detection
- Python execution via Pyodide
- Test case validation

### 2. Visual Programming with Blockly

For younger learners, visual programming with Blockly:

```typescript
import BlocklyEditor from '@/component/BlocklyEditor';

<BlocklyEditor
  onCodeChange={(code) => console.log(code)}
  initialBlocks={savedBlocks}
/>
```

### 3. Video Lectures

Seamless video playback with progress tracking:

```typescript
import VideoPlayer from '@/component/VideoPlayer';

<VideoPlayer
  src={lecture.url}
  onProgress={(progress) => saveLectureProgress(progress)}
  onComplete={() => markLectureComplete()}
/>
```

### 4. Assessment System

Three types of assessments:

#### Multiple Choice Questions (MCQ)
```typescript
<MCQQuestion
  question={question}
  options={options}
  onAnswer={(answer) => submitAnswer(answer)}
/>
```

#### Coding Challenges
```typescript
<CodingChallenge
  question={question}
  testCases={testCases}
  onSubmit={(code) => validateCode(code)}
/>
```

#### Paragraph Questions
```typescript
<ParagraphQuestion
  question={question}
  keywords={keywords}
  onSubmit={(answer) => submitAnswer(answer)}
/>
```

### 5. Theme Support

Dark/Light mode with system preference detection:

```typescript
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</button>
```

## 👨‍💻 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing
pnpm test             # Run Jest tests
pnpm test:watch       # Run tests in watch mode
```

### Development Guidelines

#### Component Structure
```typescript
// component/ExampleComponent/ExampleComponent.tsx
interface ExampleComponentProps {
  title: string;
  onAction: () => void;
}

export default function ExampleComponent({ title, onAction }: ExampleComponentProps) {
  return (
    <div className="p-4 rounded-lg bg-background">
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

#### Custom Hooks
```typescript
// hooks/useExample.ts
import { useState, useEffect } from 'react';

export function useExample(id: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data logic
  }, [id]);

  return { data, loading };
}
```

#### API Services
See [API_GUIDE.md](./API_GUIDE.md) for detailed API integration documentation.

```typescript
import { studentApi } from '@/services/api.service';

// Fetch students
const { success, data, error } = await studentApi.getAll();

// Create student
const result = await studentApi.create({
  name: "John Doe",
  email: "john@example.com",
  level: "0",
  role: "individual"
});
```

### Styling Guidelines

Using Tailwind CSS with Radix UI:

```typescript
<div className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h2>
</div>
```

### TypeScript Best Practices

```typescript
// Define types
interface Student {
  id: string;
  name: string;
  email: string;
  level: number;
  role: 'individual' | 'school';
}

// Use types in components
function StudentCard({ student }: { student: Student }) {
  return <div>{student.name}</div>;
}
```

## 🔌 API Integration

The application uses a centralized API service for all backend communication. See [API_GUIDE.md](./API_GUIDE.md) for comprehensive documentation.

### Quick Example

```typescript
import { courseApi, lectureApi } from '@/services/api.service';

// Fetch courses
const courses = await courseApi.getAll();

// Create lecture
const lecture = await lectureApi.create({
  title: "Introduction to Python",
  description: "Learn Python basics",
  url: "https://example.com/video.mp4",
  courseId: "course-id"
});
```

### Error Handling

```typescript
const { success, data, error } = await studentApi.create(studentData);

if (success) {
  toast.success("Student created successfully");
  router.push('/students');
} else {
  toast.error(error || "Failed to create student");
}
```

### Authentication

```typescript
import { authApi } from '@/services/api.service';

// Login
const result = await authApi.signIn({
  email: "user@example.com",
  password: "password123"
});

// Get session
const session = await authApi.getSession();
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Import project on [Vercel](https://vercel.com)
- Configure environment variables
- Deploy

### Environment Variables in Vercel

Add the following in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`
- `BETTER_AUTH_SECRET`
- `NEXT_PUBLIC_SCHOOL_DOMAIN`
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`

### Docker Deployment

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### Build Configuration

```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone', // For Docker
  images: {
    domains: ['your-cdn.com'],
  },
  experimental: {
    serverActions: true,
  },
};
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react';
import StudentCard from '@/component/StudentCard';

describe('StudentCard', () => {
  it('renders student information', () => {
    const student = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    render(<StudentCard student={student} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## 🤝 Contributing

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Checklist

- [ ] Code follows TypeScript and React best practices
- [ ] Components are properly typed
- [ ] No console.logs in production code
- [ ] Responsive design implemented
- [ ] Accessibility considerations (ARIA labels, keyboard navigation)
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Tests added/updated
- [ ] Documentation updated

## 📝 License

Private - Copyright (c) 2025 Career Cafe

## 🙋 Support

For issues or questions:
- **Documentation**: See [API_GUIDE.md](./API_GUIDE.md)
- **Issues**: Create an issue on GitHub
- **Backend**: [easycode-backend](../easycode-backend)

## 🗺️ Roadmap

### Current Features
- ✅ Interactive code editor with Python execution
- ✅ Visual programming with Blockly
- ✅ Video lecture playback
- ✅ Assessment system (MCQ, Coding, Paragraph)
- ✅ Progress tracking
- ✅ Dark/Light theme
- ✅ Multi-tenant support

### Planned Features
- [ ] Internationalization (i18n) support - for backend as well
- [ ] Real-time collaboration
- [ ] Live coding sessions
- [ ] Gamification elements
- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Enhanced analytics dashboard
- [ ] Social learning features
- [ ] AI-powered code suggestions
- [ ] Voice-guided tutorials

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with code splitting
- **Image Optimization**: Next.js Image component

## 🔒 Security

- XSS protection with React
- CSRF protection
- Secure authentication
- Environment variable validation
- Content Security Policy headers
- Regular dependency updates

---

**Built with ❤️ by Career Cafe Team**

**Empowering the next generation of coders** 🚀
