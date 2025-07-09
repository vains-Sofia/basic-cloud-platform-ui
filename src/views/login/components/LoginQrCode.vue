<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import Motion from "../utils/motion";
import ReQrcode from "@/components/ReQrcode";
import { useUserStoreHook } from "@/store/modules/user";
import { getQrCodeData, qrCodeLogin } from "@/api/QrCode";
import { getQueryString } from "@/utils/auth";
import { getTopMenu, initRouter } from "@/router/utils";
import { message } from "@/utils/message";
import { useRouter } from "vue-router";

const { t } = useI18n();

const router = useRouter();
// 过期提示文字
const expireText = ref("");
// 是否正在加载二维码
const loading = ref(false);
// 头像
const picture = ref();

// sse事件对象
let sse: EventSource | null = null;
const pollQrCode = (token: string) => {
  if (sse) {
    sse.close();
  }
  // 初始化无效提示
  expireText.value = "";
  sse = new EventSource(
    `${import.meta.env.VITE_BASE_URI}/auth/qr-code/poll?token=${token}`
  );

  sse.addEventListener("scanned", event => {
    // 更新二维码 UI 为“用户头像”...
    // sse.close();
    picture.value = JSON.parse(event.data)?.picture;
  });

  sse.addEventListener("confirmed", event => {
    // 调用二维码登录接口
    qrCodeLogin(token).then(async res => {
      if (res.code === 200) {
        const target = getQueryString("target");
        if (target) {
          return new Promise(() => {
            window.location.href = target;
          });
        } else {
          // 跳转到首页
          await initRouter();
          router.push(getTopMenu(true).path).then(() => {
            message(t("login.pureLoginSuccess"), { type: "success" });
          });
        }
      } else {
        message(res.message || t("login.pureLoginFail"), { type: "error" });
      }
    });
    sse.close();
  });

  sse.addEventListener("expired", event => {
    // 更新 UI 状态为“失效”...
    expireText.value = "二维码已过期";
    sse.close();
  });
};

// 二维码内容
const qrCodeData = ref();

// 加载二维码数据
const loadingQrCode = () => {
  loading.value = true;
  getQrCodeData()
    .then(res => {
      // 轮训二维码状态
      pollQrCode(res.data.token);
      qrCodeData.value = JSON.stringify(res.data);
    })
    .finally(() => (loading.value = false));
};

// 默认加载
loadingQrCode();

onUnmounted(() => {
  if (sse) {
    // 退出二维码登录页面之前关闭sse
    sse.close();
  }
});
</script>

<template>
  <div>
    <Motion v-loading="loading" class="-mt-2 -mb-2">
      <ReQrcode
        v-if="!picture"
        :text="qrCodeData"
        :disabled="
          expireText !== null &&
          expireText !== '' &&
          typeof expireText !== undefined
        "
        :disabledText="expireText"
        @click="loadingQrCode"
        @disabled-click="loadingQrCode"
      />
      <el-image
        v-else
        fit="cover"
        :src="picture"
        :preview-teleported="true"
        :preview-src-list="Array.of(picture)"
        class="w-[200px] h-[200px] full align-middle"
      />
    </Motion>
    <Motion :delay="100">
      <el-divider>
        <p class="text-gray-500 text-xs">{{ t("login.pureTip") }}</p>
      </el-divider>
    </Motion>
    <Motion :delay="150">
      <el-button
        class="w-full mt-4"
        @click="useUserStoreHook().SET_CURRENTPAGE(0)"
      >
        {{ t("login.pureBack") }}
      </el-button>
    </Motion>
  </div>
</template>
