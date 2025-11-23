import { http } from '@/utils/request.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'
import type {
	EndpointListParams,
	FindApiScanRecordPageRequest,
	SysApiEndpoint,
	SysApiScanRecord
} from '@/api/types/ApiScanTypes.ts'

/**
 * 开始扫描接口
 */
export const endpointScan = (applications: string[]) => {
	return http.post<number>(`/system/api-endpoint/scan/endpoints`, applications)
}

/**
 * 获取扫描记录列表
 */
export const scanPage = (params: FindApiScanRecordPageRequest) => {
	return http.request<Pageable<SysApiScanRecord>>('get', `/system/api-scan/page`, params)
}

/**
 * 获取接口端点列表
 */
export const endpointList = (params: EndpointListParams) => {
	return http.request<Pageable<SysApiEndpoint>>('get', `/system/api-endpoint/page`, params)
}

/**
 * 批量导入接口
 */
export const batchImport = (data: Array<string>) => {
	return http.post<any>(`/system/api-endpoint/import`, data)
}

/**
 * 根据批次id批量导入接口
 */
export const batchImportByBatchId = (scanBatchId: string) => {
	return http.request<any>('post', `/system/api-endpoint/import/batch/${scanBatchId}`)
}

/**
 * 批量忽略接口
 */
export const batchIgnore = (data: string[]) => {
	return http.put<any>(`/system/api-endpoint/ignore`, data)
}
