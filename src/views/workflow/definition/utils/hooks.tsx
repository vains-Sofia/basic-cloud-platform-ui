import { onMounted, reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import {
	changeSuspensionState,
	getBpmnXml,
	pageQuery,
} from '@/api/workflow/DeploymentDefinition.ts'
import type { PageProcessDefinitionResponse } from '@/api/types/ProcessDefinitionTypes.ts'
import { openDialog } from '@/components/CommonDialog'
import type { BasicFooterContext } from '@/stores/Plugins.ts'
import { startProcess } from '@/api/workflow/ProcessTask.ts'

export function useProcessDefinition() {
	// 表格是否加载中
	const loading = ref(true)
	// 获取bpmn xml加载状态
	const bpmnXmlLoadingMap = ref<Record<string, boolean>>({})
	// 获取bpmn xml加载状态
	const startProcessLoadingMap = ref<Record<string, boolean>>({})

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
		name: '',
		category: '',
		processKey: '',
		active: undefined,
		current: pagination.currentPage,
		size: pagination.pageSize,
	})

	/**
	 * 表格列定义
	 */
	const columns: TableColumn[] = [
		{
			title: '流程名称',
			dataKey: 'name',
			align: 'center',
			width: 150,
			formatter: ({ name }) => <span>{name ? name : '-'}</span>,
		},
		{
			title: '流程定义key',
			dataKey: 'key',
			minWidth: 285,
		},
		{
			title: '版本号',
			dataKey: 'version',
			align: 'center',
			minWidth: 60,
			formatter: ({ version }) => <ElTag>v{version}</ElTag>,
		},
		{
			title: '流程分类',
			dataKey: 'category',
			minWidth: 210,
		},
		{
			title: '状态',
			dataKey: 'suspended',
			align: 'center',
			formatter: ({ suspended }) => (
				<ElTag type={suspended ? 'warning' : 'success'}>
					{suspended ? '挂起' : '激活'}
				</ElTag>
			),
		},
		{
			title: '部署时间',
			dataKey: 'deploymentTime',
			minWidth: 130,
			align: 'center',
		},
		{
			title: '操作',
			fixed: 'right',
			width: 210,
			slot: 'operation',
			dataKey: 'operation',
		},
	]

	/**
	 * 列表数据加载
	 */
	function onSearch() {
		loading.value = true
		pageQuery(form)
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
	 * 改变流程定义状态
	 * @param row 流程定义行数据
	 * @param active 激活/挂起
	 */
	const changeSuspension = (row: PageProcessDefinitionResponse, active: boolean) => {
		let changeState
		if (active) {
			changeState = { state: 1 }
		} else {
			changeState = { state: 2 }
		}
		changeSuspensionState(row.id, changeState).then(() => {
			ElNotification({
				title: `${active ? '激活成功' : '挂起成功'}`,
				message: `流程定义 ${row.name ? row.name : row.key} ${active ? '激活成功' : '挂起成功'}`,
				type: 'success',
			})
			onSearch()
		})
	}

	/**
	 * 查看流程定义的BPMN XML
	 * @param row 流程定义
	 */
	const viewBpmnXml = (row: PageProcessDefinitionResponse) => {
		bpmnXmlLoadingMap.value[row.id] = true
		getBpmnXml(row.id)
			.then((bpmnXml) => {
				openDialog({
					title: 'BPMN 预览',
					draggable: true,
					top: '8vh',
					destroyOnClose: true,
					width: '60%',
					content: () => (
						<div v-highlight class="max-h-[70vh] overflow-auto">
							<pre>
								<code class="!whitespace-pre-wrap">{bpmnXml}</code>
							</pre>
						</div>
					),
					footerRenderer: ({ close } = {} as BasicFooterContext) => (
						<div class="flex justify-end">
							<ElButton plain onClick={close}>
								关闭
							</ElButton>
						</div>
					),
				})
			})
			.finally(() => (bpmnXmlLoadingMap.value[row.id] = false))
	}

	/**
	 * 去详情页面
	 * @param row 流程定义数据
	 */
	// const toProcessDetails = (row: PageProcessDefinitionResponse) => {
	// 	router.push({ name: 'ProcessDetails', query: { processDefinitionId: row.id } }).then()
	// }

	/**
	 * 发起流程
	 * @param row 流程定义数据
	 */
	const startProcessByKey = (row: PageProcessDefinitionResponse) => {
		if (!row.key) {
			ElNotification({
				title: `发起失败`,
				message: `流程定义 Key 不能为空.`,
				type: 'error',
			})
			return
		}
		startProcessLoadingMap.value[row.id] = true
		startProcess({ processDefinitionKey: row.key })
			.then((res) => console.log(res))
			.finally(() => (startProcessLoadingMap.value[row.id] = false))
	}

	onMounted(onSearch)

	return {
		form,
		columns,
		loading,
		onSearch,
		dataList,
		pagination,
		viewBpmnXml,
		changeSuspension,
		handleSizeChange,
		startProcessByKey,
		bpmnXmlLoadingMap,
		handleCurrentChange,
		startProcessLoadingMap,
	}
}
