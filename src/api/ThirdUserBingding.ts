import { http } from "@/utils/http";
import type { Result } from "./types";

/** 检查绑定 */
export const checkBinding = () => {
  return http.request<Result<string>>(
    "get",
    `/system/third/user/check-binding`
  );
};

/** 获取邮件验证码 */
export const bindEmailCode = (email: string) => {
  return http.request<Result<string>>(
    "get",
    `/system/third/user/bind-email-code/${email}`
  );
};

/** 获取邮件验证码 */
export const bindEmail = (data: any) => {
  return http.request<Result<string>>("post", `/system/third/user/bind-email`, {
    data
  });
};
