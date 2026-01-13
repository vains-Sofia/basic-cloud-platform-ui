<script setup lang="ts">
import SmartTable from '@/components/SmartTable'
import Reading from '~icons/ep/reading'
import CloseCircleLine from '~icons/ri/close-circle-line'
import { useMine } from '@/views/workflow/mine/utils/hooks.tsx'

const {
	columns,
	loading,
	onSearch,
	dataList,
	pagination,
	cancelProcess,
	cancelLoadingMap,
	handleSizeChange,
	handleCurrentChange,
} = useMine()
</script>

<template>
	<div>
		<SmartTable
			title="我发起的流程"
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
				<!-- TODO 详情 -->
				<el-button class="reset-margin" link type="primary" :icon="Reading">
					详情
				</el-button>
				<!-- 取消 -->
				<el-button
					v-if="!row.ended"
					class="reset-margin"
					link
					type="primary"
					@click="cancelProcess(row)"
					:icon="CloseCircleLine"
					:loading="cancelLoadingMap[row.processInstanceId]"
				>
					取消
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
