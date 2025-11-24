import { onMounted, reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import type { FindAuthorizationResponse } from '@/api/types/AuthorizationTypes.ts'
import { findByPage, offline } from '@/api/platform/Authorization.ts'
import type { FindSysDictItemResponse } from '@/api/types/DictTypes.ts'
import { dictItems } from '@/api/system/Dict.ts'

export function useAuthorization() {
	// 表格是否加载中
	const loading = ref(true)
	// 表格数据列表
	const dataList = ref<FindAuthorizationResponse[]>([])
	// 字典数据——GrantType
	const grantTypeDict = ref<FindSysDictItemResponse[]>([])
	// 表格分页
	const pagination = reactive<TablePagination>({
		total: 0,
		pageSize: 10,
		currentPage: 1,
	})

	/**
	 * 搜索入参
	 */
	const form = reactive({
		registeredClientId: '',
		principalName: '',
		authorizationGrantType: '',
		current: pagination.currentPage,
		size: pagination.pageSize,
	})

	const getGrantTypeTagType = (grantType: string) => {
		switch (grantType) {
			case 'authorization_code':
				return 'success'
			case 'urn:ietf:params:oauth:grant-type:device_code':
				return 'primary'
			case 'password':
				return 'warning'
			default:
				return 'info'
		}
	}

	/**
	 * 表格列定义
	 */
	const columns: TableColumn[] = [
		{
			title: '授权应用',
			dataKey: 'registeredClientName',
			minWidth: 150,
		},
		{
			title: '应用Logo',
			dataKey: 'registeredClientLogo',
			width: 100,
			formatter: (row) =>
				row.registeredClientLogo ? (
					<ElAvatar src={row.registeredClientLogo} size={65} shape="square">
						<i class="ri-apps-line" />
					</ElAvatar>
				) : (
					<ElAvatar size={65} shape="square">
						<i class="ri-apps-line" />
					</ElAvatar>
				),
		},
		{
			title: '授权用户',
			dataKey: 'principalName',
			minWidth: 120,
		},
		{
			title: '授权模式',
			dataKey: 'authorizationGrantType',
			width: 180,
			formatter: ({ authorizationGrantType }) => (
				<ElTag type={getGrantTypeTagType(authorizationGrantType)}>
					{grantTypeDict.value?.find((item) => item.itemCode === authorizationGrantType)
						?.itemName ?? authorizationGrantType}
				</ElTag>
			),
		},
		{
			title: '授权码',
			dataKey: 'authorizationCodeValue',
			minWidth: 200,
			showOverflowTooltip: true,
		},
		{
			title: '授权码状态',
			dataKey: 'authorizationCodeInvalidated',
			width: 100,
			formatter: ({ authorizationCodeInvalidated }) => (
				<ElTag type={authorizationCodeInvalidated ? 'danger' : 'success'} size="small">
					{authorizationCodeInvalidated ? '无效' : '有效'}
				</ElTag>
			),
		},
		{
			title: 'Access Token',
			dataKey: 'accessTokenValue',
			minWidth: 200,
			showOverflowTooltip: true,
		},
		{
			title: '状态',
			dataKey: 'accessTokenInvalidated',
			width: 70,
			formatter: ({ accessTokenInvalidated }) => (
				<ElTag type={accessTokenInvalidated ? 'danger' : 'success'} size="small">
					{accessTokenInvalidated ? '无效' : '有效'}
				</ElTag>
			),
		},
		{
			title: 'Refresh Token',
			dataKey: 'refreshTokenValue',
			minWidth: 200,
			showOverflowTooltip: true,
		},
		{
			title: '状态',
			dataKey: 'refreshTokenInvalidated',
			width: 70,
			formatter: ({ refreshTokenInvalidated }) => (
				<ElTag type={refreshTokenInvalidated ? 'danger' : 'success'} size="small">
					{refreshTokenInvalidated ? '无效' : '有效'}
				</ElTag>
			),
		},
		{
			title: '操作',
			fixed: 'right',
			width: 90,
			dataKey: 'operation',
			slot: 'operation',
		},
	]

	/**
	 * 列表数据加载
	 */
	function onSearch() {
		loading.value = true
		findByPage(form)
			.then((data) => {
				dataList.value = data.records
				pagination.total = data.total
				pagination.pageSize = data.size
				pagination.currentPage = data.current
			})
			.finally(() => (loading.value = false))

		setTimeout(() => {
			loading.value = false
		}, 500)
	}

	/**
	 * 分页-每页行数变化
	 * @param val 每页行数
	 */
	function handleSizeChange(val: number) {
		form.size = val
		onSearch()
	}

	/**
	 * 分页-当前页变化
	 * @param val 当前页码
	 */
	function handleCurrentChange(val: number) {
		form.current = val
		onSearch()
	}

	const handleOffline = (row: FindAuthorizationResponse) => {
		ElMessageBox.confirm(
			`确定要下线用户 "${row.principalName}" 在客户端 "${row.registeredClientName}" 的认证吗？`,
			'确认下线',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			},
		).then(() => {
			row.offlineLoading = true
			offline(row.accessTokenValue)
				.then(() => {
					ElMessage.success('下线成功')
					onSearch()
				})
				.finally(() => (row.offlineLoading = false))
		})
	}

	onMounted(() => {
		onSearch()

		dictItems('GRANT_TYPE').then((res) => {
			grantTypeDict.value = res
		})
	})

	return {
		form,
		columns,
		loading,
		onSearch,
		dataList,
		pagination,
		handleOffline,
		grantTypeDict,
		handleSizeChange,
		handleCurrentChange,
	}
}
