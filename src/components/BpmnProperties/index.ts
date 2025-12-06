/**
 * BPMN属性面板组件库 - 入口文件
 */

// 主组件
export { default as PropertiesPanel } from './PropertiesPanel.vue'

// 区块组件
export { default as BasicSection } from './sections/BasicSection.vue'
export { default as AssigneeSection } from './sections/AssigneeSection.vue'
export { default as ListenersSection } from './sections/ListenersSection.vue'
// export { default as FormSection } from './sections/FormSection.vue'
// export { default as InputOutputSection } from './sections/InputOutputSection.vue'
// export { default as MultiInstanceSection } from './sections/MultiInstanceSection.vue'
// export { default as AsyncSection } from './sections/AsyncSection.vue'
// export { default as ConditionSection } from './sections/ConditionSection.vue'
// export { default as ScriptSection } from './sections/ScriptSection.vue'
// export { default as ExtensionSection } from './sections/ExtensionSection.vue'

// 类型定义
export type {
	BpmnElement,
	BusinessObject,
	Listener,
	Parameter,
	FormField,
	MultiInstanceConfig,
	AsyncConfig,
	TimerDefinition,
	ConditionDefinition,
	MessageDefinition,
	ErrorDefinition,
	SignalDefinition,
	PropertyUpdateEvent
} from './types'

export {
	ElementType,
	EventType,
	ImplementationType,
	ScriptFormat,
	FormFieldType
} from './types'

// 工具函数
export {
	is,
	isAny,
	getBusinessObject,
	getExtensionElements,
	getDocumentation,
	setDocumentation,
	isUserTask,
	isServiceTask,
	isScriptTask,
	isBusinessRuleTask,
	isCallActivity,
	isSubProcess,
	isSequenceFlow,
	isEvent,
	isGateway,
	isProcess,
	getEventDefinition,
	hasEventDefinition,
	getTimerEventDefinition,
	getMessageEventDefinition,
	getErrorEventDefinition,
	getSignalEventDefinition,
	supportsAsync,
	supportsMultiInstance,
	getLoopCharacteristics,
	isMultiInstance,
	generateId
} from './utils/bpmnHelper'

// Composables
export { useModeling } from './composables/useModeling'
