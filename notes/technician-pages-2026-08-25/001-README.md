# Technician และ Profile Code Notes — 25 สิงหาคม 2026

ชุดเอกสารนี้ใช้อ่านเตรียมอธิบายโค้ดหน้าที่แก้ไขล่าสุด โดยอ้างอิงโค้ดใน branch `feature/technician-mobile-dashboard`

> หมายเหตุ: หมายเลขบรรทัดอ้างอิงโค้ด ณ วันที่ 25 สิงหาคม 2026 หากแก้ไฟล์ภายหลังหมายเลขอาจเลื่อน แต่ชื่อ function และลำดับการทำงานยังใช้ค้นหาได้

## ลำดับที่แนะนำให้อ่าน

1. `01-technician-layout-navigation-note.md` — โครงสร้างร่วม, Guard, Sidebar และ Mobile Drawer
2. `02-technician-requests-note.md` — หน้า `/technician/requests`
3. `03-technician-jobs-note.md` — หน้า `/technician/jobs` และหน้ารายละเอียด
4. `04-technician-history-note.md` — หน้า `/technician/history` และการ reuse component
5. `05-technician-settings-note.md` — หน้า `/technician/settings`
6. `06-profile-page-note.md` — หน้า `/profile` และ `ProfileCard2`
7. `07-presentation-cheat-sheet.md` — สรุปคำพูดและคำถามที่อาจถูกถาม

## คำศัพท์ที่ใช้ในเอกสาร

| คำ | ความหมาย |
|---|---|
| Route/Page | ไฟล์ภายใต้ `src/app` ที่ Next.js ใช้สร้าง URL |
| UI Component | ส่วนที่รับผิดชอบการแสดงผล เช่น Card, Header, Drawer |
| Logic | การตัดสินใจ จัดการ state เรียก API กรองข้อมูล หรือรับ event |
| State | ข้อมูลที่เปลี่ยนระหว่างใช้งานและทำให้ React render ใหม่ |
| Context | state กลางที่หลายหน้าใช้ร่วมกัน |
| Service Layer | ฟังก์ชันที่ซ่อนรายละเอียด Axios/API ออกจาก UI |
| Responsive | การเปลี่ยน layout ตามความกว้างจอ เช่น `md:hidden` |

## ภาพรวมการเชื่อมต่อ

```text
Browser URL
  → Next.js page.tsx
  → TechnicianRouteShell / Guard / Layout
  → Page component
  → UI components
  → TechnicianContext (ข้อมูลช่างร่วมกัน)
  → technicianApi.ts (service layer)
  → apiClient (token/interceptor/base URL)
  → Express backend
  → repository / PostgreSQL
```

## ประโยคสรุปสำหรับอธิบายผู้สอน

> ผมแยก route, business logic, UI component, shared context และ API service ออกจากกัน หน้า route จึงไม่ต้องรู้รายละเอียด Axios ส่วน responsive ใช้ mobile-first class โดย desktop เริ่มที่ breakpoint `md` หรือ 768px ทำให้เพิ่ม mobile UI ได้โดยไม่เปลี่ยน desktop behavior
