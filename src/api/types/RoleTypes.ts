import type { PageableRequest } from '@/api/types/ModelTypes.ts'

/**
 * 分页查询角色信息入参
 */
export interface FindRolePageRequest extends PageableRequest {
	/** 角色代码 */
	code?: string;

	/** 角色名称 */
	name?: string;

	/** 角色描述 */
	description?: string;
}

/**
 * 保存或修改角色信息入参
 */
export interface SaveRoleRequest {
	/** 主键id（修改时必传） */
	id?: number;

	/** 角色代码 */
	code: string;

	/** 角色名称 */
	name: string;

	/** 角色描述 */
	description?: string;
}

/**
 * 修改角色权限入参
 */
export interface UpdateRolePermissionsRequest {
	/** 角色id */
	roleId: number;

	/** 权限id列表 */
	permissionIds?: number[];
}
