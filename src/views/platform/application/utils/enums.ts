import { ref } from "vue";

// 时间单位选项
const unitSelects = [
  {
    label: "秒",
    value: "Seconds"
  },
  {
    label: "时",
    value: "Hours"
  },
  {
    label: "天",
    value: "Days"
  }
];

// Jws 加密选项，根据客户端包含的类型自动切换(或者合并提供选择)
const jwsMacAlgorithmSelect = ["HS256", "HS384", "HS512"];
const jwsSignatureAlgorithmSelect = [
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512"
];

// access token 格式
const accessTokenFormats = [
  {
    label: "Jwt",
    value: "self-contained",
    tip: "Jwt自包含token"
  },
  {
    label: "Opaque",
    value: "reference",
    tip: "Opaque不透明token"
  }
];

// 是否绑定x509证书
const x509CertificateBoundAccessTokensSelect = [
  {
    label: "绑定",
    value: true,
    tip: "如果在使用 tls_client_auth 或 self_signed_tls_client_auth 时access token必须绑定到客户端身份验证期间收到的客户端的X509Certificate，则选择此项"
  },
  {
    label: "不绑定",
    value: false,
    tip: "不绑定"
  }
];

// 重复使用refresh token
const reuseRefreshTokensSelect = [
  {
    label: "重复",
    value: true,
    tip: "刷新token以后refresh token不变"
  },
  {
    label: "不重复",
    value: false,
    tip: "刷新token以后获取一个新的refresh token"
  }
];

// 是否为PKCE模式
const requireProofKeySelect = [
  {
    label: "是",
    value: true,
    tip: "授权码的扩展—PKCE模式，如果客户端是HTML、APP或其它可被反编译的应用则推荐使用该模式"
  },
  {
    label: "否",
    value: false,
    tip: "普通授权码模式"
  }
];

// 是否显示授权确认页面
const requireAuthorizationConsentSelect = [
  {
    label: "显示",
    value: true,
    tip: "选择该项时在授权申请后会重定向至授权确认页面"
  },
  {
    label: "不显示",
    value: false,
    tip: "授权申请后会直接携带授权码跳转至授权回调地址"
  }
];

const form = ref({
  id: "",
  clientId: "",
  clientName: "",
  clientLogo: "",
  description: "",
  clientSecret: "",
  clientSecretExpiresAt: "",
  clientAuthenticationMethods: [],
  authorizationGrantTypes: [],
  redirectUris: [""],
  postLogoutRedirectUris: [""],
  scopes: [],
  clientSettings: {
    requireProofKey: false,
    requireAuthorizationConsent: false,
    jwkSetUrl: "",
    tokenEndpointAuthenticationSigningAlgorithm: "",
    x509CertificateSubjectDN: ""
  },
  tokenSettings: {
    authorizationCodeTimeToLive: 300,
    authorizationCodeTimeToLiveUnit: "Seconds",
    accessTokenTimeToLive: 2,
    accessTokenTimeToLiveUnit: "Hours",
    accessTokenFormat: "self-contained",
    deviceCodeTimeToLive: 300,
    deviceCodeTimeToLiveUnit: "Seconds",
    reuseRefreshTokens: true,
    refreshTokenTimeToLive: 30,
    refreshTokenTimeToLiveUnit: "Days",
    idTokenSignatureAlgorithm: "RS256",
    x509CertificateBoundAccessTokens: false
  }
});

export {
  form,
  unitSelects,
  accessTokenFormats,
  requireProofKeySelect,
  jwsMacAlgorithmSelect,
  reuseRefreshTokensSelect,
  jwsSignatureAlgorithmSelect,
  requireAuthorizationConsentSelect,
  x509CertificateBoundAccessTokensSelect
};
