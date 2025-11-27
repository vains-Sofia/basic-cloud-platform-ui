import { http } from '@/utils/request.ts'
import type { QrCodeInitResult } from '@/api/types/QrCodeTypes.ts'

/**
 * 获取生成二维码的数据
 */
export const getQrCodeData = () => {
	return http.request<QrCodeInitResult>("get", "/auth/qr-code/init");
};
