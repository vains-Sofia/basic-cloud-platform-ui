import { http } from "@/utils/http";
import type {
  FindAuthorizationPageParams,
  FindAuthorizationResponse,
  ResultPage
} from "@/api/types";

// 分页查询认证信息
export const findByPage = (params: FindAuthorizationPageParams) => {
  return http.request<ResultPage<FindAuthorizationResponse>>(
    "get",
    "/auth/authorization/findByPage",
    { params }
  );
};

// 下线
export const offline = (accessToken: string) => {
  return http.request<void>("delete", "/auth/authorization/offline", {
    data: { accessToken }
  });
};
