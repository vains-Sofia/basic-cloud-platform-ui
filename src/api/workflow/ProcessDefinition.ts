import { http } from '@/utils/request.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'
import type {
	FindDefinitionPageRequest,
	PageProcessDefinitionResponse,
	ProcessDefinitionResponse,
	StartProcessRequest,
	StartProcessResponse,
	SuspensionStateChangeRequest,
} from '@/api/types/ProcessDefinitionTypes.ts'

/**
 * 分页查询部署后的流程定义
 * @param params 分页查询入参
 */
export const pageQuery = (params: FindDefinitionPageRequest) => {
	return http.request<Pageable<PageProcessDefinitionResponse>>(
		'get',
		'/workflow/process-definition/page',
		params,
	)
}

/**
 * 改变流程定义状态
 * @param processDefinitionId 流程定义 ID
 * @param data 改变流程定义状态入参
 */
export const changeSuspensionState = (
	processDefinitionId: string,
	data: SuspensionStateChangeRequest,
) => {
	return http.put<Pageable<PageProcessDefinitionResponse>>(
		`/workflow/process-definition/change-suspension-state/${processDefinitionId}`,
		data,
	)
}

/**
 * 根据部署后的流程定义ID获取BPMN XML
 * @param processDefinitionId 流程定义 ID
 */
export const getBpmnXml = (processDefinitionId: string) => {
	return http.get<string>(`/workflow/process-definition/${processDefinitionId}/bpmn`)
}

/**
 * 根据部署后的流程定义ID获取流程定义详情
 * @param processDefinitionId 流程定义 ID
 */
export const getDeployDefinitionDetail = (processDefinitionId: string) => {
	return http.get<ProcessDefinitionResponse>(
		`/workflow/process-definition/${processDefinitionId}`,
	)
}

/**
 * 发起流程
 * @param data 发起流程数据
 */
export const startProcess = (data: StartProcessRequest) => {
	return http.post<StartProcessResponse>('/workflow/process-definition/start', data)
}
