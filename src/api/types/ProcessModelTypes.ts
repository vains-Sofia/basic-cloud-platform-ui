import type { DefinitionStatusEnum } from '@/api/types/Enums.ts'
import type { PageableRequest } from '@/api/types/ModelTypes.ts'

export interface PublishProcessResponse {
	/**
	 * 流程定义key
	 */
	processKey: string

	/**
	 * 模型版本
	 */
	version?: number
}

export interface PageProcessModelResponse {
	/**
	 * 主键id
	 */
	id: string

	/**
	 * 流程定义key
	 */
	processKey: string

	/**
	 * 流程定义名称
	 */
	processName: string

	/**
	 * 分类（请假、采购等）
	 */
	category?: string

	/**
	 * 模型版本
	 */
	version: number

	/**
	 * 状态：0=草稿，1=已发布，2=已禁用
	 */
	status: DefinitionStatusEnum

	/**
	 * 说明
	 */
	remark?: string

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
	createTime?: Date

	/**
	 * 修改时间
	 */
	updateTime?: Date
}

export interface ProcessModelResponse extends PageProcessModelResponse {
	/**
	 * BPMN XML 内容
	 */
	processXml: string

	/**
	 * 如果前端使用 bpmn-js JSON，可额外存储
	 */
	processJson?: string
}

export interface FindModelPageRequest extends PageableRequest {
	/**
	 * 模糊查询流程名称
	 */
	name?: string

	/**
	 * 分类
	 */
	category?: string

	/**
	 * 状态
	 */
	status?: DefinitionStatusEnum
}

// PublishProcessRequest.ts
export interface PublishProcessRequest {
	/**
	 * 发布说明
	 */
	remark?: string
}

export interface FindModelHistoryPageRequest extends PageableRequest {
	/**
	 * 流程定义key
	 */
	processKey: string
}

export interface SaveProcessModelRequest {
	/**
	 * 流程定义key
	 */
	processKey: string

	/**
	 * 流程定义名称
	 */
	processName: string

	/**
	 * BPMN XML 内容
	 */
	processXml: string

	/**
	 * 如果前端使用 bpmn-js JSON，可额外存储
	 */
	processJson?: string

	/**
	 * 分类（请假、采购等）
	 */
	category?: string

	/**
	 * 说明
	 */
	remark?: string
}
