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
	taskId: string

	/**
	 * 审批类型 - APPROVE / REJECT
	 */
	action: string;

	/**
	 * 审批意见
	 */
	comment?: string

	/**
	 * 表单或审批变量
	 */
	variables?: Map<string, any> | Record<string, any>
}

/**
 * 流程审批响应
 */
export interface TaskApproveResponse {
	/**
	 * 是否流程结束
	 */
	processEnded: boolean

	/**
	 * 下一节点 taskId
	 */
	nextTaskId?: string

	/**
	 * 下一节点 formKey
	 */
	nextFormKey?: string

	/**
	 * 下一节点 name
	 */
	nextTaskName?: string
}

/**
 * 已完成任务响应
 */
export interface FinishedTaskResponse {
	/**
	 * 任务 ID
	 */
	taskId?: string

	/**
	 * 任务名称
	 */
	taskName?: string

	/**
	 * 审批人、提交人
	 */
	assignee?: string

	/**
	 * 表单 schema
	 */
	formContent?: string

	/**
	 * 表单数据
	 */
	formData?: Record<string, any>

	/**
	 * 提交时间
	 */
	endTime?: string
}

/**
 * 流程任务详情响应
 */
export interface ProcessTaskDetailResponse {
	/**
	 * 任务 ID
	 */
	taskId?: string

	/**
	 * 任务名称
	 */
	taskName?: string

	/**
	 * 流程实例 ID
	 */
	processInstanceId?: string

	/**
	 * 流程定义名称
	 */
	processDefinitionName?: string

	/**
	 * 流程定义 Key
	 */
	processDefinitionKey?: string

	/**
	 * 流程定义版本
	 */
	processDefinitionVersion?: number

	/**
	 * 表单设计器生成、使用的完整JSON配置
	 */
	formContent: string

	/**
	 * 已完成任务
	 */
	finishedTasks?: FinishedTaskResponse[]
}

/**
 * 流程实例响应
 */
export interface ProcessInstanceResponse {
	/**
	 * 流程实例 ID
	 */
	processInstanceId: string

	/**
	 * 流程定义 ID
	 */
	processDefinitionId?: string

	/**
	 * 流程定义 Key
	 */
	processDefinitionKey?: string

	/**
	 * 流程定义名称
	 */
	processDefinitionName?: string

	/**
	 * 流程定义版本
	 */
	processDefinitionVersion?: number

	/**
	 * 业务 Key
	 */
	businessKey?: string

	/**
	 * 流程状态：RUNNING, SUSPENDED, COMPLETED, CANCELLED
	 */
	status?: string

	/**
	 * 流程是否挂起
	 */
	suspended?: boolean

	/**
	 * 流程是否结束
	 */
	ended?: boolean

	/**
	 * 流程实例开始时间
	 */
	startTime?: string

	/**
	 * 流程实例结束时间
	 */
	endTime?: string

	/**
	 * 格式化的间隔时间
	 */
	formattedDuration: string

	/**
	 * 流程实例从开始到结束间隔的毫秒数
	 */
	durationInMillis?: number

	/**
	 * 办理人 ID
	 */
	assigneeId?: string

	/**
	 * 办理人姓名
	 */
	assigneeName?: string

	/**
	 * 当前活动节点 ID（仅运行中流程）
	 */
	currentActivityId?: string

	/**
	 * 当前活动节点名称（仅运行中流程）
	 */
	currentActivityName?: string
}

export interface FindProcessInstanceRequest extends PageableRequest {
	/**
	 * 流程定义 key
	 */
	processDefinitionKey?: string
}

export interface CancelProcessInstanceRequest {
	/**
	 * 流程实例 ID
	 */
	processInstanceId: string

	/**
	 * 取消流程原因
	 */
	reason?: string
}
