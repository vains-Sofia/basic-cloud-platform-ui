<script setup lang="ts">
import { FormViewer } from '@/components/FormDesigner'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProcessFormById } from '@/api/workflow/ProcessForm.ts'
import type { ProcessFormResponse } from '@/api/types/ProcessFormTypes.ts'
import { taskApprove } from '@/api/workflow/ProcessTask.ts'
import router from '@/router'

// 表单预览器
const formViewerRef = ref()

const route = useRoute()
const taskId = route.query.taskId as string
const formKey = route.query.formKey as string

// 流程表单
const processForm = ref<ProcessFormResponse>()
getProcessFormById(formKey).then((res) => (processForm.value = res))
const submitLoading = ref(false)
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
				.then(res => {
					console.log(res)
					router.go(-1)
				}).finally(() => submitLoading.value = false)
		}
	})
}
</script>

<template>
	<div class="bg-[var(--el-bg-color)] p-8">
		<FormViewer v-if="processForm" ref="formViewerRef" :form-json="processForm.formContent" />
		<div class="pl-[125px]">
			<el-button plain @click="() => formViewerRef?.reset?.()"> 重置表单 </el-button>
			<el-button plain @click="submitForm" v-loading="submitLoading"> 提交 </el-button>
		</div>
	</div>
</template>

<style scoped></style>
