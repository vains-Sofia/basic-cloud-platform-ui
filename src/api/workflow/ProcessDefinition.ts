// 分页查询认证信息
import type {
	FindDefinitionHistoryPageRequest,
	FindDefinitionPageRequest,
	PageProcessDefinitionResponse,
	ProcessDefinitionResponse,
	PublishProcessRequest,
	PublishProcessResponse,
	SaveProcessDefinitionRequest
} from '@/api/types/ProcessDefinitionTypes.ts'
import { http } from '@/utils/request.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'

/**
 * 分页查询流程定义
 * @param params 分页查询入参
 */
export const findDefinitionPage = (params: FindDefinitionPageRequest) => {
	return http.request<Pageable<PageProcessDefinitionResponse>>(
		'get',
		'/workflow/process-definition/page',
		params,
	)
}

/**
 * 保存流程定义（草稿）
 * @param data 流程定义数据
 */
export const saveProcessDefinition = (data: SaveProcessDefinitionRequest) => {
	return http.post<ProcessDefinitionResponse>('/workflow/process-definition', data)
}

/**
 * 根据 processKey 查询流程定义
 * @param processKey 流程定义key
 */
export const getByProcessKey = (processKey: string) => {
	return http.get<ProcessDefinitionResponse>(`/workflow/process-definition/key/${processKey}`)
}

/**
 * 修改流程定义元数据
 *
 * @param id 流程定义id
 * @param data 流程定义数据
 */
export const updateProcessDefinition = (id: string, data: SaveProcessDefinitionRequest) => {
	return http.put<string>(`/workflow/process-definition/${id}`, data)
}

/**
 * 修改流程定义元数据
 * @param processKey 流程定义key
 */
export const deleteProcessDefinition = (processKey: string) => {
	return http.delete<string>(`/workflow/process-definition/${processKey}`)
}

/**
 * 发布流程定义
 *
 * @param id 流程定义id
 * @param data 发布说明
 */
export const publishProcessDefinition = (id: string, data: PublishProcessRequest) => {
	return http.post<PublishProcessResponse>(`/workflow/process-definition/${id}/publish`, data)
}

/**
 * 禁用流程定义
 *
 * @param id 流程定义id
 */
export const disableProcessDefinition = (id: string) => {
	return http.post<string>(`/workflow/process-definition/${id}/disable`)
}

/**
 * 启用流程定义
 *
 * @param id 流程定义id
 */
export const enableProcessDefinition = (id: string) => {
	return http.post<string>(`/workflow/process-definition/${id}/enable`)
}

/**
 * 分页查询流程定义历史版本
 *
 * @param params 分页查询流程定义历史版本入参
 */
export const getProcessDefinitionHistory = (params: FindDefinitionHistoryPageRequest) => {
	return http.get<Pageable<PageProcessDefinitionResponse>>(
		`/workflow/process-definition/history/page`,
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
	return http.put<string>(`/workflow/process-definition/rollback/${processKey}/${version}`)
}
