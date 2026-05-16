import { clientApi } from "@/lib/axios/client";
import { ResponseResult } from "@/types/common/ResponseResult";
import { UpdateProfilePayload } from "@/types/profile/profile";
import UserDetailType from "@/types/user/UserDetailType";

const me = async (): Promise<UserDetailType> => {
  const res = await clientApi.get("/profile/me");
  return res.data.data;
};
const updateMyAddress = async (address: string): Promise<void> => {
  await clientApi.put("/profile/me/address", {
    address,
  });
};
const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<UserDetailType> => {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("phone", payload.phone);
  formData.append("address", payload.address);

  if (payload.currentPassword) {
    formData.append("currentPassword", payload.currentPassword);
  }

  if (payload.newPassword) {
    formData.append("newPassword", payload.newPassword);
  }

  if (payload.confirmPassword) {
    formData.append("confirmPassword", payload.confirmPassword);
  }

  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }

  const res = await clientApi.put<ResponseResult<UserDetailType>>(
    "/profile/me",
    formData,
  );

  return res.data.data;
};

const checkCurrentPassword = async (
  currentPassword: string,
): Promise<boolean> => {
  const res = await clientApi.post<ResponseResult<boolean>>(
    "/profile/me/check-password",
    { currentPassword },
  );

  return res.data.data;
};

export { me, updateMyAddress, updateProfile, checkCurrentPassword };
