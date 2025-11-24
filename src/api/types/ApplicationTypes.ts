import type { PageableRequest } from '@/api/types/ModelTypes.ts'

export type OAuth2Metadata = {
	issuer: string;
	authorization_endpoint: string;
	device_authorization_endpoint: string;
	token_endpoint: string;
	token_endpoint_auth_methods_supported: Array<
		| "client_secret_basic"
		| "client_secret_post"
		| "client_secret_jwt"
		| "private_key_jwt"
		| "tls_client_auth"
		| "self_signed_tls_client_auth"
	>;
	jwks_uri: string;
	userinfo_endpoint: string;
	end_session_endpoint: string;
	response_types_supported: ["code"];
	grant_types_supported: Array<
		| "authorization_code"
		| "client_credentials"
		| "refresh_token"
		| "urn:ietf:params:oauth:grant-type:device_code"
		| "urn:ietf:params:oauth:grant-type:token-exchange"
		| "password"
	>;
	revocation_endpoint: string;
	revocation_endpoint_auth_methods_supported: Array<
		| "client_secret_basic"
		| "client_secret_post"
		| "client_secret_jwt"
		| "private_key_jwt"
		| "tls_client_auth"
		| "self_signed_tls_client_auth"
	>;
	introspection_endpoint: string;
	introspection_endpoint_auth_methods_supported: Array<
		| "client_secret_basic"
		| "client_secret_post"
		| "client_secret_jwt"
		| "private_key_jwt"
		| "tls_client_auth"
		| "self_signed_tls_client_auth"
	>;
	code_challenge_methods_supported: ["S256"];
	tls_client_certificate_bound_access_tokens: boolean;
	subject_types_supported: ["public"];
	id_token_signing_alg_values_supported: ["RS256"];
	scopes_supported: ["openid"];
};

export interface FindApplicationPageRequest extends PageableRequest {
	/** 客户端id */
	clientId?: string;

	/** 客户端名称 */
	applicationName?: string;

	/** 客户端认证方式 */
	clientAuthenticationMethod?: string;

	/** 客户端支持的 grant type */
	authorizationGrantType?: string;
}

export interface ApplicationCardResponse {
	/** 客户端数据id */
	id?: string;

	/** 客户端id */
	clientId?: string;

	/** 客户端名称 */
	clientName?: string;

	/** 客户端Logo */
	clientLogo?: string;

	/** 创建时间 */
	createTime?: string; // LocalDateTime 通常转 string（ISO 格式）

	/** 客户端描述 */
	description?: string;
}

export interface BasicApplicationResponse {
	/**
	 * 客户端数据id
	 */
	id?: string;

	/**
	 * 客户端id
	 */
	clientId?: string;

	/**
	 * 客户端id签发时间
	 */
	clientIdIssuedAt?: string;

	/**
	 * 客户端密钥过期时间
	 */
	clientSecretExpiresAt?: string;

	/**
	 * 客户端名称
	 */
	clientName?: string;

	/**
	 * 客户端Logo
	 */
	clientLogo?: string;

	/**
	 * 客户端描述
	 */
	description?: string;

	/**
	 * 客户端认证方式
	 */
	clientAuthenticationMethods?: string[];

	/**
	 * 客户端支持的grant type
	 */
	authorizationGrantTypes?: string[];

	/**
	 * 客户端回调地址
	 */
	redirectUris?: string[];

	/**
	 * Openid Connect登出后跳转地址
	 */
	postLogoutRedirectUris?: string[];

	/**
	 * 客户端拥有的权限
	 */
	scopes?: string[];

	/**
	 * 客户端设置
	 */
	clientSettings?: BasicClientSettings;

	/**
	 * 客户端申请的access token设置
	 */
	tokenSettings?: BasicTokenSettings;

	/**
	 * 创建人
	 */
	createBy?: number;

	/**
	 * 修改人
	 */
	updateBy?: number;

	/**
	 * 创建人名称
	 */
	createName?: string;

