import { onMounted, reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import type { TodoTaskPageResponse } from '@/api/types/ProcessTaskTypes.ts'
import { todoTaskPage } from '@/api/workflow/ProcessTask.ts'
import router from '@/router'

export function useTodo() {
	// 表格是否加载中
	const loading = ref(true)
	// 表格数据列表
	const dataList = ref<TodoTaskPageResponse[]>([])
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
		current: pagination.currentPage,
		size: pagination.pageSize,
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
			title: '任务 ID',
			dataKey: 'taskId',
			align: 'center',
		},
		{
			title: '流程定义名称',
			dataKey: 'processDefinitionName',
			align: 'center',
		},
		{
			title: '任务名称',
			dataKey: 'taskName',
			align: 'center',
		},
		{
			title: '流程发起人',
			dataKey: 'startUserName',
		},
		{
			title: '流程发起时间',
			dataKey: 'createTime',
			align: 'center',
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
		todoTaskPage(form)
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

	const approve = (row: TodoTaskPageResponse) => {
		if (row.formKey) {
			// 表单填写
			router
				.push({
					path: '/task/todo/form',
					query: { formKey: row.formKey, taskId: row.taskId },
				})
				.then()
		} else {
			// TODO 审批
			console.log(row)
		}
	}

	onMounted(onSearch)

	return {
		columns,
		loading,
		approve,
		onSearch,
		dataList,
		pagination,
		handleSizeChange,
		handleCurrentChange,
	}
}
