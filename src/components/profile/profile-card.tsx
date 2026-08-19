"use client";

import Image from "next/image";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
} from "@/services/profile.service";
import { useAuth } from "@/contexts/AuthContext";
import type { UserProfile } from "@/types/user";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PROFILE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const PHONE_PATTERN = /^0[0-9]{8,9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EditableField = "fullName" | "email" | "phone";

const EDITABLE_FIELDS: {
  key: EditableField;
  label: string;
  inputType: "text" | "email" | "tel";
  maxLength: number;
}[] = [
  { key: "fullName", label: "ชื่อ-นามสกุล", inputType: "text", maxLength: 80 },
  { key: "email", label: "อีเมล", inputType: "email", maxLength: 120 },
  { key: "phone", label: "เบอร์โทรศัพท์", inputType: "tel", maxLength: 10 },
];

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500";
const cancelButtonClass =
  "inline-flex min-h-10 min-w-24 items-center justify-center rounded-lg border border-[#3366FF] bg-white px-5 text-sm font-medium text-[#3366FF] transition hover:bg-blue-50 disabled:opacity-50";
const saveButtonClass =
  "inline-flex min-h-10 min-w-24 items-center justify-center rounded-lg border border-transparent bg-[#3366FF] px-5 text-sm font-medium text-white transition hover:bg-[#2557E0] disabled:opacity-50";

function getErrorMessage(reason: unknown, fallback: string): string {
  if (typeof reason === "object" && reason !== null) {
    const axiosMessage =
      "response" in reason &&
      typeof reason.response === "object" &&
      reason.response !== null &&
      "data" in reason.response &&
      typeof reason.response.data === "object" &&
      reason.response.data !== null &&
      "message" in reason.response.data
        ? String(reason.response.data.message)
        : null;
    if (axiosMessage) return axiosMessage;
    if ("message" in reason) return String(reason.message);
  }
  return fallback;
}

function fieldValue(profile: UserProfile, key: EditableField): string {
  if (key === "phone") return profile.phone ?? "";
  return profile[key] ?? "";
}

function displayValue(profile: UserProfile, key: EditableField): string {
  const value = fieldValue(profile, key).trim();
  return value || "-";
}

function validateField(key: EditableField, value: string): string | null {
  const trimmed = value.trim();
  if (key === "fullName" && (trimmed.length < 2 || trimmed.length > 80)) {
    return "กรุณากรอกชื่อ-นามสกุล 2 ถึง 80 ตัวอักษร";
  }
  if (key === "email" && !EMAIL_PATTERN.test(trimmed.toLowerCase())) {
    return "กรุณากรอกอีเมลให้ถูกต้อง";
  }
  if (key === "phone" && trimmed && !PHONE_PATTERN.test(trimmed)) {
    return "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง";
  }
  return null;
}

export function ProfileCard() {
  const { fetchCurrentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draft, setDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileImageError, setProfileImageError] = useState("");
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(getErrorMessage(reason, "ไม่สามารถโหลดโปรไฟล์ได้"));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
    };
  }, [profileImagePreview]);

  const startEdit = (key: EditableField) => {
    if (!profile) return;
    setEditingField(key);
    setDraft(fieldValue(profile, key));
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setDraft("");
    setError("");
  };

  const saveField = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !editingField) return;

    const validationError = validateField(editingField, draft);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const nextEmail = editingField === "email" ? draft.trim().toLowerCase() : profile.email;
      const nextName = editingField === "fullName" ? draft.trim() : profile.fullName;
      const nextPhone = editingField === "phone" ? draft.trim() || null : profile.phone;
      const updatedProfile = await updateMyProfile({
        fullName: nextName,
        email: nextEmail,
        phone: nextPhone,
        avatarUrl: profile.avatarUrl,
      });
      setProfile(updatedProfile);
      setEditingField(null);
      setDraft("");
      await fetchCurrentUser();
      setSuccess("บันทึกข้อมูลโปรไฟล์สำเร็จ");
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, "ไม่สามารถบันทึกข้อมูลโปรไฟล์ได้"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      setProfileImageError("กรุณาเลือกรูป JPEG, PNG, GIF หรือ WebP");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setProfileImageError("รูปโปรไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }

    setProfileImageError("");
    setError("");
    setSuccess("");
    const preview = URL.createObjectURL(file);
    setProfileImagePreview(preview);

    try {
      const updatedProfile = await uploadMyAvatar(file);
      setProfile(updatedProfile);
      await fetchCurrentUser();
      setSuccess("อัปโหลดรูปโปรไฟล์สำเร็จ");
    } catch (reason: unknown) {
      setProfileImageError(getErrorMessage(reason, "อัปโหลดรูปโปรไฟล์ไม่สำเร็จ"));
    } finally {
      URL.revokeObjectURL(preview);
      setProfileImagePreview("");
    }
  };

  if (error && !profile) {
    return (
      <div role="alert" className="max-w-160 rounded-xl bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!profile) {
    return <p className="m-0 text-sm text-gray-500">กำลังโหลดข้อมูลโปรไฟล์...</p>;
  }

  const profileInitial = profile.fullName.trim().charAt(0).toUpperCase() || "U";
  const displayedAvatar = profileImagePreview || profile.avatarUrl;

  return (
    <section
      aria-label="ข้อมูลโปรไฟล์"
      className="grid w-full gap-1 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm"
    >
      <div className="flex flex-col gap-5 border-b border-gray-100 pb-7 sm:flex-row sm:items-center sm:gap-6">
        <div
          className="relative flex size-27 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8e5e1] text-[36px] font-semibold text-gray-900"
          aria-label={`รูปโปรไฟล์ของ ${profile.fullName}`}
        >
          {displayedAvatar ? (
            <Image
              src={displayedAvatar}
              alt={`รูปโปรไฟล์ของ ${profile.fullName}`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <span aria-hidden="true">{profileInitial}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={profileImageInputRef}
            id="profile-image"
            type="file"
            aria-label="เลือกรูปโปรไฟล์"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="sr-only"
            onChange={handleProfileImageChange}
          />
          <button
            type="button"
            onClick={() => profileImageInputRef.current?.click()}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#c9c1b8] bg-white px-5 text-sm font-semibold text-gray-900 transition hover:border-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <PhotoCameraOutlinedIcon className="size-5" aria-hidden="true" />
            Upload profile image
          </button>
          <p className="mt-3 max-w-md text-xs leading-5 text-gray-500 sm:text-[13px]">
            JPEG, PNG, GIF or WebP up to 5MB. A default avatar appears when no image is uploaded.
          </p>
          {profileImageError ? (
            <p role="alert" className="mt-2 text-xs text-red-700">
              {profileImageError}
            </p>
          ) : null}
        </div>
      </div>

      <dl className="m-0 divide-y divide-gray-100">
        {EDITABLE_FIELDS.map(({ key, label, inputType, maxLength }) => (
          <div key={key} className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-start sm:gap-6">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="m-0">
              {editingField === key ? (
                <form className="grid gap-3" onSubmit={saveField}>
                  <input
                    id={`profile-${key}`}
                    type={inputType}
                    value={draft}
                    maxLength={maxLength}
                    autoFocus
                    aria-label={label}
                    onChange={(event) => setDraft(event.target.value)}
                    className={inputClass}
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={cancelEdit} disabled={isSaving} className={cancelButtonClass}>
                      ยกเลิก
                    </button>
                    <button type="submit" disabled={isSaving} className={saveButtonClass}>
                      {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-gray-900">{displayValue(profile, key)}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(key)}
                    className="shrink-0 text-sm font-medium text-[#3366FF] hover:underline"
                  >
                    แก้ไข
                  </button>
                </div>
              )}
            </dd>
          </div>
        ))}

        <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
          <dt className="text-sm font-medium text-gray-500">สิทธิ์ผู้ใช้งาน</dt>
          <dd className="m-0 text-sm font-medium text-gray-900">{profile.role || "-"}</dd>
        </div>
      </dl>

      {success ? (
        <p role="status" className="pt-2 text-sm text-green-700">
          {success}
        </p>
      ) : null}
      {error && profile ? (
        <p role="alert" className="pt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </section>
  );
}
