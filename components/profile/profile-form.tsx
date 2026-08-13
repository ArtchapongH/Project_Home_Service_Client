"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/src/services/profile.service";

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  avatarUrl: "",
};

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

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
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
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "บันทึกโปรไฟล์ไม่สำเร็จ");
    }
  }

  if (status === "loading") {
    return <p className="profile-status">กำลังโหลดข้อมูลโปรไฟล์...</p>;
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>รูปโปรไฟล์</legend>
        <label htmlFor="avatarUrl">ลิงก์รูปภาพ</label>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          value={form.avatarUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
      </fieldset>

      <fieldset>
        <legend>ข้อมูลส่วนตัว</legend>
        <label htmlFor="fullName">ชื่อ-นามสกุล</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          minLength={2}
          maxLength={80}
          value={form.fullName}
          onChange={handleChange}
        />

        <label htmlFor="phone">เบอร์โทรศัพท์</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          value={form.phone}
          onChange={handleChange}
          placeholder="0801234567"
        />

        <label htmlFor="email">อีเมล</label>
        <input id="email" name="email" type="email" value={form.email} readOnly />

        <label htmlFor="address">ที่อยู่</label>
        <textarea
          id="address"
          name="address"
          rows={4}
          maxLength={200}
          value={form.address}
          onChange={handleChange}
        />
      </fieldset>

      {message ? (
        <p className={status === "error" ? "profile-status is-error" : "profile-status is-success"} role="status">
          {message}
        </p>
      ) : null}

      <div className="profile-actions">
        <button type="reset" className="button button-outline" onClick={() => setMessage("")}>
          ยกเลิก
        </button>
        <button type="submit" className="button button-primary" disabled={status === "saving"}>
          {status === "saving" ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>
    </form>
  );
}
