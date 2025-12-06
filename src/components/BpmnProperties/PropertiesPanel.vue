<template>
	<div class="bpmn-properties-panel">
		<div v-if="!activeElement" class="empty-state">
			<el-empty description="请选择一个元素" />
		</div>

		<div v-else class="panel-content">
			<!-- 标题栏 -->
			<div class="panel-header">
				<div class="element-info">
					<el-tag :type="getElementTagType(activeElement.type)">
						{{ getElementTypeName(activeElement.type) }}
					</el-tag>
					<span class="element-id">{{ activeElement.businessObject?.name }}</span>
				</div>
			</div>

			<!-- 属性区块折叠面板 -->
			<el-scrollbar class="panel-scrollbar">
				<el-collapse v-model="activeNames" class="properties-collapse">
					<!-- 基础属性 -->
					<BasicSection
						v-if="!isProcess(activeElement)"
						:element="activeElement"
						:modeler="modeler"
					/>

					<!-- 流程定义属性 -->
					<template v-if="isProcess(activeElement)">
						<ProcessSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 用户任务特定属性 -->
					<template v-if="isUserTask(activeElement)">
						<AssigneeSection :element="activeElement" :modeler="modeler" />
						<FormSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 开始事件启动表单 -->
					<template v-if="isStartEvent(activeElement)">
						<FormSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 服务任务属性 -->
					<template v-if="isServiceTask(activeElement)">
						<ServiceTaskSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 脚本任务属性 -->
					<template v-if="isScriptTask(activeElement)">
						<ScriptSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 业务规则任务 -->
					<template v-if="isBusinessRuleTask(activeElement)">
						<BusinessRuleSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 调用活动 -->
					<template v-if="isCallActivity(activeElement)">
						<CallActivitySection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 流转条件 -->
					<template v-if="isSequenceFlow(activeElement)">
						<ConditionSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 事件属性 -->
					<template v-if="isEvent(activeElement)">
						<EventSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 网关属性 -->
					<!--					<template v-if="isGateway(activeElement)">-->
					<!--						<GatewaySection :element="activeElement" :modeler="modeler" />-->
					<!--					</template>-->

					<!-- 监听器配置 -->
					<template v-if="!isSequenceFlow(activeElement)">
						<ListenersSection :element="activeElement" :modeler="modeler" />
					</template>
					<!--					<template v-if="!isSequenceFlow(activeElement) && !isGateway(activeElement)">-->
					<!--						<ListenersSection :element="activeElement" :modeler="modeler" />-->
					<!--					</template>-->

					<!-- 输入输出映射 -->
					<template v-if="supportsInputOutput(activeElement)">
						<InputOutputSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 多实例配置 -->
					<template v-if="supportsMultiInstance(activeElement)">
						<MultiInstanceSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 异步配置 -->
					<template v-if="supportsAsync(activeElement)">
						<AsyncSection :element="activeElement" :modeler="modeler" />
					</template>

					<!-- 扩展属性 -->
					<ExtensionSection :element="activeElement" :modeler="modeler" />
				</el-collapse>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { BpmnElement } from './types'
import {
	isBusinessRuleTask,
	isCallActivity,
	isEvent,
	// isGateway,
	isProcess,
	isScriptTask,
	isSequenceFlow,
	isServiceTask,
	isStartEvent,
	isUserTask,
	supportsAsync,
	supportsMultiInstance,
} from './utils/bpmnHelper'

// 导入各个区块组件
import BasicSection from './sections/BasicSection.vue'
import AssigneeSection from './sections/AssigneeSection.vue'
import FormSection from './sections/FormSection.vue'
import ServiceTaskSection from './sections/ServiceTaskSection.vue'
import ScriptSection from './sections/ScriptSection.vue'
import BusinessRuleSection from './sections/BusinessRuleSection.vue'
import CallActivitySection from './sections/CallActivitySection.vue'
import ConditionSection from './sections/ConditionSection.vue'
import EventSection from './sections/EventSection.vue'
// import GatewaySection from './sections/GatewaySection.vue'
import ListenersSection from './sections/ListenersSection.vue'
import InputOutputSection from './sections/InputOutputSection.vue'
import MultiInstanceSection from './sections/MultiInstanceSection.vue'
import ProcessSection from './sections/ProcessSection.vue'
import AsyncSection from './sections/AsyncSection.vue'
import ExtensionSection from './sections/ExtensionSection.vue'

// 注意：需要创建以下组件文件
// - FormSection.vue
// - ServiceTaskSection.vue
// - ScriptSection.vue
// - BusinessRuleSection.vue
// - CallActivitySection.vue
// - ConditionSection.vue
// - EventSection.vue
// - GatewaySection.vue
// - InputOutputSection.vue
// - MultiInstanceSection.vue
// - AsyncSection.vue
// - ExtensionSection.vue

