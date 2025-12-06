import { onMounted, reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import type { PageProcessDeploymentResponse } from '@/api/types/ProcessDeploymentTypes.ts'
import { findDeploymentPage, undeploy } from '@/api/workflow/ProcessDeployment.ts'

export function useProcessDeployment() {
	// 表格是否加载中
	const loading = ref(true)
	// 表格数据列表
	const dataList = ref<PageProcessDeploymentResponse[]>([])
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
		name: '',
		category: '',
		processDefinitionKey: '',
		current: pagination.currentPage,
		size: pagination.pageSize,
	})

	/**
	 * 表格列定义
	 */
	const columns: TableColumn[] = [
		{
			title: '部署 ID',
			dataKey: 'id',
			align: 'center',
			minWidth: 180,
		},
		{
			title: '流程实例名称',
			dataKey: 'name',
			align: 'center',
		},
		{
			title: '流程定义key',
			dataKey: 'processKey',
			minWidth: 280,
		},
		{
			title: '流程实例分类',
			dataKey: 'category',
			align: 'center',
		},
		{
			title: '部署时间',
			dataKey: 'deploymentTime',
			minWidth: 100,
			align: 'center',
		},
		{
			title: '操作',
			fixed: 'right',
			width: 80,
			slot: 'operation',
			dataKey: 'operation',
		},
	]

	/**
	 * 列表数据加载
	 */
	function onSearch() {
		loading.value = true
		findDeploymentPage(form)
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
	 * 删除部署的流程
	 * @param row 流程部署数据
	 */
	function handleDelete(row: PageProcessDeploymentResponse) {
		undeploy(row.id).then(() => {
			ElNotification({
				title: '删除成功',
				message: `流程部署 ${row.name} 删除成功`,
				type: 'success',
			})
			onSearch()
		})
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

	onMounted(onSearch)

	return {
		form,
		columns,
		loading,
		onSearch,
		dataList,
		pagination,
		handleDelete,
		handleSizeChange,
		handleCurrentChange,
	}
}
