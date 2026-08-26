# อธิบายหน้า `/technician/requests`

ไฟล์หลัก: `src/app/technician/requests/page.tsx`

หน้าที่ของหน้านี้คือแสดงคำขอบริการที่ช่างสามารถรับได้ โดยพิจารณาจากสถานะพร้อมทำงาน บริการที่ช่างรับ และตำแหน่งของช่างในรัศมีที่ backend กำหนด

## 1. การเชื่อมต่อของหน้า

```text
/technician/requests
  → TechnicianRequestsPage
  → useTechnician() รับ profile + requestCount กลาง
  → readBrowserLocation() ขอพิกัดจาก Browser
  → updateTechnicianLocation() บันทึกพิกัด
  → getTechnicianRequests() โหลดคำขอ
  → ServiceRequestCard แสดงแต่ละงาน
  → AcceptRequestDialog ยืนยันก่อนรับงาน
  → accept/decline API
  → โหลดรายการใหม่และอัปเดต badge ที่ Sidebar
```

## 2. แยก Logic และ UI

### Logic

- State บรรทัด 25–36
- ตรวจสถานะและพิกัด บรรทัด 38–40
- โหลดคำขอ บรรทัด 42–80
- debounce การค้นหา บรรทัด 82–85
- อ่านและบันทึกตำแหน่ง บรรทัด 87–105
- auto locate ครั้งแรก บรรทัด 107–112
- รับงาน บรรทัด 114–136
- ปฏิเสธงาน บรรทัด 138–151

### UI

- Header/filter/search บรรทัด 153–181
- Location banner และข้อความสถานะ บรรทัด 182–206
- Available/Unavailable/loading/empty states บรรทัด 208–234
- รายการ ServiceRequestCard บรรทัด 236–248
- AcceptRequestDialog บรรทัด 250–258

## 3. อธิบายโค้ดตามช่วงบรรทัด

### บรรทัด 1 — `"use client"`

ประกาศว่าไฟล์นี้เป็น Client Component เพราะใช้ `useState`, `useEffect`, Browser Geolocation และ event handlers หากไม่มีบรรทัดนี้ Next.js จะถือเป็น Server Component และใช้ hooks เหล่านี้ไม่ได้

### บรรทัด 3–22 — Imports

| Import | หน้าที่ |
|---|---|
| React hooks | เก็บ state, ทำ side effect, memoize function และเก็บค่าไม่ให้หายระหว่าง render |
| `Link` | เปลี่ยนหน้าแบบ client-side navigation |
| `Bell`, `Search` | ไอคอน UI |
| `TechnicianPageHeader` | Header ร่วมของทุกหน้า Technician |
| `AcceptRequestDialog` | Modal ยืนยันก่อนรับงาน ป้องกันการกดผิด |
| `CurrentLocationBanner` | UI แสดงตำแหน่งและปุ่มรีเฟรช |
| `readBrowserLocation` | Logic ครอบ `navigator.geolocation` เป็น Promise |
| `ServiceRequestCard` | UI ของคำขอหนึ่งงาน |
| `useTechnician` | อ่าน/แก้ profile และ badge count จาก Context |
| ฟังก์ชันจาก `technicianApi` | Service layer เชื่อม backend หรือ mock |
| `TechnicianJob` | TypeScript contract ของข้อมูลงาน |
| `formatThaiDateTime` | แปลงวันเวลาเป็นรูปแบบภาษาไทย |

### บรรทัด 24–36 — Component และ State

`TechnicianRequestsPage` เป็น component หลักของ route

| State/ref | ใช้ทำอะไร |
|---|---|
| `jobs` | รายการคำขอที่โหลดมา |
| `search` | keyword จากช่องค้นหา |
| `serviceId` | service ที่เลือกกรอง |
| `loading` | ควบคุม loading state |
| `actionId` | จำว่างานใดกำลัง accept/decline เพื่อ disable เฉพาะการ์ดนั้น |
| `selected` | งานที่กำลังเปิด dialog ยืนยันรับ |
| `error` | ข้อความผิดพลาดจาก API |
| `success` | ข้อความสำเร็จหลังรับ/ปฏิเสธ |
| `locationLoading` | สถานะขณะขอพิกัด |
| `locationMessage` | ข้อความผิดพลาดจาก geolocation |
| `didAutoLocate` | ref ป้องกัน auto locate ซ้ำเมื่อ component render ใหม่ |

