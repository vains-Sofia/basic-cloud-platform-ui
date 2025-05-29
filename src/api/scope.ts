import { http } from "@/utils/http";
import type { FindScopeResponse, Result } from "@/api/types";

/** 平台管理-scope列表 */
export const findScopeList = (data?: object) => {
  return http.request<Result<Array<FindScopeResponse>>>(
    "get",
    "/auth/open/scope/findScopeList",
    {
      params: data
    }
  );
};
