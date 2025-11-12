import { ref } from 'vue'
import router from '@/router'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { staticRoutes } from '@/router/modules/default'
import { transformMenuToRoutes, normalizeRoutes } from '@/router/transform'
import { lastRouters } from '@/router/modules/lastRouters'
import { formLogin } from '@/api/OAuth.ts'
import type { UserInfo } from '@/api/types/UserTypes'
import type { OAuth2TokenResult } from '@/api/types/OAuth2Types'
import { loginUserinfo } from '@/api/system/User.ts'
import { getAsyncRoutes } from '@/api/system/Permission.ts'

const logo = new URL(`../assets/logo.png`, import.meta.url).href

export const useUserStore = defineStore(
	'User',
	() => {
		// 头像
		const picture = ref(logo)

		// 昵称
		const nickname = ref('')

		// 用户完整信息
		const userinfo = ref<UserInfo>()

		// 拥有的菜单
		const routers = ref()

		const route = useRoute()

		const oauth2Token = ref<OAuth2TokenResult>()

		// 路由是否被初始化
		const isRouterInitialized = ref(false)

		// 设置用户基础信息
		function setupUser(user: UserInfo) {
			userinfo.value = user
			if (user.picture) {
				picture.value = user.picture
			}
			nickname.value = user.nickname
		}

		// 设置用户菜单
		function setupRouters(routerTree: any) {
			routers.value = routerTree
		}

		async function getRouters() {
			if (routers.value && routers.value.length > 0) {
				// 将子路由的绝对路径转为相对路径
				return normalizeRoutes([...staticRoutes, ...routers.value])
			}

			try {
				const routerList = await getAsyncRoutes()
				if (routerList) {
					routers.value = routerList
					return [...staticRoutes, ...routers.value]
				}
			} catch (error) {
				console.error(error)
			}

			return staticRoutes
		}

		// 初始化Router
		async function initRouter() {
			// 初始化过跳出
			if (isRouterInitialized.value) {
				return
			}

			if (!routers.value || routers.value.length === 0) {
				try {
					const routerList = await getAsyncRoutes()
					if (routerList) {
						const testRouters = [
							{
								path: '/aaa',
								name: 'aaa',
								meta: { title: '测试', icon: 'ep:house', showLink: true },
								component: () => import('@/components/Layout/index.vue'),
								children: [
									{
										path: 'level-1',
										name: 'level-1',
										component: '/components/Levels',
										meta: { title: 'level-1', icon: 'ep:house', showLink: true, showParent: true },
										children: [
											{
												path: 'level-2',
												name: 'level-2',
												component: '/components/Levels2',
												meta: { title: 'level-2', icon: 'ep:house', showLink: true, showParent: true },
												children: [
													{
														path: 'level-3',
														name: 'level-3',
														component: '/components/Levels3',
														meta: { title: 'level-3', icon: 'ep:house', showParent: true, activePath: '/aaa/level-1/level-2' },
													},
												],
											},
										],
									},
								],
							},
						]
						routers.value = [...testRouters, ...routerList]
					}
				} catch (error) {
					console.error(error)
				}
			}

			// 将组件从字符串转为实际的Vue组件
			const dynamicRoutes = transformMenuToRoutes(routers.value, true)
			// 将子路由的绝对路径转为相对路径
			const normalizedRoutes = normalizeRoutes(dynamicRoutes)

			// 添加路由
			normalizedRoutes.forEach((route: any) => {
				router.addRoute(route)
			})

			// 添加最后的路由(404)
			lastRouters.forEach((route) => router.addRoute(route))

			isRouterInitialized.value = true
		}

		// 登录
		function login(type: string, data: any) {
			return new Promise((resolve, reject) => {
				switch (type) {
					case 'account':
					case 'email':
					case 'qrcode':
						const oauth2Login = !!route.query.target
						formLogin(data, oauth2Login, type)
							.then((res) => {
								if (res.expires_in && res.expires_in > 0) {
									// 过期时长转为具体的过期时间
									res.expires_in = Date.now() + res.expires_in * 1000
								}
								oauth2Token.value = res
								loginUserinfo()
									.then((userResult) => {
										setupUser(userResult)
										resolve(true)
									})
									.catch(reject)
							})
							.catch(reject)
						break
					default:
						reject(new Error(`无对应类型: ${type}`))
						break
				}
			})
		}

		// 登出
		function logout() {
			router.push({ path: '/login' }).then(() => {
				console.log(logo)
				picture.value = logo
				nickname.value = ''
				routers.value = []
				isRouterInitialized.value = false
			})
		}

		return {
			login,
			logout,
			routers,
			picture,
			nickname,
			userinfo,
			getRouters,
			initRouter,
			oauth2Token,
			setupRouters,
			isRouterInitialized,
		}
	},
	{
		persistedState: {
			excludePaths: ['routers', 'isRouterInitialized'],
		},
	},
)
