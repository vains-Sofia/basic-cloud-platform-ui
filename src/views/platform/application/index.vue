<template>
	<div class="p-4">
		<!-- 顶部工具栏 -->
		<el-row class="mb-4" justify="space-between">
			<el-col :span="12">
				<el-button type="primary" @click="goToDetail(null)"> 新增客户端 </el-button>
			</el-col>
			<el-col :span="12" style="text-align: right">
				<el-input
					v-model="applicationName"
					v-debounce:input="{ handler: handleSearch, wait: 400 }"
					placeholder="请输入名称搜索"
					clearable
					style="max-width: 240px"
					@clear="handleSearch"
				>
					<template #prefix>
						<el-icon>
							<Search />
						</el-icon>
					</template>
				</el-input>
			</el-col>
		</el-row>

		<!-- 卡片列表 -->
		<el-row :gutter="16">
			<template v-if="list.length > 0">
				<el-col
					v-for="item in list"
					:key="item.id"
					:xs="24"
					:sm="12"
					:md="8"
					:lg="6"
					class="mb-4"
				>
					<el-card
						class="client-card"
						shadow="hover"
						:body-style="{ padding: '20px' }"
						@click="goToDetail(item.id)"
					>
						<!-- 客户端Logo和名称 -->
						<div class="card-header">
							<el-image
								:src="item.clientLogo"
								fit="cover"
								class="logo client-logo"
								:preview-src-list="[item.clientLogo]"
								:preview-teleported="true"
							/>
							<div class="client-info">
								<h3 class="client-name line-clamp-1">{{ item.clientName }}</h3>
								<p class="card-time">
									<span>{{ formatDate(item.createTime) }}</span>
								</p>
							</div>
						</div>

						<!-- 应用id -->
						<div class="client-id line-clamp-1">ID:&nbsp;{{ item.clientId }}</div>

						<!-- 应用描述 -->
						<div class="card-description">
							<p>{{ item.description || '暂无描述' }}</p>
						</div>
					</el-card>
				</el-col>
			</template>

			<!-- 骨架屏 -->
			<template v-else-if="loading">
				<el-col
					v-for="n in pageSize"
					:key="'skeleton-' + n"
					:xs="24"
					:sm="12"
					:md="8"
					:lg="6"
					class="mb-4"
				>
					<el-card class="card-item">
						<div class="flex items-start space-x-4">
							<el-skeleton style="width: 56px; height: 56px" animated />
							<div class="flex-1">
								<el-skeleton :rows="3" animated />
							</div>
						</div>
					</el-card>
				</el-col>
			</template>
		</el-row>

		<!-- 触发器 -->
		<div ref="loadMoreTrigger" class="h-10" />

		<!-- 加载提示 -->
		<div
			v-if="loading && list.length > 0"
			class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm"
		>
			加载中...
		</div>
		<div
			v-if="finished && list.length > 0"
			class="text-center py-4 text-gray-400 dark:text-gray-500 text-sm"
		>
			已加载全部数据
		</div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Search from '~icons/ep/search'
import { useApplication } from './utils/hooks'

defineOptions({
	name: 'PlatformApplication',
})

const {
	list,
	loading,
	finished,
	pageSize,
	fetchData,
	formatDate,
	goToDetail,
	handleSearch,
	applicationName,
} = useApplication()

let observer: IntersectionObserver | null = null
const loadMoreTrigger = ref<HTMLElement | null>(null)

onMounted(() => {
	fetchData()
	if (!loadMoreTrigger.value) return

	observer = new IntersectionObserver((entries) => {
		const entry = entries[0]
		if (entry.isIntersecting) {
			fetchData()
		}
	})

	observer.observe(loadMoreTrigger.value)
})

onBeforeUnmount(() => {
	observer?.disconnect()
})
</script>

<style scoped>
.logo {
	width: 56px;
	height: 56px;
	border-radius: 8px;
	object-fit: cover;
}

.card-item:hover {
	transform: translateY(-2px);
}

.header h2 {
	margin: 0;
	color: var(--el-text-color-primary);
	font-size: 24px;
	font-weight: 600;
}

.client-card {
	cursor: pointer;
	transition: all 0.3s ease;
	border-radius: 12px;
	border: 1px solid var(--el-border-color-light);
}

.client-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

:deep(.dark) .client-card:hover {
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.card-header {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
}

.client-logo {
	margin-right: 12px;
	border: 2px solid var(--el-border-color-light);
}

.client-name {
	margin: 0 0 4px 0;
	font-size: 16px;
	font-weight: 600;
	color: var(--el-text-color-primary);
	line-height: 1.4;
}

.client-id {
	margin-bottom: 12px;
	font-size: 13px;
	color: var(--el-text-color-regular);
	text-overflow: ellipsis;
}

.card-time {
	margin: 0;
	font-size: 12px;
	color: var(--el-text-color-placeholder);
	display: flex;
	align-items: center;
}

.card-time .el-icon {
	margin-right: 6px;
	font-size: 14px;
}

.card-description p {
	margin: 0;
	font-size: 13px;
	color: var(--el-text-color-regular);
	line-height: 1.5;
	min-height: 3em;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.header h2 {
		font-size: 20px;
	}

	.client-card {
		margin-bottom: 15px;
	}
}
</style>
