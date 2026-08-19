"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/services/profile.service";

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  avatarUrl: "",
};

const fieldsetClass = "m-0 grid gap-2 border-0 p-0";
const legendClass = "mb-2 text-base font-semibold";
const labelClass = "text-sm font-medium";
const inputClass = "w-full rounded-lg border border-gray-200 px-3.5 py-3 font-sans text-sm read-only:bg-gray-100 read-only:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
const buttonBaseClass = "inline-flex min-h-[42px] items-center justify-center rounded-[7px] border px-[22px] py-2.5 text-sm font-medium transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

export function ProfileForm() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    getMyProfile()
      .then((profile) => {
        if (cancelled) {
          return;
        }

        setForm({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          email: profile.email || "",
          address: profile.address || "",
          avatarUrl: profile.avatarUrl || "",
        });
        setStatus("ready");
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setMessage(error.message || "ไม่สามารถโหลดโปรไฟล์ได้");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const result = await updateMyProfile({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        avatarUrl: form.avatarUrl,
      });
      setStatus("ready");
      setMessage(result.message || "บันทึกโปรไฟล์สำเร็จ");
    } catch (error: unknown) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : "บันทึกโปรไฟล์ไม่สำเร็จ",
      );
    }
  }

  if (status === "loading") {
    return <p className="m-0 text-sm">กำลังโหลดข้อมูลโปรไฟล์...</p>;
  }

  return (
    <form className="grid max-w-160 gap-6 rounded-xl bg-white p-7 shadow-[0_8px_24px_rgb(23_51_109/6%)]" onSubmit={handleSubmit}>
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>รูปโปรไฟล์</legend>
        <label className={labelClass} htmlFor="avatarUrl">ลิงก์รูปภาพ</label>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          value={form.avatarUrl}
          onChange={handleChange}
          placeholder="https://..."
          className={inputClass}
        />
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>ข้อมูลส่วนตัว</legend>
        <label className={labelClass} htmlFor="fullName">ชื่อ-นามสกุล</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          minLength={2}
          maxLength={80}
          value={form.fullName}
          onChange={handleChange}
          className={inputClass}
        />

        <label className={labelClass} htmlFor="phone">เบอร์โทรศัพท์</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          value={form.phone}
          onChange={handleChange}
          placeholder="0801234567"
          className={inputClass}
        />

        <label className={labelClass} htmlFor="email">อีเมล</label>
        <input className={inputClass} id="email" name="email" type="email" value={form.email} readOnly />

        <label className={labelClass} htmlFor="address">ที่อยู่</label>
        <textarea
          id="address"
          name="address"
          rows={4}
          maxLength={200}
          value={form.address}
          onChange={handleChange}
          className={inputClass}
        />
      </fieldset>

      {message ? (
        <p className={`m-0 text-sm ${status === "error" ? "text-[#d7263d]" : "text-blue-700"}`} role="status">
          {message}
        </p>
      ) : null}

      <div className="flex justify-end gap-3">
        <button type="reset" className={`${buttonBaseClass} border-blue-500 text-blue-600 hover:bg-blue-100`} onClick={() => setMessage("")}>
          ยกเลิก
        </button>
        <button type="submit" className={`${buttonBaseClass} border-transparent bg-blue-500 text-white hover:bg-blue-700`} disabled={status === "saving"}>
          {status === "saving" ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>
    </form>
  );
}
