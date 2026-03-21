interface UserRequest {
  id?: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  fullName: string;
  avatar?: File | null;
  roleId: number | string;
}
