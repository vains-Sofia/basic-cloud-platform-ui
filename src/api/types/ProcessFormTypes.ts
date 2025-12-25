import type { PageableRequest } from '@/api/types/ModelTypes.ts'

export interface SaveProcessFormRequest {
	/**
	 * 表单标题
	 */
	title: string

	/**
	 * 表单描述
	 */
	description?: string

	/**
	 * 表单设计器生成、使用的完整JSON配置
	 */
	formContent: string
}

export interface PageProcessFormResponse {
	/**
	 * 表单id，主键
	 */
	id: string

	/**
	 * 表单标题
	 */
	title: string

	/**
	 * 表单描述
	 */
	description?: string

	/**
	 * 创建人名称
	 */
	createName?: string

	/**
	 * 修改人名称
	 */
	updateName?: string

	/**
	 * 创建时间
	 */
	createTime?: string

	/**
	 * 修改时间
	 */
	updateTime?: string
}

export interface ProcessFormResponse extends PageProcessFormResponse {

	/**
	 * 表单设计器生成、使用的完整JSON配置
	 */
	formContent: string
}

export interface FindProcessFormPageRequest extends PageableRequest {
	/**
	 * 表单标题
	 */
	title?: string

	/**
	 * 表单描述
	 */
	description?: string
}
