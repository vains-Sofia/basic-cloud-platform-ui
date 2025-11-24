import { http } from '@/utils/request'
import type {
	FindScopePageRequest,
	FindScopeResponse,
	ResetScopePermissionRequest,
	SaveScopeRequest
} from '@/api/types/ScopeTypes'
import type { Pageable } from '@/api/types/ModelTypes.ts'

/** 平台管理-scope列表 */
export const findScopeList = () => {
	return http.request<Array<FindScopeResponse>>('get', '/auth/scope/findScopeList')
}

/** 获取平台管理-scope管理列表 */
export const getScopeList = (data?: FindScopePageRequest) => {
	return http.request<Pageable<FindScopeResponse>>('get', '/auth/scope/findByPage', data)
}

/** 添加scope信息 */
export const insertScope = (data?: SaveScopeRequest) => {
	return http.post<string>('/auth/scope/save', data)
}

/** 修改scope信息 */
export const updateScope = (data?: SaveScopeRequest) => {
	return http.put<string>('/auth/scope/update', data)
}

/** 删除scope信息 */
export const removeScopeById = (id?: string) => {
	return http.request<string>('delete', `/auth/scope/removeById/${id}`)
}

/** scope管理-权限-菜单权限-修改scope id 对应菜单 */
export const updateScopePermissions = (data?: ResetScopePermissionRequest) => {
	return http.put<string>(`/auth/scope/resetScopePermission`, data)
}

/** 获取scope管理-权限-菜单权限-根据scope id 查对应菜单 */
export const getScopeMenuIds = (scope?: string) => {
	return http.request<Array<string>>('get', `/auth/scope/findPermissionIdsByScope/${scope}`)
}
