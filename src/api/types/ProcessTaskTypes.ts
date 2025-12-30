import type { RedirectTypeEnum } from '@/api/types/Enums.ts'
import type { PageableRequest } from '@/api/types/ModelTypes.ts'

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

// RedirectInfo.ts
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
	taskId: string;

	/**
	 * 任务定义Key
	 */
	taskDefinitionKey: string;

	/**
	 * 任务名称
	 */
	taskName: string;

	/**
	 * 指派人
	 */
	assignee: string;

	/**
	 * 创建时间
	 */
	createTime: Date;

	// ---- 流程维度 ----

	/**
	 * 流程实例ID
	 */
	processInstanceId: string;

	/**
	 * 流程定义Key
	 */
	processDefinitionKey: string;

	/**
	 * 流程定义名称
	 */
	processDefinitionName: string;

	/**
	 * 流程定义版本
	 */
	processDefinitionVersion: number;

	/**
	 * 业务唯一ID
	 */
	businessKey: string;

	/**
	 * 启动用户ID
	 */
	startUserId: string;

	// ---- 表单 ----

	/**
	 * 表单主键ID
	 */
	formKey: string;

	/**
	 * 表单版本
	 */
	formVersion: number;

	// ---- 前端辅助 ----

	/**
	 * 是否可以拾取
	 */
	canClaim: boolean;

	/**
	 * 是否为当前用户任务
	 */
	initiatorTask: boolean;
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
