<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { emailRules } from "./utils/rule";
import TypeIt from "@/components/ReTypeit";
import { debounce } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { useEventListener } from "@vueuse/core";
import type { FormInstance } from "element-plus";
import { operates, thirdParty } from "./utils/enums";
import { useLayout } from "@/layout/hooks/useLayout";
import LoginAccount from "./components/LoginAccount.vue";
import LoginRegist from "./components/LoginRegist.vue";
import LoginUpdate from "./components/LoginUpdate.vue";
import LoginQrCode from "./components/LoginQrCode.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { getTopMenu, initRouter } from "@/router/utils";
import { avatar, bg, illustration } from "./utils/static";
import { computed, reactive, ref, toRaw, watch } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import globalization from "@/assets/svg/globalization.svg?component";
import Check from "~icons/ep/check";
import { getQueryString } from "@/utils/auth";
import MailLine from "~icons/ri/mail-line";
import Keyhole from "~icons/ri/shield-keyhole-line";
import Gitee from "@/assets/svg/gitee.svg?component";
import { useVerifyCode } from "@/views/login/utils/verifyCode";

defineOptions({
  name: "Login"
});

const imgCode = ref("");
const loginDay = ref(7);
const router = useRouter();
const loading = ref(false);
const checked = ref(false);
const disabled = ref(false);
const ruleFormRef = ref<FormInstance>();
const currentPage = computed(() => {
  return useUserStoreHook().currentPage;
});

const { t } = useI18n();
const { initStorage } = useLayout();
initStorage();
const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { locale, translationCh, translationEn } = useTranslationLang();

const ruleForm = reactive({
  email: "",
  captcha: "",
  verifyCode: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByEmail({
          email: ruleForm.email,
          captcha: ruleForm.captcha
        })
        .then(res => {
          if (res.code === 200) {
            const target = getQueryString("target");
            if (target) {
              return new Promise(resolve => {
                window.location.href = target;
              });
            } else {
              // 跳转到首页
              return initRouter().then(() => {
                disabled.value = true;
                router
                  .push(getTopMenu(true).path)
                  .then(() => {
                    message(t("login.pureLoginSuccess"), { type: "success" });
                  })
                  .finally(() => (disabled.value = false));
              });
            }
            // 获取后端路由
            /*return initRouter().then(() => {
              disabled.value = true;
              router
                .push(getTopMenu(true).path)
                .then(() => {
                  message(t("login.pureLoginSuccess"), { type: "success" });
                })
                .finally(() => (disabled.value = false));
            });*/
          } else {
            message(res.message || t("login.pureLoginFail"), { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};

const immediateDebounce: any = debounce(
  formRef => onLogin(formRef),
  1000,
  true
);

useEventListener(document, "keydown", ({ code }) => {
  if (
    ["Enter", "NumpadEnter"].includes(code) &&
    !disabled.value &&
    !loading.value
  )
    immediateDebounce(ruleFormRef.value);
});

// 三方oauth2登录发起
const authorizeRequest = (provider: string) => {
  window.location.href = `${import.meta.env.VITE_OAUTH_ISSUER}/oauth2/authorization/${provider}`;
};

watch(imgCode, value => {
  useUserStoreHook().SET_VERIFYCODE(value);
});
watch(checked, bool => {
  useUserStoreHook().SET_ISREMEMBERED(bool);
});
watch(loginDay, value => {
  useUserStoreHook().SET_LOGINDAY(value);
});

const { isDisabled, text } = useVerifyCode();
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <globalization
          class="hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <IconifyIconOffline
                v-show="locale === 'zh'"
                class="check-zh"
                :icon="Check"
              />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
              @click="translationEn"
            >
              <span v-show="locale === 'en'" class="check-en">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">
              <TypeIt
                :options="{ strings: [title], cursor: false, speed: 100 }"
              />
            </h2>
          </Motion>

          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="emailRules"
            size="large"
          >
            <Motion>
              <el-form-item prop="email">
                <el-input
                  v-model="ruleForm.email"
                  clearable
                  :placeholder="t('login.pureEmail')"
                  :prefix-icon="useRenderIcon(MailLine)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="100">
              <el-form-item prop="captcha">
                <div class="w-full flex justify-between">
                  <el-input
                    v-model="ruleForm.captcha"
                    clearable
                    :placeholder="t('login.pureEmailVerifyCode')"
                    :prefix-icon="useRenderIcon(Keyhole)"
                  />
                  <el-button
                    :disabled="isDisabled"
                    class="ml-2"
                    @click="
                      useVerifyCode().start(
                        ruleFormRef,
                        'email',
                        ruleForm.email,
                        1
                      )
                    "
                  >
                    {{
                      text.length > 0
                        ? text + t("login.pureInfo")
                        : t("login.pureGetVerifyCode")
                    }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <el-button
                  class="w-full"
                  size="default"
                  type="primary"
                  :loading="loading"
                  :disabled="disabled"
                  @click="onLogin(ruleFormRef)"
                >
                  {{ t("login.pureLogin") }}
                </el-button>
              </el-form-item>
            </Motion>

            <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click="useUserStoreHook().SET_CURRENTPAGE(index + 1)"
                  >
                    {{ t(item.title) }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>
          </el-form>

          <Motion v-if="currentPage === 0" :delay="350">
            <el-form-item>
              <el-divider>
                <p class="text-gray-500 text-xs">
                  {{ t("login.pureThirdLogin") }}
                </p>
              </el-divider>
              <div class="w-full flex justify-evenly">
                <span
                  v-for="(item, index) in thirdParty"
                  :key="index"
                  :title="t(item.title)"
                >
                  <IconifyIconOnline
                    v-if="item.icon !== 'gitee'"
                    width="20"
                    :icon="`ri:${item.icon}-fill`"
                    class="cursor-pointer hover:scale-110"
                    :style="{ color: item.color }"
                    @click="authorizeRequest(item.provider)"
                  />
                  <Gitee
                    v-else
                    width="20"
                    style="padding: 1.5px"
                    :style="{ color: item.color }"
                    class="cursor-pointer hover:scale-110"
                    @click="authorizeRequest(item.provider)"
                  />
                </span>
              </div>
            </el-form-item>
          </Motion>
          <!-- 手机号登录 -->
          <LoginAccount v-if="currentPage === 1" />
          <!-- 二维码登录 -->
          <LoginQrCode v-if="currentPage === 2" />
          <!-- 注册 -->
          <LoginRegist v-if="currentPage === 3" />
          <!-- 忘记密码 -->
          <LoginUpdate v-if="currentPage === 4" />
        </div>
      </div>
    </div>
    <div
      class="w-full flex-c absolute bottom-3 text-sm text-[rgba(0,0,0,0.6)] dark:text-[rgba(220,220,242,0.8)]"
    >
      Copyright © 2020-present
      <a
        class="hover:text-primary"
        href="https://github.com/pure-admin"
        target="_blank"
      >
        &nbsp;{{ title }}
      </a>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
