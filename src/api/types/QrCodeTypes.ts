export interface QrCodeInitResult {
	/**
	 * 二维码唯一标识
	 */
	token: string;

	/**
	 * 二维码有效时长(单位：秒)
	 */
	expireIn: number;
}
