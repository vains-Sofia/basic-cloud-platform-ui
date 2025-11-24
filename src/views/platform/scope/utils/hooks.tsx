import { onMounted, reactive, ref } from 'vue'
import type { TableColumn, TablePagination } from '@/components/SmartTable'
import { openDrawer } from '@/components/CommonDrawer'
import ScopeMenu from '../form/ScopeMenu.vue'
import ScopeUpdateForm from '../form/ScopeUpdateForm.vue'
import type { FindPermissionResponse } from '@/api/types/PermissionTypes.ts'
import { getMenuList } from '@/api/system/Permission.ts'
import {
	getScopeList,
	insertScope,
	removeScopeById,
	updateScope,
	updateScopePermissions,
} from '@/api/platform/Scope.ts'
import type { FindScopeResponse, SaveScopeRequest } from '@/api/types/ScopeTypes.ts'

export function useScope() {
	// 表格是否加载中
	const loading = ref(true)
	// 角色权限实例
	const scopeMenuRef = ref<InstanceType<typeof ScopeMenu>>()
	// 修改表单实例
	const formRef = ref<InstanceType<typeof ScopeUpdateForm>>()
	// 表格数据列表
	const dataList = ref<FindScopeResponse[]>([])
	// 所有菜单列表
	const allMenus = ref<Array<FindPermissionResponse>>([])
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
		name: "",
		scope: "",
		current: pagination.currentPage,
		size: pagination.pageSize,
	})

	/**
	 * 表格列定义
	 */
	const columns: TableColumn[] = [
		{
			title: 'Scope编号',
			dataKey: 'id',
			align: 'center',
		},
		{
			title: 'Scope名称',
			dataKey: 'name',
			align: 'center',
		},
		{
			title: 'Scope编码',
			dataKey: 'scope',
			align: 'center',
		},
		{
			title: '备注',
			dataKey: 'description',
			minWidth: 150,
			showOverflowTooltip: true,
		},
		{
			title: '创建时间',
			dataKey: 'createTime',
			minWidth: 100,
			align: 'center',
		},
		{
			title: '操作',
			dataKey: 'operation',
			fixed: 'right',
			width: 210,
			slot: 'operation',
		},
	]

	/**
	 * 列表数据加载
	 */
	function onSearch() {
		loading.value = true
		getScopeList(form)
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
	 * 删除角色
	 * @param row 角色数据
	 */
	function handleDelete(row: FindScopeResponse) {
		removeScopeById(row.id).then(() => {
			ElMessage({ type: 'success', message: `您删除了Scope名称为${row.name}的这条数据` })
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
	const openUpdatePanel = (title = '新增', row?: FindScopeResponse) => {
		openDrawer({
			title: `${title} Scope`,
			bodyPadding: 20,
			confirmLoading: true,
			content: () => <ScopeUpdateForm ref={formRef} formInline={row as SaveScopeRequest} />,
			onConfirm(close, closeLoading) {
				const updateFormRef = formRef.value?.getRef()
				const formData = formRef.value?.getData()?.value

				function chores() {
					ElMessage({
						type: 'success',
						message: `您${title}了Scope名称为${formData.name}的这条数据`,
					})
					close() // 关闭弹框
					onSearch() // 刷新表格数据
				}

				updateFormRef.validate((valid: unknown) => {
					if (valid) {
						// 表单规则校验通过
						if (title === '新增') {
							// 添加角色
							insertScope(formData)
								.then(() => chores())
								.finally(() => closeLoading())
						} else {
							// 修改角色
							updateScope(formData)
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

	const openMenuPanel = (row: FindScopeResponse) => {
		const formInline = {
			scope: row.scope,
			allMenus: allMenus.value,
		}
		openDrawer({
			title: `菜单权限${row?.scope ? `（${row.scope}）` : ''}`,
			bodyPadding: 20,
			confirmLoading: true,
			content: () => <ScopeMenu formInline={formInline} ref={scopeMenuRef} />,
			onConfirm(close, closeLoading) {
				// 选中的key
				const permissionsId = [
					...scopeMenuRef.value?.getTreeRef().getCheckedKeys(),
					...scopeMenuRef.value?.getTreeRef().getHalfCheckedKeys(),
				]
				updateScopePermissions({ scope: row.scope, permissionsId })
					.then(() =>
						ElMessage({
							type: 'success',
							message: `Scope名称为${row.name}的菜单权限修改成功`,
						}),
					)
					.finally(() => closeLoading())
			},
		})
	}

	onMounted(() => {
		onSearch()
		getMenuList().then((menus) => {
			allMenus.value = menus
		})
	})

	return {
		form,
		columns,
		loading,
		onSearch,
		dataList,
		pagination,
		handleDelete,
		openMenuPanel,
		openUpdatePanel,
		handleSizeChange,
		handleCurrentChange,
	}
}
