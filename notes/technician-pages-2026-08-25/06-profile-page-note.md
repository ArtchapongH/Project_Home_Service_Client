# อธิบายหน้า `/profile` และ `ProfileCard2`

ไฟล์หลัก:

- `src/app/profile/page.tsx`
- `src/components/profile/profile-card2.tsx`
- `src/services/profile.service.ts`
- `src/types/user.ts`
- Backend: `src/validators/user.validator.mjs`, `src/repositories/user.repository.mjs`

## 1. หน้าที่ของหน้า

แสดงและแก้ไขชื่อที่แสดง ชื่อจริง นามสกุล อีเมล เบอร์โทร รูปโปรไฟล์ และแสดง role ของผู้ใช้ ปัจจุบัน route ใช้ `ProfileCard2` แทน `ProfileCard` เดิม

## 2. `profile/page.tsx` ทีละส่วน

### บรรทัด 1–3 — Imports

- `CustomerServicesSideNav` คือเมนูด้านข้างของ user area
- `ProtectedRoute` ป้องกันคนที่ยังไม่ login
- `ProfileCard2` คือ UI + form logic หลัก

### บรรทัด 5–8 — Metadata

Next.js นำ title/description ไปสร้าง `<title>` และ meta description ฝั่ง server

### บรรทัด 10–37 — Layout UI

1. `ProtectedRoute` ครอบทั้งหมด
2. wrapper เป็น flex column เต็มความสูง
3. blue hero แสดงชื่อหน้า
4. main กำหนด responsive spacing
5. container จำกัดความกว้าง 1140px
6. ต่ำกว่า 801px menu กับ content เรียงแนวตั้ง
7. ตั้งแต่ 801px ใช้ `flex-row`
8. `min-w-0` ป้องกัน ProfileCard ดัน layout ล้น
9. render `<ProfileCard2 />`

ไฟล์ page ไม่มี form logic เป็น thin page ที่จัด composition ของ components

## 3. `ProfileCard2`: Constants และ Helpers

### บรรทัด 1–17 — Client/imports

เป็น Client Component เพราะใช้ state/effect/file input/form events Import service layer แทนเรียก Axios ใน UI และ import `UserProfile` เพื่อไม่ใช้ `any`

### บรรทัด 19–28 — Validation constants

| Constant | เหตุผล |
|---|---|
| `MAX_PROFILE_IMAGE_SIZE` | 5MB เขียนเป็น bytes |
| `ALLOWED_PROFILE_IMAGE_TYPES` | ให้ตรงกับ backend multer |
| `PHONE_PATTERN` | เบอร์ไทยขึ้นต้น 0 และมี 9–10 หลัก |
| `EMAIL_PATTERN` | ต้องมีข้อความก่อน/หลัง @ และมี dot |
| `NAME_PATTERN` | รองรับตัวอักษร Unicode/ภาษาไทย เครื่องหมายเว้นวรรค apostrophe และ hyphen |

### บรรทัด 30–47 — `getErrorMessage`

รับ `unknown` แทน `any` แล้วตรวจโครงสร้างทีละชั้น:

1. ถ้าไม่ใช่ object คืน fallback
2. ถ้ามี Axios-like `response.data.message` คืนข้อความจาก backend
3. หากเป็น Error ปกติ ใช้ `message`
4. หากไม่ตรงรูปแบบ คืน fallback

วิธีนี้รักษา Type Safety และป้องกันอ่าน property จาก null

## 4. State และการโหลดข้อมูล

### บรรทัด 54–67 — State/ref

| State/ref | หน้าที่ |
|---|---|
| `profile` | server snapshot ล่าสุดและข้อมูล avatar/role |
| `displayName`–`phone` | form draft ที่ผู้ใช้แก้ได้ |
| `preview` | temporary object URL ของรูปก่อน upload เสร็จ |
| `saving` | disable ปุ่ม save/cancel |
| `error` | validation/API error |
| `ok` | success message |
| `fileInputRef` | เปิด hidden file input จากปุ่ม custom |

### บรรทัด 69–76 — `syncProfile`

เป็น helper กลางที่รับ response `UserProfile` แล้ว sync ทั้ง server snapshot และ form fields ใช้หลัง initial load, save และ avatar upload ป้องกันแต่ละ flow เติม state ไม่เหมือนกัน

### บรรทัด 78–86 — Initial fetch

Effect ทำครั้งเดียวหลัง mount เรียก `getMyProfile()` หากสำเร็จ sync form หากล้มเหลวแสดงข้อความผ่าน `getErrorMessage`

## 5. Avatar Upload Logic

### บรรทัด 88–116 — `handleAvatarChange`

1. อ่านไฟล์แรกจาก input
2. reset `event.target.value` เพื่อให้เลือกไฟล์เดิมซ้ำได้
3. return ถ้าไม่ได้เลือก
4. ตรวจ MIME ด้วย allowlist ไม่ใช้ `image/*` เพราะ backend ไม่รับ SVG
5. ตรวจขนาดไม่เกิน 5MB
6. สร้าง object URL สำหรับ preview ทันที
7. เรียก `uploadMyAvatar(file)`
8. sync profile จาก response และ refresh AuthContext เพื่อให้ Navbar avatar เปลี่ยนด้วย
9. แสดง success/แปลง error
10. `finally` revoke object URL ป้องกัน memory leak และล้าง preview

### บรรทัด 118–120 — เปิด file picker

ปุ่ม UI เรียก `fileInputRef.current?.click()` เครื่องหมาย `?.` ป้องกัน error หาก ref ยังไม่มี DOM element

## 6. Controlled input handlers

