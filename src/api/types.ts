export type ResultArray = {
  success: boolean;
  message: string;
  code: number;
  data?: Array<any>;
};

export type Result<T> = {
  success: boolean;
  message: string;
  code: number;
  data?: T;
};

export type ResultTable = {
  success: boolean;
  code: number;
  data?: {
    /** 列表数据 */
    records: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    size?: number;
    /** 当前页数 */
    current?: number;
  };
};

export type ResultPage<T> = {
  success: boolean;
  code: number;
  data?: {
    /** 列表数据 */
    records: Array<T>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    size?: number;
    /** 当前页数 */
    current?: number;
  };
};

export type FindScopeResponse = {
  /** 主键id */
  id: number;

  /** scope 名称 */
  scope: string;

  /** scope 描述 */
  description: string;

  /** 是否启用 */
  enabled: boolean;
};

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

export interface FindAuthorizationResponse {
  id: string;
  registeredClientId: string;
  registeredClientName: string;
  registeredClientLogo: string;
  principalName: string;
  authorizationGrantType: string;
  authorizedScopes: string[];
  authorizationCodeValue: string;
  authorizationCodeIssuedAt: string;
  authorizationCodeExpiresAt: string;
  authorizationCodeInvalidated: boolean;
  accessTokenValue: string;
  accessTokenIssuedAt: string;
  accessTokenExpiresAt: string;
  accessTokenInvalidated: boolean;
  accessTokenType: string;
  accessTokenScopes: string;
  refreshTokenValue: string;
  refreshTokenIssuedAt: string;
  refreshTokenExpiresAt: string;
  refreshTokenInvalidated: boolean;
  oidcIdTokenValue: string;
  oidcIdTokenIssuedAt: string;
  oidcIdTokenExpiresAt: string;
  oidcIdTokenInvalidated: boolean;
  userCodeValue: string;
  userCodeIssuedAt: string;
  userCodeExpiresAt: string;
  userCodeInvalidated: boolean;
  deviceCodeValue: string;
  deviceCodeIssuedAt: string;
  deviceCodeExpiresAt: string;
  deviceCodeInvalidated: boolean;
  createTime: string;
  updateTime: string;
}

export interface FindAuthorizationPageParams {
  current: number;
  size: number;
  registeredClientName?: string;
  principalName?: string;
  authorizationGrantType?: string;
}
