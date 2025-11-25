import { http } from '@/utils/request.ts'
import type { Result } from '@/api/types/ModelTypes.ts'

/** 检查绑定 */
export const checkBinding = () => {
	return http.request<Result<string>>('get', `/system/third/user/check-binding`, undefined, {
		rawResponse: true,
	})
}

/** 获取邮件验证码 */
export const bindEmailCode = (email: string) => {
	return http.request<string>('get', `/system/third/user/bind-email-code/${email}`)
}

/** 获取邮件验证码 */
export const bindEmail = (data: any) => {
	return http.post<Result<string>>(`/system/third/user/bind-email`, data, { rawResponse: true })
}

/** 重发确认绑定邮件 */
export const resendConfirmEmail = () => {
	return http.request<string>('post', `/system/third/user/resend-bind-confirmation`)
}
