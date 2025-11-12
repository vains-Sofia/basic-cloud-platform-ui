import { http } from '@/utils/request.ts'
import type {
	FindBasicUserPageRequest,
	FindBasicUserResponse,
	FindRoleResponse,
	ResetPasswordRequest,
	SaveBasicUserRequest,
	UpdateUserRolesRequest,
	UserInfo
} from '@/api/types/UserTypes.ts'
import type { Pageable, Result } from '@/api/types/ModelTypes.ts'

/** 个人信息 */
export const loginUserinfo = () => {
	return http.request<UserInfo>('get', '/system/user/loginUserinfo')
}

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: FindBasicUserPageRequest) => {
	return http.request<Pageable<FindBasicUserResponse>>('get', '/system/user/findByPage', {
		params: data,
	})
}

/** 添加用户信息 */
export const insertBasicUser = (data?: SaveBasicUserRequest) => {
	return http.request<Result<string>>('post', '/system/user/insertBasicUser', {
		data,
	})
}

/** 修改用户信息 */
export const updateBasicUser = (data?: SaveBasicUserRequest) => {
	return http.request<Result<string>>('put', '/system/user/updateBasicUser', {
		data,
	})
}

/** 删除用户信息 */
export const removeBasicUserById = (id?: string) => {
	return http.request<Result<string>>('delete', `/system/user/removeById/${id}`)
}

/** 修改用户角色 */
export const updateUserRoles = (data?: UpdateUserRolesRequest) => {
	return http.request<Result<string>>('put', '/system/user/updateUserRoles', {
		data,
	})
}

/** 重置密码 */
export const resetPassword = (data?: ResetPasswordRequest) => {
	return http.request<Result<string>>('put', '/system/user/resetPassword', {
		data,
	})
}

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
	return http.request<Result<Array<FindRoleResponse>>>('get', '/system/role/findRoles')
}

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (userId?: string) => {
	return http.request<Result<Array<string>>>('get', `/system/role/findRoleIdsByUserId/${userId}`)
}
