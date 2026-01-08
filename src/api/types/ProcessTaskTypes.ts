import type { RedirectTypeEnum } from '@/api/types/Enums.ts'
import type { PageableRequest } from '@/api/types/ModelTypes.ts'

/**
 * 分页查询待办任务列表入参
 */
export interface FindTodoTaskRequest extends PageableRequest {
	any?: string
}

/**
 * 待办任务列表响应
 */
export interface TodoTaskPageResponse {
	// ---- 任务维度 ----

	/**
	 * 任务id
	 */
	taskId: string

	/**
	 * 任务定义Key
	 */
	taskDefinitionKey: string

	/**
	 * 任务名称
	 */
	taskName: string

	/**
	 * 指派人
	 */
	assignee: string

	/**
	 * 创建时间
	 */
	createTime: Date

	// ---- 流程维度 ----

	/**
	 * 流程实例ID
	 */
	processInstanceId: string

	/**
	 * 流程定义Key
	 */
	processDefinitionKey: string

	/**
	 * 流程定义名称
	 */
	processDefinitionName: string

	/**
	 * 流程定义版本
	 */
	processDefinitionVersion: number

	/**
	 * 业务唯一ID
	 */
	businessKey: string

	/**
	 * 启动用户ID
	 */
	startUserId: string

	// ---- 表单 ----

	/**
	 * 表单主键ID
	 */
	formKey: string

	/**
	 * 表单版本
	 */
	formVersion: number

	// ---- 前端辅助 ----

	/**
	 * 是否可以拾取
	 */
	canClaim: boolean

	/**
	 * 是否可以归还
	 */
	canUnclaim: boolean

	/**
	 * 是否为当前用户任务
	 */
	initiatorTask: boolean
}

/**
 * 流程审批入参
 */
export interface TaskApproveRequest {
	/**
	 * 任务ID
	 */
	taskId: string;

	/**
	 * 审批类型 - APPROVE / REJECT
	 */
	action: string;

	/**
	 * 审批意见
	 */
	comment?: string;

	/**
	 * 表单或审批变量
	 */
	variables?: Map<string, any> | Record<string, any>;
}

/**
 * 流程审批响应
 */
export interface TaskApproveResponse {
	/**
	 * 是否流程结束
	 */
	processEnded: boolean;

	/**
	 * 下一节点 taskId
	 */
	nextTaskId?: string;

	/**
	 * 下一节点 formKey
	 */
	nextFormKey?: string;

	/**
	 * 下一节点 name
	 */
	nextTaskName?: string;
}
