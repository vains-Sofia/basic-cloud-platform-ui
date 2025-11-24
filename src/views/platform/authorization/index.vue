<script setup lang="ts">
import { ref } from 'vue'
import Search from '~icons/ep/search'
import SmartTable from '@/components/SmartTable'
import { useAuthorization } from '@/views/platform/authorization/utils/hooks.tsx'

const {
	form,
	columns,
	loading,
	onSearch,
	dataList,
	pagination,
	handleOffline,
	grantTypeDict,
	handleSizeChange,
	handleCurrentChange,
} = useAuthorization()

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
			<el-form-item label="客户端名称：">
				<el-input
					v-model="form.registeredClientId"
					placeholder="请输入客户端名称"
					clearable
					style="width: 200px"
				/>
			</el-form-item>
			<el-form-item label="授权模式：">
				<el-select
					v-model="form.authorizationGrantType"
					placeholder="请选择授权模式"
					clearable
					style="width: 200px"
				>
					<el-option
						v-for="grantType in grantTypeDict"
						:key="grantType.id"
						:label="grantType.itemName"
						:value="grantType.itemCode"
					/>
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
			title="认证管理"
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
				<el-button
					:disabled="!row.accessTokenValue"
					type="danger"
					size="small"
					:loading="row.offlineLoading"
					@click="handleOffline(row)"
				>
					<Icon icon="ri:logout-circle-r-line" />
					下线
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
