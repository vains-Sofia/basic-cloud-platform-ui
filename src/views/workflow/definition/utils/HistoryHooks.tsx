import { useProcessDefinition } from '@/views/workflow/definition/utils/hooks.tsx'
import type { PageProcessDefinitionResponse } from '@/api/types/ProcessDefinitionTypes.ts'
import { getProcessDefinitionHistory } from '@/api/workflow/ProcessDefinition.ts'
import { reactive, ref } from 'vue'
import { deepClone } from '@/utils/Common.ts'
import type { TableColumn, TablePagination } from '@/components/SmartTable'

export function useHistory() {
	const { columns, renderButtons } = useProcessDefinition()

	// 表格是否加载中
	const loading = ref(true)
	// 表格数据列表
	const dataList = ref<PageProcessDefinitionResponse[]>([])
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
		processKey: '',
		current: pagination.currentPage,
		size: pagination.pageSize,
	})

	/**
	 * 历史版本列表定义
	 */
	const historyColumns: TableColumn[] = deepClone(columns).map((e) => {
		if (e.dataKey === 'operation') {
			e.width = 90
			e.formatter = (row) => renderButtons(row, 'HistoryPage')
		}
		return e
	})

	/**
	 * 列表数据加载
	 */
	function onSearch() {
		loading.value = true
		getProcessDefinitionHistory(form)
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

	return {
		form,
		loading,
		onSearch,
		dataList,
		pagination,
		historyColumns,
		handleSizeChange,
		handleCurrentChange,
	}
}
