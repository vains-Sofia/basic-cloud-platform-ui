import { http } from '@/utils/request.ts'
import {
	type CancelProcessInstanceRequest,
	type FindProcessInstanceRequest,
	type FindTodoTaskRequest,
	type ProcessInstanceResponse,
	type ProcessTaskDetailResponse,
	type TaskApproveRequest,
	type TaskApproveResponse,
	type TodoTaskPageResponse
} from '@/api/types/ProcessTaskTypes.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'

/**
 * 查询我的待办任务列表
 * @param data 分页查询待办任务列表入参
 */
export const todoTaskPage = (data: FindTodoTaskRequest) => {
	return http.get<Pageable<TodoTaskPageResponse>>('/workflow/process-task/todo/page', data)
}

/**
 * 查询我的待办任务列表
 * @param data 分页查询待办任务列表入参
 */
export const taskApprove = (data: TaskApproveRequest) => {
	return http.post<TaskApproveResponse>('/workflow/process-task/approve', data)
}

/**
 * 拾取任务
 * @param taskId 任务 ID
 */
export const claim = (taskId: string) => {
	return http.put<TaskApproveResponse>(`/workflow/process-task/claim/${taskId}`)
}

/**
 * 归还任务
 * @param taskId 任务 ID
 */
export const unclaim = (taskId: string) => {
	return http.put<TaskApproveResponse>(`/workflow/process-task/unclaim/${taskId}`)
}

/**
 * 获取流程任务详情
 * @param taskId 任务 ID
 */
export const getProcessTaskDetail = (taskId: string) => {
	return http.get<ProcessTaskDetailResponse>(
		`/workflow/process-task/process/task/detail/${taskId}`,
	)
}

/**
 * 分页获取我发起的流程
 * @param params 分页参数
 */
export const getMyProcessInstance = (params: FindProcessInstanceRequest) => {
	return http.get<Pageable<ProcessInstanceResponse>>(
		`/workflow/process-task/my-instances`,
		params,
	)
}

/**
 * 取消流程实例
 * @param data 取消流程实例入参
 */
export const cancelProcessInstance = (data: CancelProcessInstanceRequest) => {
	return http.delete<Pageable<ProcessInstanceResponse>>(
		`/workflow/process-task/cancel-process`,
		data,
	)
}