`profile`, `setProfile`, `setRequestCount` มาจาก Context ไม่ใช่ local state เพราะ Sidebar และหน้า Settings ต้องใช้ข้อมูลเดียวกัน

### บรรทัด 38–40 — Derived values

ดึง latitude/longitude จาก profile หากไม่มีให้เป็น `null` แล้วสร้าง `hasCoordinates` เพื่อให้เงื่อนไข UI อ่านง่าย แทนที่จะเช็ค lat/lng ซ้ำหลายจุด

### บรรทัด 42–80 — `loadRequests`

นี่คือ Logic หลักของหน้า

1. ถ้าช่าง `isAvailable === false` จะล้างรายการและ badge แล้วหยุดทันที
2. ถ้ายังไม่มีพิกัด จะยังไม่เรียก API เพราะ backend ต้องใช้ตำแหน่งค้นหางานใกล้ช่าง
3. ก่อน request ตั้ง `loading=true` และล้าง error เก่า
4. เรียก `getTechnicianRequests` พร้อม service, search, latitude, longitude
5. `search || undefined` ทำให้ค่าว่างไม่ถูกส่งเป็น query parameter
6. เมื่อสำเร็จ เก็บงานใน `jobs` และนำ `meta.total` ไปใส่ Context เพื่อแสดง badge ที่เมนู
7. เมื่อผิดพลาด ใช้ `getTechnicianApiError` แปลง error ที่ไม่ทราบชนิดเป็นข้อความปลอดภัย
8. `finally` ปิด loading ไม่ว่า request สำเร็จหรือไม่

ใช้ `useCallback` เพื่อให้ function มี reference คงที่จนกว่า dependency จะเปลี่ยน เหมาะกับการนำไปใส่ dependency ของ `useEffect`

### บรรทัด 82–85 — Debounce

เมื่อ search/service/location เปลี่ยน `loadRequests` จะเปลี่ยนตาม Effect จึงตั้งเวลา 250ms ก่อนโหลด หากผู้ใช้พิมพ์ต่อ cleanup จะยกเลิก timeout เก่า ลดจำนวน API calls

### บรรทัด 87–105 — `refreshLocation`

1. ป้องกันทำงานถ้ายังไม่มี profile
2. เปิด loading ของ location
3. เรียก `readBrowserLocation()` เพื่อขอสิทธิ์และรับพิกัดจาก browser
4. ส่งพิกัดเข้า `updateTechnicianLocation`
5. merge ผลลัพธ์กลับเข้า profile ด้วย `{ ...profile, ...result }`
6. หน้าอื่นที่ใช้ Context จะเห็นตำแหน่งใหม่ทันที
7. แปลง Geolocation error เป็นข้อความภาษาไทย
8. ปิด loading ใน `finally`

### บรรทัด 107–112 — Auto locate

Effect นี้ทำงานเมื่อช่างพร้อมรับงานแต่ยังไม่มีพิกัด `didAutoLocate.current` ทำหน้าที่เป็น flag ที่เปลี่ยนค่าได้โดยไม่ทำให้ render ใหม่ จึงป้องกัน browser ขอ Location ซ้ำ

### บรรทัด 114–136 — `confirmAccept`

- ถ้าไม่มี `selected` จะไม่ทำงาน
- ใช้ `orderId` เป็น actionId
- เรียก POST accept ผ่าน service layer
- ปิด dialog แสดง success แล้ว refresh รายการ
- ถ้า code เป็น `ORDER_ALREADY_ASSIGNED` แสดงข้อความเฉพาะว่าช่างอื่นรับไปแล้ว
- refresh แม้เกิด conflict เพื่อให้ UI ตรงกับ server

### บรรทัด 138–151 — `decline`

รับ `job` จากการ์ด เรียก decline API แสดงผล แล้วโหลดรายการใหม่ รูปแบบ `void decline(job)` ใน JSX หมายถึง event handler ไม่รอ Promise และจงใจไม่คืน Promise ให้ React

