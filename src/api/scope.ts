import { http } from "@/utils/http";
import type { FindScopeResponse, Result, ResultArray, ResultTable } from "@/api/types";

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

/** 获取平台管理-scope管理列表 */
export const getScopeList = (data?: object) => {
  return http.request<ResultTable>("get", "/auth/open/scope/findByPage", {
    params: data
  });
};

/** 添加scope信息 */
export const insertScope = (data?: object) => {
  return http.request<Result<string>>("post", "/auth/open/scope/save", {
    data
  });
};

/** 修改scope信息 */
export const updateScope = (data?: object) => {
  return http.request<Result<string>>("put", "/auth/open/scope/update", {
    data
  });
};

/** 删除scope信息 */
export const removeScopeById = (id?: object) => {
  return http.request<Result<string>>(
    "delete",
    `/auth/open/scope/removeById/${id}`
  );
};

/** scope管理-权限-菜单权限-修改scope id 对应菜单 */
export const updateScopePermissions = (data?: object) => {
  return http.request<Result<string>>(
    "put",
    `/auth/open/scope/resetScopePermission`,
    {
      data
    }
  );
};

/** 获取scope管理-权限-菜单权限-根据scope id 查对应菜单 */
export const getScopeMenuIds = (scope?: object) => {
  return http.request<ResultArray>(
    "get",
    `/auth/open/scope/findPermissionIdsByScope/${scope}`
  );
};
