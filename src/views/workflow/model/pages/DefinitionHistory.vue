<script setup lang="ts">
import SmartTable from '@/components/SmartTable'
import { useHistory } from '@/views/workflow/model/utils/HistoryHooks.tsx'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const {
	form,
	loading,
	dataList,
	pagination,
	historyColumns,
	onSearch,
	handleSizeChange,
	handleCurrentChange,
} = useHistory()

onMounted(() => {
	const route = useRoute()
	form.processKey = route.query.processKey as string
	onSearch()
})
</script>

<template>
	<SmartTable
		title="流程定义历史"
		:data="dataList"
		:columns="historyColumns"
		:loading="loading"
		:pagination="pagination"
		style="width: 100%"
		:header-cell-style="{
			color: 'var(--el-text-color-primary)',
		}"
		@refresh="onSearch"
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
	/>
</template>

<style scoped></style>
