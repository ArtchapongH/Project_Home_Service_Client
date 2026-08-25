# อธิบายหน้า `/technician/history`

ไฟล์หลัก:

- `src/app/technician/history/page.tsx`
- `src/components/technician/jobs/TechnicianJobList.tsx`
- `src/app/technician/history/[assignmentId]/page.tsx`
- `src/components/technician/jobs/TechnicianJobDetail.tsx`

## 1. แนวคิดสำคัญ: Reuse แทน Duplicate

History ไม่สร้าง list component ใหม่ แต่ใช้

```tsx
<TechnicianJobList mode="history" />
```

Jobs ใช้ component เดียวกันด้วย `mode="active"` ความต่างถูกควบคุมด้วย prop จึงมี source of truth เดียวสำหรับ search, filter, sort, loading, error, mobile cards และ desktop table

## 2. สิ่งที่ `mode="history"` เปลี่ยน

| จุด | Active Jobs | History |
|---|---|---|
| Header | รายการที่รอดำเนินการ | ประวัติการซ่อม |
| สถานะที่แสดง | ACCEPTED, IN_PROGRESS | COMPLETED, CANCELLED |
| Detail URL | `/technician/jobs/:id` | `/technician/history/:id` |
| ข้อความ breadcrumb detail | บริการที่รับ | ประวัติการซ่อม |
| Back URL | `/technician/jobs` | `/technician/history` |

## 3. Route page ทีละบรรทัด

| บรรทัด | คำอธิบาย |
|---|---|
| 1 | import shared list component |
| 3 | ประกาศ Next.js page component |
| 4 | render list ด้วย history mode |
| 5 | ปิด function |

Route จึงเป็น Server Component ได้ เพราะไม่มี state/event ของตัวเอง ส่วน `TechnicianJobList` มี `"use client"` และรับผิดชอบ interaction

## 4. History filtering logic

ใน `TechnicianJobList` บรรทัด 39–44:

```text
ถ้า mode เป็น active
  เก็บ ACCEPTED หรือ IN_PROGRESS
ถ้าไม่ใช่ (history)
  เก็บ COMPLETED หรือ CANCELLED
```

เหตุผลที่กรองอีกชั้นใน frontendคือ endpoint jobs อาจคืนหลายสถานะ แต่หน้า History มีหน้าที่แสดงเฉพาะงานที่จบหรือยกเลิก

## 5. History detail route

ไฟล์ `history/[assignmentId]/page.tsx`:

1. Next.js อ่าน dynamic parameter จาก URL
2. await `params`
3. ส่ง `assignmentId` และ prop `history` เข้า `TechnicianJobDetail`

การเขียน `<TechnicianJobDetail assignmentId={assignmentId} history />` เท่ากับ `history={true}`

## 6. การทำงานเมื่อผู้ใช้กดดูรายละเอียด

```text
กด icon บน card/table
  → Link ไป /technician/history/{assignmentId}
  → dynamic page อ่าน assignmentId
  → TechnicianJobDetail mount
  → useEffect เรียก getTechnicianJob(id)
  → เก็บ response ใน job state
  → render รายละเอียด
```

## 7. Logic กับ UI

### Logic

- prop `mode`
- กรอง status ด้วย `useMemo`
- สร้าง `basePath`
- โหลด/filter/sort API
- detail fetch จาก assignmentId
- back URL ตาม history flag

### UI

- Search/filter controls
- Mobile card (`md:hidden`)
- Desktop table (`hidden md:table`)
- Detail definition list
- DirectionsLink

## 8. ประโยคสำหรับตอบผู้สอน

> History ไม่ได้ copy โค้ดจาก Jobs แต่ส่ง mode history เข้า shared component จากนั้น component กรองเฉพาะ COMPLETED/CANCELLED และเปลี่ยน base path ส่วน detail ก็ reuse component เดิมโดยส่ง boolean history ทำให้แก้ responsive หรือ loading state ครั้งเดียวมีผลทั้งสองหน้า

