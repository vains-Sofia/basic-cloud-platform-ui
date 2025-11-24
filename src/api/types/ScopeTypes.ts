import type { PageableRequest } from '@/api/types/ModelTypes.ts'

export type FindScopeResponse = {
	/** 主键id */
	id: string

	/** scope名称 */
	name: string

	/** scope 名称 */
	scope: string

	/** scope 描述 */
	description: string

	/** 是否启用 */
	enabled: boolean

	/** 创建时间 */
	createTime: string
}

export interface FindScopePageRequest extends PageableRequest {
	/**
	 * scope名称/描述
	 */
	name?: string

	/**
	 * scope编码
	 */
	scope?: string

	/**
	 * 是否启用
	 */
	enabled?: boolean
}

/**
 * 插入或修改scope入参
 */
export interface SaveScopeRequest {
	/**
	 * 主键id
	 */
	id?: string

	/**
	 * scope 名称
	 */
	name?: string

	/**
	 * scope 编码
	 */
	scope?: string

	/**
	 * scope 描述
	 */
	description?: string

	/**
	 * 是否启用 - 仅修改时使用
	 */
	enabled?: boolean
}

/**
 * 重置scope权限入参
 */
export interface ResetScopePermissionRequest {
	/**
	 * scope名称
	 */
	scope: string

	/**
	 * 权限id(为空代表移除scope的所有权限)
	 */
	permissionsId?: string[]
}
