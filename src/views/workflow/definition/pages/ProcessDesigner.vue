<script setup lang="ts">
import BpmnDesigner from '@/components/BpmnDesigner'
import { useRoute } from 'vue-router'
import { useDesignerHooks } from '@/views/workflow/definition/utils/DesignerHooks.tsx'

const route = useRoute()

const { bpmnXml, confirmLoading, processDefinition, saveDefinitionDraft } = useDesignerHooks()

const handleBack = () => {
	history.back()
}
</script>

<template>
	<div>
		<div class="p-3 pl-5 pb-1 pr-5 bg-[var(--el-bg-color)] title-card">
			<div class="flex justify-between w-full items-center" v-if="processDefinition">
				<div class="font-bold">{{ processDefinition.processName }}</div>

				<el-descriptions v-if="processDefinition" :column="1">
					<el-descriptions-item>
						<el-button plain @click="() => handleBack()">返回</el-button>
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
				v-model="bpmnXml"
				@error="console.error"
				:process-key="route.query.processKey as string"
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
