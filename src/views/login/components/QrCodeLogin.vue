<script setup lang="ts">
import QrCode from '@/components/QrCode/src'
import { onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/User.ts'
import { getQrCodeData } from '@/api/oauth2/QrCodeLogin.ts'
import router from '@/router'
import { useRoute } from 'vue-router'

const qrcodeWidth = 230

interface Emits {
	back: []
}

const route = useRoute()

const emit = defineEmits<Emits>()

const userStore = useUserStore()
// 过期提示文字
const expired = ref(false)
// 是否正在加载二维码
const loading = ref(false)
// 头像
const picture = ref()

// sse事件对象
let sse: EventSource | undefined = undefined
const pollQrCode = (token: string) => {
	if (sse) {
		sse.close()
	}
	// 初始化无效提示
	expired.value = false
	sse = new EventSource(`${import.meta.env.VITE_API_URL}/auth/qr-code/poll?token=${token}`)

	sse.addEventListener('scanned', (event) => {
		// 更新二维码 UI 为“用户头像”...
		// sse.close();
		picture.value = JSON.parse(event.data)?.picture
	})

	sse.addEventListener('confirmed', () => {
		// 调用二维码登录接口
		userStore.login('qr-code', { token })
			.then(() => {
				const oauth2Login = !!route.query.target
				if (!oauth2Login) {
					userStore
						.initRouter()
						.then(() =>
							router
								.replace({ name: 'Dashboard' })
								.then(() => console.log('跳转首页')),
						).finally(() => sse?.close())
				}
			}).finally(() => sse?.close())
	})

	sse.addEventListener('expired', () => {
		// 更新 UI 状态为“失效”...
		expired.value = true
		sse?.close()
	})
}

// 二维码内容
const qrCodeData = ref('')

// 加载二维码数据
const loadingQrCode = () => {
	loading.value = true
	getQrCodeData()
		.then((res) => {
			// 轮训二维码状态
			pollQrCode(res.token)
			qrCodeData.value = JSON.stringify(res)
		})
		.finally(() => (loading.value = false))
}

// 默认加载
loadingQrCode()

onUnmounted(() => {
	if (sse) {
		// 退出二维码登录页面之前关闭sse
		sse.close()
	}
})
</script>

<template>
	<div class="flex items-center flex-col">
		<div class="pb-3 animate__animated animate__fadeInUp" :style="{ animationDelay: '0.1s' }">
			使用APP扫一扫登录
		</div>

		<QrCode
			v-if="!picture"
			:data="qrCodeData"
			:size="qrcodeWidth"
			:expired="expired"
			:loading="loading"
			:on-refresh="loadingQrCode"
			class="animate__animated animate__fadeInUp"
			:style="{ animationDelay: '0.15s' }"
		/>

		<el-image
			v-else
			fit="cover"
			:src="picture"
			:preview-teleported="true"
			:preview-src-list="Array.of(picture)"
			class="w-[230px] h-[230px] full align-middle"
		/>

		<el-form-item
			:style="{ width: qrcodeWidth + 'px', animationDelay: '0.2s' }"
			class="animate__animated animate__fadeInUp"
		>
			<el-button plain class="mt-5.5 w-full" @click="() => emit('back')"> 返回 </el-button>
		</el-form-item>
	</div>
</template>

<style scoped></style>
