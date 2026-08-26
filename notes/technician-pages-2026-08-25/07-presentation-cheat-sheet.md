# Cheat Sheet สำหรับอธิบายหน้าชั้นเรียน

## โครงพูด 5 นาที

### 1. Architecture

> โปรเจกต์ใช้ Next.js App Router ไฟล์ page เป็น route ส่วน interaction อยู่ใน client components ข้อมูลช่างที่หลายหน้าใช้ร่วมกันเก็บใน TechnicianContext และทุก API call ถูกแยกไว้ใน service layer

### 2. Requests

> หน้า Requests ตรวจสามอย่างก่อนโหลดงาน คือช่างพร้อมให้บริการหรือไม่ มีพิกัดหรือไม่ และ filter ปัจจุบันคืออะไร จากนั้น service ส่ง query ไป backend เมื่อรับหรือปฏิเสธงานจะ refresh list และอัปเดต badge ส่วน Card, Location Banner และ Dialog เป็น UI components

### 3. Jobs กับ History

> สองหน้าใช้ TechnicianJobList ตัวเดียว ต่างกันที่ mode active/history แล้วกรอง status คนละชุด Mobile render เป็น card ส่วน desktop render table แต่ใช้ข้อมูลและ logic ชุดเดียวกัน

### 4. Settings

> Profile จาก Context เป็นข้อมูลจริงล่าสุด ส่วน local state เป็น draft ของ form จึงกดยกเลิกได้ เมื่อ save สำเร็จจะนำ response กลับไป update Context ทำให้หน้าอื่นเห็น availability, services และ location ใหม่ทันที

### 5. Responsive

> ใช้ mobile-first Tailwind ต่ำกว่า 768px และใส่ `md:` เพื่อคืน layout desktop เดิม Sidebar desktop เป็น `hidden md:flex` ส่วน mobile top bar/drawer เป็น `md:hidden`

### 6. ProfileCard2

> แยก form draft จาก server profile ใช้ type UserProfile แทน any ตรวจรูปและข้อมูลให้ตรง backend และ sync response หลัง save/upload ชื่อจริงกับนามสกุลถูกเก็บแยกโดย backend แล้ว

## คำถามที่มีโอกาสถูกถาม

### ทำไมใช้ Context

เพราะ profile และ requestCount ถูกใช้หลาย component เช่น Requests, Settings และ Sidebar หากส่ง props ผ่านหลายชั้นจะเกิด prop drilling

### ทำไมใช้ `useCallback`

เพื่อรักษา reference ของ async loader ให้ใช้เป็น dependency ของ Effect ได้อย่างควบคุม และสร้างใหม่เมื่อ filter ที่เกี่ยวข้องเปลี่ยนเท่านั้น

### ทำไมใช้ debounce 250ms

ลด API calls ระหว่างผู้ใช้กำลังพิมพ์ หากมี keystroke ใหม่ cleanup จะยกเลิก timeout เก่า

### ทำไมไม่เรียก Axios ใน component

เพื่อ separation of concerns UI ไม่ต้องรู้ base URL/token/mock และ service สามารถเปลี่ยน implementation หรือทดสอบแยกได้

### `useState` กับ `useRef` ต่างกันอย่างไร

เปลี่ยน state แล้ว React render ใหม่ ส่วน ref เก็บค่าข้าม render โดยไม่ทำให้ render จึงเหมาะกับ flag `didAutoLocate` และ DOM reference

### `finally` มีไว้ทำอะไร

ปิด loading/saving ไม่ว่า Promise สำเร็จหรือ throw error ป้องกัน UI ค้าง disabled

### `undefined` กับ `null` ใน payload ต่างกันอย่างไร

ใน profile update ใช้ undefined หมายถึง client ไม่ได้ส่ง fieldและต้องรักษาค่าเดิม ส่วน null หมายถึงผู้ใช้ตั้งใจล้างค่า

### ทำไม mobile กับ desktop render ต่างกัน

Table อ่านยากบนจอแคบ จึงใช้ card บน mobile แต่ desktop ยังคง table เดิม ทั้งสองใช้ array `visibleJobs` เดียวกันจึงไม่ duplicate logic

### ARIA attributes มีไว้ทำอะไร

ช่วย screen reader เข้าใจปุ่มไอคอน สถานะ drawer และ dialog เช่น `aria-label`, `aria-expanded`, `aria-modal`

## คำศัพท์โค้ดที่ควรจำ

- `map` — แปลง array เป็น UI หลายรายการ
- `filter` — เลือกสมาชิกที่ตรงเงื่อนไข
- `includes` — ตรวจว่ามีค่าใน array
- spread `...` — copy/merge object หรือ array แบบ immutable
- optional chaining `?.` — อ่านค่าอย่างปลอดภัยเมื่ออาจเป็น null
- nullish coalescing `??` — ใช้ fallback เมื่อค่าเป็น null/undefined
- ternary `condition ? A : B` — เลือกค่า/UI สองทาง
- early return — จบ function เร็วเมื่อเงื่อนไขไม่พร้อม
- controlled input — value ถูกควบคุมด้วย React state
- dependency array — บอก Effect/Callback ว่าต้องทำใหม่เมื่อค่าใดเปลี่ยน

