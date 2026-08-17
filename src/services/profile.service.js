const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export async function getMyProfile() {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
    headers: {
      "x-user-id": process.env.NEXT_PUBLIC_DEV_USER_ID || "",
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw payload;
  }

  return payload.data;
}

export async function updateMyProfile(profile) {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": process.env.NEXT_PUBLIC_DEV_USER_ID || "",
    },
    body: JSON.stringify(profile),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw payload;
  }

  return payload;
}