interface Props {
	element?: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

// 默认展开的面板
const activeNames = ref(['basic'])

function getProcess(modeler: any) {
	const canvas = modeler.get('canvas')
	const root = canvas.getRootElement()

	if (root.businessObject?.$type === 'bpmn:Process') {
		return root
	}

	if (root.businessObject?.$type === 'bpmn:Collaboration') {
		return root.businessObject.participants?.[0]
	}

	return null
}

const activeElement = ref<BpmnElement>()

onMounted(() => {
	if (!props.element && props.modeler) {
		props.modeler.on('import.done', () => {
			// 等待加载完毕再获取主流程
			const process = getProcess(props.modeler)
			activeElement.value = process
			elementActive(process)
		})
	}
})

// 监听元素变化，重置展开状态
watch(
	() => props.element,
	(newElement) => {
		if (newElement) {
			elementActive(newElement)
			activeElement.value = newElement
		} else {
			// 未选择元素时默认选择主流程
			const process = getProcess(props.modeler)
			activeElement.value = process
			elementActive(process)
		}
	},
)

const elementActive = (newElement: BpmnElement) => {
	if (!newElement) return
	// 根据元素类型自动展开相关面板
	activeNames.value = ['basic']

	if (isProcess(newElement)) {
		activeNames.value.push('process')
	} else {
		activeNames.value.push('basic')

		if (isUserTask(newElement)) {
			activeNames.value.push('assignee')
		} else if (isServiceTask(newElement)) {
			activeNames.value.push('serviceTask')
		} else if (isSequenceFlow(newElement)) {
			activeNames.value.push('condition')
		} else if (isEvent(newElement)) {
			activeNames.value.push('event')
		}
	}
}

// 判断是否支持输入输出映射
const supportsInputOutput = (element: BpmnElement): boolean => {
	return (
		isUserTask(element) ||
		isServiceTask(element) ||
		isBusinessRuleTask(element) ||
		isScriptTask(element) ||
		isCallActivity(element)
	)
}

// 获取元素类型标签
const getElementTagType = (type: string) => {
	switch (type) {
		case 'bpmn:UserTask':
			return 'primary'
		case 'bpmn:ServiceTask':
			return 'success'
		case 'bpmn:ScriptTask':
		case 'bpmn:ExclusiveGateway':
			return 'warning'
		case 'bpmn:StartEvent':
			return 'success'
		case 'bpmn:EndEvent':
			return 'danger'
		default:
			return 'info'
	}
}

// 获取元素类型名称
const getElementTypeName = (type: string): string => {
	const nameMap: Record<string, string> = {
		'bpmn:Process': '流程',
		'bpmn:UserTask': '用户任务',
		'bpmn:ServiceTask': '服务任务',
		'bpmn:ScriptTask': '脚本任务',
		'bpmn:BusinessRuleTask': '业务规则任务',
		'bpmn:SendTask': '发送任务',
		'bpmn:ReceiveTask': '接收任务',
		'bpmn:ManualTask': '手工任务',
		'bpmn:CallActivity': '调用活动',
		'bpmn:SubProcess': '子流程',
		'bpmn:SequenceFlow': '流转',
		'bpmn:StartEvent': '开始事件',
		'bpmn:EndEvent': '结束事件',
		'bpmn:IntermediateCatchEvent': '中间捕获事件',
		'bpmn:IntermediateThrowEvent': '中间抛出事件',
		'bpmn:BoundaryEvent': '边界事件',
		'bpmn:ExclusiveGateway': '排他网关',
		'bpmn:ParallelGateway': '并行网关',
		'bpmn:InclusiveGateway': '包容网关',
		'bpmn:EventBasedGateway': '事件网关',
	}
	return nameMap[type] || type?.replace('bpmn:', '')
}
</script>

<style scoped>
.bpmn-properties-panel {
	height: 100%;
	border-left: 1px solid var(--el-border-color);
	display: flex;
	flex-direction: column;
}

.empty-state {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.panel-content {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.panel-header {
	padding: 16px;
	border-bottom: 1px solid var(--el-border-color);
}

.element-info {
	display: flex;
	align-items: center;
	gap: 8px;
}

.element-id {
	font-size: 13px;
	font-family: monospace;
}

.panel-scrollbar {
	flex: 1;
	height: 0;
}

.properties-collapse {
	border: none;
}

:deep(.el-collapse-item__header) {
	height: 48px;
	line-height: 48px;
	padding: 0 16px;
	font-weight: 600;
	border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-collapse-item__wrap) {
	border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-collapse-item__content) {
	padding: 16px;
}

:deep(.el-form-item__label) {
	font-size: 13px;
	font-weight: 500;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-input-number) {
	width: 100%;
}
</style>
