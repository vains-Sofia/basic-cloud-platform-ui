import NProgress from 'nprogress'
import { useUserStore } from '@/stores/User.ts'
import { staticRoutes } from '@/router/modules'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

// 根据环境变量获取路由模式
const routerMode = import.meta.env.VITE_ROUTER_MODE || 'history'

// 根据路由模式创建对应的 history 对象
const history =
	routerMode === 'hash'
		? createWebHashHistory(import.meta.env.VITE_BASE_PATH)
		: createWebHistory(import.meta.env.VITE_BASE_PATH)

const router = createRouter({
	history,
	routes: staticRoutes,
})

/** 路由白名单 */
const whiteList = [
	"/login",
	"/UserBinding",
	"/OAuthAuthorize",
	"/DeviceActivated",
	"/AuthorizeRequest",
	"/DeviceVerification",
	"/OAuthAuthorizeError"
];

// 路由守卫
router.beforeEach((to, from, next) => {
	NProgress.start()
	const userStore = useUserStore()

	// 如果未登录，跳转到登录页
	if (whiteList.includes(to.path)) {
		next()
		return
	}

	// 登录后，且还未添加动态路由 → 添加
	if (!userStore.isRouterInitialized && userStore.oauth2Token?.access_token) {
		userStore.initRouter().then(() => {
			// 是否存在路由
			const matched = router.getRoutes().some((route) => route.path === to.path)
			if (!matched) {
				// 不存在转404
				next({ name: 'NotFound', replace: true })
			} else {
				next({ ...to, replace: true })
			}
		})
		return
	}

	if (!userStore.oauth2Token?.access_token) {
		next({ path: '/login', replace: true })
		return
	}

	next()
})

router.afterEach(() => NProgress.done())

export default router
