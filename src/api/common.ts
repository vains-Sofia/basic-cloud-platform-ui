import { http } from "@/utils/http";
import type { Result } from "./types";

type FilePreSigned = {
  name: string;
  bucket: string;
  url: string;
};

/** 文件上传预签名 */
export const uploadPreSigned = (data?: object) => {
  return http.request<Result<FilePreSigned>>(
    "put",
    `/system/common/pre/signed`,
    {
      data
    }
  );
};

/** 使用预签名地址上传 */
export const uploadByPreSignedUrl = (
  preSignedUrl: string,
  data: object,
  fileType: string
) => {
  return http.request<Result<FilePreSigned>>(
    "put",
    preSignedUrl,
    {
      data
    },
    {
      headers: {
        "Content-Type": fileType
      }
    }
  );
};
