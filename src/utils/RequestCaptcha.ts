// 请求验证码
import { getEmailCaptcha } from '@/api/system/Common.ts'

export const requestEmailCaptcha = async (registerFormRef: InstanceType<any>, email: string) => {
	return new Promise<void>((resolve, reject) => {
		registerFormRef?.validateField('email', async (isValid: unknown, error: any) => {
			if (isValid) {
				await getEmailCaptcha(email)
				resolve()
			} else {
				reject(error['email'][0].message)
			}
		})
	})
}
