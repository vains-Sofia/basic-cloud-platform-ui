import { http } from '@/utils/request.ts'
import type { OAuth2ConsentResponse, OAuth2TokenResult } from '@/api/types/OAuth2Types.ts'
import { base64Str } from '@/utils/auth.ts'

/**
 * 表单登录
 * @param data 请求体
 * @param oauth2Login 是否OAuth2登录
 * @param loginType 登录方式
 */
export const formLogin = (data: any, oauth2Login: boolean, loginType: string) => {
	// 请求头
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'X-Admin-Platform-Login': 'Admin-Platform-Login',
	}
	if (oauth2Login) {
		headers['X-Admin-Platform-Login'] = ''
	}

	// 请求路径
	let url = '/auth/login'
	if (loginType !== 'account') {
		url = `${url}/${loginType}`
	}

	return http.post(url, data, { headers, withCredentials: true, rawResponse: !oauth2Login })
}

/**
 * 根据授权确认相关参数获取授权确认与未确认的scope相关参数
 * @param params 获取授权确认与未确认的scope相关参数
 * @returns 返回AccessToken对象
 */
export function getConsentParameters(params: any) {
	return http.get<OAuth2ConsentResponse>('/auth/oauth2/consent/parameters', params, {
		withCredentials: true,
	})
}

/**
 * 授权确认
 * @param contextPath 认证服务context path
 * @param requestUri 授权确认地址
 * @param data 授权确认数据
 */
export function authorize(contextPath: string, requestUri: string, data: any) {
	const headers: any = {
		'Content-Type': 'multipart/form-data;',
	}
	return http.post<any>(`${contextPath}${requestUri}`, data, { withCredentials: true, headers })
}

/**
 * 检查是否登录过
 */
export function checkLogin() {
	return http.get<any>(`/auth/check/login`, {}, { withCredentials: true })
}

/**
 * 从认证服务获取AccessToken
 * @param data 获取token入参
 * @returns 返回AccessToken对象
 */
export function getToken(data: any) {
	const headers: any = {
		'Content-Type': 'multipart/form-data;',
	}
	if (data.client_secret) {
		// 设置客户端的basic认证
		headers.Authorization = `Basic ${base64Str(`${data.client_id}:${data.client_secret}`)}`
		// 移除入参中的key
		delete data.client_id
		delete data.client_secret
	}
	// 可以设置为AccessToken的类型
	return http.post<OAuth2TokenResult>('/auth/oauth2/token', data, { headers, rawResponse: true })
}

/**
 * 设备码验证user code
 * @param userCode 设备码模式授权申请获取到的user_code
 */
export function deviceVerification(userCode: string) {
	const headers: any = {
		'Content-Type': 'multipart/form-data;',
	}
	return http.post<string>(
		`/auth/oauth2/device_verification`,
		{
			user_code: userCode,
		},
		{ withCredentials: true, headers },
	)
}
