<script setup lang="ts">
import BpmnDesigner from '@/components/BpmnDesigner'
import { useDesignerHooks } from '@/views/workflow/model/utils/DesignerHooks.tsx'
import router from '@/router'
import { useRoute } from 'vue-router'
import { closeDialog } from '@/components/CommonDialog'
import { useProcessModel } from '@/views/workflow/model/utils/hooks.tsx'
import type { PageProcessModelResponse } from '@/api/types/ProcessModelTypes.ts'
const route = useRoute()

// 如果传入dialogId代表是作为组件嵌入弹框的
const { processKey = '', dialogId = '' } = defineProps<{
	processKey: string
	dialogId?: string
}>()

const { bpmnXml, confirmLoading, processDefinition, saveDefinitionDraft } =
	useDesignerHooks(processKey)

const { publishDefinition } = useProcessModel()

const handleBack = () => {
	if (dialogId) {
		closeDialog(dialogId)
	} else {
		router.push('/workflow/model').then()
	}
}
</script>

<template>
	<div>
		<div class="p-3 pl-5 pb-1 pr-5 bg-[var(--el-bg-color)] title-card">
			<div class="flex justify-between w-full items-center" v-loading="!processDefinition">
				<div class="font-bold pb-[8px]">{{ processDefinition?.processName }}</div>

				<el-descriptions :column="1">
					<el-descriptions-item>
						<el-button plain @click="() => handleBack()">关闭</el-button>
						<el-button
							:loading="confirmLoading"
							type="success"
							@click="publishDefinition(processDefinition as PageProcessModelResponse)"
						>
							发布
						</el-button>
						<el-button
							:loading="confirmLoading"
							type="primary"
							@click="saveDefinitionDraft"
						>
							保存
						</el-button>
					</el-descriptions-item>
				</el-descriptions>
			</div>
		</div>
		<div class="bg-[var(--el-bg-color)]">
			<BpmnDesigner
				v-if="processDefinition"
				v-model="bpmnXml"
				@error="console.error"
				:process-key="processKey ?? (route.query.processKey as string)"
			/>
		</div>
	</div>
</template>

<style scoped>
.title-card {
	border: 1px solid var(--el-border-color);
	border-bottom: 0;
}
</style>
