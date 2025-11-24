import { http } from '@/utils/request.ts'
import type { Pageable } from '@/api/types/ModelTypes.ts'
import type {
	ApplicationCardResponse,
	BasicApplicationResponse,
	FindApplicationPageRequest,
	OAuth2Metadata,
	SaveApplicationRequest
} from '@/api/types/ApplicationTypes.ts'

/** 平台管理-应用列表 */
export const cardListPage = (data?: FindApplicationPageRequest) => {
	return http.request<Pageable<ApplicationCardResponse>>(
		'get',
		'/auth/application/cardListPage',
		data,
	)
}
/** 平台管理-应用详情 */
export const findById = (id?: string) => {
	return http.request<BasicApplicationResponse>('get', `/auth/application/findById/${id}`)
}

/** 平台管理-添加应用 */
export const save = (data: SaveApplicationRequest) => {
	return http.post<string>(`/auth/application/save`, data)
}

/** 平台管理-更新应用 */
export const update = (data: SaveApplicationRequest) => {
	return http.put<string>(`/auth/application/update`, data)
}

/** 平台管理-认证中心OIDC配置 */
export const openidConfiguration = () => {
	return http.request<OAuth2Metadata>(
		'get',
		`/auth/.well-known/openid-configuration`,
		undefined,
		{ rawResponse: true },
	)
}
