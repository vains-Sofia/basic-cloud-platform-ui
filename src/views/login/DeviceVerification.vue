<template>
  <DeviceVerification
    ref="verificationRef"
    :min-length="6"
    :max-length="10"
    @verification="customVerifyApi"
  />
</template>

<script setup>
import { ref } from "vue";
import { deviceVerification } from "@/api/user";
import DeviceVerification from "./components/DeviceVerificationComponent.vue";
import { message } from "@/utils/message";

const verificationRef = ref();

// 自定义验证API
const customVerifyApi = async code => {
  try {
    const response = await deviceVerification(code);
    if (response.code === 200) {
      window.location.href = response.data;
    } else {
      message(response.message || "授权失败", { type: "error" });
    }
    return {
      success: response.status === 200
    };
  } catch (error) {
    throw new Error("验证请求失败");
  }
};
</script>
