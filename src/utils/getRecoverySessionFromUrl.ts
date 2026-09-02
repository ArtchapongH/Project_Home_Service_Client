export type RecoverySession = {
  accessToken: string;
  refreshToken: string;
};

export function getRecoverySessionFromUrl(): RecoverySession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);

  const accessToken =
    hashParams.get("access_token") ?? queryParams.get("access_token");
  const refreshToken =
    hashParams.get("refresh_token") ?? queryParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export function clearRecoveryParamsFromUrl(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState(null, "", window.location.pathname);
}
