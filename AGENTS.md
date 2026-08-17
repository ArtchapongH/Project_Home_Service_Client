<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Frontend Development Guidelines

ยินดีต้อนรับ AI Agents และนักพัฒนาสู่โครงการ **Home Service Client (Frontend)** เอกสารนี้สรุปมาตรฐาน รูปแบบสถาปัตยกรรม ข้อตกลงในการเขียนโค้ด (Coding Conventions) และคำสั่งที่สำคัญ เพื่อให้การแก้ไข พัฒนา และดูแลรักษาโค้ดเป็นไปในทิศทางเดียวกัน

---

## 1. Project Overview & Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **UI Component Library**: Material UI (MUI v9) + `@mui/icons-material`
- **Theme**: MUI Custom Theme (`src/theme/muiTheme.ts`)
- **CSS Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + MUI `sx` prop
- **Data Fetching**: Axios / Fetch API Client connecting to Express Backend
- **Backend & Database Context**: Express API Server + Supabase (PostgreSQL, Auth, Storage)

---

## 2. Directory Structure Conventions

โครงสร้างซอร์สโค้ดหลักจะถูกจัดให้อยู่ในโฟลเดอร์ `src/` เพื่อความเป็นระเบียบและสม่ำเสมอ:

```
Project_Home_Service_Client/
├── app/                      # Next.js App Router (Pages, Layouts, API routes)
│   ├── layout.tsx            # Root Layout
│   ├── page.tsx              # Home Page
│   ├── admin/                # Admin Panel Routes
│   ├── login/                # Authentication Routes
│   └── profile/              # User Profile Routes
├── src/                      # Source Code Core Components & Logic
│   ├── components/           # Reusable UI Components
│   │   ├── admin/            # Admin-specific components (e.g. ServiceForm, ServiceTable)
│   │   ├── layout/           # Shared Layout components (Navbar, Footer, Sidebar)
│   │   ├── providers/        # App Provider wrappers (MUI ThemeProvider, Context Providers)
│   │   └── common/           # Shared UI atomic components
│   ├── contexts/             # React Context Providers for Global State (e.g. ServiceContext)
│   ├── services/             # API Service Layer & Axios endpoints (e.g. serviceApi.ts)
│   ├── types/                # TypeScript Interfaces & Types (e.g. service.ts)
│   ├── theme/                # MUI Theme tokens & configuration (muiTheme.ts)
│   ├── hooks/                # Custom React Hooks
│   ├── utils/                # Helper functions & Utilities
│   └── assets/               # Static images, icons, and media
```

> **Rule for Agents**: 
> - สับเปลี่ยนและย้าย UI Components ใหม่ทั้งหมดเข้าไว้ใน `src/components/` (หลีกเลี่ยงการสร้างโฟลเดอร์ `components/` ซ้ำซ้อนที่ Root)
> - หน้ารับ Route ใน `app/` ควรทำหน้าที่รับ Parameters/Page level logic แล้วเรียกใช้ Components จาก `src/components/`

---

## 3. Styling Guidelines (MUI + Tailwind CSS)

โครงการนี้ใช้เทคโนโลยี Styling ร่วมกันระหว่าง **Material UI** และ **Tailwind CSS**:

1. **Material UI Components (Primary UI)**
   - ใช้ส่วนประกอบหลักจาก `@mui/material` เช่น `<Button>`, `<TextField>`, `<Paper>`, `<Dialog>`, `<Typography>` เพื่อคงความสม่ำเสมอของ Design System
   - กำหนดค่าผ่าน `muiTheme.ts` (เช่น Font: Prompt, Primary Color: `#3366FF`, Border Radius: `8px`)
   - ปรับแต่ง styling ราย component ด้วย `sx` prop หรือ Theme palette

2. **Tailwind CSS (Layout & Utility Classes)**
   - ใช้ Tailwind CSS สำหรับจัดโครงสร้าง Layout และ Positioning อย่างรวดเร็ว เช่น `flex`, `grid`, `gap-4`, `p-6`, `items-center`, `justify-between`, `responsive breakpoints`
   - หลีกเลี่ยงการเขียน CSS แบบ Inline Style ทั่วไป ให้ใช้ Tailwind class หรือ MUI `sx` แทน

---

## 4. API & Service Layer Pattern

1. **Separation of Concerns**
   - ห้ามเขียน `axios` หรือ `fetch` Directives ลงใน UI Component โดยตรง
   - ให้แยก API logic ทั้งหมดไว้ที่ `src/services/` (เช่น `src/services/serviceApi.ts`, `src/services/auth.service.ts`)

2. **Type Safety**
   - อินเทอร์เฟซของ Request DTO และ Response Data ต้องนิยามไว้ใน `src/types/` (เช่น `src/types/service.ts`)
   - ฟังก์ชันใน Service จะต้องคืนค่าเป็น `Promise<T>` ที่ระบุประเภทข้อมูลชัดเจนเสมอ ห้ามใช้ `any`

3. **Fallback & Error Handling**
   - จัดการ `try...catch` และแสดง Error Log ที่อ่านเข้าใจง่าย
   - รองรับกรณีระบบกำลังเชื่อมต่อ Backend API หรือต้องการ Mock Data ระหว่างทดสอบ

---

## 5. State Management & Form Handling

1. **Global State**:
   - ใช้ **React Context API** สำหรับ State ที่ต้องแชร์ข้ามหลายหน้า/คอมโพเนนต์ (เช่น User Auth State, Service List Context) 
   - วาง Context ไว้ใน `src/contexts/` และส่งผ่าน App ทาง `src/components/providers/`

2. **Form & Local State**:
   - ใช้ **React Controlled Components (`useState`, `useRef`)** สำหรับจัดการข้อมูลฟอร์มภายในหน้า
   - มีการตรวจสอบความถูกต้องของข้อมูล (Validation) และแสดง Error Message บน UI ให้ชัดเจนก่อน Submit

---

## 6. Coding Conventions & Best Practices

1. **Client vs Server Components**:
   - ใส่ `"use client";` ที่บรรทัดแรกของไฟล์เสมอ สำหรับคอมโพเนนต์ที่มี Interaction, State (`useState`), Effects (`useEffect`), หรือ MUI Dynamic Handlers
2. **TypeScript Strictness**:
   - หลีกเลี่ยงการใช้ `any`
   - ใช้ Explicit Return Types สำหรับ Async Functions และ Handler Types
3. **Naming Conventions**:
   - Component Files: `PascalCase.tsx` (เช่น `ServiceForm.tsx`)
   - Services & Utilities: `camelCase.ts` หรือ `name.service.ts` (เช่น `serviceApi.ts`)
   - Types & Interfaces: `PascalCase` (เช่น `ServiceItem`, `CreateServiceInput`)

---

## 7. Useful Commands

- `npm run dev` — เริ่มต้นพัฒนาใน Local Development Server (`localhost:3000`)
- `npm run build` — ตรวจสอบและ Build Production Bundle
- `npm run lint` — รัน ESLint เพื่อตรวจสอบข้อผิดพลาดในรูปแบบโค้ด