	/**
	 * 修改人名称
	 */
	updateName?: string;

	/**
	 * 创建时间
	 */
	createTime?: string;

	/**
	 * 修改时间
	 */
	updateTime?: string;
}

export interface BasicClientSettings {
	/**
	 * 授权码流程时是否需要提供challenge and verifier (PKCE模式)
	 */
	requireProofKey?: boolean;

	/**
	 * 客户端是否需要授权确认
	 */
	requireAuthorizationConsent?: boolean;

	/**
	 * 客户端jwks的url地址
	 */
	jwkSetUrl?: string;

	/**
	 * JWS算法，该算法必须用于签名用于在令牌端点为private_key_jwt和client_secret_jwt身份验证方法对客户端进行身份验证的JWT。
	 * private_key_jwt：SignatureAlgorithm
	 * client_secret_jwt：MacAlgorithm
	 */
	tokenEndpointAuthenticationSigningAlgorithm?: string;

	/**
	 * 使用tls_client_auth方法进行客户端身份验证时收到的证书，返回与客户端关联的预期主题专有名称。
	 */
	x509CertificateSubjectDN?: string;
}

export interface BasicTokenSettings {
	/**
	 * 授权码有效时长
	 */
	authorizationCodeTimeToLive?: number;

	/**
	 * 授权码有效时长的单位
	 */
	authorizationCodeTimeToLiveUnit?: string;

	/**
	 * access token有效时长
	 */
	accessTokenTimeToLive?: number;

	/**
	 * access token有效时长的单位
	 */
	accessTokenTimeToLiveUnit?: string;

	/**
	 * 设置access token的格式，
	 * Jwt token ：OAuth2TokenFormat#SELF_CONTAINED
	 * Opaque token ：OAuth2TokenFormat#REFERENCE
	 */
	accessTokenFormat?: string;

	/**
	 * 设备码有效时长
	 */
	deviceCodeTimeToLive?: number;

	/**
	 * 设备码有效时长的单位
	 */
	deviceCodeTimeToLiveUnit?: string;

	/**
	 * 设置refresh token是否可重复使用
	 */
	reuseRefreshTokens?: boolean;

	/**
	 * refresh token有效时长
	 */
	refreshTokenTimeToLive?: number;

	/**
	 * refresh token有效时长的单位
	 */
	refreshTokenTimeToLiveUnit?: string;

	/**
	 * 对ID Token进行签名的JWS算法。
	 */
	idTokenSignatureAlgorithm?: string;

	/**
	 * 如果在使用 tls_client_auth 或 self_signed_tls_client_auth 时access token必须绑定到客户端身份验证期间收到的客户端 X509Certificate，则设置为 true。
	 */
	x509CertificateBoundAccessTokens?: boolean;
}

export interface SaveApplicationRequest {
	/**
	 * 客户端数据id
	 */
	id?: string;

	/**
	 * 客户端id
	 */
	clientId: string;

	/**
	 * 客户端密钥
	 */
	clientSecret?: string;

	/**
	 * 客户端密钥过期时间
	 */
	clientSecretExpiresAt?: string;

	/**
	 * 客户端名称
	 */
	clientName: string;

	/**
	 * 客户端Logo
	 */
	clientLogo?: string;

	/**
	 * 客户端描述
	 */
	description?: string;

	/**
	 * 客户端认证方式
	 */
	clientAuthenticationMethods: string[];

	/**
	 * 客户端支持的grant type
	 */
	authorizationGrantTypes: string[];

	/**
	 * 客户端回调地址
	 */
	redirectUris: string[];

	/**
	 * Openid Connect登出后跳转地址
	 */
	postLogoutRedirectUris: string[];

	/**
	 * 客户端拥有的权限
	 */
	scopes?: string[];

	/**
	 * 客户端设置
	 */
	clientSettings: BasicClientSettings;

	/**
	 * 客户端申请的access token设置
	 */
	tokenSettings: BasicTokenSettings;
}
