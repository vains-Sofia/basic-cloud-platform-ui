import { http } from "@/utils/http";
import type {
  FindSysDictItemResponse,
  FindSysDictTypeResponse,
  Result,
  ResultPage
} from "@/api/types";

/**
 * 分页查询字典类型
 */
export const allType = () => {
  return http.request<Result<FindSysDictTypeResponse[]>>(
    "get",
    "/system/dict/type/all"
  );
};

/**
 * 分页查询字典类型
 */
export const pageType = (params: any) => {
  return http.request<ResultPage<FindSysDictTypeResponse>>(
    "get",
    "/system/dict/type/page",
    { params }
  );
};

/**
 * 创建字典类型
 */
export const createType = (data: any) => {
  return http.request<Result<FindSysDictTypeResponse>>(
    "post",
    "/system/dict/type",
    { data }
  );
};

/**
 * 修改字典类型
 */
export const updateType = (id: string, data: any) => {
  return http.request<Result<FindSysDictTypeResponse>>(
    "put",
    `/system/dict/type/${id}`,
    { data }
  );
};

/**
 * 删除字典类型
 */
export const deleteType = (id: string) => {
  return http.request<Result<any>>("delete", `/system/dict/type/${id}`);
};

/**
 * 分页查询字典项
 */
export const pageItem = (params: any) => {
  return http.request<ResultPage<FindSysDictItemResponse>>(
    "get",
    "/system/dict/item/page",
    { params }
  );
};

/**
 * 创建字典类型
 */
export const createItem = (data: any) => {
  return http.request<Result<FindSysDictItemResponse>>(
    "post",
    "/system/dict/item",
    { data }
  );
};

/**
 * 修改字典类型
 */
export const updateItem = (id: string, data: any) => {
  return http.request<Result<FindSysDictItemResponse>>(
    "put",
    `/system/dict/item/${id}`,
    { data }
  );
};

/**
 * 删除字典类型
 */
export const deleteItem = (id: string) => {
  return http.request<Result<any>>("delete", `/system/dict/item/${id}`);
};

/**
 * 根据字典类型获取字典项
 */
export const dictItems = (typeCode: string) => {
  return http.request<Result<FindSysDictItemResponse[]>>(
    "get",
    `/system/dict/item/type/${typeCode}`
  );
};
