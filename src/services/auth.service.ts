import apiClient from "./apiClient";

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post("/api/auth/forgot-password", { email });
}

type ResetPasswordInput = {
  newPassword: string;
  confirmNewPassword: string;
  accessToken: string;
  refreshToken: string;
};

export async function resetPasswordWithRecovery(
  input: ResetPasswordInput,
): Promise<void> {
  await apiClient.post(
    "/api/auth/reset-password",
    {
      newPassword: input.newPassword,
      confirmNewPassword: input.confirmNewPassword,
      refreshToken: input.refreshToken,
    },
    {
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
      },
    },
  );
}
