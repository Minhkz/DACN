import { clientApi } from "@/lib/axios/client";
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

export { me, updateMyAddress };
