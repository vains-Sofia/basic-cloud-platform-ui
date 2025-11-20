export interface FindSysDictItemResponse {
	/** 字典项的唯一标识符 */
	id: string;

	/** 字典项所属的字典类型代码 */
	typeCode: string;

	/** 字典项的键，用于标识该字典项 */
	itemCode: string;

	/** 字典项的值，用于描述该字典项 */
	itemName: string;

	/** 字典项的排序值，用于控制显示顺序 */
	sortOrder: number;

	/** 字典项的状态（Y=启用，N=禁用） */
	status: "Y" | "N";

	/** 字典项的多语言支持 JSON 字符串 */
	i18nJson: string;

	/** 创建该字典项的用户ID */
	createBy: string;

	/** 创建该字典项的用户姓名 */
	createName: string;

	/** 字典项的创建时间 */
	createTime: string;

	/** 最后修改该字典项的用户ID */
	updateBy: string;

	/** 最后修改该字典项的用户姓名 */
	updateName: string;

	/** 字典项的最后修改时间 */
	updateTime: string;
}
