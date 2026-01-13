<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { getContainerHeight } from '@/utils/Common.ts'
import { FormViewer } from '@/components/FormDesigner'
import { getProcessTaskDetail, taskApprove } from '@/api/workflow/ProcessTask.ts'
import type { ProcessTaskDetailResponse } from '@/api/types/ProcessTaskTypes.ts'

// 图标
import CloseCircleLine from '~icons/ri/close-circle-line'
import CheckboxCircleLine from '~icons/ri/checkbox-circle-line'

import router from '@/router'
import type { FormProps } from 'element-plus'

const route = useRoute()
const taskId = route.query.taskId as string

// tab页面
const activeName = ref('approve')
// tab实例
const tabsRef = ref()
// 审批意见
const comment = ref('')
// 审批容器实例
const approveRef = ref<HTMLDivElement>()
// 审批容器高度
const approveHeight = ref(0)
// 审批页头部实例
const approveTitleRef = ref()
// 表单数据展示区高度
const formScrollbarHeight = computed(() => {
	if (approveTitleRef.value && tabsRef.value) {
		return (
			approveHeight.value -
			approveTitleRef.value.offsetHeight -
			tabsRef.value.tabNavRef.tabListRef.offsetHeight
		)
	}
	return 0
})

// 流程任务详情
const processTaskDetail = ref<ProcessTaskDetailResponse>()

// 审批通过loading
const approveLoading = ref(false)
// 审批loading
const rejectLoading = ref(false)

/**
 * 审批通过
 */
const approve = () => {
	approveLoading.value = true
	taskApprove({
		taskId,
		action: 'APPROVE',
		comment: comment.value,
	})
		.then(() => {
			ElNotification({
				title: '审批通过',
				message: `审批通过成功`,
				type: 'success',
			})
			handleBack()
		})
		.finally(() => (approveLoading.value = false))
}

const reject = () => {
	const approveRequest = {
		taskId,
		action: 'REJECT',
		comment: comment.value,
	}
	rejectLoading.value = true
	taskApprove(approveRequest)
		.then(() => {
			ElNotification({
				title: '提醒',
				message: `已拒绝`,
				type: 'success',
			})
			handleBack()
		})
		.finally(() => (rejectLoading.value = false))
}

onMounted(() => {
	approveHeight.value = getContainerHeight(approveRef) ?? 0
})

const initData = () => {
	if (!taskId) {
		ElNotification({
			title: '错误',
			message: `Task ID 不能为空`,
			type: 'error',
		})
		return
	}
	getProcessTaskDetail(taskId).then((res) => {
		processTaskDetail.value = res
	})
}

// 审批意见Label宽度设置
const commentLabelWidth = computed(() => {
	const finishedTasks = processTaskDetail.value?.finishedTasks
	if (finishedTasks && finishedTasks.length > 0) {
		const formContent = finishedTasks[finishedTasks.length - 1].formContent
		if (formContent) {
			try {
				const json = JSON.parse(formContent)
				return json.formConfig.labelWidth + json.formConfig.fieldPadding
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (e) {
				return 85
			}
		}
	}
	return 85
})

initData()

const handleBack = () => {
	router.go(-1)
}

const formProps = {
	disabled: true,
} as FormProps
</script>

<template>
	<div ref="approveRef" class="bg-(--el-bg-color)" :style="{ height: approveHeight + 'px' }">
		<el-container>
			<el-header style="padding: 0; height: auto">
				<div
					class="p-8 pt-4 pb-4 flex justify-between items-center"
					style="border-bottom: 1px solid var(--el-border-color)"
					ref="approveTitleRef"
				>
					<div class="font-bold text-xl">
						{{ processTaskDetail?.processDefinitionName }}
					</div>
					<div>
						<el-button plain @click="handleBack"> 返回 </el-button>
					</div>
				</div>
			</el-header>

			<el-main class="p-0!">
				<el-tabs v-model="activeName" ref="tabsRef">
					<el-tab-pane label="任务审批" name="approve">
						<div ref="approveFooterRef" class="p-8!">
							<el-form-item
								label="审批意见"
								label-position="right"
								:label-width="`${commentLabelWidth}px`"
							>
								<el-input
									type="textarea"
									:rows="3"
									placeholder="请输入审批意见"
									v-model="comment"
								/>
							</el-form-item>
							<div :style="{ paddingLeft: `${commentLabelWidth}px` }">
								<el-button
									plain
									@click="approve"
									:icon="CheckboxCircleLine"
									:loading="approveLoading"
								>
									同意
								</el-button>
								<el-button
									plain
									@click="reject"
									:icon="CloseCircleLine"
									:loading="rejectLoading"
								>
									拒绝
								</el-button>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="表单数据" name="form">
						<el-scrollbar :height="`${formScrollbarHeight}px`">
							<div
								v-for="(finishedTask, index) in processTaskDetail?.finishedTasks"
								class="p-8"
								:style="
									index !== (processTaskDetail?.finishedTasks?.length ?? 0) - 1
										? {
												paddingBottom: 0,
											}
										: {}
								"
								:key="finishedTask.taskId"
							>
								<el-card v-if="finishedTask.formContent">
									<template #header>
										<div class="assignee-text">
											<span class="font-bold">
												{{ finishedTask.taskName }}
											</span>
											<br />
											提交人员：{{ finishedTask.assignee }}
											<br />
											提交时间：{{ finishedTask.endTime }}
										</div>
									</template>

									<FormViewer
										v-if="finishedTask.formContent"
										class="mb-px"
										ref="formViewerRef"
										:form-native-props="formProps"
										:form-data="finishedTask.formData"
										:form-json="finishedTask.formContent"
									/>
								</el-card>
							</div>
						</el-scrollbar>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
	</div>
</template>

<style scoped>
.assignee-text {
	font-size: 14px;
	color: var(--el-text-color-secondary);
}

::v-deep(.el-tabs__header) {
	margin-bottom: 0;
}

::v-deep(.el-tabs__nav-wrap) {
	padding-left: calc(var(--spacing) * 8);
}
</style>
