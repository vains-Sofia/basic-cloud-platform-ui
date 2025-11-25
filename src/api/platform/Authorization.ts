import { http } from '@/utils/request'
import type {
	FindAuthorizationPageParams,
	FindAuthorizationResponse,
} from '@/api/types/AuthorizationTypes'
import type { Pageable } from '@/api/types/ModelTypes'

// 分页查询认证信息
export const findByPage = (params: FindAuthorizationPageParams) => {
	return http.request<Pageable<FindAuthorizationResponse>>(
		'get',
		'/auth/authorization/findByPage',
		params,
	)
}

// 下线
export const offline = (accessToken: string) => {
	return http.delete<void>(
		'/auth/authorization/offline',
		{ accessToken },
		{ withCredentials: true },
	)
}

// 登出
export const authorizationLogout = () => {
	return http.delete<void>(
		'/auth/authorization/logout',
		undefined,
		{ withCredentials: true },
	)
}
