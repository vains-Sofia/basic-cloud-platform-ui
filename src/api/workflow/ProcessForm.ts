import { http } from '@/utils/request.ts'
import type {
	FindProcessFormPageRequest,
	PageProcessFormResponse,
	ProcessFormResponse,
	SaveProcessFormRequest,
} from '@/api/types/ProcessFormTypes.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'

/**
 * 保存动态表单
 * @param data 流程表单数据
 */
export const saveProcessForm = (data?: SaveProcessFormRequest) => {
	return http.post<string>('/workflow/process-form', data)
}

/**
 * 修改动态表单
 * @param id 主键id
 * @param data 流程定义数据
 */
export const updateProcessForm = (id: string, data?: SaveProcessFormRequest) => {
	return http.put<string>(`/workflow/process-form/${id}`, data)
}

/**
 * 删除动态表单
 * @param id 主键id
 */
export const deleteProcessForm = (id: string) => {
	return http.delete<string>(`/workflow/process-form/${id}`)
}

/**
 * 获取动态表单详情
 * @param id 主键id
 */
export const getProcessFormById = (id: string) => {
	return http.get<ProcessFormResponse>(`/workflow/process-form/${id}`)
}

/**
 * 分页查询动态表单列表
 * @param params 分页查询参数
 */
export const pageProcessForm = (params: FindProcessFormPageRequest) => {
	return http.get<Pageable<PageProcessFormResponse>>(`/workflow/process-form/page`, params)
}


