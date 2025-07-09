import { http } from "@/utils/http";
import type { QrCodeInitResult, Result } from "@/api/types";

/**
 * 获取生成二维码的数据
 */
export const getQrCodeData = () => {
  return http.request<Result<QrCodeInitResult>>("get", "/auth/qr-code/init");
};

/**
 * 根据二维码唯一标识登录
 */
export const qrCodeLogin = (token: string) => {
  const headers: any = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  return http.request<Result<string>>(
    "post",
    "/auth/login/qr-code",
    {
      data: { token }
    },
    { withCredentials: true, headers }
  );
};