บรรทัด 122–138 แยก handler สำหรับแต่ละ field ทุก handler รับ `ChangeEvent<HTMLInputElement>` แล้วเก็บ `event.target.value` ลง state

นี่คือ UI interaction logic: input ไม่แก้ server ทันที แต่แก้ draft ก่อน

## 7. Save Logic

### บรรทัด 140–181 — `handleSubmit`

1. `event.preventDefault()` ป้องกัน browser reload หน้า
2. ถ้ายังไม่มี profile ให้หยุด
3. trim/normalize fields หนึ่งครั้ง
4. validate display name 2–80 ตัวอักษร
5. validate รูปแบบชื่อด้วย Unicode regex
6. first/last เป็น optional แต่ถ้ากรอกต้องอย่างน้อย 2 ตัวและรูปแบบถูกต้อง
7. validate email และ phone
8. เปิด saving ล้างข้อความเก่า
9. สร้าง `UpdateProfileInput`
10. `fullName` และ `displayName` ใช้ชื่อที่แสดงเพื่อ compatibility กับ backend เดิม
11. ค่าว่างของ first/last/phone เปลี่ยนเป็น null เพื่อสั่งล้างข้อมูล
12. รอ PATCH API
13. sync response และ refresh AuthContext
14. แสดง success
15. catch แปลง error
16. finally ปิด saving เสมอ

## 8. Cancel และ Render States

### บรรทัด 183–191 — Cancel

คืน form draft จาก `profile` ซึ่งเป็น server snapshot ล่าสุด ล้าง error/success และไม่เรียก API

### บรรทัด 194–208 — Early rendering

- ถ้าโหลดไม่สำเร็จและไม่มี profile แสดง alert
- ถ้ายังไม่มี profile และไม่มี error แสดง loading
- ช่วยให้ JSX หลักด้านล่างมั่นใจว่า profile ไม่เป็น null

### บรรทัด 210–211 — Display values

เลือกชื่อ fallback เป็น `User` และเลือกรูป preview ก่อน avatarUrl เพื่อให้ผู้ใช้เห็นไฟล์ใหม่ทันที

## 9. Main UI บรรทัด 213–393

### Avatar section

- `<figure>` เป็นวงกลม
- ถ้ามี URL ใช้ Next `<Image fill>`
- ถ้าไม่มีรูปใช้ตัวอักษรแรก
- file input ซ่อนด้วย `sr-only` แต่ยัง accessible
- `accept` ช่วยจำกัด file picker
- custom button ใช้ Camera icon

### Form fields

ใช้ semantic `<dl>`, `<dt>`, `<dd>` เพื่อแสดงคู่ label/value ทุก label เชื่อม input ด้วย `htmlFor` และ `id`

Layout default เป็นหนึ่งคอลัมน์ mobile และ `sm:grid-cols-[160px_1fr]` เป็นสองคอลัมน์ตั้งแต่ 640px

### Role

แสดง `profile.role` อย่างเดียว ไม่มี input เพราะผู้ใช้ไม่ควรแก้ role ด้วยตนเอง

### Messages และ actions

- success ใช้สีเขียว
- error ใช้สีแดง
- cancel/save ถูก disable ระหว่าง saving
- submit button เปลี่ยนข้อความเป็น “กำลังบันทึก...”

## 10. Frontend Service Layer

`profile.service.ts` แยกเป็นสามฟังก์ชัน:

| Function | Method/URL |
|---|---|
| `getMyProfile` | GET `/api/users/me` |
| `updateMyProfile` | PATCH `/api/users/me` |
| `uploadMyAvatar` | POST `/api/users/me/avatar` แบบ multipart/form-data |

ทุกฟังก์ชันกำหนด generic response type จึงคืน `UserProfile` โดยไม่ใช้ `any`

## 11. Backend Connection

### Validator

`validateUpdateProfile` trim/validate fields และแยกความหมาย:

- field ไม่ถูกส่ง → `undefined` หมายถึงรักษาค่าเดิม
- field ถูกส่งเป็นค่าว่าง → `null` หมายถึงล้างค่า

### Repository

SELECT คืน `fullName`, `displayName`, `firstName`, `lastName` โดย `displayName` ใช้ `full_name` ที่มีอยู่เพื่อไม่บังคับ migration ใหม่

UPDATE ใช้ `CASE WHEN` สำหรับ first/last เพื่อให้ client รุ่นเก่าที่ไม่ส่ง field ไม่ลบค่าเดิม

## 12. Tests ที่เพิ่ม

`profile-card2.test.tsx` ตรวจ:

1. โหลดชื่อแยก field ถูกต้อง
2. save ส่ง normalized payload และ sync response
3. ปฏิเสธ SVG ก่อนเรียก upload API
4. ปฏิเสธอีเมลที่ browser อาจยอมรับแต่ backend ไม่ยอมรับ

Backend validator tests ตรวจ accepted payload, omitted fields, explicit clearing และ invalid data

## 13. Logic กับ UI

| Logic | UI Component |
|---|---|
| validation regex | card container |
| API calls | avatar circle |
| `syncProfile` | upload button |
| form state | input rows |
| submit/cancel | success/error text |
| file validation/preview cleanup | action buttons |
| AuthContext refresh | responsive grid |

## 14. ประโยคสำหรับตอบผู้สอน

> Route Profile รับผิดชอบ layout ส่วน ProfileCard2 เป็น client form component ผมใช้ local draft แยกจาก server snapshot เพื่อรองรับ Cancel และ sync response หลัง Save การเรียก API แยกใน service layer ส่วน backend contract รองรับ displayName, firstName และ lastName โดยใช้ undefined เพื่อรักษาค่าเดิมและ null เพื่อล้างค่า

