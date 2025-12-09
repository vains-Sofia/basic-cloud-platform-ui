// 分页查询认证信息
import type {
	FindModelHistoryPageRequest,
	FindModelPageRequest,
	PageProcessModelResponse,
	ProcessModelResponse,
	PublishProcessRequest,
	PublishProcessResponse,
	SaveProcessModelRequest,
} from '@/api/types/ProcessModelTypes.ts'
import { http } from '@/utils/request.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'

/**
 * 分页查询流程定义
 * @param params 分页查询入参
 */
export const findModelPage = (params: FindModelPageRequest) => {
	return http.request<Pageable<PageProcessModelResponse>>(
		'get',
		'/workflow/process-model/page',
		params,
	)
}

/**
 * 保存流程定义（草稿）
 * @param data 流程定义数据
 */
export const saveProcessModel = (data: SaveProcessModelRequest) => {
	return http.post<ProcessModelResponse>('/workflow/process-model', data)
}

/**
 * 根据 processKey 查询流程定义
 * @param processKey 流程定义key
 */
export const getByProcessKey = (processKey: string) => {
	return http.get<ProcessModelResponse>(`/workflow/process-model/key/${processKey}`)
}

/**
 * 修改流程定义元数据
 *
 * @param id 流程定义id
 * @param data 流程定义数据
 */
export const updateProcessModel = (id: string, data: SaveProcessModelRequest) => {
	return http.put<string>(`/workflow/process-model/${id}`, data)
}

/**
 * 修改流程定义元数据
 * @param processKey 流程定义key
 */
export const deleteProcessModel = (processKey: string) => {
	return http.delete<string>(`/workflow/process-model/${processKey}`)
}

/**
 * 发布流程定义
 *
 * @param id 流程定义id
 * @param data 发布说明
 */
export const publishProcessModel = (id: string, data: PublishProcessRequest) => {
	return http.post<PublishProcessResponse>(`/workflow/process-model/${id}/publish`, data)
}

/**
 * 禁用流程定义
 *
 * @param id 流程定义id
 */
export const disableProcessModel = (id: string) => {
	return http.post<string>(`/workflow/process-model/${id}/disable`)
}

/**
 * 启用流程定义
 *
 * @param id 流程定义id
 */
export const enableProcessModel = (id: string) => {
	return http.post<string>(`/workflow/process-model/${id}/enable`)
}

/**
 * 分页查询流程定义历史版本
 *
 * @param params 分页查询流程定义历史版本入参
 */
export const getProcessModelHistory = (params: FindModelHistoryPageRequest) => {
	return http.get<Pageable<PageProcessModelResponse>>(
		`/workflow/process-model/history/page`,
		params,
	)
}

/**
 * 回退processKey对应的模型定义至version版本
 *
 * @param processKey 流程定义key
 * @param version 流程定义版本
 */
export const rollback = (processKey: string, version: number) => {
	return http.put<string>(`/workflow/process-model/rollback/${processKey}/${version}`)
}