## 4. UI และ Responsive

### Header บรรทัด 155–181

- แสดง filter/search เฉพาะเมื่อ `profile.isAvailable`
- `flex-col md:flex-row` หมายถึง mobile เรียงแนวตั้ง และตั้งแต่ 768px เรียงแนวนอน
- `w-full md:w-auto` ทำให้ field เต็มจอบนมือถือ แต่ขนาดเดิมบน desktop
- input เป็น controlled component เพราะ value มาจาก state และ `onChange` เป็นผู้แก้ state

### Location Banner บรรทัด 183–192

หน้าแม่ส่งข้อมูลและ callback ลง component ลูก วิธีนี้เรียกว่า props down / events up: ลูกแสดงผล แต่การแก้ state จริงอยู่ที่หน้าแม่

### Conditional rendering บรรทัด 208–234

ลำดับเงื่อนไขมีความสำคัญ:

```text
Unavailable
  → ยังไม่มีพิกัด
  → กำลังโหลด
  → ไม่มีงาน
  → แสดงรายการงาน
```

React จะแสดงเพียง branch แรกที่ตรงเงื่อนไข

### รายการงาน บรรทัด 236–248

ใช้ `jobs.map` เปลี่ยนข้อมูลแต่ละงานเป็น `ServiceRequestCard` และใช้ `job.orderId` เป็น key ที่ไม่ซ้ำ ส่ง callback accept/decline ลงไปโดยไม่ให้การ์ดรู้รายละเอียด API

### Dialog บรรทัด 250–258

`open={Boolean(selected)}` แปลง object/null เป็น boolean ส่วนข้อมูลชื่อบริการและวันเวลามี fallback เพื่อไม่ให้ส่ง `undefined`

## 5. Component ลูก

### `CurrentLocationBanner.tsx`

- บรรทัด 3–16: แปลงรหัส Geolocation error เป็นข้อความผู้ใช้
- บรรทัด 18–38: ครอบ callback API ของ browser เป็น Promise เพื่อใช้ `await`
- บรรทัด 40–51: ประกาศ props contract
- บรรทัด 53–81: UI banner
- mobile ใช้ `flex-col` และปุ่ม `w-full`; desktop ใช้ `md:flex-row`, `md:w-auto`

### `ServiceRequestCard.tsx`

- บรรทัด 5–15: props รับข้อมูลและ callback ไม่เรียก API เอง
- บรรทัด 16–18: รวมรายการย่อยเป็นข้อความ
- บรรทัด 20–35: UI รายละเอียดงาน
- บรรทัด 36–37: ปุ่มเท่ากันบน mobile ด้วย `flex-1` และกลับเป็นขนาดเนื้อหาบน desktop ด้วย `md:flex-none`

### `AcceptRequestDialog.tsx`

เป็น Presentational Component รับ `open`, ข้อมูล, loading และ callback จากหน้าแม่ จุดประสงค์คือแยก UI modal ออกจาก business logic

## 6. Service/API ที่เกี่ยวข้อง

| ฟังก์ชัน | Endpoint/หน้าที่ |
|---|---|
| `getTechnicianRequests` | GET `/api/technicians/me/requests` |
| `updateTechnicianLocation` | PATCH `/api/technicians/me/location` |
| `acceptTechnicianRequest` | POST `/api/technicians/me/requests/:orderId/accept` |
| `declineTechnicianRequest` | POST `/api/technicians/me/requests/:orderId/decline` |

ถ้า `NEXT_PUBLIC_USE_TECHNICIAN_MOCKS=true` service จะเรียก mock functions แทน API จริง UI จึงไม่ต้องเขียนเงื่อนไข mock เอง

## 7. ประโยคสำหรับตอบผู้สอน

> Logic หลักอยู่ในหน้า Requests ได้แก่ตรวจสถานะพร้อมให้บริการและพิกัด, debounce filter, เรียก service และจัดการ accept/decline ส่วน Card, Banner และ Dialog เป็น UI components ที่รับข้อมูลผ่าน props การแยกแบบนี้ทำให้ component ลูกทดสอบและนำกลับมาใช้ได้ และหน้าไม่ผูกกับรายละเอียด Axios โดยตรง
