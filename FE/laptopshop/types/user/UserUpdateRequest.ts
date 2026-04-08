export default interface UserUpdateRequest {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  fullName: string;
  avatar?: File | null;
}
