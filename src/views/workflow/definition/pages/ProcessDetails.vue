<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import { useRoute } from 'vue-router'
import { getBpmnXml, getDeployDefinitionDetail } from '@/api/workflow/DeploymentDefinition.ts'
import type { ProcessDefinitionResponse } from '@/api/types/ProcessDefinitionTypes.ts'
import { getScrollContainer } from '@/utils/Common.ts'

const canvas = ref()

const route = useRoute()
const processDefinitionId = route.query.processDefinitionId as string

const bpmnXmlLoading = ref(true)
const definitionLoading = ref(true)
// 流程定义详情
const processDefinition = ref<ProcessDefinitionResponse>()

const containerRef = ref()
// 计算高度
const detailContainerHeight = ref()

const taskFormKeys = computed(() => processDefinition.value?.taskForms?.map(e => e.formKey).filter(e => e !== null))

onMounted(() => {
	if (!processDefinitionId) {
		ElNotification({
			title: '初始化异常',
			message: `流程定义初始化失败，请从流程定义管理进入该页面`,
			type: 'error',
		})
		return
	}

	if (!containerRef.value) return
	const container = getScrollContainer(containerRef.value)
	const containerHeight =
		container instanceof Window ? window.innerHeight : container.clientHeight

	const rect = containerRef.value.getBoundingClientRect()
	const containerRect =
		container instanceof Window ? { top: 0 } : container.getBoundingClientRect()
	const tableTop = rect.top - containerRect.top

	detailContainerHeight.value = containerHeight - tableTop

	// 获取流程定义详情
	getDeployDefinitionDetail(processDefinitionId)
		.then((res) => {
			processDefinition.value = res
		})
		.finally(() => (definitionLoading.value = false))

	// 获取流程图 BPMN XML
	getBpmnXml(processDefinitionId)
		.then((res) => {
			const bpmnViewer = new NavigatedViewer({ container: canvas.value }) as any
			bpmnViewer.importXML(res).then(({}) => {
				// 调整在正中间
				bpmnViewer.get('canvas').zoom('fit-viewport', 'auto')
			})
		})
		.finally(() => (bpmnXmlLoading.value = false))
})
</script>

<template>
	<div class="flex justify-between">
		<div
			ref="containerRef"
			:style="{ height: `${detailContainerHeight}px`}"
			class="min-w-[30%] mr-[1px] bg-[var(--el-bg-color)] p-6 pl-8"
			v-loading="definitionLoading"
		>
			<el-descriptions :column="1" title="基础信息" class="mb-2" v-if="processDefinition">
				<el-descriptions-item label="名称" label-width="60px">
					<span class="font-bold">
						{{ processDefinition.name }}
					</span>
				</el-descriptions-item>
				<el-descriptions-item label="Key" label-width="60px">
					{{ processDefinition.key }}
				</el-descriptions-item>
				<el-descriptions-item label="版本" label-width="60px">
					<el-tag type="primary" size="small">
						v{{ processDefinition.version }}
					</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="分类" label-width="60px">
					{{ processDefinition.category }}
				</el-descriptions-item>
				<el-descriptions-item label="状态" label-width="60px">
					<el-tag :type="processDefinition.suspended ? 'warning' : 'success'" size="small">
						{{ processDefinition.suspended ? '挂起' : '激活' }}
					</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="部署 ID" label-width="60px">
					{{ processDefinition.deploymentId }}
				</el-descriptions-item>
				<el-descriptions-item label="部署时间" label-width="60px">
					{{ processDefinition.deploymentTime }}
				</el-descriptions-item>
			</el-descriptions>
			<el-descriptions :column="1" title="表单绑定" v-if="processDefinition">
				<el-descriptions-item label="启动表单" v-if="processDefinition.startFormKey">
					{{ processDefinition.startFormKey }}
				</el-descriptions-item>
				<el-descriptions-item label="任务表单" v-if="taskFormKeys && taskFormKeys.length > 0">
					{{ taskFormKeys.join(',') }}
				</el-descriptions-item>
				<el-descriptions-item v-else>
					-
				</el-descriptions-item>
			</el-descriptions>
<!--			<el-descriptions :column="1" title="监听器">-->
<!--				<el-descriptions-item>-->
<!--					<el-descriptions :column="3" direction="vertical">-->
<!--						<el-descriptions-item label="类型" label-width="100px">-->
<!--							类型-->
<!--						</el-descriptions-item>-->
<!--						<el-descriptions-item label="事件" label-width="100px">-->
<!--							事件-->
<!--						</el-descriptions-item>-->
<!--						<el-descriptions-item label="表达式" label-width="100px">-->
<!--							表达式-->
<!--						</el-descriptions-item>-->
<!--						<el-descriptions-item label-width="100px"> 类型 </el-descriptions-item>-->
<!--						<el-descriptions-item label-width="100px"> 事件 </el-descriptions-item>-->
<!--						<el-descriptions-item label-width="100px"> 表达式 </el-descriptions-item>-->
<!--						<el-descriptions-item label-width="100px"> 类型 </el-descriptions-item>-->
<!--						<el-descriptions-item label-width="100px"> 事件 </el-descriptions-item>-->
<!--						<el-descriptions-item label-width="100px"> 表达式 </el-descriptions-item>-->
<!--					</el-descriptions>-->
<!--				</el-descriptions-item>-->
<!--			</el-descriptions>-->
<!--			<el-descriptions :column="1" title="历史版本">-->
<!--				<el-descriptions-item> 列表展示 </el-descriptions-item>-->
<!--			</el-descriptions>-->
		</div>
		<div class="w-[70%] bg-[var(--el-bg-color)]" ref="canvas" v-loading="bpmnXmlLoading"></div>
	</div>
</template>

<style scoped></style>
