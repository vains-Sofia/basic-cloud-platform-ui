import { http } from "@/utils/http";
import type { OAuth2Metadata, Result, ResultTable } from "./types";

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
/** 平台管理-应用详情 */
export const findById = (id?: string | string[]) => {
  return http.request<Result<any>>(
    "get",
    `/auth/open/application/findById/${id}`
  );
};

/** 平台管理-添加应用 */
export const save = (data: object) => {
  return http.request<Result<any>>("post", `/auth/open/application/save`, {
    data
  });
};

/** 平台管理-更新应用 */
export const update = (data: object) => {
  return http.request<Result<any>>("put", `/auth/open/application/update`, {
    data
  });
};

/** 平台管理-认证中心OIDC配置 */
export const openidConfiguration = () => {
  return http.request<OAuth2Metadata>(
    "get",
    `/auth/.well-known/openid-configuration`
  );
};
