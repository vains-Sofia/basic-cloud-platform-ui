import { computed, reactive, ref } from 'vue'
import { batchIgnore, batchImport, endpointList, scanPage } from '@/api/system/ApiScan'
import { dictItems } from '@/api/system/Dict'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import {
	type EndpointListParams,
	ScanStatusEnum,
	type SysApiEndpoint,
} from '@/api/types/ApiScanTypes.ts'
import type { FindSysDictItemResponse } from '@/api/types/DictTypes.ts'
import { openDrawer } from '@/components/CommonDrawer'
import EndpointDetail from '@/views/system/api-scan/components/EndpointDetail.vue'

export function useApiEndpoints() {
	// 响应式数据
	const pagination = reactive<TablePagination>({
		total: 0,
		pageSize: 10,
		currentPage: 1,
	})

	const filterForm = reactive({
		size: pagination.pageSize,
		current: pagination.currentPage,
		scanStatus: null,
		imported: null,
		moduleName: '',
		scanBatchId: '',
		keyword: '',
	})

	const moduleOptions = ref<FindSysDictItemResponse[]>([])
	const selectedNum = ref(0)
	const tableLoading = ref(false)
	const tableData = ref<SysApiEndpoint[]>([])
	const selectedRows = ref<SysApiEndpoint[]>([])
	const currentScanBatchId = ref<number | null>(null)

	const loadData = () => {
		tableLoading.value = true

		const params: EndpointListParams = {
			scanBatchId: filterForm.scanBatchId,
			current: pagination.currentPage,
			size: pagination.pageSize,
			scanStatus: filterForm.scanStatus,
			imported: filterForm.imported,
			moduleName: filterForm.moduleName,
			keyword: filterForm.keyword,
		}

		endpointList(params)
			.then((res) => {
				tableData.value = res.records
				pagination.total = res.total
				pagination.pageSize = res.size
				pagination.currentPage = res.current
			})
			.finally(() => {
				tableLoading.value = false
			})
	}

	/**
	 * 获取扫描记录列表（用于远程选择组件）
	 */
	const scanRecordPage = async ({ current, size }: any) => {
		return scanPage({ current, size })
	}

	const exportReport = () => {
		if (!currentScanBatchId.value) {
			ElMessage.error(`请先选择扫描批次`)
			return
		}

		/*try {
		  await interfaceScanStore.exportReport(currentScanBatchId.value);
		  ElMessage.success("导出成功");
		} catch (error) {
		  ElMessage.error("导出失败：" + error);
		}*/
	}

	const openDetailDialog = (row: SysApiEndpoint) => {
		openDrawer({
			title: `接口详情`,
			size: '38%',
			bodyPadding: 20,
			confirmLoading: true,
			hideFooter: true,
			content: () => <EndpointDetail data={row} />,
		})
	}

	const importBatch = () => {
		const newEndpoints = selectedRows.value.filter(
			(row) => row.scanStatus === ScanStatusEnum.NEW_FOUND && !row.imported,
		)

		if (newEndpoints.length === 0) {
			ElMessage.error(`请选择需要导入的新接口`)
			return
		}

		batchImport(newEndpoints.map((item) => item.id)).then(() => {
			ElMessage.success(`成功导入 ${newEndpoints.length} 个接口`)
			loadData() // 刷新数据
		})
	}

	const ignoreBatch = () => {
		const ignoreList = selectedRows.value.filter(
			(row) => row.scanStatus !== ScanStatusEnum.IGNORE && !row.imported,
		)
		if (ignoreList.length === 0) {
			ElMessage.error(`请选择需要忽略的接口`)
			return
		}

		const ignoreCount = ignoreList.length
		batchIgnore(ignoreList.map((item) => item.id)).then(() => {
			ElMessage.success(`成功忽略 ${ignoreCount} 个接口`)
			// 取消选择
			onSelectionCancel()
			loadData() // 刷新数据
		})
	}

	// 忽略选中的行
	const ignoreSelected = (row: SysApiEndpoint) => {
		if (row.scanStatus === ScanStatusEnum.IGNORE) {
			ElMessage.error(`接口 ${row.requestMethod} - ${row.path} 已被忽略`)
			return
		}

		batchIgnore([row.id]).then(() => {
			ElMessage.success(`成功忽略 1 个接口`)
			loadData() // 刷新数据
		})
	}

	// 计算属性
	const hasSelectedNewEndpoints = computed(() => {
		return selectedRows.value.some(
			(row) => row.scanStatus === ScanStatusEnum.NEW_FOUND && !row.imported,
		)
	})

	const hasSelectedNonIgnoreEndpoints = computed(() => {
		return selectedRows.value.some(
			(row) => row.scanStatus !== ScanStatusEnum.IGNORE && !row.imported,
		)
	})

	const selectedNewCount = computed(() => {
		return selectedRows.value.filter(
			(row) => row.scanStatus === ScanStatusEnum.NEW_FOUND && !row.imported,
		).length
	})

	const selectedNonIgnoreCount = computed(() => {
		return selectedRows.value.filter(
			(row) => row.scanStatus !== ScanStatusEnum.IGNORE && !row.imported,
		).length
	})

	const importedCount = computed(() => {
		return tableData.value.filter((item) => item.imported).length
	})

	// 分页-每页条数改变
	const handleSizeChange = (val: number) => {
		pagination.pageSize = val
		filterForm.size = val
		loadData()
	}

	// 分页-当前页改变
	const handleCurrentChange = (val: number) => {
		pagination.currentPage = val
		filterForm.current = val
		loadData()
	}

	// 工具方法
	const getMethodTagType = (method: string) => {
		switch (method) {
			case 'GET':
				return 'success'
			case 'POST':
				return 'primary'
			case 'PUT':
				return 'warning'
			case 'DELETE':
				return 'danger'
			case 'PATCH':
				return 'info'
			default:
				return 'info'
		}
	}

	const getScanStatusTagType = (status: ScanStatusEnum) => {
		switch (status) {
			case ScanStatusEnum.NEW_FOUND:
				return 'success'
			case ScanStatusEnum.EXISTING:
				return 'primary'
			case ScanStatusEnum.MISSING_ANNOTATION:
				return 'warning'
			case ScanStatusEnum.IGNORE:
				return 'info'
			default:
				return 'info'
		}
	}

	const getScanStatusLabel = (status: ScanStatusEnum) => {
		const labelMap: Record<number, string> = {
			[ScanStatusEnum.NEW_FOUND]: '新发现',
			[ScanStatusEnum.EXISTING]: '已存在',
			[ScanStatusEnum.MISSING_ANNOTATION]: '缺少注释',
			[ScanStatusEnum.IGNORE]: '已忽略',
		}
		return labelMap[status] || '未知'
	}

	const columns: TableColumn[] = [
		{
			title: '勾选列', // 如果需要表格多选，此处label必须设置
			type: 'selection',
			dataKey: 'selection',
			fixed: 'left',
		},
		{
			title: '请求路径',
			dataKey: 'path',
			align: 'left',
			minWidth: 200,
			showOverflowTooltip: true,
		},
		{
			title: '请求方式',
			dataKey: 'requestMethod',
			formatter: ({ requestMethod }) => (
				<ElTag type={getMethodTagType(requestMethod)} effect="plain">
					{requestMethod}
				</ElTag>
			),
		},
		{
			title: '权限码',
			align: 'left',
			dataKey: 'permission',
			minWidth: 200,
			showOverflowTooltip: true,
			formatter: ({ permission }) =>
				permission ? (
					<span class="permission-code">{permission}</span>
				) : (
					<span class="text-gray-400">-</span>
				),
		},
		{
			title: '所属模块',
			dataKey: 'moduleName',
			formatter: ({ moduleName }) =>
				moduleName ? (
					<span>
						{(moduleOptions.value.find((item) => item.itemCode === moduleName) || {})
							.itemName || moduleName}
					</span>
				) : (
					<span class="text-gray-400">-</span>
				),
		},
		{
			title: '接口描述',
			dataKey: 'title',
			align: 'left',
			minWidth: 180,
			showOverflowTooltip: true,
			formatter: ({ title }) =>
				title ? <span>{title}</span> : <span class="text-gray-400">暂无描述</span>,
		},
		{
			title: '扫描状态',
			dataKey: 'scanStatus',
			width: 100,
			formatter: ({ scanStatus }) => (
				<ElTag type={getScanStatusTagType(scanStatus)} effect="plain">
					{getScanStatusLabel(scanStatus)}
				</ElTag>
			),
		},
		{
			title: '导入状态',
			dataKey: 'imported',
			formatter: ({ imported, importTime }) => (
				<>
					{imported ? (
						<ElTooltip content={importTime} placement={'top'}>
							<ElTag type="success" size="small">
								已导入
							</ElTag>
						</ElTooltip>
					) : (
						<ElTag type="info" size="small">
							未导入
						</ElTag>
					)}
				</>
			),
		},
		{
			title: '操作',
			fixed: 'right',
			width: 260,
			align: 'left',
			dataKey: 'operation',
			slot: 'operation',
		},
	]

	/** 当CheckBox选择项发生变化时会触发该事件 */
	function handleSelectionChange(val: SysApiEndpoint[]) {
		selectedRows.value = val
		selectedNum.value = val.length
	}

	/** 取消选择 */
	function onSelectionCancel() {
		selectedNum.value = 0
		selectedRows.value = []
	}

	// 加载模块列表
	dictItems('MODULE').then((res) => {
		moduleOptions.value = res
	})

	return {
		columns,
		loadData,
		tableData,
		pagination,
		hasSelectedNewEndpoints,
		hasSelectedNonIgnoreEndpoints,
		selectedNewCount,
		selectedNonIgnoreCount,
		importedCount,
		selectedRows,
		importBatch,
		ignoreBatch,
		selectedNum,
		tableLoading,
		handleSizeChange,
		handleCurrentChange,
		handleSelectionChange,
		onSelectionCancel,
		filterForm,
		moduleOptions,
		scanRecordPage,
		exportReport,
		ignoreSelected,
		openDetailDialog,
	}
}
