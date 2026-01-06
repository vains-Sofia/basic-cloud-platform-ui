import type { PageableRequest } from '@/api/types/ModelTypes.ts'
import { RedirectTypeEnum, type SuspensionStateEnum } from '@/api/types/Enums.ts'

/**
 * 部署后的流程定义分页查询入参
 */
export interface FindDefinitionPageRequest extends PageableRequest {
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
export interface PageProcessDefinitionResponse {
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
	taskDefinitionKey?: string
	/**
	 * 任务表单Key
	 */
	formKey?: string
}

/**
 * 部署的流程定义详情
 */
export interface ProcessDefinitionResponse extends PageProcessDefinitionResponse {
	/**
	 * 资源名称
	 * xml资源名称
	 */
	resourceName?: string
	/**
	 * 图片资源名称
	 * 图片资源名称
	 */
	diagramResourceName?: string
	/**
	 * 启动用户
	 * 启动用户
	 */
	startUsers?: string[]
	/**
	 * 启动用户组
	 * 启动用户组
	 */
	startGroups?: string[]
	/**
	 * 启动表单key
	 * 启动表单key
	 */
	startFormKey?: string
	/**
	 * 任务表单列表
	 * 任务表单列表
	 */
	taskForms?: TaskFormResponse[]
}
/**
 * 发起流程请求入参
 */
export interface StartProcessRequest {
	/**
	 * 流程定义key
	 */
	processDefinitionKey: string

	/**
	 * 业务唯一id
	 */
	businessKey?: string

	/**
	 * 流程变量
	 */
	variables?: Record<string, any>
}

// NextTaskInfo.ts
/**
 * 下一个任务节点
 */
export interface NextTaskInfo {
	/**
	 * 任务ID
	 */
	taskId?: string

	/**
	 * 任务定义Key
	 */
	taskDefinitionKey?: string

	/**
	 * 任务名称
	 */
	taskName?: string

	/**
	 * 任务指派人
	 */
	assignee?: string

	/**
	 * 表单key
	 */
	formKey?: string

	/**
	 * 表单版本
	 */
	formVersion?: number

	/**
	 * 是否发起人填写节点
	 */
	initiatorTask: boolean
}

/**
 * 前端重定向相关
 */
export interface RedirectInfo {
	/**
	 * 重定向地址
	 */
	url?: string

	/**
	 * 重定向类型
	 */
	type: RedirectTypeEnum
}

/**
 * 发起流程实例响应
 */
export interface StartProcessResponse {
	/**
	 * 流程实例id
	 */
	processInstanceId?: string

	/**
	 * 流程定义Key
	 */
	processDefinitionKey?: string

	/**
	 * 业务唯一ID
	 */
	businessKey?: string

	/**
	 * 发起流程的用户ID
	 */
	startUserId?: string

	/**
	 * 下一个任务节点
	 */
	nextTask?: NextTaskInfo

	/**
	 * 前端重定向相关
	 */
	redirect?: RedirectInfo
}
