<template>
	<DeviceVerification
		ref="verificationRef"
		:min-length="6"
		:max-length="10"
		@verification="customVerifyApi"
	/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { deviceVerification } from '@/api/oauth2/OAuth.ts'
import DeviceVerification from "../components/DeviceVerificationComponent.vue";

const verificationRef = ref();

// 自定义验证API
const customVerifyApi = async (code: string) => {
	try {
		const response = await deviceVerification(code);
		if (response) {
			window.location.href = response;
		}
		return {
			success: !!response
		};
	} catch (error) {
		console.log(error)
		throw new Error("验证请求失败");
	}
};
</script>
