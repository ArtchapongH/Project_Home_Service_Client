# อธิบายหน้า `/technician/jobs`

ไฟล์หลัก:

- `src/app/technician/jobs/page.tsx`
- `src/components/technician/jobs/TechnicianJobList.tsx`
- `src/app/technician/jobs/[assignmentId]/page.tsx`
- `src/components/technician/jobs/TechnicianJobDetail.tsx`

## 1. หน้าที่ของหน้า

แสดงงานที่ช่างรับแล้วและยังต้องดำเนินการ สถานะที่ถือว่า active คือ `ACCEPTED` และ `IN_PROGRESS`

## 2. Route file มีเพียง 5 บรรทัดเพราะอะไร

`jobs/page.tsx` import `TechnicianJobList` แล้ว render `<TechnicianJobList mode="active" />`

นี่เป็นแนวคิด thin route: route รับผิดชอบเลือก mode ส่วน data fetching, state และ UI อยู่ใน component เพื่อให้ History reuse ได้

## 3. `TechnicianJobList.tsx`: Logic

### บรรทัด 1–10 — Imports

- React hooks สำหรับ state/effect/memo
- `Link` สำหรับไปหน้ารายละเอียด
- `ExternalLink`, `Search` เป็น UI icons
- Context สำหรับรายการบริการของช่าง
- API service สำหรับโหลด jobs
- formatter แยก presentation logic ของราคา/วันเวลา

### บรรทัด 12 — Props contract

`mode` รับได้เพียง `"active" | "history"` TypeScript จึงป้องกันการส่งค่าผิด และ component เดียวเปลี่ยนพฤติกรรมได้ตามหน้า

### บรรทัด 13–19 — State

| State | หน้าที่ |
|---|---|
| `jobs` | ข้อมูลทั้งหมดจาก endpoint jobs |
| `search` | รหัส/คำค้น |
| `serviceId` | บริการที่เลือก |
| `sort` | newest, oldest หรือ nearest |
| `loading` | loading UI |
| `error` | API error UI |

### บรรทัด 21–32 — `loadJobs`

เปิด loading, ล้าง error, เรียก `getTechnicianJobs` พร้อม filters แล้วบันทึก `result.data` หากล้มเหลวแปลง error เป็นข้อความ และปิด loadingใน `finally`

dependency `[search, serviceId, sort]` ทำให้ callback สร้างใหม่เมื่อ filter เปลี่ยน

### บรรทัด 34–37 — Debounce filter

รอ 250ms ก่อนเรียก API และ cleanup timeout เก่าเมื่อผู้ใช้เปลี่ยน filter ต่อ ลด request ที่ไม่จำเป็น

### บรรทัด 39–44 — `visibleJobs`

`useMemo` กรองรายการตาม mode:

```text
active  → ACCEPTED หรือ IN_PROGRESS
history → COMPLETED หรือ CANCELLED
```

การใช้ `useMemo` ทำให้คำนวณใหม่เฉพาะเมื่อ `jobs` หรือ `mode` เปลี่ยน

### บรรทัด 45 — `basePath`

กำหนด URL ปลายทางของปุ่ม detail ถ้า active ไป `/technician/jobs/:id` ถ้า history ไป `/technician/history/:id`

## 4. UI List

### บรรทัด 49–54 — Header search

Search เป็น controlled input บน mobile กว้างเต็มพื้นที่และ desktop กลับเป็น 192px ด้วย `md:w-48`

### บรรทัด 55–81 — Filter controls

- options ของ service มาจาก `profile.services` จึงแสดงเฉพาะบริการที่ช่างรับ
- sort value cast เป็น union เดียวกับ state
- mobile เป็น grid เต็มความกว้าง
- desktop ใช้ `md:flex` และ select กว้าง 224px

### บรรทัด 83–87 — Error/loading/empty

ใช้ conditional rendering เพื่อไม่แสดง table/card ก่อนข้อมูลพร้อม

### บรรทัด 89–104 — Mobile cards

`md:hidden` ทำให้แสดงเฉพาะต่ำกว่า 768px แต่ละ card แสดงชื่อบริการ วันนัด รหัส และราคา ปุ่มรายละเอียดมี `size-11` หรือ 44px เพื่อแตะง่าย

`grid-cols-[96px_minmax(0,1fr)]` สร้างคอลัมน์ label 96px และ value ที่ย่อได้ ป้องกัน order code ล้นด้วย `break-all`

### บรรทัด 106–121 — Desktop table

`hidden md:table` รักษาตารางเดิมตั้งแต่ 768px ขึ้นไป Header กำหนดชื่อคอลัมน์ ส่วน tbody map งานเป็นแถว ปุ่ม Action ใช้ assignmentId สร้าง URL

## 5. หน้ารายละเอียด

### Dynamic route

ไฟล์ `[assignmentId]/page.tsx` รับ `params`, await ค่า `assignmentId` แล้วส่งให้ `TechnicianJobDetail` Next.js ใช้ชื่อ folder ในวงเล็บเหลี่ยมเป็น dynamic segment

### `TechnicianJobDetail.tsx`

| ช่วงบรรทัด | หน้าที่ |
|---|---|
| 1–9 | Imports |
| 11 | รับ `assignmentId` และ optional `history` |
| 12–13 | เก็บ job/error |
| 15–17 | เรียก `getTechnicianJob` เมื่อ id เปลี่ยน |
| 19 | เลือก back URL ตาม mode |
| 20–21 | error/loading early return |
| 22 | รวมรายการย่อยเป็นข้อความ |
| 25–29 | Header และปุ่มย้อนกลับ |
| 30–44 | Detail card และ definition list |

บน mobile `<dl>` เป็นหนึ่งคอลัมน์เพื่ออ่านง่าย ส่วน desktop ใช้ `md:grid-cols-[180px_minmax(0,1fr)]` ให้ label/value อยู่สองคอลัมน์

## 6. API connection

`getTechnicianJobs(filters)` เรียก GET `/api/technicians/me/jobs` ส่วน `getTechnicianJob(assignmentId)` เรียก GET `/api/technicians/me/jobs/:assignmentId`

UI ไม่ import Axios โดยตรง จึงเปลี่ยน API/mock ได้ใน service layer จุดเดียว

## 7. ประโยคสำหรับตอบผู้สอน

> หน้า Jobs ใช้ thin route ส่ง mode active เข้า shared list component ตัว component เป็นผู้ดูแล filter, debounce, API และ status filtering ส่วน responsive render mobile card กับ desktop table จากข้อมูลชุดเดียวกัน จึงไม่ duplicate business logic

