export default [
	{
		path: '/AuthorizeRequest',
		name: 'AuthorizeRequest',
		component: () => import('@/views/oauth2/authorize/AuthorizeRequest.vue'),
		meta: {
			icon: 'ep:home-filled',
			title: '授权申请...',
			showLink: false,
			rank: 0,
		},
	},
	{
		path: '/OAuthAuthorize',
		name: 'OAuthAuthorize',
		component: () => import('@/views/oauth2/authorize/OAuthAuthorize.vue'),
		meta: {
			icon: 'ep:home-filled',
			title: '授权确认',
			showLink: false,
			rank: 1,
		},
	},
	{
		path: '/OAuthAuthorizeError',
		name: 'OAuthAuthorizeError',
		component: () => import('@/views/oauth2/authorize/OAuthAuthorizeError.vue'),
		meta: {
			icon: 'ep:home-filled',
			title: '授权失败',
			showLink: false,
			rank: 1,
		},
	},
	{
		path: '/DeviceVerification',
		name: 'DeviceVerification',
		component: () => import('@/views/oauth2/authorize/DeviceVerification.vue'),
		meta: {
			icon: 'ep:home-filled',
			title: '设备码验证',
			showLink: false,
			rank: 1,
		},
	},
	{
		path: '/DeviceActivated',
		name: 'DeviceActivated',
		component: () => import('@/views/oauth2/authorize/DeviceActivated.vue'),
		meta: {
			icon: 'ep:home-filled',
			title: '验证成功',
			showLink: false,
			rank: 1,
		},
	},
	{
		path: '/UserBinding',
		name: 'UserBinding',
		component: () => import('@/views/oauth2/third/UserBinding.vue'),
		meta: {
			icon: 'ep:home-filled',
			title: '账号绑定',
			showLink: false,
			rank: 1,
		},
	},
]
