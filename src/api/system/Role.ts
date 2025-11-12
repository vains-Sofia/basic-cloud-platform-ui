import { http } from '@/utils/request.ts'
import type { Pageable, Result } from '@/api/types/ModelTypes.ts'
import type { FindRoleResponse } from '@/api/types/UserTypes.ts'
import type { FindRolePageRequest, SaveRoleRequest, UpdateRolePermissionsRequest } from '@/api/types/RoleTypes.ts'

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: FindRolePageRequest) => {
	return http.request<Pageable<FindRoleResponse>>('get', '/system/role/findByPage', {
		params: data,
	})
}

/** 添加角色信息 */
export const insertRole = (data?: SaveRoleRequest) => {
	return http.request<Result<string>>('post', '/system/role/insertRole', {
		data,
	})
}

/** 修改角色信息 */
export const updateRole = (data?: SaveRoleRequest) => {
	return http.request<Result<string>>('put', '/system/role/updateRole', {
		data,
	})
}

/** 删除角色信息 */
export const removeRoleById = (id?: string) => {
	return http.request<Result<string>>('delete', `/system/role/removeById/${id}`)
}

/** 角色管理-权限-菜单权限-修改角色 id 查对应菜单 */
export const updateRolePermissions = (data?: UpdateRolePermissionsRequest) => {
	return http.request<Result<string>>('put', `/system/role/updateRolePermissions`, {
		data,
	})
}
