"use client";

import Image from "next/image";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
const NAME_PATTERN = /^[\p{Letter}\p{Mark}]+(?:[ '\-][\p{Letter}\p{Mark}]+)*$/u;

function getErrorMessage(reason: unknown, fallback: string): string {
  if (typeof reason !== "object" || reason === null) return fallback;
  if (
    "response" in reason &&
    typeof reason.response === "object" &&
    reason.response !== null &&
    "data" in reason.response &&
    typeof reason.response.data === "object" &&
    reason.response.data !== null &&
    "message" in reason.response.data
  ) {
    return String(reason.response.data.message);
  }
  return "message" in reason ? String(reason.message) : fallback;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500";
const cancelButtonClass =
  "inline-flex min-h-[42px] min-w-24 items-center justify-center rounded-[8px] border border-blue-500 bg-white px-[22px] py-2.5 text-sm font-medium text-blue-500 transition hover:bg-blue-100 disabled:opacity-50";
const saveButtonClass =
  "inline-flex min-h-[42px] min-w-24 items-center justify-center rounded-[8px] border border-transparent bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50";

export function ProfileCard2() {
  const { fetchCurrentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  function syncProfile(data: UserProfile) {
    setProfile(data);
    setDisplayName(data.displayName || data.fullName || "");
    setFirstName(data.firstName || "");
    setLastName(data.lastName || "");
    setEmail(data.email || "");
    setPhone(data.phone || "");
  }

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        syncProfile(data);
      })
      .catch((reason: unknown) =>
        setError(getErrorMessage(reason, "โหลดโปรไฟล์ไม่สำเร็จ")),
      );
  }, []);

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      setError("กรุณาเลือกรูป JPEG, PNG, GIF หรือ WebP");
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setError("รูปโปรไฟล์ต้องมีขนาดไม่เกิน 5MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    try {
      const data = await uploadMyAvatar(file);
      syncProfile(data);
      await fetchCurrentUser();
      setOk("อัปโหลดรูปโปรไฟล์สำเร็จ");
      setError("");
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, "อัปโหลดรูปไม่สำเร็จ"));
    } finally {
      URL.revokeObjectURL(url);
      setPreview("");
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleDisplayNameChange(event: ChangeEvent<HTMLInputElement>) {
    setDisplayName(event.target.value);
  }

  function handleFirstNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event: ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    setPhone(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    const trimmedDisplayName = displayName.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 80)
      return setError("กรุณากรอกชื่อที่แสดง 2 ถึง 80 ตัวอักษร");
    if (!NAME_PATTERN.test(trimmedDisplayName))
      return setError("ชื่อต้องเป็นตัวอักษรภาษาไทยหรืออังกฤษเท่านั้น");
    if (trimmedFirstName && (trimmedFirstName.length < 2 || !NAME_PATTERN.test(trimmedFirstName)))
      return setError("กรุณากรอกชื่อจริงให้ถูกต้อง");
    if (trimmedLastName && (trimmedLastName.length < 2 || !NAME_PATTERN.test(trimmedLastName)))
      return setError("กรุณากรอกนามสกุลให้ถูกต้อง");
    if (!EMAIL_PATTERN.test(trimmedEmail)) return setError("กรอกอีเมลให้ถูกต้อง");
    if (trimmedPhone && !PHONE_PATTERN.test(trimmedPhone))
      return setError("กรอกเบอร์โทรให้ถูกต้อง");

    setSaving(true);
    setError("");
    setOk("");
    try {
      const data = await updateMyProfile({
        displayName: trimmedDisplayName,
        firstName: trimmedFirstName || null,
        lastName: trimmedLastName || null,
        fullName: trimmedDisplayName,
        email: trimmedEmail,
        phone: trimmedPhone || null,
        avatarUrl: profile.avatarUrl,
      });
      syncProfile(data);
      await fetchCurrentUser();
      setOk("บันทึกข้อมูลโปรไฟล์สำเร็จ");
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, "บันทึกไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (!profile) return;
    setDisplayName(profile.displayName || profile.fullName || "");
    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setEmail(profile.email || "");
    setPhone(profile.phone || "");
    setError("");
    setOk("");
  }

  if (error && !profile) {
    return (
      <p
        role="alert"
        className="max-w-160 rounded-xl bg-red-50 p-6 text-sm text-red-700"
      >
        {error}
      </p>
    );
  }
  if (!profile) {
    return (
      <p className="m-0 text-sm text-gray-500">กำลังโหลดข้อมูลโปรไฟล์...</p>
    );
  }

  const name = displayName || "User";
  const avatar = preview || profile.avatarUrl;

  return (
    <section
      aria-label="ข้อมูลโปรไฟล์"
      className="grid w-full gap-1 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-5 border-b border-gray-100 pb-7 sm:flex-row sm:items-center sm:gap-6">
        <figure
          className="relative flex size-27 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8e5e1] text-[36px] font-semibold text-gray-900"
          aria-label={`รูปโปรไฟล์ของ ${name}`}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt={`รูปโปรไฟล์ของ ${name}`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <span aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
          )}
        </figure>

        <div className="min-w-0 flex-1">
          <input
            ref={fileInputRef}
            id="profile-image-2"
            type="file"
            aria-label="เลือกรูปโปรไฟล์"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="sr-only"
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#c9c1b8] bg-white px-5 text-sm font-semibold text-gray-900 transition hover:border-gray-700 hover:bg-gray-50"
          >
            <PhotoCameraOutlinedIcon className="size-5" aria-hidden="true" />
            Upload profile image
          </button>
          <p className="mt-3 max-w-md text-xs leading-5 text-gray-500 sm:text-[13px]">
            JPEG, PNG, GIF or WebP up to 5MB. A default avatar appears when no
            image is uploaded.
          </p>
        </div>
      </div>

      <form className="grid gap-1" onSubmit={handleSubmit}>
        <dl className="m-0 divide-y divide-gray-100">
          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt>
              <label
                htmlFor="displayName"
                className="text-sm font-medium text-gray-500"
              >
                ชื่อที่แสดง
              </label>
            </dt>
            <dd className="m-0">
              <input
                id="displayName"
                value={displayName}
                maxLength={80}
                onChange={handleDisplayNameChange}
                className={inputClass}
              />
            </dd>
          </div>

          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt>
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-500"
              >
                ชื่อจริง
              </label>
            </dt>
            <dd className="m-0">
              <input
                id="firstName"
                value={firstName}
                maxLength={50}
                onChange={handleFirstNameChange}
                className={inputClass}
              />
            </dd>
          </div>

          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt>
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-500"
              >
                นามสกุล
              </label>
            </dt>
            <dd className="m-0">
              <input
                id="lastName"
                value={lastName}
                maxLength={50}
                onChange={handleLastNameChange}
                className={inputClass}
              />
            </dd>
          </div>

          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-500"
              >
                อีเมล
              </label>
            </dt>
            <dd className="m-0">
              <input
                id="email"
                type="email"
                value={email}
                maxLength={120}
                onChange={handleEmailChange}
                className={inputClass}
              />
            </dd>
          </div>

          <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-500"
              >
                เบอร์โทรศัพท์
              </label>
            </dt>
            <dd className="m-0">
              <input
                id="phone"
                type="tel"
                value={phone}
                maxLength={10}
                onChange={handlePhoneChange}
                className={inputClass}
              />
            </dd>
          </div>

          <div className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
            <dt className="text-sm font-medium text-gray-500">
              สิทธิ์ผู้ใช้งาน
            </dt>
            <dd className="m-0 text-sm font-medium text-gray-900">
              {profile.role || "-"}
            </dd>
          </div>
        </dl>

        {ok ? <p className="pt-2 text-sm text-green-700">{ok}</p> : null}
        {error ? <p className="pt-2 text-sm text-red-600">{error}</p> : null}

        <div className="flex justify-end gap-3 pt-5">
          <button
            type="button"
            disabled={saving}
            className={cancelButtonClass}
            onClick={handleCancel}
          >
            ยกเลิก
          </button>
          <button type="submit" disabled={saving} className={saveButtonClass}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </section>
  );
}
