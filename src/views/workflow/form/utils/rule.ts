import { reactive } from 'vue'
import type { FormRules } from 'element-plus'

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
	title: [{ required: true, message: '表单名称不能为空', trigger: 'blur' }],
})
