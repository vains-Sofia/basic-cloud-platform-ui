/**
 * BPMN 属性面板 - 类型定义
 */
// BPMN元素类型
export interface BpmnElement {
	id: string
	name?: string
	type: string
	businessObject: BusinessObject
	incoming?: BpmnElement[]
	outgoing?: BpmnElement[]
	parent?: BpmnElement
}

export interface BusinessObject {
	id: string
	name?: string
	$type: string
	documentation?: Documentation[]
	extensionElements?: ExtensionElements
	[key: string]: any
}

export interface Documentation {
	text: string
}

export interface ExtensionElements {
	values: any[]
}

// 监听器类型
export interface Listener {
	id?: string
	event: string
	listenerType: 'class' | 'expression' | 'delegateExpression' | 'script'
	class?: string
	expression?: string
	delegateExpression?: string
	script?: Script
	fields?: Field[]
}

export interface Script {
	scriptFormat: string
	value: string
	resource?: string
}

export interface Field {
	name: string
	type: 'string' | 'expression'
	value: string
}

// 输入输出参数
export interface Parameter {
	id?: string
	name: string
	type: 'string' | 'expression' | 'script' | 'list' | 'map'
	value?: string
	definition?: Script
}

// 表单字段
export interface FormField {
	id: string
	label: string
	type: 'string' | 'long' | 'boolean' | 'date' | 'enum'
	defaultValue?: string
	validation?: FormFieldValidation
	properties?: FormFieldProperty[]
}

export interface FormFieldValidation {
	constraints: ValidationConstraint[]
}

export interface ValidationConstraint {
	name: string
	config?: string
}

export interface FormFieldProperty {
	id: string
	value: string
}

// 多实例配置
export interface MultiInstanceConfig {
	isSequential: boolean
	loopCardinality?: string
	collection?: string
	elementVariable?: string
	completionCondition?: string
}

// 异步配置
export interface AsyncConfig {
	asyncBefore: boolean
	asyncAfter: boolean
	exclusive: boolean
	retryTimeCycle?: string
}

// 定时器定义
export interface TimerDefinition {
	type: 'date' | 'duration' | 'cycle'
	value: string
}

// 条件定义
export interface ConditionDefinition {
	type: 'expression' | 'script'
	body?: string
	script?: Script
}

// 消息定义
export interface MessageDefinition {
	messageRef?: string
	messageName?: string
}

// 错误定义
export interface ErrorDefinition {
	errorRef?: string
	errorCode?: string
	errorMessage?: string
	errorCodeVariable?: string
	errorMessageVariable?: string
}

// 信号定义
export interface SignalDefinition {
	signalRef?: string
	signalName?: string
	scope?: 'global' | 'processInstance'
}

// 属性更新事件
export interface PropertyUpdateEvent {
	element: BpmnElement
	properties: Record<string, any>
}

// 元素类型枚举
export enum ElementType {
	PROCESS = 'bpmn:Process',
	USER_TASK = 'bpmn:UserTask',
	SERVICE_TASK = 'bpmn:ServiceTask',
	SCRIPT_TASK = 'bpmn:ScriptTask',
	BUSINESS_RULE_TASK = 'bpmn:BusinessRuleTask',
	SEND_TASK = 'bpmn:SendTask',
	RECEIVE_TASK = 'bpmn:ReceiveTask',
	MANUAL_TASK = 'bpmn:ManualTask',
	CALL_ACTIVITY = 'bpmn:CallActivity',
	SUB_PROCESS = 'bpmn:SubProcess',
	SEQUENCE_FLOW = 'bpmn:SequenceFlow',
	START_EVENT = 'bpmn:StartEvent',
	END_EVENT = 'bpmn:EndEvent',
	INTERMEDIATE_CATCH_EVENT = 'bpmn:IntermediateCatchEvent',
	INTERMEDIATE_THROW_EVENT = 'bpmn:IntermediateThrowEvent',
	BOUNDARY_EVENT = 'bpmn:BoundaryEvent',
	EXCLUSIVE_GATEWAY = 'bpmn:ExclusiveGateway',
	PARALLEL_GATEWAY = 'bpmn:ParallelGateway',
	INCLUSIVE_GATEWAY = 'bpmn:InclusiveGateway',
	EVENT_BASED_GATEWAY = 'bpmn:EventBasedGateway',
}

// 事件类型
export enum EventType {
	TIMER = 'bpmn:TimerEventDefinition',
	MESSAGE = 'bpmn:MessageEventDefinition',
	ERROR = 'bpmn:ErrorEventDefinition',
	SIGNAL = 'bpmn:SignalEventDefinition',
	ESCALATION = 'bpmn:EscalationEventDefinition',
	COMPENSATION = 'bpmn:CompensateEventDefinition',
	CONDITIONAL = 'bpmn:ConditionalEventDefinition',
	LINK = 'bpmn:LinkEventDefinition',
	TERMINATE = 'bpmn:TerminateEventDefinition',
}

// 实现类型
export enum ImplementationType {
	CLASS = 'class',
	EXPRESSION = 'expression',
	DELEGATE_EXPRESSION = 'delegateExpression',
	EXTERNAL = 'external',
	CONNECTOR = 'connector',
}

// 脚本格式
export enum ScriptFormat {
	JAVASCRIPT = 'javascript',
	GROOVY = 'groovy',
	PYTHON = 'python',
	JUEL = 'juel',
}

// 表单字段类型
export enum FormFieldType {
	STRING = 'string',
	LONG = 'long',
	BOOLEAN = 'boolean',
	DATE = 'date',
	ENUM = 'enum',
}
