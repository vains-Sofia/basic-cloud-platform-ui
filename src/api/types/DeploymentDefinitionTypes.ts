import type { PageableRequest } from '@/api/types/ModelTypes.ts'
import type { SuspensionStateEnum } from '@/api/types/Enums.ts'

/**
 * 部署后的流程定义分页查询入参
 */
export interface FindDeployDefinitionPageRequest extends PageableRequest {
	/**
	 * 模糊查询流程名称
	 */
	name?: string

	/**
	 * 分类
	 */
	category?: string

	/**
	 * 流程定义key
	 */
	processKey?: string

	/**
	 * 状态 - 激活或挂起
	 */
	active?: boolean
}

/**
 * 部署后的流程定义响应bean
 */
export interface PageDeployDefinitionResponse {
	/**
	 * 流程定义 ID
	 */
	id: string

	/**
	 * 流程名称
	 */
	name?: string

	/**
	 * 流程key
	 */
	key?: string

	/**
	 * 流程分类
	 */
	category?: string

	/**
	 * 状态 - 挂起 激活
	 */
	suspended?: boolean

	/**
	 * 流程版本
	 */
	version?: number

	/**
	 * 部署 ID
	 */
	deploymentId?: string

	/**
	 * 部署时间
	 */
	deploymentTime?: string
}

/**
 * 改变流程定义状态入参
 */
export interface SuspensionStateChangeRequest {
	/**
	 * 流程定义状态
	 * @validates 不能为空
	 */
	state: SuspensionStateEnum

	/**
	 * 是否包含关联的流程实例
	 */
	includeProcessInstances?: boolean
}

/**
 * 任务表单响应
 */
export interface TaskFormResponse {
	/**
	 * 任务定义Key
	 */
	taskDefinitionKey?: string;
	/**
	 * 任务表单Key
	 */
	formKey?: string;
}

/**
 * 部署的流程定义详情
 */
export interface DeployDefinitionResponse extends PageDeployDefinitionResponse {
	/**
	 * 资源名称
	 * xml资源名称
	 */
	resourceName?: string;
	/**
	 * 图片资源名称
	 * 图片资源名称
	 */
	diagramResourceName?: string;
	/**
	 * 启动用户
	 * 启动用户
	 */
	startUsers?: string[];
	/**
	 * 启动用户组
	 * 启动用户组
	 */
	startGroups?: string[];
	/**
	 * 启动表单key
	 * 启动表单key
	 */
	startFormKey?: string;
	/**
	 * 任务表单列表
	 * 任务表单列表
	 */
	taskForms?: TaskFormResponse[];
}
