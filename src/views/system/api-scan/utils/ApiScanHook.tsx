import { reactive, ref, watch } from 'vue'
import { batchImportByBatchId, endpointScan, scanPage } from '@/api/system/ApiScan'
import { dictItems } from '@/api/system/Dict'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import type { SysApiScanRecord } from '@/api/types/ApiScanTypes.ts'

export function useApiScanRecord() {
	// 响应式数据
	const recordPagination = reactive<TablePagination>({
		total: 0,
		pageSize: 10,
		currentPage: 1,
	})

	const scanFilterForm = reactive({
		size: recordPagination.pageSize,
		current: recordPagination.currentPage,
		startTime: '',
		endTime: '',
	})

	const scanRecords = ref<SysApiScanRecord[]>([])
	const moduleOptions = ref()
	const startEndTimes = ref([])
	const scanLoading = ref(false)
	const recordTableLoading = ref(false)
	const scanStatus = ref<'idle' | 'scanning' | 'completed' | 'error'>('idle')

	// 开始扫描
	const startScan = async (applications: string[]) => {
		scanLoading.value = true
		scanStatus.value = 'scanning'

		try {
			await endpointScan(applications)
			scanStatus.value = 'completed'
			// 扫描完成后刷新记录列表
			scanRecordTable()
		} catch (error) {
			scanStatus.value = 'error'
			console.error('扫描失败:', error)
		} finally {
			scanLoading.value = false
		}
	}

	/**
	 * 获取扫描记录列表
	 */
	const scanRecordTable = () => {
		recordTableLoading.value = true

		scanPage(scanFilterForm)
			.then((res) => {
				scanRecords.value = res.records
				recordPagination.total = res.total
				recordPagination.pageSize = res.size
				recordPagination.currentPage = res.current
			})
			.finally(() => {
				recordTableLoading.value = false
			})
	}

	// 分页-每页条数改变
	const handleRecordSizeChange = (val: number) => {
		recordPagination.pageSize = val
		scanFilterForm.size = val
		scanRecordTable()
	}

	// 分页-当前页改变
	const handleRecordCurrentChange = (val: number) => {
		recordPagination.currentPage = val
		scanFilterForm.current = val
		scanRecordTable()
	}

	const resetScanForm = (formEl: InstanceType<any>) => {
		if (!formEl) return
		formEl.resetFields()
		scanRecordTable()
	}

	// 加载模块列表
	dictItems('MODULE').then((res) => {
		moduleOptions.value = res
	})

	// 范围日期预设选项
	const shortcuts = [
		{
			text: '上周',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
				return [start, end]
			},
		},
		{
			text: '上个月',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
				return [start, end]
			},
		},
		{
			text: '三个月前',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
				return [start, end]
			},
		},
	]

	// 监听 startEndTimes 值的变化，然后更新 scanFilterForm
	watch(startEndTimes, (newTimes) => {
		if (newTimes && newTimes.length === 2) {
			scanFilterForm.startTime = newTimes[0]
			scanFilterForm.endTime = newTimes[1]
		} else {
			scanFilterForm.startTime = ''
			scanFilterForm.endTime = ''
		}
	})

	const scanRecordColumns: TableColumn[] = [
		{
			title: '扫描记录id',
			dataKey: 'id',
			width: 180
		},
		{
			title: '扫描时间',
			dataKey: 'scanTime',
			width: 180
		},
		{
			title: '总接口数',
			dataKey: 'totalCount',
		},
		{
			title: '新发现接口数',
			dataKey: 'newCount',
		},
		{
			title: '已存在接口数',
			dataKey: 'existCount',
		},
		{
			title: '缺少注释数',
			dataKey: 'missingDescCount',
		},
		{
			title: '扫描结果摘要',
			dataKey: 'scanResult',
			showOverflowTooltip: true,
			width: 220,
		},
		{
			title: '操作',
			fixed: 'right',
			dataKey: 'operation',
			slot: 'operation',
			width: 210,
		},
	]

	// 导入选中行至权限表
	const importSelected = (row: SysApiScanRecord) => {
		batchImportByBatchId(row.id).then(() => {
			ElMessage({
				message: '导入成功',
			})
		})
	}

	return {
		recordPagination,
		scanFilterForm,
		scanRecords,
		moduleOptions,
		startEndTimes,
		scanLoading,
		recordTableLoading,
		scanStatus,
		startScan,
		scanRecordTable,
		handleRecordSizeChange,
		handleRecordCurrentChange,
		resetScanForm,
		shortcuts,
		scanRecordColumns,
		importSelected,
	}
}
