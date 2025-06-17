import { http } from "@/utils/http";
import type { Result } from "./types";

/** 文件上传预签名 */
export const checkBinding = () => {
  return http.request<Result<string>>(
    "get",
    `/system/third/user/check-binding`
  );
};
