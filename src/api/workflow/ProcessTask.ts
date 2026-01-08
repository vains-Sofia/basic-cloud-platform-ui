import { http } from '@/utils/request.ts'
import type {
	FindTodoTaskRequest,
	TaskApproveRequest,
	TaskApproveResponse,
	TodoTaskPageResponse,
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
 * @param taskId
 */
export const claim = (taskId: string) => {
	return http.put<TaskApproveResponse>(`/workflow/process-task/claim/${taskId}`)
}

/**
 * 归还任务
 * @param taskId
 */
export const unclaim = (taskId: string) => {
	return http.put<TaskApproveResponse>(`/workflow/process-task/unclaim/${taskId}`)
}
