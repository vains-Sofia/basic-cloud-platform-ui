import { http } from "@/utils/http";
import type { Result, ResultPage } from "@/api/types";

// 扫描状态枚举
export enum ScanStatusEnum {
  NEW_FOUND = 1, // 新发现
  EXISTING = 2, // 已存在
  MISSING_ANNOTATION = 3, // 缺少注解
  IGNORE = 4 // 异常
}

export interface SysApiScanRecord {
  id: string;
  scanTime: string;
  totalCount: number;
  newCount: number;
  existCount: number;
  missingDescCount: number;
  scanResult?: string;
  createTime: string;
  updateTime: string;
}

export interface SysApiEndpoint {
  id: string;
  scanBatchId: number;
  path: string;
  requestMethod: string;
  moduleName?: string;
  permission?: string;
  title?: string;
  scanStatus: ScanStatusEnum;
  existingPermissionId?: number;
  imported: boolean;
  importTime?: string;
  errorMessage?: string;
  createTime: string;
  updateTime: string;
  createName: string;
  updateName: string;
}

export interface EndpointListParams {
  scanBatchId: number;
  current: number;
  size: number;
  scanStatus?: ScanStatusEnum | null;
  imported?: boolean | null;
  moduleName?: string;
  keyword?: string;
}

/**
 * 开始扫描接口
 */
export const endpointScan = (applications: string[]) => {
  return http.request<number>("post", `/system/api-endpoint/scan/endpoints`, {
    data: applications
  });
};

/**
 * 获取扫描记录列表
 */
export const scanPage = (params: any) => {
  return http.request<ResultPage<SysApiScanRecord[]>>(
    "get",
    `/system/api-scan/page`,
    {
      params
    }
  );
};

/**
 * 获取接口端点列表
 */
export const endpointList = (params: any) => {
  return http.request<ResultPage<SysApiEndpoint>>(
    "get",
    `/system/api-endpoint/page`,
    {
      params
    }
  );
};

/**
 * 批量导入接口
 */
export const batchImport = (data: any) => {
  return http.request<Result<any>>("post", `/system/api-endpoint/import`, {
    data
  });
};

/**
 * 根据批次id批量导入接口
 */
export const batchImportByBatchId = (scanBatchId: any) => {
  return http.request<Result<any>>(
    "post",
    `/system/api-endpoint/import/batch/${scanBatchId}`
  );
};

/**
 * 批量忽略接口
 */
export const batchIgnore = (data: any) => {
  return http.request<Result<any>>("put", `/system/api-endpoint/ignore`, {
    data
  });
};
