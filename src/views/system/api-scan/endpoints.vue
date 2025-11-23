<script setup lang="ts">
import Search from '~icons/ep/search'
import { useRoute } from 'vue-router'
import { nextTick, onMounted, ref } from 'vue'
import SmartTable from '@/components/SmartTable'
import RemoteSelectV2 from '@/components/RemoteSelectV2/Index.vue'
import { useApiEndpoints } from '@/views/system/api-scan/utils/EndpointHook.tsx'
import { scanStatusSelect } from '@/views/system/api-scan/utils/Enums.ts'

const route = useRoute()

// 页面加载后执行
onMounted(() => {
	nextTick(() => {
		filterForm.scanBatchId = route.query.id as string
		loadData()
	})
})

const {
	columns,
	hasSelectedNewEndpoints,
	hasSelectedNonIgnoreEndpoints,
	selectedNewCount,
	selectedNonIgnoreCount,
	importBatch,
	ignoreBatch,
	tableData,
	pagination,
	selectedNum,
	tableLoading,
	loadData,
	scanRecordPage,
	handleSizeChange,
	handleCurrentChange,
	handleSelectionChange,
	onSelectionCancel,
	filterForm,
	moduleOptions,
	ignoreSelected,
	openDetailDialog,
} = useApiEndpoints()

const searchForm = ref()

const resetForm = () => {
	searchForm.value?.resetFields()
	loadData()
}
</script>

<template>
	<div>
		<el-form
			inline
			ref="searchForm"
			:model="filterForm"
			class="p-4 pb-1 pl-6 mb-2 search-form"
			style="background-color: var(--el-bg-color)"
		>
			<el-form-item label="关键字：" prop="keyword">
				<el-input
					v-model="filterForm.keyword"
					placeholder="搜索路径、权限码或描述"
					clearable
					class="!w-[180px]"
				/>
			</el-form-item>
			<el-form-item label="模块筛选：" prop="moduleName">
				<el-select
					v-model="filterForm.moduleName"
					placeholder="模块筛选"
					clearable
					style="width: 150px"
				>
					<el-option
						v-for="module in moduleOptions"
						:key="module.id"
						:label="module.itemName"
						:value="module.itemCode"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="扫描状态：" prop="scanStatus">
				<el-select
					v-model="filterForm.scanStatus"
					placeholder="扫描状态"
					clearable
					style="width: 150px"
				>
					<el-option
						v-for="status in scanStatusSelect"
						:key="status.label"
						:label="status.label"
						:value="status.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="导入状态：" prop="imported">
				<el-select
					v-model="filterForm.imported"
					placeholder="导入状态"
					clearable
					style="width: 150px"
				>
					<el-option :key="0" label="已导入" :value="true" />
					<el-option :key="1" label="未导入" :value="false" />
				</el-select>
			</el-form-item>
			<el-form-item label="导入批次：" :prop="route.query.id !== undefined ? '' : 'scanBatchId'">
				<RemoteSelectV2
					v-model="filterForm.scanBatchId"
					label-key="scanTime"
					clearable
					style="width: 260px"
					:disabled="route.query.id !== undefined"
					:fetch-function="scanRecordPage"
					:label-formatter="(item: any) => `${item.scanTime} - 总数: ${item.totalCount}`"
					placeholder="选择导入批次"
				/>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="loadData" :loading="tableLoading" :icon="Search">
					查询
				</el-button>
				<el-button plain @click="resetForm">
					<Icon icon="ep:refresh" /> 重置
				</el-button>
			</el-form-item>
		</el-form>

		<SmartTable
			title="接口列表"
			:data="tableData"
			:columns="columns"
			:loading="tableLoading"
			:pagination="pagination"
			style="width: 100%"
			:header-cell-style="{
				color: 'var(--el-text-color-primary)',
			}"
			@refresh="loadData"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			@selection-change="handleSelectionChange"
		>
			<template #toolbarSlot>
				<div v-if="selectedNum > 0" class="w-full flex items-center">
					<div class="flex-auto">
						<span
							style="font-size: var(--el-font-size-base)"
							class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
						>
							已选 {{ selectedNum }} 项
						</span>
						<el-button type="primary" text @click="onSelectionCancel">
							取消选择
						</el-button>
					</div>
					<el-popconfirm title="是否确认导入?" @confirm="importBatch">
						<template #reference>
							<el-button type="success" :disabled="!hasSelectedNewEndpoints">
								批量导入 ({{ selectedNewCount }})
							</el-button>
						</template>
					</el-popconfirm>
					<el-popconfirm title="是否确认忽略?" @confirm="ignoreBatch">
						<template #reference>
							<el-button type="warning" :disabled="!hasSelectedNonIgnoreEndpoints">
								批量忽略 ({{ selectedNonIgnoreCount }})
							</el-button>
						</template>
					</el-popconfirm>
				</div>
			</template>

			<!-- 操作列 -->
			<template #operation="{ row }">
				<el-button type="primary" size="small" @click="openDetailDialog(row)">
					<Icon icon="ep:view" /> 详情
				</el-button>
				<el-button v-if="row.scanStatus === 1 && !row.imported" type="success" size="small">
					<Icon icon="ep:plus" /> 导入
				</el-button>
				<el-button
					v-if="row.scanStatus !== 4 && !row.imported"
					type="danger"
					size="small"
					@click="ignoreSelected(row)"
				>
					<Icon icon="ep:warning" /> 忽略
				</el-button>
			</template>
		</SmartTable>
	</div>
</template>

<style scoped>
:deep(.el-dropdown-menu__item i) {
	margin: 0;
}

:deep(.el-button:focus-visible) {
	outline: none;
}
.el-form-item {
	margin-bottom: 12px;
}

span svg {
	margin-right: 5px;
}
</style>
