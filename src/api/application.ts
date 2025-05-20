import { http } from "@/utils/http";
import type { ResultTable, Result } from "./types";

/** 平台管理-应用列表 */
export const cardListPage = (data?: object) => {
  return http.request<ResultTable>(
    "get",
    "/auth/open/application/cardListPage",
    {
      params: data
    }
  );
};
/** 平台管理-应用列表 */
export const findById = (id?: object) => {
  return http.request<Result<any>>(
    "get",
    `/auth/open/application/findById/${id}`
  );
};
