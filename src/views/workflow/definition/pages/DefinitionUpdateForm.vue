<script setup lang="ts">
import { ref } from 'vue'
import Refresh from '~icons/ep/refresh'
import { formRules } from '../utils/rule.ts'
import type { FormProps } from '../utils/types.ts'
import { generateUUID } from '@/utils/Common.ts'
import type { SaveProcessDefinitionRequest } from '@/api/types/ProcessDefinitionTypes.ts'

const {
	formInline = {
		id: undefined,
		remark: '',
		category: '',
		processKey: '',
		processName: '',
	},
} = defineProps<FormProps>()

const roleUpdateForm = ref()
const newFormInline = ref(formInline as SaveProcessDefinitionRequest)

defineExpose({
	getRef: () => roleUpdateForm.value,
	getData: () => newFormInline,
})
</script>

<template>
	<el-form ref="roleUpdateForm" :model="newFormInline" :rules="formRules" label-width="120px">
		<el-form-item label="流程定义名称" prop="processName">
			<el-input
				v-model="newFormInline.processName"
				clearable
				placeholder="请输入流程定义名称"
			/>
		</el-form-item>
		<el-form-item label="流程定义key" prop="processKey">
			<el-input
				v-model="newFormInline.processKey"
				placeholder="请输入流程定义key"
				:disabled="formInline.id !== undefined"
			>
				<template #suffix>
					<Refresh
						class="cursor-pointer refresh-key"
						@click="newFormInline.processKey = `Process_${generateUUID()}`"
					/>
				</template>
			</el-input>
		</el-form-item>

		<el-form-item label="分类" prop="category">
			<el-input v-model="newFormInline.category" clearable placeholder="请输入分类" />
		</el-form-item>

		<el-form-item label="说明">
			<el-input v-model="newFormInline.remark" placeholder="请输入说明" type="textarea" />
		</el-form-item>
	</el-form>
</template>

<style scoped>
.refresh-key:hover {
	color: var(--el-color-primary);
}
</style>
