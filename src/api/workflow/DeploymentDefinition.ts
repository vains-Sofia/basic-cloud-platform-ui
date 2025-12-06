import { http } from '@/utils/request.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'
import type {
	DeployDefinitionResponse,
	FindDeployDefinitionPageRequest,
	PageDeployDefinitionResponse,
	SuspensionStateChangeRequest,
} from '@/api/types/DeploymentDefinitionTypes.ts'

/**
 * 分页查询部署后的流程定义
 * @param params 分页查询入参
 */
export const pageQuery = (params: FindDeployDefinitionPageRequest) => {
	return http.request<Pageable<PageDeployDefinitionResponse>>(
		'get',
		'/workflow/deployment-definition/page',
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
	return http.put<Pageable<PageDeployDefinitionResponse>>(
		`/workflow/deployment-definition/change-suspension-state/${processDefinitionId}`,
		data,
	)
}

/**
 * 根据部署后的流程定义ID获取BPMN XML
 * @param processDefinitionId 流程定义 ID
 */
export const getBpmnXml = (processDefinitionId: string) => {
	return http.get<string>(`/workflow/deployment-definition/${processDefinitionId}/bpmn`)
}

/**
 * 根据部署后的流程定义ID获取流程定义详情
 * @param processDefinitionId 流程定义 ID
 */
export const getDeployDefinitionDetail = (processDefinitionId: string) => {
	return http.get<DeployDefinitionResponse>(`/workflow/deployment-definition/${processDefinitionId}`)
}
