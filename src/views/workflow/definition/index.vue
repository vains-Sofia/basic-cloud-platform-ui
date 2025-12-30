<script setup lang="ts">
import { ref } from 'vue'
import Search from '~icons/ep/search'
import CodeView from '~icons/ri/code-view'
import VideoPlay from '~icons/ep/video-play'
import SmartTable from '@/components/SmartTable'
import { useProcessDefinition } from '@/views/workflow/definition/utils/hooks.tsx'

const {
	form,
	columns,
	loading,
	onSearch,
	dataList,
	pagination,
	viewBpmnXml,
	changeSuspension,
	handleSizeChange,
	bpmnXmlLoadingMap,
	startProcessByKey,
	handleCurrentChange,
	startProcessLoadingMap,
} = useProcessDefinition()

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
			<el-form-item label="流程实例名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入流程实例名称" clearable />
			</el-form-item>
			<el-form-item label="流程定义key" prop="processDefinitionKey">
				<el-input v-model="form.processKey" placeholder="请输入流程定义key" clearable />
			</el-form-item>
			<el-form-item label="状态" prop="active">
				<el-select v-model="form.active" placeholder="请选择" clearable class="!w-[180px]">
					<el-option label="激活" :value="true" />
					<el-option label="挂起" :value="false" />
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
			<!-- 操作列 -->
			<template #operation="{ row }">
				<!-- 查看详情 -->
				<el-button
					class="reset-margin"
					link
					type="primary"
					:icon="VideoPlay"
					@click="startProcessByKey(row)"
					:loading="startProcessLoadingMap[row.id]"
				>
					发起
				</el-button>
				<!-- 激活 -->
				<el-button
					v-if="row.suspended"
					class="reset-margin"
					link
					type="primary"
					@click="changeSuspension(row, true)"
				>
					<Icon icon="fa7-solid:toggle-on" /> 激活
				</el-button>
				<!-- 挂起 -->
				<el-button
					v-else
					class="reset-margin"
					link
					type="warning"
					@click="changeSuspension(row, false)"
				>
					<Icon icon="fa7-solid:toggle-off" /> 挂起
				</el-button>
				<!-- 查看xml -->
				<el-button
					class="reset-margin"
					link
					type="primary"
					@click="viewBpmnXml(row)"
					:loading="bpmnXmlLoadingMap[row.id]"
					:icon="CodeView"
				>
					xml
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
