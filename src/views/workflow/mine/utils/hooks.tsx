import { onMounted, reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import type { ProcessInstanceResponse } from '@/api/types/ProcessTaskTypes.ts'
import { cancelProcessInstance, getMyProcessInstance } from '@/api/workflow/ProcessTask.ts'

export function useMine() {
	// 表格是否加载中
	const loading = ref(true)
	// 取消流程实例加载状态Map
	const cancelLoadingMap = ref<Record<string, boolean>>({})
	// 表格数据列表
	const dataList = ref<ProcessInstanceResponse[]>([])
	// 表格分页
	const pagination = reactive<TablePagination>({
		total: 0,
		pageSize: 15,
		currentPage: 1,
		pageSizes: [10, 15, 20, 50, 100],
	})

	/**
	 * 搜索入参
	 */
	const form = reactive({
		processDefinitionKey: '',
		size: pagination.pageSize,
		current: pagination.currentPage,
	})

	/**
	 * 表格列定义
	 */
	const columns: TableColumn[] = [
		{
			title: '勾选列',
			dataKey: 'index',
			type: 'selection',
			width: 30,
		},
		{
			title: '流程实例 ID',
			dataKey: 'processInstanceId',
			align: 'center',
			minWidth: 120,
		},
		{
			title: '流程定义名称',
			dataKey: 'processDefinitionName',
			align: 'center',
		},
		// {
		// 	title: '流程定义 Key',
		// 	dataKey: 'processDefinitionKey',
		// 	align: 'center',
		// 	width: 290,
		// },
		{
			title: '流程版本',
			dataKey: 'processDefinitionVersion',
			align: 'center',
			formatter: (row) => <ElTag>{row.processDefinitionVersion}</ElTag>,
		},
		{
			title: '发起时间',
			dataKey: 'startTime',
			align: 'center',
			minWidth: 100,
		},
		{
			title: '流程状态',
			dataKey: 'status',
			align: 'center',
			formatter: (row) => (
				<ElTag
					type={
						row.status === 'RUNNING'
							? 'primary'
							: row.status === 'COMPLETED'
								? 'success'
								: 'info'
					}
				>
					{row.status === 'RUNNING'
						? '进行中'
						: row.status === 'COMPLETED'
							? '已完成'
							: '已取消'}
				</ElTag>
			),
		},
		{
			title: '耗时',
			dataKey: 'formattedDuration',
			align: 'center',
		},
		{
			title: '当前节点',
			dataKey: 'currentActivityName',
			align: 'center',
			formatter: (row) => <span>{row.currentActivityName ?? '-'}</span>,
		},
		{
			title: '办理人',
			dataKey: 'assigneeName',
			align: 'center',
			formatter: (row) => <span>{row.assigneeName ?? '-'}</span>,
		},
		{
			title: '操作',
			fixed: 'right',
			slot: 'operation',
			dataKey: 'operation',
		},
	]

	/**
	 * 列表数据加载
	 */
	function onSearch() {
		loading.value = true
		getMyProcessInstance(form)
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

	/**
	 * 取消流程实例
	 * @param row 我发起的流程数据
	 */
	const cancelProcess = (row: ProcessInstanceResponse) => {
		cancelLoadingMap.value[row.processInstanceId] = true
		cancelProcessInstance({ processInstanceId: row.processInstanceId })
			.then(() => {
				ElNotification({
					title: '拾取任务',
					message: `任务领取成功`,
					type: 'success',
				})
				onSearch()
			})

			.finally(() => (cancelLoadingMap.value[row.processInstanceId] = false))
	}

	onMounted(onSearch)

	return {
		columns,
		loading,
		onSearch,
		dataList,
		pagination,
		cancelProcess,
		cancelLoadingMap,
		handleSizeChange,
		handleCurrentChange,
	}
}
