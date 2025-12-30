import { http } from '@/utils/request.ts'
import type {
	FindTodoTaskRequest,
	StartProcessRequest,
	StartProcessResponse,
	TaskApproveRequest,
	TaskApproveResponse,
	TodoTaskPageResponse,
} from '@/api/types/ProcessTaskTypes.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'

/**
 * 发起流程
 * @param data 发起流程数据
 */
export const startProcess = (data: StartProcessRequest) => {
	return http.post<StartProcessResponse>('/workflow/process-task/start', data)
}

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
