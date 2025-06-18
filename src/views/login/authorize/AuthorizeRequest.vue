<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import {
  getQueryString,
  generateCodeVerifier,
  generateCodeChallenge,
  setToken
} from "@/utils/auth";
import { getTopMenu, initRouter } from "@/router/utils";
import { getToken, loginUserinfo, UserInfoResult } from "@/api/user";
import { checkBinding } from "@/api/ThirdUserBingding";

const router = useRouter();

const { t } = useI18n();

// 生成CodeVerifier
let codeVerifier: string = generateCodeVerifier();
// codeChallenge
let codeChallenge: string = generateCodeChallenge(codeVerifier);
// 生成state
let state: string = generateCodeVerifier();

// 获取地址栏授权码
const code = getQueryString("code");

if (code) {
  // 从缓存中获取 codeVerifier
  const state = localStorage.getItem("state");
  // 校验state，防止cors
  const urlState = getQueryString("state");
  if (urlState !== state) {
    message("state校验失败", { type: "warning" });
  } else {
    // 从缓存中获取 codeVerifier
    const code_verifier = localStorage.getItem("codeVerifier");
    getToken({
      grant_type: "authorization_code",
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
      code,
      code_verifier,
      state
    })
      .then((res: any) => {
        setToken(res);
        loginUserinfo()
          .then(async (user: UserInfoResult) => {
            res.userinfo = user.data;
            setToken(res);
            if (user.data.accountPlatform !== "system") {
              const nonOperationStatus = ["bound", "new_created"];
              // 三方登录用户，检查是否绑定账户
              checkBinding().then(async response => {
                if (response.code === 200) {
                  if (nonOperationStatus.indexOf(response.data) === -1) {
                    // 跳转到用户绑定确认页面
                    await router.push({
                      path: "/UserBinding",
                      query: {
                        status: response.data
                      }
                    });
                  } else {
                    await initRouter();
                    router.push(getTopMenu(true).path).then(() => {
                      message(t("login.pureLoginSuccess"), {
                        type: "success"
                      });
                    });
                  }
                } else {
                  message(res.message || `检查绑定状态失败!`, {
                    type: "warning"
                  });
                }
              });
            } else {
              await initRouter();
              router.push(getTopMenu(true).path).then(() => {
                message(t("login.pureLoginSuccess"), { type: "success" });
              });
            }
          })
          .catch((err: Error) => {
            message(`请求用户信息失败!`, {
              type: "warning"
            });
          });
      })
      .catch(e => {
        console.log(e);
        message(`请求token失败!`, {
          type: "warning"
        });
      });
  }
} else {
  // 缓存state
  localStorage.setItem("state", state);
  // 缓存codeVerifier
  localStorage.setItem("codeVerifier", codeVerifier);
  window.location.href = `${
    import.meta.env.VITE_OAUTH_ISSUER
  }/oauth2/authorize?response_type=code&client_id=${
    import.meta.env.VITE_OAUTH_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    import.meta.env.VITE_OAUTH_REDIRECT_URI
  )}&scope=${encodeURIComponent(
    import.meta.env.VITE_OAUTH_SCOPE
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
}
</script>

<template>
  <div v-loading="true" style="height: 100%" />
</template>
