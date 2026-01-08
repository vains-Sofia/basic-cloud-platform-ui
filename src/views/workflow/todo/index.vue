<script setup lang="ts">
import SmartTable from '@/components/SmartTable'
import EditPen from '~icons/ep/edit-pen'
import UserSharedLine from '~icons/ri/user-shared-2-line'
import UserReceivedLine from '~icons/ri/user-received-2-line'
import { useTodo } from '@/views/workflow/todo/utils/hooks.tsx'

const {
	columns,
	loading,
	approve,
	onSearch,
	dataList,
	claimTask,
	pagination,
	unclaimTask,
	claimLoadingMap,
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
				<!-- 办理 -->
				<el-button
					class="reset-margin"
					v-if="row.initiatorTask"
					link
					type="primary"
					:icon="EditPen"
					@click="approve(row)"
				>
					办理
				</el-button>
				<!-- 拾取 -->
				<el-button
					class="reset-margin"
					v-else-if="row.canClaim"
					link
					type="primary"
					:icon="UserReceivedLine"
					:loading="claimLoadingMap[row.taskId]"
					@click="claimTask(row)"
				>
					拾取
				</el-button>
				<!-- 归还 -->
				<el-button
					v-if="row.canUnclaim"
					:loading="claimLoadingMap[row.taskId]"
					class="reset-margin"
					link
					type="primary"
					:icon="UserSharedLine"
					@click="unclaimTask(row)"
				>
					归还
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
