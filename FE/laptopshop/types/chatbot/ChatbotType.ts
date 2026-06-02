export type ChatRequest = {
  message: string;
};

export type ChatProductDto = {
  id: number;
  name: string;
  avatar: string;
  price: number;
};

export type ChatResponse = {
  answer: string;
  products: ChatProductDto[];
};

export type ChatMessage = {
  id: string;
  role: "USER" | "BOT";
  content: string;
  products?: ChatProductDto[];
  createdAt: string;
};

export type ResponseResult<T> = {
  datetime: string;
  errorCode: string | number;
  message: string;
  data: T;
  success: boolean;
};
