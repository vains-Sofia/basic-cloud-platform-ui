<script setup lang="ts">
import Search from '~icons/ep/search'
import { useRouter } from 'vue-router'
import SmartTable from '@/components/SmartTable'
import { computed, nextTick, onMounted, ref } from 'vue'
import type { FindSysDictItemResponse } from '@/api/types/DictTypes'
import { useApiScanRecord } from '@/views/system/api-scan/utils/ApiScanHook'

import Scan2Line from '~icons/ri/scan-2-line'
const router = useRouter()
// 响应式数据
const dialogVisible = ref(false)
const searchText = ref('')
const selectedModules = ref<string[]>([])

// 计算属性
const filteredModules = computed(() => {
	if (!searchText.value) {
		return moduleOptions.value
	}
	return moduleOptions.value.filter(
		(module: FindSysDictItemResponse) =>
			module.itemCode.toLowerCase().includes(searchText.value.toLowerCase()) ||
			module.itemName.toLowerCase().includes(searchText.value.toLowerCase()),
	)
})

// 处理扫描确认
const handleConfirm = () => {
	if (selectedModules.value.length === 0) {
		ElMessage({ type: 'error', message: `请至少选择一个模块` })
		return
	}

	// 判断是否带有全部
	const modulesToScan = selectedModules.value.includes('all') ? [] : selectedModules.value

	startScan(modulesToScan)
	dialogVisible.value = false
	selectedModules.value = []
}

// 跳转到接口列表
const handleRecordClick = (id: string) => {
	router.push({ name: 'ApiEndpoints', query: { id } }).catch().finally()
}

// 页面加载后执行
onMounted(() => {
	nextTick(() => {
		scanRecordTable()
	})
})

const {
	startScan,
	resetScanForm,
	scanLoading,
	recordPagination,
	recordTableLoading,
	handleRecordSizeChange,
	handleRecordCurrentChange,
	moduleOptions,
	startEndTimes,
	shortcuts,
	scanRecordColumns,
	scanRecordTable,
	scanRecords,
	importSelected,
} = useApiScanRecord()

const searchForm = ref()
</script>

<template>
	<div>
		<el-form
			inline
			ref="searchForm"
			class="p-4 pl-6 mb-2 search-form"
			style="background-color: var(--el-bg-color)"
		>
			<el-form-item label="开始时间" prop="startTime">
				<el-date-picker
					v-model="startEndTimes"
					type="datetimerange"
					:shortcuts="shortcuts"
					value-format="YYYY-MM-DD HH:mm:ss"
					range-separator="至"
					start-placeholder="开始日期时间"
					end-placeholder="结束日期时间"
					:popper-options="{
						placement: 'bottom-start',
					}"
				/>
			</el-form-item>
			<el-form-item>
				<el-button
					type="primary"
					@click="scanRecordTable"
					:loading="recordTableLoading"
					:icon="Search"
				>
					查询
				</el-button>
				<el-button plain @click="resetScanForm(searchForm)">
					<Icon icon="ep:refresh" /> 重置
				</el-button>
			</el-form-item>
		</el-form>
		<SmartTable
			title="接口扫描"
			:data="scanRecords"
			:columns="scanRecordColumns"
			:loading="recordTableLoading"
			:pagination="recordPagination"
			style="width: 100%"
			:header-cell-style="{
				color: 'var(--el-text-color-primary)',
			}"
			@refresh="scanRecordTable"
			@size-change="handleRecordSizeChange"
			@current-change="handleRecordCurrentChange"
		>
			<template #toolbarSlot>
				<el-button
					class="reset-margin"
					type="primary"
					:icon="Scan2Line"
					:loading="scanLoading"
					@click="dialogVisible = true"
				>
					扫描接口
				</el-button>
			</template>

			<!-- 操作列 -->
			<template #operation="{ row }">
				<el-button type="primary" size="small" @click="handleRecordClick(row.id)">
					<Icon icon="ep:view" /> 详情
				</el-button>
				<el-popconfirm title="是否确认导入?" @confirm="importSelected(row)">
					<template #reference>
						<el-button type="success" size="small"> 导入权限表 </el-button>
					</template>
				</el-popconfirm>
			</template>
		</SmartTable>

		<!-- 模块选择弹框 -->
		<el-dialog v-model="dialogVisible" title="选择模块" width="500px">
			<!-- 搜索框 -->
			<el-input
				v-model="searchText"
				placeholder="搜索模块..."
				:prefix-icon="Search"
				style="margin-bottom: 20px"
				clearable
			/>

			<!-- 模块列表 -->
			<el-scrollbar height="300px">
				<el-checkbox-group v-model="selectedModules">
					<!-- 全部选项 -->
					<div
						style="
							display: block;
							margin-bottom: 15px;
							padding: 10px;
							border: 1px solid #e4e7ed;
							border-radius: 4px;
						"
					>
						<el-checkbox value="all">
							<div style="display: flex; align-items: center" class="ml-2">
								<div>
									<div style="font-weight: 500">全部</div>
									<div style="font-size: 12px; color: #909399">
										包含所有可用模块
									</div>
								</div>
							</div>
						</el-checkbox>
					</div>

					<!-- 具体模块选项 -->
					<div
						v-for="module in filteredModules"
						:key="module.id"
						style="
							display: block;
							margin-bottom: 10px;
							padding: 10px;
							border: 1px solid #e4e7ed;
							border-radius: 4px;
						"
					>
						<el-checkbox :value="module.itemCode">
							<div style="display: flex; align-items: center" class="ml-2">
								<div>
									<div style="font-weight: 500">{{ module.itemCode }}</div>
									<div style="font-size: 12px; color: #909399">
										{{ module.itemName }}
									</div>
								</div>
							</div>
						</el-checkbox>
					</div>
				</el-checkbox-group>
			</el-scrollbar>

			<!-- 空状态 -->
			<el-empty
				v-if="filteredModules.length === 0"
				description="没有找到匹配的模块"
				:image-size="80"
			/>

			<!-- 底部操作按钮 -->
			<template #footer>
				<div style="text-align: right">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleConfirm">确定</el-button>
				</div>
			</template>
		</el-dialog>
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
