import { clientApi } from "@/lib/axios/client";
import {
  ChatRequest,
  ChatResponse,
  ResponseResult,
} from "@/types/chatbot/ChatbotType";

export const askChatbot = async (
  payload: ChatRequest,
): Promise<ChatResponse> => {
  const res = await clientApi.post<ResponseResult<ChatResponse>>(
    "/chatbot/ask",
    payload,
  );

  return res.data.data;
};
