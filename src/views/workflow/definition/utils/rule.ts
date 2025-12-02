import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { isValidBpmnProcessKey } from '@/utils/Common.ts'

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
	category: [{ required: true, message: '请输入分类', trigger: 'blur' }],
	processKey: [
		{
			validator: (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入/生成流程定义key'))
				} else if (isValidBpmnProcessKey(value)) {
					callback()
				} else {
					callback(
						new Error(
							'Process Key只能以字母或下划线开头，只能包含字母、数字、点( . )、下划线( _ )、连字符( - )',
						),
					)
				}
			},
			trigger: 'change',
		},
	],
	processName: [{ required: true, message: '请输入流程定义名称', trigger: 'blur' }],
})
