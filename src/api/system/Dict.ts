import { http } from '@/utils/request.ts'
import type {
	FindSysDictItemResponse,
	FindSysDictTypeResponse,
	SysDictItemRequest,
} from '@/api/types/DictTypes.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'

/**
 * 分页查询字典类型
 */
export const allType = () => {
	return http.request<FindSysDictTypeResponse[]>('get', '/system/dict/type/all')
}

/**
 * 分页查询字典类型
 */
export const pageType = (params: any) => {
	return http.request<Pageable<FindSysDictTypeResponse>>('get', '/system/dict/type/page', params)
}

/**
 * 创建字典类型
 */
export const createType = (data: any) => {
	return http.post<FindSysDictTypeResponse>('/system/dict/type', data)
}

/**
 * 修改字典类型
 */
export const updateType = (id: string, data: any) => {
	return http.put<FindSysDictTypeResponse>(`/system/dict/type/${id}`, data)
}

/**
 * 删除字典类型
 */
export const deleteType = (id: string) => {
	return http.request<any>('delete', `/system/dict/type/${id}`)
}

/**
 * 分页查询字典项
 */
export const pageItem = (params: any) => {
	return http.request<Pageable<FindSysDictItemResponse>>('get', '/system/dict/item/page', params)
}

/**
 * 创建字典类型
 */
export const createItem = (data: SysDictItemRequest) => {
	return http.post<FindSysDictItemResponse>('/system/dict/item', data)
}

/**
 * 修改字典类型
 */
export const updateItem = (id: string, data: any) => {
	return http.put<FindSysDictItemResponse>(`/system/dict/item/${id}`, data)
}

/**
 * 删除字典类型
 */
export const deleteItem = (id: string) => {
	return http.request<any>('delete', `/system/dict/item/${id}`)
}

/**
 * 根据字典类型获取字典项
 */
export const dictItems = (typeCode: string) => {
	return http.request<FindSysDictItemResponse[]>('get', `/system/dict/item/type/${typeCode}`)
}
