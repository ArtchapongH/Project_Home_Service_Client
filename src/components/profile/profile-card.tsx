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

function getErrorMessage(reason: unknown, fallback: string): string {
  return typeof reason === "object" && reason !== null && "message" in reason
    ? String(reason.message)
    : fallback;
}

export function ProfileCard() {
  const { fetchCurrentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageError, setProfileImageError] = useState("");
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setAddress(data.address ?? "");
        setSavedAddress(data.address ?? "");
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

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      setProfileImageError("กรุณาเลือกรูป JPEG, PNG, GIF หรือ WebP");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setProfileImageError("รูปโปรไฟล์ต้องมีขนาดไม่เกิน 5MB");
      event.target.value = "";
      return;
    }

    setProfileImageError("");
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setAddress(savedAddress);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      let currentProfile = profile;
      if (profileImageFile) {
        currentProfile = await uploadMyAvatar(profileImageFile);
      }

      const updatedProfile = await updateMyProfile({
        fullName: currentProfile.fullName,
        phone: currentProfile.phone,
        address: address.trim() || null,
        avatarUrl: currentProfile.avatarUrl,
      });
      setProfile(updatedProfile);
      setAddress(updatedProfile.address ?? "");
      setSavedAddress(updatedProfile.address ?? "");
      setProfileImageFile(null);
      setProfileImagePreview("");
      await fetchCurrentUser();
      setSuccess("บันทึกข้อมูลโปรไฟล์สำเร็จ");
    } catch (reason: unknown) {
      setError(getErrorMessage(reason, "ไม่สามารถบันทึกที่อยู่ได้"));
    } finally {
      setIsSaving(false);
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

  const rows = [
    ["ชื่อ-นามสกุล", profile.fullName || "-"],
    ["อีเมล", profile.email || "-"],
    ["เบอร์โทรศัพท์", profile.phone || "-"],
    ["สิทธิ์ผู้ใช้งาน", profile.role || "-"],
  ];
  const profileInitial = profile.fullName.trim().charAt(0).toUpperCase() || "U";
  const displayedAvatar = profileImagePreview || profile.avatarUrl;

  return (
    <section
      aria-label="ข้อมูลโปรไฟล์"
      className="grid max-w-2xl gap-1 overflow-hidden rounded-xl bg-white p-7 shadow-[0_8px_24px_rgb(23_51_109/6%)]"
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
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6"
          >
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="m-0 text-sm font-medium text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>

      <form className="grid gap-3 pt-4" onSubmit={handleSubmit}>
        <label htmlFor="profile-address" className="text-sm font-medium text-gray-900">
          ที่อยู่
        </label>
        <textarea
          id="profile-address"
          name="address"
          rows={5}
          maxLength={200}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
        />

        {success ? (
          <p role="status" className="text-sm text-green-700">
            {success}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="inline-flex min-h-10 min-w-24 items-center justify-center rounded-lg border border-[#3366FF] bg-white px-5 text-sm font-medium text-[#3366FF] transition hover:bg-blue-50 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-10 min-w-24 items-center justify-center rounded-lg border border-transparent bg-[#3366FF] px-5 text-sm font-medium text-white transition hover:bg-[#2557E0] disabled:opacity-50"
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </section>
  );
}
