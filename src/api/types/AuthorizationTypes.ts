export interface FindAuthorizationPageParams {
	current: number
	size: number
	registeredClientName?: string
	principalName?: string
	authorizationGrantType?: string
}

export interface FindAuthorizationResponse {
	id: string
	registeredClientId: string
	registeredClientName: string
	registeredClientLogo: string
	principalName: string
	authorizationGrantType: string
	authorizedScopes: string[]
	authorizationCodeValue: string
	authorizationCodeIssuedAt: string
	authorizationCodeExpiresAt: string
	authorizationCodeInvalidated: boolean
	accessTokenValue: string
	accessTokenIssuedAt: string
	accessTokenExpiresAt: string
	accessTokenInvalidated: boolean
	accessTokenType: string
	accessTokenScopes: string
	refreshTokenValue: string
	refreshTokenIssuedAt: string
	refreshTokenExpiresAt: string
	refreshTokenInvalidated: boolean
	oidcIdTokenValue: string
	oidcIdTokenIssuedAt: string
	oidcIdTokenExpiresAt: string
	oidcIdTokenInvalidated: boolean
	userCodeValue: string
	userCodeIssuedAt: string
	userCodeExpiresAt: string
	userCodeInvalidated: boolean
	deviceCodeValue: string
	deviceCodeIssuedAt: string
	deviceCodeExpiresAt: string
	deviceCodeInvalidated: boolean
	createTime: string
	updateTime: string
	offlineLoading?: boolean
}
