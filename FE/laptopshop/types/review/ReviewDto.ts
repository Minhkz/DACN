export interface ReviewUserDto {
  username: string;
  fullName: string;
  avatar: string;
}

export interface ReviewDto {
  id: number;
  rating: number;
  reviewContent: string;
  createdDate: string;
  user: ReviewUserDto;
}
