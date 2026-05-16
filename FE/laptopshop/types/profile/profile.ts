export type UpdateProfilePayload = {
  fullName: string;
  phone: string;
  address: string;

  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;

  avatar?: File | null;
};
