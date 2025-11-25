export type OAuth2TokenResult = {
	/** `token` */
	access_token: string
	/** 用于调用刷新`accessToken`的接口时所需的`token` */
	refresh_token?: string
	/** `accessToken`的过期时间 */
	expires_in: number
	/** oidc id token */
	id_token?: string
	/** 客户端权限 */
	scope?: string
	/** token类型 */
	token_type: string
}

// ScopeWithDescription 接口定义
export interface ScopeWithDescription {
	id: string
	name: string
	scope: string
	description: string
}

// OAuth2ConsentResponse 接口定义
export interface OAuth2ConsentResponse {
	/**
	 * @title 客户端ID
	 * @description 需要授权的客户端ID
	 */
	clientId: string

	/**
	 * @title 客户端logo
	 * @description 需要授权的客户端logo
	 */
	clientLogo: string

	/**
	 * @title 客户端名称
	 * @description 需要授权的客户端名称
	 */
	clientName: string

	/**
	 * @title 客户端要授权的scope
	 * @description 客户端要授权的scope
	 */
	scopes: Array<ScopeWithDescription>

	/**
	 * @title 已授权的scope
	 * @description 之前已经授权的scope
	 */
	previouslyApprovedScopes: Array<ScopeWithDescription>

	/**
	 * @title 用户名称
	 * @description 需要授权的用户名称
	 */
	principalName: string

	/**
	 * @title 设备码模式-用户码
	 * @description 设备码模式-用户码
	 */
	userCode: string

	/**
	 * @title oauth2授权申请时传入的state
	 * @description 会原样返回state
	 */
	state: string

	/**
	 * @title 项目的context path
	 * @description 项目的context path
	 */
	contextPath: string

	/**
	 * @title 授权后跳转URI
	 * @description 授权后跳转URI
	 */
	requestURI: string
}
