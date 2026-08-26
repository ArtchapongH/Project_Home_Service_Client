# อธิบาย Technician Layout และ Navigation

ไฟล์สำคัญ:

- `src/app/technician/layout.tsx`
- `src/components/technician/layout/TechnicianRouteShell.tsx`
- `src/components/technician/layout/TechnicianGuard.tsx`
- `src/components/technician/layout/TechnicianLayout.tsx`
- `src/components/technician/layout/TechnicianSidebar.tsx`
- `src/components/technician/shared/TechnicianPageHeader.tsx`

## 1. ทำไมต้องมี Layout ร่วม

ทุก URL ใต้ `/technician` ต้องใช้ authentication, profile ของช่าง, Sidebar และพื้นหลังเหมือนกัน Next.js App Router จึงใช้ `layout.tsx` ครอบ page ทุกหน้า ทำให้ไม่ต้องเขียน Guard/Sidebar ซ้ำ

```text
src/app/technician/layout.tsx
  → TechnicianProvider
  → TechnicianRouteShell
      ├─ /technician/login → แสดงหน้า login ตรงๆ
      └─ route อื่น → TechnicianGuard
                       → TechnicianLayout
                          ├─ TechnicianSidebar
                          └─ page children
```

## 2. `TechnicianLayout.tsx` ทีละบรรทัด

| บรรทัด | คำอธิบาย |
|---|---|
| 1 | import `ReactNode` เพื่อกำหนด type ของ children |
| 2 | import Sidebar |
| 4 | ประกาศ reusable layout component |
| 5–9 | return wrapper แบบ flex เต็มความสูงจอ |
| 6 | render Sidebar ก่อน content |
| 7 | `min-w-0` ป้องกัน content ดัน flex container ล้น; `flex-1` ใช้พื้นที่ที่เหลือ; `pt-16 md:pt-0` เว้น mobile top bar 64px แต่ desktop ไม่เว้น |

## 3. `TechnicianSidebar.tsx`: Logic

### บรรทัด 1–15 — setup และรายการเมนู

`"use client"` จำเป็นเพราะ component อ่าน URL, เปิด drawer, logout และจับ keyboard event

`items` เป็น configuration array หนึ่งชุดสำหรับสร้างทั้ง desktop sidebar และ mobile drawer ลดการเขียนเมนูซ้ำ แต่ละ item มี `href`, label และ icon component

### บรรทัด 18–24 — Hooks และ state

| ค่า | หน้าที่ |
|---|---|
| `pathname` | URL ปัจจุบัน ใช้หา active menu |
| `router` | redirect หลัง logout |
| `logout` | AuthContext action |
| `requestCount` | จำนวนคำขอจาก TechnicianContext |
| `open` | เปิด/ปิด mobile drawer |
| `closeButtonRef` | อ้าง DOM ปุ่มปิดเพื่อย้าย keyboard focus |
| `activeItem` | หา title ของหน้าปัจจุบันจาก pathname |

### บรรทัด 26–39 — Drawer side effect

Effect ทำงานเมื่อ `open` เปลี่ยน:

1. ถ้า drawer ปิด ให้จบทันที
2. จำค่า `document.body.style.overflow` เดิม
3. สร้าง keyboard handler เพื่อปิดเมื่อกด Escape
4. ตั้ง overflow เป็น hidden ป้องกันพื้นหลัง scroll
5. subscribe `keydown`
6. focus ปุ่มปิด ช่วยผู้ใช้ keyboard/screen reader
7. cleanup คืน overflow และถอด listener เมื่อปิดหรือ unmount

นี่คือ Logic ไม่ใช่ UI เพราะเป็นการ synchronize React state กับ Browser DOM

### บรรทัด 41–44 — Logout

รอ `logout()` ล้าง token/context ก่อน แล้วใช้ router ไป `/technician/login`

### บรรทัด 46–71 — Navigation factory

`navigation(onNavigate?)` คืน JSX เมนูชุดเดียวเพื่อ reuse สองตำแหน่ง

- `items.map` สร้าง Link
- `pathname.startsWith(href)` คำนวณ active state
- active ใช้พื้นหลังเข้มกว่า
- request menu แสดง badge เฉพาะ count มากกว่า 0
- `onNavigate` มีเฉพาะ drawer เพื่อปิดหลังเลือกหน้า
- ปุ่ม logout ใช้ `mt-auto` ดันไปด้านล่าง

## 4. `TechnicianSidebar.tsx`: UI

### Desktop บรรทัด 75–80

`hidden ... md:flex` หมายถึงซ่อนต่ำกว่า 768px และแสดง desktop sidebar ตั้งแต่ 768px ขึ้นไป `sticky top-0 h-screen w-64` ทำให้เมนูสูงเต็มจอและค้างขณะเลื่อน

### Mobile top bar บรรทัด 82–90

`fixed inset-x-0 top-0 z-30 md:hidden` ทำให้ bar ติดด้านบนเฉพาะ mobile มี logo, ชื่อ active page และปุ่ม hamburger ขนาดแตะ 44px

ARIA สำคัญ:

- `aria-expanded` บอกสถานะ drawer
- `aria-controls` เชื่อมปุ่มกับ element เมนู
- `aria-label` ให้ชื่อปุ่มไอคอนแก่ screen reader

### Mobile drawer บรรทัด 92–107

render เฉพาะ `open === true`

- wrapper เต็ม viewport และ z-index สูงกว่า top bar
- backdrop เป็นปุ่มเต็มพื้นที่ แตะเพื่อปิด
- `role="dialog"` และ `aria-modal="true"` บอกว่าเป็น modal navigation
- ความกว้าง `min(82vw, 320px)` ไม่เกิน 320px แต่จอเล็กใช้ 82%
- reuse `navigation(() => setOpen(false))`

## 5. `TechnicianPageHeader.tsx`

รับ `title` และ optional `children` ซึ่งมักเป็น search/filter/action buttons

- ถ้าไม่มี children mobile จะซ่อน header เพราะชื่อหน้าอยู่ใน mobile top barแล้ว
- desktop ใช้ `md:flex` จึงยังแสดง header เดิม
- title ซ่อนบน mobile ด้วย `hidden md:block`
- wrapper ของ children มี `min-w-0` ป้องกัน input/filter ดันหน้าล้น

## 6. แยก Logic กับ UI

| Logic | UI |
|---|---|
| อ่าน pathname | สี active menu |
| state `open` | hamburger/drawer |
| Escape handler | backdrop |
| body scroll lock | logo/title |
| logout + redirect | icon และ badge |
| requestCount จาก Context | responsive Tailwind classes |

## 7. ประโยคสำหรับตอบผู้สอน

> Layout ใช้ Next.js nested layout ครอบ route ทุกหน้า ส่วน Sidebar เป็น client component เพราะต้องอ่าน pathname และมี interaction ผมสร้างเมนูจาก config array ชุดเดียวเพื่อใช้ทั้ง desktop และ mobile สำหรับ mobile ใช้ drawer แบบ modal พร้อม Escape, focus และ scroll lock ขณะที่ desktop sidebar เดิมถูกควบคุมด้วย breakpoint `md`

