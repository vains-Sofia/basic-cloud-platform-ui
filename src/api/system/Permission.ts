import { http } from '@/utils/request'
import type {
	DynamicRouter,
	FindPermissionRequest,
	FindPermissionResponse,
	SavePermissionRequest,
} from '@/api/types/PermissionTypes'
import type { Result } from '@/api/types/ModelTypes.ts'

/** 获取动态路由 */
export const getAsyncRoutes = () => {
	return http.request<Array<DynamicRouter>>('get', '/system/permission/findUserRouters')
}

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: FindPermissionRequest) => {
	return http.request<Result<Array<FindPermissionResponse>>>(
		'get',
		'/system/permission/findPermissions',
		{
			params: data,
		},
	)
}

/** 添加权限信息 */
export const insertPermission = (data?: SavePermissionRequest) => {
	return http.request<Result<string>>('post', '/system/permission/insertPermission', {
		data,
	})
}

/** 修改权限信息 */
export const updatePermission = (data?: SavePermissionRequest) => {
	return http.request<Result<string>>('put', '/system/permission/updatePermission', {
		data,
	})
}

/** 批量修改权限信息 */
export const batchUpdatePermissions = (data?: Array<SavePermissionRequest>) => {
	return http.request<Result<string>>('put', '/system/permission/batchUpdatePermissions', {
		data,
	})
}

/** 删除权限信息 */
export const removePermissionById = (id?: string) => {
	return http.request<Result<string>>('delete', `/system/permission/removeById/${id}`)
}

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (roleId?: string) => {
	return http.request<Result<Array<string>>>(
		'get',
		`/system/permission/findPermissionIdsByRoleId/${roleId}`,
	)
}
