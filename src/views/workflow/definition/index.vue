<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Search from '~icons/ep/search'
import SmartTable from '@/components/SmartTable'
import { useProcessDefinition } from '@/views/workflow/definition/utils/hooks.tsx'

const {
	form,
	columns,
	loading,
	onSearch,
	dataList,
	pagination,
	openUpdatePanel,
	handleSizeChange,
	handleCurrentChange,
} = useProcessDefinition()

const searchForm = ref()

onMounted(onSearch)
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
			<el-form-item label="流程定义名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入流程定义名称" clearable />
			</el-form-item>
			<el-form-item label="流程定义分类" prop="category">
				<el-input v-model="form.category" placeholder="请输入流程定义分类" clearable />
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="form.status" placeholder="请选择" clearable class="!w-[180px]">
					<el-option label="草稿" :value="0" />
					<el-option label="发布" :value="1" />
					<el-option label="禁用" :value="2" />
				</el-select>
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
			title="流程定义管理"
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
				<el-button class="reset-margin" type="primary" @click="openUpdatePanel('新增')">
					<Icon icon="ep:circle-plus" /> 添加流程定义
				</el-button>
			</template>
		</SmartTable>
	</div>
</template>

<style scoped>
.el-form-item {
	margin-bottom: 0;
}
.search-form .el-input {
	--el-input-width: 200px;
}

span svg {
	margin-right: 5px;
}
</style>
