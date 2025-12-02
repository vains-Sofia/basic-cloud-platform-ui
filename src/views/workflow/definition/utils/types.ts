// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

import type { SaveProcessDefinitionRequest } from '@/api/types/ProcessDefinitionTypes.ts'

interface FormItemProps extends SaveProcessDefinitionRequest {
	[key: string]: any
}

interface FormProps {
	formInline: FormItemProps
}

export type { FormProps }
