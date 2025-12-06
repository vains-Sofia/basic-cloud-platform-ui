import { http } from '@/utils/request.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'
import type {
	FindDeploymentPageRequest,
	PageProcessDeploymentResponse,
} from '@/api/types/ProcessDeploymentTypes.ts'

/**
 * 分页查询流程部署
 * @param params 分页查询入参
 */
export const findDeploymentPage = (params: FindDeploymentPageRequest) => {
	return http.request<Pageable<PageProcessDeploymentResponse>>(
		'get',
		'/workflow/process-deployment/page',
		params,
	)
}

/**
 * 删除部署的流程
 * @param deploymentId
 * @param cascade
 */
export const undeploy = (deploymentId: string, cascade?: boolean) => {
	return http.request<string>(
		'delete',
		`/workflow/process-deployment/${deploymentId}/undeploy`,
		cascade !== undefined ? { cascade } : undefined,
	)
}
