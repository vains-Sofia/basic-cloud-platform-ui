/**
 * 性别枚举
 */
export enum GenderEnum {
	UNKNOWN = '0',
	MALE = '1',
	FEMALE = '2',
	UNDISCLOSED = '9',
}

/**
 * 菜单类型枚举
 */
export enum PermissionTypeEnum {
	MENU = 0,
	BUTTON = 1,
	EXTERNAL_LINK = 2,
	REST = 3,
}

/**
 * 状态枚举，等价于 Java 枚举 StatusEnum
 */
export enum StatusEnum {
	ENABLE = 'Y',
	DISABLE = 'N',
}

// DefinitionStatusEnum.ts
export enum DefinitionStatusEnum {
	/**
	 * 0-草稿
	 */
	DRAFT = 0,

	/**
	 * 1-发布
	 */
	PUBLISH = 1,

	/**
	 * 2-禁用
	 */
	DISABLED = 2,
}

export const DefinitionStatusEnumLabels: Record<DefinitionStatusEnum, string> = {
	[DefinitionStatusEnum.DRAFT]: '草稿',
	[DefinitionStatusEnum.PUBLISH]: '发布',
	[DefinitionStatusEnum.DISABLED]: '禁用',
}
