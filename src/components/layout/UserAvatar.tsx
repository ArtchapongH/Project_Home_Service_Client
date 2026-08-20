"use client";

import { useState } from "react";

interface UserAvatarProps {
  displayName?: string | null;
  fullName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

function getInitials(
  name?: string | null,
  email?: string | null,
): string {
  const nameParts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (nameParts.length > 0) {
    return nameParts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  return email?.trim().slice(0, 1).toUpperCase() || "U";
}

export function UserAvatar({ displayName, fullName, email, avatarUrl }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const resolvedName = displayName || fullName;
  const initials = getInitials(resolvedName, email);

  if (avatarUrl && !imageFailed) {
    return (
      // Avatar URLs are user-provided and can originate from any trusted image host.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`รูปโปรไฟล์ของ ${resolvedName || email || "ผู้ใช้"}`}
        onError={() => setImageFailed(true)}
        className="h-8 w-8 rounded-full border border-gray-200 object-cover"
      />
    );
  }

  return (
    <span
      aria-label={`อักษรย่อของ ${resolvedName || email || "ผู้ใช้"}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700"
    >
      {initials}
    </span>
  );
}
