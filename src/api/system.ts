import { http } from "@/utils/http";
import type { Result, ResultArray, ResultTable } from "./types";

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("get", "/system/user/findByPage", {
    params: data
  });
};

/** 添加用户信息 */
export const insertBasicUser = (data?: object) => {
  return http.request<Result<string>>("post", "/system/user/insertBasicUser", {
    data
  });
};

/** 修改用户信息 */
export const updateBasicUser = (data?: object) => {
  return http.request<Result<string>>("put", "/system/user/updateBasicUser", {
    data
  });
};

/** 删除用户信息 */
export const removeBasicUserById = (id?: object) => {
  return http.request<Result<string>>(
    "delete",
    `/system/user/removeById/${id}`
  );
};

/** 修改用户角色 */
export const updateUserRoles = (data?: object) => {
  return http.request<Result<string>>("put", "/system/user/updateUserRoles", {
    data
  });
};

/** 重置密码 */
export const resetPassword = (data?: object) => {
  return http.request<Result<string>>("put", "/system/user/resetPassword", {
    data
  });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<ResultArray>("get", "/system/role/findRoles");
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (userId?: object) => {
  return http.request<ResultArray>(
    "get",
    `/system/role/findRoleIdsByUserId/${userId}`
  );
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("get", "/system/role/findByPage", {
    params: data
  });
};

/** 添加角色信息 */
export const insertRole = (data?: object) => {
  return http.request<Result<string>>("post", "/system/role/insertRole", {
    data
  });
};

/** 修改角色信息 */
export const updateRole = (data?: object) => {
  return http.request<Result<string>>("put", "/system/role/updateRole", {
    data
  });
};

/** 删除角色信息 */
export const removeRoleById = (id?: object) => {
  return http.request<Result<string>>(
    "delete",
    `/system/role/removeById/${id}`
  );
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<ResultArray>(
    "get",
    "/system/permission/findPermissions",
    {
      params: data
    }
  );
};

/** 添加权限信息 */
export const insertPermission = (data?: object) => {
  return http.request<Result<string>>(
    "post",
    "/system/permission/insertPermission",
    {
      data
    }
  );
};

/** 修改权限信息 */
export const updatePermission = (data?: object) => {
  return http.request<Result<string>>(
    "put",
    "/system/permission/updatePermission",
    {
      data
    }
  );
};

/** 批量修改权限信息 */
export const batchUpdatePermissions = (data?: object) => {
  return http.request<Result<string>>(
    "put",
    "/system/permission/batchUpdatePermissions",
    {
      data
    }
  );
};

/** 获取动态路由 */
export const getAsyncRoutes = () => {
  return http.request<Result<string>>(
    "get",
    "/system/permission/findUserRouters"
  );
};

/** 删除权限信息 */
export const removePermissionById = (id?: object) => {
  return http.request<Result<string>>(
    "delete",
    `/system/permission/removeById/${id}`
  );
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result<string>>("post", "/dept", { data });
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/online-logs", { data });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/login-logs", { data });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/operation-logs", { data });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/system-logs", { data });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  return http.request<ResultArray>("post", "/system-logs-detail", { data });
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (roleId?: object) => {
  return http.request<ResultArray>(
    "get",
    `/system/permission/findPermissionIdsByRoleId/${roleId}`
  );
};

/** 角色管理-权限-菜单权限-修改角色 id 查对应菜单 */
export const updateRolePermissions = (data?: object) => {
  return http.request<Result<string>>(
    "put",
    `/system/role/updateRolePermissions`,
    {
      data
    }
  );
};
