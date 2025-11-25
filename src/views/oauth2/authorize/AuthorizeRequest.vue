<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/User'
import { getToken } from '@/api/oauth2/OAuth'
import { loginUserinfo } from '@/api/system/User'
import { checkBinding } from '@/api/oauth2/ThirdUserBingding'
import type { UserInfo } from '@/api/types/UserTypes.ts'
import type { OAuth2TokenResult } from '@/api/types/OAuth2Types.ts'
import { generateCodeChallenge, generateCodeVerifier, getQueryString } from '@/utils/auth'

const router = useRouter()

const userStore = useUserStore()

// 生成CodeVerifier
const codeVerifier: string = generateCodeVerifier()
// codeChallenge
const codeChallenge: string = generateCodeChallenge(codeVerifier)
// 生成state
const state: string = generateCodeVerifier()

// 获取地址栏授权码
const code = getQueryString('code')

if (code) {
	// 从缓存中获取 codeVerifier
	const state = localStorage.getItem('state')
	// 校验state，防止cors
	const urlState = getQueryString('state')
	if (urlState !== state) {
		ElMessage.warning('state校验失败')
	} else {
		// 从缓存中获取 codeVerifier
		const code_verifier = localStorage.getItem('codeVerifier')
		getToken({
			grant_type: 'authorization_code',
			client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
			redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
			code,
			code_verifier,
			state,
		}).then((res: OAuth2TokenResult) => {
			if (res.expires_in && res.expires_in > 0) {
				// 过期时长转为具体的过期时间
				res.expires_in = Date.now() + res.expires_in * 1000
			}
			userStore.oauth2Token = res
			loginUserinfo().then((user: UserInfo) => {
				userStore.setupUser(user)
				if (user.accountPlatform !== 'system' && !user.bindBasicUserChecked) {
					const nonOperationStatus = ['bound', 'new_created']
					// 三方登录用户，检查是否绑定账户
					checkBinding().then((response) => {
						if (nonOperationStatus.indexOf(response.data ?? '') === -1) {
							// 跳转到用户绑定确认页面
							router
								.push({
									path: '/UserBinding',
									query: {
										status: response.data,
									},
								})
								.then(() => ElMessage.info('请先绑定用户.'))
						} else {
							userStore
								.initRouter()
								.then(() =>
									router
										.replace({ name: 'Dashboard' })
										.then(() => ElMessage.info('登录成功.')),
								)
						}
					})
				} else {
					userStore
						.initRouter()
						.then(() =>
							router
								.replace({ name: 'Dashboard' })
								.then(() => ElMessage.success('登录成功.')),
						)
				}
			})
		})
	}
} else {
	// 缓存state
	localStorage.setItem('state', state)
	// 缓存codeVerifier
	localStorage.setItem('codeVerifier', codeVerifier)
	window.location.href = `${
		import.meta.env.VITE_API_URL
	}/auth/oauth2/authorize?response_type=code&client_id=${
		import.meta.env.VITE_OAUTH_CLIENT_ID
	}&redirect_uri=${encodeURIComponent(
		import.meta.env.VITE_OAUTH_REDIRECT_URI,
	)}&scope=${encodeURIComponent(
		import.meta.env.VITE_OAUTH_SCOPE,
	)}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`
}
</script>

<template>
	<div v-loading="true" style="height: 100%" />
</template>
