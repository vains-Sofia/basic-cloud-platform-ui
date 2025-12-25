<script setup lang="ts">
import type { FormProps } from '@/views/workflow/form/utils/types.ts'
import { ref } from 'vue'
import { formRules } from '@/views/workflow/form/utils/rule.ts'
import type { SaveProcessFormRequest } from '@/api/types/ProcessFormTypes.ts'

const {
	formInline = {
		title: '',
		description: '',
	},
} = defineProps<FormProps>()

const newFormInline = ref<SaveProcessFormRequest>(JSON.parse(JSON.stringify(formInline)))

const formRef = ref()
defineExpose({
	getRef: () => formRef.value,
	getData: () => newFormInline,
})
</script>

<template>
	<el-form ref="formRef" :model="newFormInline" :rules="formRules" label-width="82px">
		<el-form-item label="表单名称" prop="title">
			<el-input v-model="newFormInline.title" clearable placeholder="请输入表单名称" />
		</el-form-item>
		<el-form-item label="表单描述" prop="description">
			<el-input v-model="newFormInline.description" clearable placeholder="请输入表单描述" />
		</el-form-item>
	</el-form>
</template>

<style scoped></style>
