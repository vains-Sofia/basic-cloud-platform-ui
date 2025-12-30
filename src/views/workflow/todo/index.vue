<script setup lang="ts">
import SmartTable from '@/components/SmartTable'
import { useTodo } from '@/views/workflow/todo/utils/hooks.tsx'

const {
	columns,
	loading,
	approve,
	onSearch,
	dataList,
	pagination,
	handleSizeChange,
	handleCurrentChange,
} = useTodo()
</script>

<template>
	<div>
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
			<!-- 操作列 -->
			<template #operation="{ row }">
				<!-- 修改 -->
				<el-button class="reset-margin" link type="primary" @click="approve(row)">
					<Icon icon="ep:edit-pen" /> 办理
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
	--el-input-width: 220px;
}

span svg {
	margin-right: 5px;
}
</style>
