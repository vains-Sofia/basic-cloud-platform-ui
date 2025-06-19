import { http } from "@/utils/http";
import { base64Str } from "@/utils/auth";
import type { Result } from "@/api/types";

export type UserResult = {
  code: number;
  success: boolean;
  message: string;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export enum GenderEnum {
  UNKNOWN = "0",
  MALE = "1",
  FEMALE = "2",
  UNDISCLOSED = "9"
}

export interface BasicGrantedAuthority {
  /**
   * 主键id
   */
  id?: number;

  /**
   * 权限码
   */
  authority: string;

  /**
   * 路径
   */
  path?: string;

  /**
   * 权限码
   */
  permission?: string;

  /**
   * 请求方式
   */
  requestMethod?: string;

  /**
   * 是否需要鉴权
   */
  needAuthentication?: boolean;
}

export type UserInfo = {
  /**
   * 用户账号，发行方的最终用户标识符。
   */
  sub: string;

  /**
   * 昵称
   */
  nickname: string;

  /**
   * 用户个人资料页面的 URL。
   */
  profile: string;

  /**
   * 用户个人资料图片的 URL。
   */
  picture: string;

  /**
   * 用户的首选电子邮件地址。
   */
  email: string;

  /**
   * 邮箱是否已验证
   */
  emailVerified: boolean;

  /**
   * 用户的性别
   */
  gender: GenderEnum;

  /**
   * 出生日期，ISO 8601 格式：YYYY-MM-DD
   */
  birthdate: string;

  /**
   * 手机号
   */
  phoneNumber: string;

  /**
   * 手机号是否已验证
   */
  phoneNumberVerified: boolean;

  /**
   * 用户的首选邮政地址。
   */
  address: string;

  /**
   * 用户信息最后更新时间。以时间戳表示。
   */
  updatedAt: number;

  // -----------扩展信息-----------

  /**
   * 自增id
   */
  id: number;

  /**
   * 账号
   */
  account: string;

  /**
   * 账号来源类型
   */
  accountPlatform: string;

  /**
   * 检查过，即是否已确认绑定
   */
  bindBasicUserChecked: boolean;

  /**
   * 用户角色
   */
  roles: Array<string>;

  /**
   * 用户角色
   */
  authorities: Array<BasicGrantedAuthority>;
};

export type TokenResult = {
  /** `token` */
  access_token: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refresh_token: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires_in: number;
  /** oidc id token */
  id_token?: string;
  /** 客户端权限 */
  scope: string;
  /** token类型 */
  token_type: string;
};

export type UserInfoResult = {
  code: number;
  success: boolean;
  data: UserInfo;
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  const headers: any = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  return http.request<UserResult>(
    "post",
    "/auth/login",
    { data },
    { withCredentials: true, headers }
  );
};

/** 登录 */
export const getLoginByEmail = (data?: object) => {
  const headers: any = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  return http.request<UserResult>(
    "post",
    "/auth/login/email",
    { data },
    { withCredentials: true, headers }
  );
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

/**
 * 从认证服务获取AccessToken
 * @param data 获取token入参
 * @returns 返回AccessToken对象
 */
export function getToken(data: any) {
  const headers: any = {
    "Content-Type": "multipart/form-data;"
  };
  if (data.client_secret) {
    // 设置客户端的basic认证
    headers.Authorization = `Basic ${base64Str(`${data.client_id}:${data.client_secret}`)}`;
    // 移除入参中的key
    delete data.client_id;
    delete data.client_secret;
  }
  // 可以设置为AccessToken的类型
  return http.post<TokenResult, any>(
    "/auth/oauth2/token",
    { data },
    { headers }
  );
}

/**
 * 根据授权确认相关参数获取授权确认与未确认的scope相关参数
 * @param params 获取授权确认与未确认的scope相关参数
 * @returns 返回AccessToken对象
 */
export function getConsentParameters(params: any) {
  return http.get<Result<any>, any>(
    "/auth/oauth2/consent/parameters",
    {
      params
    },
    { withCredentials: true }
  );
}

/**
 * 授权确认
 * @param contextPath 认证服务context path
 * @param requestUri 授权确认地址
 * @param data 授权确认数据
 */
export function authorize(contextPath: string, requestUri: string, data: any) {
  const headers: any = {
    "Content-Type": "multipart/form-data;"
  };
  return http.post<Result<any>, any>(
    `${contextPath}${requestUri}`,
    {
      data
    },
    { withCredentials: true, headers }
  );
}

/**
 * 设备码验证user code
 * @param userCode 设备码模式授权申请获取到的user_code
 */
export function deviceVerification(userCode: string) {
  const headers: any = {
    "Content-Type": "multipart/form-data;"
  };
  return http.post<Result<any>, any>(
    `/auth/oauth2/device_verification`,
    {
      data: {
        user_code: userCode
      }
    },
    { withCredentials: true, headers }
  );
}

/**
 * 检查是否登录过
 */
export function checkLogin() {
  return http.get<Result<any>, any>(
    `/auth/check/login`,
    {},
    { withCredentials: true }
  );
}

/** 个人信息 */
export const loginUserinfo = () => {
  return http.request<UserInfoResult>("get", "/system/user/loginUserinfo");
};

/** 获取登录验证码 */
export const getEmailCaptcha = (email: string) => {
  return http.request<UserInfoResult>("get", "/auth/getEmailCaptcha", {
    params: { email }
  });
};

/** 用户注册 */
export const userRegister = (data: any) => {
  return http.request<Result<string>>("post", "/system/user/userRegister", {
    data
  });
};
