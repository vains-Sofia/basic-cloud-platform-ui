import { onMounted, reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import type { PageProcessFormResponse } from '@/api/types/ProcessFormTypes.ts'
import {
	deleteProcessForm,
	getProcessFormById,
	pageProcessForm,
} from '@/api/workflow/ProcessForm.ts'
import { openDialog } from '@/components/CommonDialog'
import FormDesignerPage from '@/views/workflow/form/pages/FormDesignerPage.vue'
import { generateUUID } from '@/utils/Common.ts'
import { FormViewer } from '@/components/FormDesigner'

export function useProcessForm() {
	// 表格是否加载中
	const loading = ref(true)
	// 表格数据列表
	const dataList = ref<PageProcessFormResponse[]>([])
	// 获取详情加载状态
	const formDetailLoadingMap = ref<Record<string, boolean>>({})
	// 表格分页
	const pagination = reactive<TablePagination>({
		total: 0,
		pageSize: 15,
		currentPage: 1,
		pageSizes: [10, 15, 20, 50, 100]
	})

	/**
	 * 搜索入参
	 */
	const form = reactive({
		title: '',
		description: '',
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
			title: '表单 ID',
			dataKey: 'id',
			align: 'center',
		},
		{
			title: '表单名称',
			dataKey: 'title',
			align: 'center',
		},
		{
			title: '表单描述',
			dataKey: 'description',
		},
		{
			title: '修改时间',
			dataKey: 'updateTime',
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
		pageProcessForm(form)
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
	function handleDelete(row: PageProcessFormResponse) {
		deleteProcessForm(row.id).then(() => {
			ElNotification({
				title: '删除成功',
				message: `表单 ${row.title} 删除成功`,
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

	/**
	 * 打开设计器
	 */
	const openDesignerPanel = (row?: PageProcessFormResponse) => {
		const dialogId = generateUUID()
		openDialog({
			id: dialogId,
			fullscreen: true,
			hideFooter: true,
			showClose: false,
			content: <FormDesignerPage dialog-id={dialogId} formId={row?.id} />,
			onCancel: () => onSearch(),
		})
	}

	/**
	 * 打开设计器
	 */
	const openPreviewPanel = (row: PageProcessFormResponse) => {
		formDetailLoadingMap.value[row.id] = true
		getProcessFormById(row.id)
			.then((res) =>
				openDialog({
					title: '预览表单',
					content: <FormViewer formJson={res.formContent} />,
				}),
			)
			.finally(() => (formDetailLoadingMap.value[row.id] = false))
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
		openPreviewPanel,
		handleSizeChange,
		openDesignerPanel,
		handleCurrentChange,
		formDetailLoadingMap,
	}
}
