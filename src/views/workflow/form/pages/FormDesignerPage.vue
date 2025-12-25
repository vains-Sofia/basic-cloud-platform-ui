<script setup lang="ts">
import FormDesigner from '@/components/FormDesigner'
import { onMounted, ref } from 'vue'
import { useDesignerHooks } from '@/views/workflow/form/utils/DesignerHooks.tsx'

const comLoad = ref(false)

onMounted(() => (comLoad.value = true))

const { formId = '', dialogId = '' } = defineProps<{
	formId?: string
	dialogId?: string
}>()

const { formSchema, handleBack, processForm, initSchema, openUpdatePanel } = useDesignerHooks(dialogId, formId)
</script>

<template>
	<div>
		<div class="p-3 flex justify-between">
			<div class="font-bold">
				{{ processForm?.title }}
			</div>
			<div>
				<el-button plain @click="openUpdatePanel(processForm ? '修改' : '新增', processForm)"> 确认 </el-button>
				<el-button plain @click="handleBack"> 关闭 </el-button>
			</div>
		</div>
		<FormDesigner
			v-if="comLoad"
			:initial-schema="initSchema"
			@update:schema="formSchema = $event"
			ref="designerRef"
			style="border-top: 1px solid var(--el-border-color)"
		/>
	</div>
</template>

<style scoped></style>
