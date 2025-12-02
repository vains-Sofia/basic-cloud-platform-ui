import { reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import { openDrawer } from '@/components/CommonDrawer'
import DefinitionUpdateForm from '../pages/DefinitionUpdateForm.vue'
import type {
	PageProcessDefinitionResponse,
	ProcessDefinitionResponse,
	PublishProcessResponse,
} from '@/api/types/ProcessDefinitionTypes.ts'
import { DefinitionStatusEnum, DefinitionStatusEnumLabels } from '@/api/types/Enums.ts'
import {
	deleteProcessDefinition,
	disableProcessDefinition,
	enableProcessDefinition,
	findDefinitionPage,
	publishProcessDefinition,
	saveProcessDefinition,
	updateProcessDefinition,
} from '@/api/workflow/ProcessDefinition.ts'
import { openDialog } from '@/components/CommonDialog'
import router from '@/router'
import { ElButton } from 'element-plus'
import { Icon } from '@iconify/vue'

export function useProcessDefinition() {
	// 表格是否加载中
	const loading = ref(true)
	// 修改表单实例
	const formRef = ref<InstanceType<typeof DefinitionUpdateForm>>()
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
		status: undefined,
		current: pagination.currentPage,
		size: pagination.pageSize,
	})

	/**
	 * 表格列定义
	 */
	const columns: TableColumn[] = [
		{
			title: '流程定义Key',
			dataKey: 'processKey',
			align: 'center',
			minWidth: 290,
		},
		{
			title: '流程定义名称',
			dataKey: 'processName',
			align: 'center',
			minWidth: 100,
		},
		{
			title: '版本号',
			dataKey: 'version',
			align: 'center',
			width: 100,
			formatter: ({ version }) => <ElTag>{version}</ElTag>,
		},
		{
			title: '分类',
			dataKey: 'category',
			align: 'center',
			width: 80,
		},
		{
			title: '状态',
			dataKey: 'status',
			align: 'center',
			formatter: ({ status }: ProcessDefinitionResponse) => (
				<ElTag type={getTagTypeByStatus(status)}>
					{DefinitionStatusEnumLabels[status]}
				</ElTag>
			),
		},
		{
			title: '说明',
			dataKey: 'remark',
			minWidth: 90,
			showOverflowTooltip: true,
		},
		{
			title: '修改时间',
			dataKey: 'updateTime',
			minWidth: 150,
			align: 'center',
		},
		{
			title: '操作',
			dataKey: 'operation',
			fixed: 'right',
			width: 230,
			formatter: (row) => renderButtons(row),
		},
	]

	/**
	 * 渲染操作按钮
	 * @param row 行数据
	 * @param type 根据type决定渲染的按钮
	 */
	const renderButtons = (row: PageProcessDefinitionResponse, type: string = 'ListPage') => {
		if (type !== 'ListPage') {
			return (
				<ElButton class="reset-margin" link type="success">
					<Icon class="mr-1" icon="ri:arrow-go-back-line" /> 回退
				</ElButton>
			)
		}
		return (
			<>
				{/* 发布按钮 - 仅草稿状态显示 */}
				{row.status !== DefinitionStatusEnum.DISABLED && (
					<ElButton
						class="reset-margin"
						link
						type="success"
						onClick={() => publishDefinition(row)}
					>
						<Icon class="mr-1" icon="ep:promotion" /> 发布
					</ElButton>
				)}

				{/* 修改按钮 */}
				<ElButton
					class="reset-margin"
					link
					type="primary"
					onClick={() => openUpdatePanel('修改', row)}
				>
					<Icon class="mr-1" icon="ep:edit-pen" /> 修改
				</ElButton>

				{/* 删除按钮 */}
				<ElPopconfirm
					title={`是否确认删除流程定义-${row.processName}？`}
					onConfirm={() => handleDelete(row)}
				>
					{{
						reference: () => (
							<ElButton class="reset-margin" link type="danger">
								<Icon class="mr-1" icon="ep:delete" /> 删除
							</ElButton>
						),
					}}
				</ElPopconfirm>

				{/* 绘制按钮 - 非禁用状态显示 */}
				{row.status !== DefinitionStatusEnum.DISABLED && (
					<ElButton
						class="reset-margin"
						link
						type="primary"
						onClick={() => toProcessDesigner(row)}
					>
						<Icon class="mr-1" icon="ri:pencil-ruler-2-line" /> 绘制
					</ElButton>
				)}

				{/* 历史按钮 */}
				<ElButton
					class="reset-margin"
					link
					type="primary"
					onClick={() => toDefinitionHistory(row)}
				>
					<Icon class="mr-1" icon="ri:history-line" /> 历史
				</ElButton>

				{/* 禁用按钮 - 非禁用状态显示 */}
				{row.status !== DefinitionStatusEnum.DISABLED && (
					<ElButton
						class="reset-margin"
						link
						type="info"
						onClick={() => toggleDefinitionStatus(row, DefinitionStatusEnum.DISABLED)}
					>
						<Icon class="mr-1" icon="fa7-solid:toggle-off" /> 禁用
					</ElButton>
				)}

				{/* 启用按钮 - 禁用状态显示 */}
				{row.status === DefinitionStatusEnum.DISABLED && (
					<ElButton
						class="reset-margin"
						link
						type="primary"
						onClick={() => toggleDefinitionStatus(row, DefinitionStatusEnum.DRAFT)}
					>
						<Icon class="mr-1" icon="fa7-solid:toggle-on" /> 启用
					</ElButton>
				)}
			</>
		)
	}

	/**
	 * 根据流程定义状态获取标签类型
	 * @param status 状态
	 */
	const getTagTypeByStatus = (status: number) => {
		switch (status) {
			case 0:
				return 'primary'
			case 1:
				return 'success'
			case 2:
				return 'danger'
			default:
				return 'info'
		}
	}

	/**
	 * 列表数据加载
	 */
	function onSearch() {
		loading.value = true
		findDefinitionPage(form)
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
	 * 删除流程定义
	 * @param row 流程定义数据
	 */
	function handleDelete(row: PageProcessDefinitionResponse) {
		deleteProcessDefinition(row.processKey).then(() => {
			ElMessage({ type: 'success', message: `您删除了流程定义-${row.processName}` })
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
	 * 打开新增、修改框
	 * @param title 新增/修改
	 * @param row 角色数据
	 */
	const openUpdatePanel = (title = '新增', row?: PageProcessDefinitionResponse) => {
		openDrawer({
			title: `${title}流程定义`,
			bodyPadding: 20,
			size: '700px',
			confirmLoading: true,
			content: () => (
				<DefinitionUpdateForm
					ref={formRef}
					formInline={row ? JSON.parse(JSON.stringify(row)) : undefined}
				/>
			),
			onConfirm(close, closeLoading) {
				const updateFormRef = formRef.value?.getRef()
				const formData = formRef.value?.getData()?.value

				function chores() {
					ElMessage({
						type: 'success',
						message: `您${title}了流程定义-${formData?.processName}`,
					})
					close() // 关闭弹框
					onSearch() // 刷新表格数据
				}

				updateFormRef.validate((valid: unknown) => {
					if (valid) {
						if (!formData) {
							ElMessage.error('数据错误，请刷新后重试.')
							closeLoading()
							return
						}
						// 表单规则校验通过
						if (title === '新增') {
							// 添加流程定义
							saveProcessDefinition(formData)
								.then(() => chores())
								.finally(() => closeLoading())
						} else {
							if (!row) {
								ElMessage.error('数据错误，请刷新后重试.')
								closeLoading()
								return
							}
							// 修改流程定义元数据
							updateProcessDefinition(row.id, formData)
								.then(() => chores())
								.finally(() => closeLoading())
						}
					} else {
						closeLoading()
					}
				})
			},
		})
	}

	/**
	 * 打开流程定义历史弹框
	 * @param row 角色数据
	 */
	const toDefinitionHistory = (row: PageProcessDefinitionResponse) => {
		router.push({ name: 'DefinitionHistory', query: { processKey: row.processKey } }).then()
	}

	/**
	 * 发布流程设计
	 * @param row 流程设计数据
	 */
	const publishDefinition = (row: PageProcessDefinitionResponse) => {
		const remark = ref(row.remark || '')
		openDialog({
			title: `发布流程定义`,
			width: '50vw',
			destroyOnClose: true,
			confirmLoading: true,
			content: () => (
				<div>
					<ElDescriptions border direction="vertical" labelWidth="60%">
						<ElDescriptionsItem label="Process Key">
							{row.processKey}
						</ElDescriptionsItem>
						<ElDescriptionsItem label="版本">{row.version}</ElDescriptionsItem>
					</ElDescriptions>
					<ElFormItem class="mt-5" label="发布描述" labelPosition="top">
						<ElInput
							v-model={remark.value}
							placeholder={'请输入发布描述'}
							rows={6}
							type="textarea"
							maxlength={500}
							showWordLimit
						/>
					</ElFormItem>
				</div>
			),
			onConfirm: (close, closeLoading) => {
				closeLoading()
				publishProcessDefinition(row.id, { remark: remark.value })
					.then((res: PublishProcessResponse) => {
						ElNotification({
							title: '发布成功',
							message: `${res.processKey} - ${res.version} 已发布成功`,
							type: 'success',
						})
						onSearch()
						close()
					})
					.finally(() => closeLoading())
			},
		})
	}

	/**
	 * 根据状态决定启用还是禁用
	 * @param row 行数据
	 * @param status 状态
	 */
	const toggleDefinitionStatus = (
		row: PageProcessDefinitionResponse,
		status: DefinitionStatusEnum,
	) => {
		if (status === DefinitionStatusEnum.DRAFT) {
			enableProcessDefinition(row.id).then(() => {
				ElNotification({
					title: '启用成功',
					message: `流程定义 ${row.processKey} - ${row.version} 已启用`,
					type: 'success',
				})
				onSearch()
			})
		} else {
			disableProcessDefinition(row.id).then(() => {
				ElNotification({
					title: '禁用成功',
					message: `流程定义 ${row.processKey} - ${row.version} 已禁用`,
					type: 'success',
				})
				onSearch()
			})
		}
	}

	const toProcessDesigner = (row: PageProcessDefinitionResponse) => {
		router.push({ name: 'ProcessDesigner', query: { processKey: row.processKey } }).then()
	}

	return {
		form,
		columns,
		loading,
		onSearch,
		dataList,
		pagination,
		handleDelete,
		renderButtons,
		openUpdatePanel,
		handleSizeChange,
		publishDefinition,
		handleCurrentChange,
		toggleDefinitionStatus,
	}
}
