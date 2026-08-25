# อธิบายหน้า `/technician/settings`

ไฟล์หลัก:

- `src/app/technician/settings/page.tsx`
- `src/components/technician/settings/LocationControl.tsx`
- `src/services/publicServiceApi.ts`
- `src/services/technicianApi.ts`

## 1. หน้าที่ของหน้า

ให้ช่างแก้ชื่อ นามสกุล เบอร์โทร ที่อยู่ สถานะพร้อมให้บริการ พิกัดปัจจุบัน และรายการบริการที่รับซ่อม

## 2. Data flow

```text
TechnicianContext.profile
  → เติมค่าเริ่มต้นของ form
Public Service API
  → รายการ checkbox ทั้งหมด
ผู้ใช้แก้ controlled inputs
  → local state
กดยืนยัน
  → updateTechnicianSettings(payload)
  → backend
  → profile ล่าสุด
  → setProfile(updated)
  → ทุกหน้า Technician เห็นข้อมูลใหม่
```

## 3. อธิบาย Logic ตามบรรทัด

### บรรทัด 1–9 — Imports

`"use client"` เพราะมี form state/effects จากนั้น import shared header, location component, context, public service API, technician API และ type ของบริการ

### บรรทัด 11–22 — State

| ค่า | หน้าที่ |
|---|---|
| `profile` | ข้อมูลช่างล่าสุดจาก Context |
| `setProfile` | อัปเดตข้อมูลกลางหลัง save/location |
| `initializedProfileId` | ป้องกัน effect เติม form ซ้ำและทับสิ่งที่ผู้ใช้กำลังพิมพ์ |
| `services` | บริการทั้งหมดสำหรับ checkbox |
| `firstName`–`address` | controlled form fields |
| `isAvailable` | switch พร้อมให้บริการ |
| `serviceIds` | id ของบริการที่เลือก |
| `saving` | disable ปุ่มระหว่างบันทึก |
| `message` | success/error message |

### บรรทัด 24–26 — โหลดบริการทั้งหมด

Effect ทำครั้งเดียวหลัง mount เพราะ dependency เป็น `[]` เรียก `getPublicServices({ limit: 100 })` แล้วเก็บผล หาก error เปลี่ยน message

### บรรทัด 28–37 — Sync profile เข้า form

Context อาจโหลด profile หลัง page render ครั้งแรก Effect จึงรอ `profile` เมื่อได้ข้อมูลจะเติม local state

เงื่อนไข `initializedProfileId.current === profile.technicianId` สำคัญ เพราะถ้า Context เปลี่ยน object จากการ refresh location โดยยังเป็นช่างคนเดิม จะไม่ reset form fields ที่ผู้ใช้กำลังแก้

### บรรทัด 39 — Early return

ถ้ายังไม่มี profile ไม่ render form เพื่อป้องกันอ่าน property จาก null โดย guard/layout จะเป็นผู้ดูแล loading/error หลัก

### บรรทัด 41–43 — `toggleService`

ใช้ functional state update เพื่ออ่านค่าล่าสุด:

- ถ้ามี id อยู่แล้ว ใช้ `filter` เอาออก
- ถ้ายังไม่มี ใช้ spread เพิ่มเข้า array

นี่เป็น immutable update ไม่แก้ array เดิมโดยตรง React จึงตรวจพบ state change

### บรรทัด 45–53 — `cancelChanges`

คืนทุก field เป็นค่าจาก profile ล่าสุด และล้าง message ไม่ต้องเรียก API เพราะเป็นการยกเลิกเฉพาะ draft ใน browser

### บรรทัด 55–74 — `save`

1. เปิด saving และล้าง message
2. สร้าง payload โดย trim ชื่อ และเปลี่ยนค่าว่าง optional เป็น null
3. เรียก PATCH settings ผ่าน service layer
4. response เป็น `TechnicianProfile` ล่าสุด
5. `setProfile(updated)` อัปเดต Context
6. แสดง success
7. catch แปลง API error
8. finally ปิด saving เสมอ

## 4. อธิบาย UI

### Header actions บรรทัด 78–92

mobile ใช้ grid สองคอลัมน์ ปุ่มยกเลิก/ยืนยันขนาดเท่ากัน desktop ใช้ `md:flex` และ padding เดิม ปุ่มถูก disable ระหว่าง save ป้องกันส่งซ้ำ

### Account fields บรรทัด 93–151

แต่ละ input เป็น controlled component:

```text
value={state}
onChange={event => setState(event.target.value)}
```

mobile layout เป็นคอลัมน์เดียวโดย default ส่วน `md:grid-cols-[130px_268px_1fr]` สร้าง 3 คอลัมน์บน desktop: label, input, location action

### LocationControl บรรทัด 143–148

ส่ง profile และ callback `onUpdated` ลง component ลูก เมื่อบันทึกพิกัดสำเร็จ ลูกส่งค่ากลับ แล้วหน้าแม่ merge เข้า Context

### Availability switch บรรทัด 154–177

checkbox จริงถูกซ่อนด้วย `sr-only` แต่ยังเข้าถึงได้ด้วย keyboard/screen reader ส่วน span สองตัววาด track และ knob ผ่าน Tailwind `peer-checked:*`

### Services บรรทัด 180–191

map รายการ services เป็น checkbox `checked={serviceIds.includes(service.id)}` ทุก label สูงอย่างน้อย 44px บน mobile เพื่อแตะง่าย

## 5. `LocationControl.tsx`

### Logic

- บรรทัด 5–13 แปลง Geolocation error code
- บรรทัด 22–23 เก็บ loading/message
- บรรทัด 25–53 ตรวจ browser support และเรียก `navigator.geolocation.getCurrentPosition`
- callback success ส่ง lat/lng ไป `updateTechnicianLocation`
- `onUpdated(result)` แจ้งหน้าแม่
- options ใช้ accuracy สูง, timeout 10 วินาที, cache ได้ 60 วินาที

### UI

- ปุ่ม refresh เต็มความกว้าง mobile และ auto width desktop
- แสดงเวลาที่อัปเดตล่าสุดผ่าน `formatThaiDateTime`
- message ใช้ `role="status"`

## 6. API

| Action | Endpoint |
|---|---|
| โหลด profile | GET `/api/technicians/me` |
| บันทึก settings | PATCH `/api/technicians/me/settings` |
| บันทึกพิกัด | PATCH `/api/technicians/me/location` |
| โหลดบริการ | Public services endpoint ผ่าน `getPublicServices` |

## 7. ประโยคสำหรับตอบผู้สอน

> หน้า Settings แยก server profile ใน Context ออกจาก form draft ใน local state เพื่อให้ยกเลิกได้โดยไม่เรียก API เมื่อ save สำเร็จจึงอัปเดต Context ให้หน้า Requests และ Sidebar เห็นสถานะใหม่ ส่วน LocationControl แยก Browser Geolocation ออกเป็น component ลูกและสื่อสารกลับด้วย callback

