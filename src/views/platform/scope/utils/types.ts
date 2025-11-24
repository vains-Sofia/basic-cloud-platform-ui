// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

import type { SaveScopeRequest } from '@/api/types/ScopeTypes.ts'
import type { FindPermissionResponse } from '@/api/types/PermissionTypes.ts'

interface FormProps {
	formInline: SaveScopeRequest
}

interface ScopeMenuItemProps {
	scope: string
	allMenus: Array<FindPermissionResponse>
}

interface ScopeMenuProps {
	formInline: ScopeMenuItemProps
}

export type { FormProps, ScopeMenuProps, ScopeMenuItemProps }
