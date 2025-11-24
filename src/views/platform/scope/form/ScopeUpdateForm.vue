<script setup lang="ts">
import { ref } from 'vue'
import { formRules } from '../utils/rule.ts'
import type { FormProps } from '../utils/types.ts'

const {
	formInline = {
		id: '',
		name: '',
		code: '',
		description: '',
	},
} = defineProps<FormProps>()

const roleUpdateForm = ref()
const newFormInline = ref(JSON.parse(JSON.stringify(formInline)))

defineExpose({
	getRef: () => roleUpdateForm.value,
	getData: () => newFormInline,
})
</script>

<template>
	<el-form ref="roleUpdateForm" :model="newFormInline" :rules="formRules" label-width="100px">
		<el-form-item label="Scope编码" prop="scope">
			<el-input
				v-model="newFormInline.scope"
				clearable
				placeholder="请输入Scope编码"
			/>
		</el-form-item>
		<el-form-item label="Scope名称" prop="name">
			<el-input
				v-model="newFormInline.name"
				clearable
				placeholder="请输入Scope名称"
			/>
		</el-form-item>

		<el-form-item label="备注">
			<el-input
				v-model="newFormInline.description"
				placeholder="请输入备注信息"
				type="textarea"
			/>
		</el-form-item>
	</el-form>
</template>
