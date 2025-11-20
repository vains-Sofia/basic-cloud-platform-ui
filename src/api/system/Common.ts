import { http } from '@/utils/request.ts'
import type { FilePreSignedRequest, FilePreSignedResponse } from '@/api/types/CommonTypes.ts'

/** 文件上传预签名 */
export const uploadPreSigned = (data?: FilePreSignedRequest) => {
	return http.put<FilePreSignedResponse>(
		`/system/common/pre/signed`,
		data
	);
};

/** 使用预签名地址上传 */
export const uploadByPreSignedUrl = (
	preSignedUrl: string,
	data: object,
	fileType: string
) => {
	return http.put<any>(
		preSignedUrl,
		data,
		{
			headers: {
				"Content-Type": fileType
			},
			rawResponse: true
		}
	);
};
