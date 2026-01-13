<script setup lang="ts">
import { FormViewer } from '@/components/FormDesigner'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProcessTaskDetail, taskApprove } from '@/api/workflow/ProcessTask.ts'
import router from '@/router'
import type { ProcessTaskDetailResponse } from '@/api/types/ProcessTaskTypes.ts'

// 图标
import CheckboxCircleLine from '~icons/ri/checkbox-circle-line'

// 表单预览器
const formViewerRef = ref()

const route = useRoute()
const taskId = route.query.taskId as string

// 流程表单加载状态
const submitLoading = ref(false)
// 流程任务详情
const processTaskDetail = ref<ProcessTaskDetailResponse>()
// 提交表单
const submitForm = () => {
	submitLoading.value = true
	formViewerRef.value?.validate?.().then((valid: boolean) => {
		if (valid) {
			const approveRequest = {
				taskId,
				action: 'APPROVE',
				variables: formViewerRef.value?.getData(),
			}
			taskApprove(approveRequest)
				.then(() => {
					ElNotification({
						title: '提醒',
						message: `提交成功`,
						type: 'success',
					})
					handleBack()
				})
				.finally(() => (submitLoading.value = false))
		}
	})
}

const initData = () => {
	if (!taskId) {
		ElNotification({
			title: '错误',
			message: `Task ID 不能为空`,
			type: 'error',
		})
		return
	}
	getProcessTaskDetail(taskId).then((res) => (processTaskDetail.value = res))
}

initData()

const handleBack = () => {
	router.go(-1)
}
</script>

<template>
	<div>
		<div class="bg-(--el-bg-color) p-8 pt-4 pb-4 mb-px flex justify-between items-center">
			<div class="font-bold text-xl">
				{{ processTaskDetail?.taskName }}
			</div>
			<div>
				<el-button plain @click="handleBack"> 返回 </el-button>
			</div>
		</div>
		<div class="bg-(--el-bg-color) p-8">
			<FormViewer
				v-if="processTaskDetail && processTaskDetail.formContent"
				ref="formViewerRef"
				:form-json="processTaskDetail.formContent"
			/>
			<div class="pl-[85px]">
				<el-button plain @click="() => formViewerRef?.reset?.()"> 重置表单 </el-button>
				<el-button
					plain
					@click="submitForm"
					:icon="CheckboxCircleLine"
					:loading="submitLoading"
				>
					提交
				</el-button>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
