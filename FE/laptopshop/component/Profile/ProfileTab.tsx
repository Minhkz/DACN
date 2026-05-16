import React, { ChangeEvent, useEffect, useState } from "react";
import {
  MapPin,
  LockKeyhole,
  UserRound,
  ImagePlus,
  Save,
  X,
  Pencil,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import UserDetailType from "@/types/user/UserDetailType";
import {
  checkCurrentPassword,
  updateProfile,
} from "@/services/user/UserService";
import { UpdateProfilePayload } from "@/types/profile/profile";
import { notify } from "@/utils/notify";

type Props = {
  user: UserDetailType;
};

type ProfileForm = {
  fullName: string;
  phone: string;
  address: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileErrors = {
  fullName: string;
  phone: string;
  address: string;
};

type PasswordErrors = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfileTab({ user }: Props) {
  const queryClient = useQueryClient();

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: user.fullName || "",
    phone: user.phone || "",
    address: user.address || "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({
    fullName: "",
    phone: "",
    address: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<
    boolean | null
  >(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    setProfileForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    setAvatarPreview(user.avatar || "");
  }, [user]);

  const avatarLetter =
    user.fullName?.charAt(0).toUpperCase() ||
    user.username?.charAt(0).toUpperCase() ||
    "U";

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,

    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);

      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsCurrentPasswordValid(null);
      setAvatarFile(null);

      notify("success", "Cập nhật thông tin thành công");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Cập nhật thông tin thất bại";

      notify("error", message);
    },
  });

  const checkPasswordMutation = useMutation({
    mutationFn: checkCurrentPassword,

    onSuccess: (isValid) => {
      setIsCurrentPasswordValid(isValid);

      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: isValid ? "" : "Mật khẩu hiện tại không đúng",
      }));
    },

    onError: () => {
      setIsCurrentPasswordValid(false);

      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: "Không thể kiểm tra mật khẩu hiện tại",
      }));
    },
  });

  const handleProfileChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setProfileErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setPasswordErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (field === "currentPassword") {
      setIsCurrentPasswordValid(null);
    }
  };

  const validateProfile = () => {
    const errors: ProfileErrors = {
      fullName: "",
      phone: "",
      address: "",
    };

    const fullName = profileForm.fullName.trim();
    const phone = profileForm.phone.trim();
    const address = profileForm.address.trim();

    if (!fullName) {
      errors.fullName = "Vui lòng nhập họ và tên";
    } else if (fullName.length < 8 || fullName.length > 30) {
      errors.fullName = "Họ tên phải từ 8 đến 30 ký tự";
    }

    if (!phone) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!address) {
      errors.address = "Vui lòng nhập địa chỉ";
    } else if (address.length < 5) {
      errors.address = "Địa chỉ phải có ít nhất 5 ký tự";
    }

    setProfileErrors(errors);

    return !errors.fullName && !errors.phone && !errors.address;
  };

  const validatePassword = () => {
    const errors: PasswordErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword;
    const confirmPassword = passwordForm.confirmPassword;

    const wantsChangePassword =
      currentPassword || newPassword || confirmPassword;

    if (!wantsChangePassword) {
      setPasswordErrors(errors);
      return true;
    }

    if (!currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 6 || newPassword.length > 16) {
      errors.newPassword = "Mật khẩu mới phải từ 6 đến 16 ký tự";
    } else if (!/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])\S{6,16}$/.test(newPassword)) {
      errors.newPassword =
        "Mật khẩu phải có chữ hoa, ký tự đặc biệt và không chứa khoảng trắng";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu không khớp";
    }

    if (isCurrentPasswordValid === false) {
      errors.currentPassword = "Mật khẩu hiện tại không đúng";
    }

    setPasswordErrors(errors);

    return (
      !errors.currentPassword && !errors.newPassword && !errors.confirmPassword
    );
  };

  const handleCheckCurrentPassword = () => {
    const currentPassword = passwordForm.currentPassword.trim();

    if (!currentPassword) {
      return;
    }

    checkPasswordMutation.mutate(currentPassword);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];

    if (!validTypes.includes(file.type)) {
      notify("error", "Chỉ hỗ trợ file JPEG hoặc PNG");
      return;
    }

    if (file.size > 1024 * 1024) {
      notify("error", "Dung lượng ảnh tối đa 1MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const isProfileValid = validateProfile();
    const isPasswordValid = validatePassword();

    if (!isProfileValid || !isPasswordValid) {
      return;
    }

    const wantsChangePassword =
      passwordForm.currentPassword.trim() ||
      passwordForm.newPassword ||
      passwordForm.confirmPassword;

    if (wantsChangePassword && isCurrentPasswordValid === false) {
      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: "Mật khẩu hiện tại không đúng",
      }));

      return;
    }

    const payload: UpdateProfilePayload = {
      fullName: profileForm.fullName.trim(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim(),
      avatar: avatarFile,
    };

    if (wantsChangePassword) {
      payload.currentPassword = passwordForm.currentPassword;
      payload.newPassword = passwordForm.newPassword;
      payload.confirmPassword = passwordForm.confirmPassword;
    }

    updateProfileMutation.mutate(payload);
  };

  const handleReset = () => {
    setProfileForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setProfileErrors({
      fullName: "",
      phone: "",
      address: "",
    });

    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setIsCurrentPasswordValid(null);
    setAvatarFile(null);
    setAvatarPreview(user.avatar || "");
  };

  const isSubmitting = updateProfileMutation.isPending;

  return (
    <div className="animate-in fade-in duration-300 w-full text-gray-900">
      <h2
        className="text-2xl font-bold text-gray-900"
        style={{ marginBottom: "8px" }}
      >
        Hồ sơ của tôi
      </h2>

      <p className="text-gray-500 text-sm" style={{ marginBottom: "24px" }}>
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>

      <div
        className="flex flex-col lg:flex-row border-t border-gray-200"
        style={{ paddingTop: "32px", gap: "32px" }}
      >
        <div className="flex-1 lg:border-r border-gray-200">
          <div style={{ marginBottom: "24px", paddingRight: "32px" }}>
            <label
              className="block text-sm font-bold text-gray-700"
              style={{ marginBottom: "8px" }}
            >
              Họ và tên
            </label>

            <input
              type="text"
              value={profileForm.fullName}
              onChange={(e) => handleProfileChange("fullName", e.target.value)}
              placeholder="Nhập họ và tên"
              className={`w-full bg-gray-50 border text-gray-900 rounded-lg outline-none focus:bg-white transition-colors ${
                profileErrors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-emerald-500"
              }`}
              style={{ padding: "12px 16px" }}
            />

            {profileErrors.fullName && (
              <p className="text-xs text-red-500" style={{ marginTop: "6px" }}>
                {profileErrors.fullName}
              </p>
            )}
          </div>

          <div
            className="flex flex-col sm:flex-row"
            style={{ gap: "16px", marginBottom: "24px", paddingRight: "32px" }}
          >
            <div className="flex-1">
              <label
                className="block text-sm font-bold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Email
              </label>

              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-lg outline-none cursor-not-allowed"
                style={{ padding: "12px 16px" }}
              />
            </div>

            <div className="flex-1">
              <label
                className="block text-sm font-bold text-gray-700"
                style={{ marginBottom: "8px" }}
              >
                Số điện thoại
              </label>

              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
                className={`w-full bg-gray-50 border text-gray-900 rounded-lg outline-none focus:bg-white transition-colors ${
                  profileErrors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-emerald-500"
                }`}
                style={{ padding: "12px 16px" }}
              />

              {profileErrors.phone && (
                <p
                  className="text-xs text-red-500"
                  style={{ marginTop: "6px" }}
                >
                  {profileErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "32px", paddingRight: "32px" }}>
            <label
              className="block text-sm font-bold text-gray-700"
              style={{ marginBottom: "8px" }}
            >
              Địa chỉ giao hàng
            </label>

            <div
              className={`bg-emerald-50 border-2 text-gray-900 rounded-lg flex items-center shadow-sm ${
                profileErrors.address ? "border-red-500" : "border-emerald-500"
              }`}
              style={{ padding: "12px 16px", marginBottom: "8px" }}
            >
              <MapPin
                size={18}
                strokeWidth={2.3}
                className={
                  profileErrors.address ? "text-red-500" : "text-emerald-600"
                }
                style={{ marginRight: "10px" }}
              />

              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => handleProfileChange("address", e.target.value)}
                placeholder="Nhập địa chỉ giao hàng"
                className="w-full bg-transparent outline-none text-gray-900"
              />
            </div>

            {profileErrors.address && (
              <p className="text-xs text-red-500" style={{ marginTop: "6px" }}>
                {profileErrors.address}
              </p>
            )}
          </div>

          <div
            className="bg-gray-50 border border-gray-200 rounded-xl"
            style={{
              padding: "24px",
              marginRight: "32px",
              marginBottom: "32px",
            }}
          >
            <h3
              className="text-gray-900 font-bold flex items-center"
              style={{ marginBottom: "20px" }}
            >
              <LockKeyhole
                size={20}
                strokeWidth={2.3}
                className="text-yellow-600"
                style={{ marginRight: "10px" }}
              />
              Thay đổi mật khẩu
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label
                className="block text-sm text-gray-600"
                style={{ marginBottom: "8px" }}
              >
                Mật khẩu hiện tại
              </label>

              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                onBlur={handleCheckCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                className={`w-full bg-white border text-gray-900 rounded-lg outline-none ${
                  passwordErrors.currentPassword
                    ? "border-red-500 focus:border-red-500"
                    : isCurrentPasswordValid
                      ? "border-emerald-500 focus:border-emerald-500"
                      : "border-gray-200 focus:border-emerald-500"
                }`}
                style={{ padding: "12px 16px" }}
              />

              {checkPasswordMutation.isPending && (
                <p
                  className="text-xs text-gray-500"
                  style={{ marginTop: "6px" }}
                >
                  Đang kiểm tra mật khẩu...
                </p>
              )}

              {passwordErrors.currentPassword && (
                <p
                  className="text-xs text-red-500"
                  style={{ marginTop: "6px" }}
                >
                  {passwordErrors.currentPassword}
                </p>
              )}

              {isCurrentPasswordValid && !passwordErrors.currentPassword && (
                <p
                  className="text-xs text-emerald-600"
                  style={{ marginTop: "6px" }}
                >
                  Mật khẩu hiện tại chính xác
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row" style={{ gap: "16px" }}>
              <div className="flex-1">
                <label
                  className="block text-sm text-gray-600"
                  style={{ marginBottom: "8px" }}
                >
                  Mật khẩu mới
                </label>

                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  placeholder="Nhập mật khẩu mới"
                  className={`w-full bg-white border text-gray-900 rounded-lg outline-none ${
                    passwordErrors.newPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-emerald-500"
                  }`}
                  style={{ padding: "12px 16px" }}
                />

                {passwordErrors.newPassword && (
                  <p
                    className="text-xs text-red-500"
                    style={{ marginTop: "6px" }}
                  >
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label
                  className="block text-sm text-gray-600"
                  style={{ marginBottom: "8px" }}
                >
                  Xác nhận mật khẩu mới
                </label>

                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  placeholder="Xác nhận lại"
                  className={`w-full bg-white border text-gray-900 rounded-lg outline-none ${
                    passwordErrors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-emerald-500"
                  }`}
                  style={{ padding: "12px 16px" }}
                />

                {passwordErrors.confirmPassword && (
                  <p
                    className="text-xs text-red-500"
                    style={{ marginTop: "6px" }}
                  >
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: "16px" }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md transition-all flex items-center"
              style={{ padding: "12px 32px", gap: "8px" }}
            >
              <Save size={18} strokeWidth={2.3} />
              {isSubmitting ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="text-gray-500 font-bold hover:text-gray-900 flex items-center disabled:cursor-not-allowed"
              style={{ padding: "12px 24px", gap: "8px" }}
            >
              <X size={18} strokeWidth={2.3} />
              Hủy
            </button>
          </div>
        </div>

        <div
          className="w-full lg:w-1/3 flex flex-col items-center"
          style={{ paddingTop: "16px" }}
        >
          <div
            className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shadow-inner overflow-hidden"
            style={{ marginBottom: "24px" }}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={user.fullName || user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <UserRound size={48} strokeWidth={1.8} />
                <span className="text-lg font-bold">{avatarLetter}</span>
              </div>
            )}
          </div>

          <label
            className="border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center cursor-pointer"
            style={{ padding: "8px 24px", marginBottom: "16px", gap: "8px" }}
          >
            <ImagePlus size={18} strokeWidth={2.2} />
            Chọn ảnh
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>

          {avatarFile && (
            <p
              className="text-xs text-emerald-600 text-center font-medium"
              style={{ marginBottom: "12px" }}
            >
              Ảnh mới đã được chọn. Bấm LƯU THAY ĐỔI để cập nhật.
            </p>
          )}

          <p className="text-xs text-gray-500 text-center uppercase tracking-wider">
            Dung lượng file tối đa 1 MB
            <br />
            Định dạng: .JPEG, .PNG
          </p>
        </div>
      </div>
    </div>
  );
}
