import type { PageableRequest } from '@/api/types/ModelTypes.ts'

/**
* 分页查询流程定义入参
*/
export interface FindDeploymentPageRequest extends PageableRequest {
	/**
	 * 模糊查询流程名称
	 */
	name?: string;

	/**
	 * 分类
	 */
	category?: string;

	/**
	 * 流程定义key
	 */
	processDefinitionKey?: string;
}

/**
 * 流程部署响应bean
 */
export interface PageProcessDeploymentResponse {
	/**
	 * 部署 ID
	 */
	id: string;

	/**
	 * 流程实例名称
	 */
	name?: string;

	/**
	 * 流程实例分类
	 */
	category?: string;

	/**
	 * 流程实例key
	 */
	processKey?: string;

	/**
	 * 部署时间
	 */
	deploymentTime?: string;
}
