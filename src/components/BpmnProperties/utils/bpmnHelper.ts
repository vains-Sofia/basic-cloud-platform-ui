/**
 * BPMN 辅助工具函数
 */

import type { BpmnElement, BusinessObject, ExtensionElements } from '../types'

/**
 * 判断元素类型
 */
export const is = (element: BpmnElement | BusinessObject, type: string): boolean => {
	const bo = (element as BpmnElement).businessObject || (element as BusinessObject)
	return bo.$type === type
}

/**
 * 判断是否为任意类型
 */
export const isAny = (element: BpmnElement, types: string[]): boolean => {
	return types.some(type => is(element, type))
}

/**
 * 获取业务对象
 */
export const getBusinessObject = (element: BpmnElement): BusinessObject => {
	return element.businessObject
}

/**
 * 获取扩展元素
 */
export const getExtensionElements = (
	element: BpmnElement,
	type?: string
): any[] | undefined => {
	const bo = getBusinessObject(element)

	if (!bo.extensionElements) {
		return undefined
	}

	if (!type) {
		return bo.extensionElements.values
	}

	return bo.extensionElements.values?.filter((e: any) => is(e, type))
}

/**
 * 创建扩展元素
 */
export const createExtensionElements = (
	moddle: any,
	values: any[]
): ExtensionElements => {
	return moddle.create('bpmn:ExtensionElements', { values })
}

/**
 * 获取文档内容
 */
export const getDocumentation = (element: BpmnElement): string => {
	const bo = getBusinessObject(element)
	const docs = bo.documentation || []
	return docs.length > 0 ? docs[0].text : ''
}

/**
 * 设置文档内容
 */
export const setDocumentation = (
	moddle: any,
	element: BpmnElement,
	text: string
): any[] => {
	if (!text) return []
	return [moddle.create('bpmn:Documentation', { text })]
}

/**
 * 判断是否为用户任务
 */
export const isStartEvent = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:StartEvent')
}

/**
 * 判断是否为用户任务
 */
export const isUserTask = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:UserTask')
}

/**
 * 判断是否为服务任务
 */
export const isServiceTask = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:ServiceTask')
}

/**
 * 判断是否为脚本任务
 */
export const isScriptTask = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:ScriptTask')
}

/**
 * 判断是否为业务规则任务
 */
export const isBusinessRuleTask = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:BusinessRuleTask')
}

/**
 * 判断是否为调用活动
 */
export const isCallActivity = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:CallActivity')
}

/**
 * 判断是否为子流程
 */
export const isSubProcess = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:SubProcess')
}

/**
 * 判断是否为流转
 */
export const isSequenceFlow = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:SequenceFlow')
}

/**
 * 判断是否为事件
 */
export const isEvent = (element: BpmnElement): boolean => {
	return isAny(element, [
		'bpmn:StartEvent',
		'bpmn:EndEvent',
		'bpmn:IntermediateCatchEvent',
		'bpmn:IntermediateThrowEvent',
		'bpmn:BoundaryEvent'
	])
}

/**
 * 判断是否为网关
 */
export const isGateway = (element: BpmnElement): boolean => {
	return isAny(element, [
		'bpmn:ExclusiveGateway',
		'bpmn:ParallelGateway',
		'bpmn:InclusiveGateway',
		'bpmn:EventBasedGateway',
		'bpmn:ComplexGateway'
	])
}

/**
 * 判断是否为流程定义
 */
export const isProcess = (element: BpmnElement): boolean => {
	return is(element, 'bpmn:Process') || is(element, 'bpmn:Participant')
}

/**
 * 获取事件定义
 */
export const getEventDefinition = (element: BpmnElement, type?: string): any => {
	const bo = getBusinessObject(element)
	const eventDefinitions = bo.eventDefinitions || []

	if (!type) {
		return eventDefinitions[0]
	}

	return eventDefinitions.find((def: any) => is(def, type))
}

/**
 * 判断是否有事件定义
 */
export const hasEventDefinition = (element: BpmnElement, type: string): boolean => {
	return !!getEventDefinition(element, type)
}

/**
 * 获取定时器事件定义
 */
export const getTimerEventDefinition = (element: BpmnElement): any => {
	return getEventDefinition(element, 'bpmn:TimerEventDefinition')
}

/**
 * 获取消息事件定义
 */
export const getMessageEventDefinition = (element: BpmnElement): any => {
	return getEventDefinition(element, 'bpmn:MessageEventDefinition')
}

/**
 * 获取错误事件定义
 */
export const getErrorEventDefinition = (element: BpmnElement): any => {
	return getEventDefinition(element, 'bpmn:ErrorEventDefinition')
}

/**
 * 获取信号事件定义
 */
export const getSignalEventDefinition = (element: BpmnElement): any => {
	return getEventDefinition(element, 'bpmn:SignalEventDefinition')
}

/**
 * 判断是否支持异步
 */
export const supportsAsync = (element: BpmnElement): boolean => {
	return !isSequenceFlow(element) && !isProcess(element)
}

/**
 * 判断是否支持多实例
 */
export const supportsMultiInstance = (element: BpmnElement): boolean => {
	return isAny(element, [
		'bpmn:UserTask',
		'bpmn:ServiceTask',
		'bpmn:ScriptTask',
		'bpmn:BusinessRuleTask',
		'bpmn:SendTask',
		'bpmn:ReceiveTask',
		'bpmn:ManualTask',
		'bpmn:CallActivity',
		'bpmn:SubProcess'
	])
}

/**
 * 获取循环特性
 */
export const getLoopCharacteristics = (element: BpmnElement): any => {
	const bo = getBusinessObject(element)
	return bo.loopCharacteristics
}

/**
 * 判断是否为多实例
 */
export const isMultiInstance = (element: BpmnElement): boolean => {
	const loopCharacteristics = getLoopCharacteristics(element)
	return !!loopCharacteristics && is(loopCharacteristics, 'bpmn:MultiInstanceLoopCharacteristics')
}

/**
 * 清空数组中的空值
 */
export const removeEmptyValues = (obj: any): any => {
	if (Array.isArray(obj)) {
		return obj.filter(item => item != null)
	}

	const result: any = {}
	Object.keys(obj).forEach(key => {
		if (obj[key] != null && obj[key] !== '') {
			result[key] = obj[key]
		}
	})

	return result
}

/**
 * 生成唯一ID
 */
export const generateId = (prefix = 'id'): string => {
	return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
