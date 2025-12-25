<script setup lang="ts">
import { ref } from 'vue'
import View from '~icons/ep/view'
import Search from '~icons/ep/search'
import SmartTable from '@/components/SmartTable'
import { useProcessForm } from '@/views/workflow/form/utils/hooks.tsx'

const {
	form,
	columns,
	loading,
	onSearch,
	dataList,
	pagination,
	handleDelete,
	handleSizeChange,
	openPreviewPanel,
	openDesignerPanel,
	handleCurrentChange,
	formDetailLoadingMap,
} = useProcessForm()

const searchForm = ref()
</script>

<template>
	<div>
		<el-form
			inline
			ref="searchForm"
			:model="form"
			class="p-4 pl-6 mb-2 search-form"
			style="background-color: var(--el-bg-color)"
		>
			<el-form-item label="表单名称" prop="name">
				<el-input v-model="form.title" placeholder="请输入流程实例名称" clearable />
			</el-form-item>
			<el-form-item label="表单描述" prop="category">
				<el-input v-model="form.description" placeholder="请输入流程实例分类" clearable />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSearch" :loading="loading" :icon="Search">
					查询
				</el-button>
				<el-button plain @click="() => searchForm?.resetFields()">
					<Icon icon="ep:refresh" /> 重置
				</el-button>
			</el-form-item>
		</el-form>

		<SmartTable
			title="表单管理"
			:data="dataList"
			:columns="columns"
			:loading="loading"
			:pagination="pagination"
			style="width: 100%"
			:header-cell-style="{
				color: 'var(--el-text-color-primary)',
			}"
			@refresh="onSearch"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		>
			<template #toolbarSlot>
				<el-button class="reset-margin" type="primary" @click="openDesignerPanel()">
					<Icon icon="ep:circle-plus" /> 新增
				</el-button>
			</template>

			<!-- 操作列 -->
			<template #operation="{ row }">
				<!-- 修改 -->
				<el-button class="reset-margin" link type="primary" @click="openDesignerPanel(row)">
					<Icon icon="ep:edit-pen" /> 修改
				</el-button>

				<!-- 修改 -->
				<el-button
					class="reset-margin"
					link
					type="primary"
					@click="openPreviewPanel(row)"
					:icon="View"
					:loading="formDetailLoadingMap[row.id]"
				>
					预览
				</el-button>

				<!-- 删除 -->
				<el-popconfirm
					:title="`是否确认删除表单 ${row.title} ？`"
					@confirm="handleDelete(row)"
				>
					<template #reference>
						<el-button class="reset-margin" link type="primary">
							<Icon icon="ep:delete" /> 删除
						</el-button>
					</template>
				</el-popconfirm>
			</template>
		</SmartTable>
	</div>
</template>

<style scoped>
.el-form-item {
	margin-bottom: 0;
}
.search-form .el-input {
	--el-input-width: 220px;
}

span svg {
	margin-right: 5px;
}
</style>
