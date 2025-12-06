/**
 * BPMN建模操作 Composable
 */

import { computed, type Ref, toRaw } from 'vue'
import type { BpmnElement } from '../types'
import { getBusinessObject, removeEmptyValues } from '../utils/bpmnHelper'

export function useModeling(modeler: Ref<any>, element: Ref<BpmnElement | null>) {
	// 获取建模服务
	const modeling = computed(() => modeler.value?.get('modeling'))
	const moddle = computed(() => modeler.value?.get('moddle'))
	const bpmnFactory = computed(() => modeler.value?.get('bpmnFactory'))

	/**
	 * 更新元素属性
	 */
	const updateProperties = (properties: Record<string, any>) => {
		if (!element.value || !modeling.value) return

		const cleanedProps = removeEmptyValues(properties)
		modeling.value.updateProperties(toRaw(element.value), cleanedProps)
	}

	/**
	 * 更新业务对象属性
	 */
	const updateBusinessObject = (properties: Record<string, any>) => {
		if (!element.value) return

		const bo = getBusinessObject(element.value)
		Object.assign(bo, removeEmptyValues(properties))
	}

	/**
	 * 更新标签
	 */
	const updateLabel = (name: string) => {
		if (!element.value || !modeling.value) return
		modeling.value.updateLabel(toRaw(element.value), name)
	}

	/**
	 * 创建Camunda属性
	 */
	const createCamundaProperty = (name: string, value: string) => {
		if (!moddle.value) return null

		return moddle.value.create('camunda:Property', {
			name,
			value
		})
	}

	/**
	 * 创建Camunda字段
	 */
	const createCamundaField = (name: string, value: string, type: 'string' | 'expression' = 'string') => {
		if (!moddle.value) return null

		const field = moddle.value.create('camunda:Field', { name })

		if (type === 'string') {
			field.string = value
		} else {
			field.expression = value
		}

		return field
	}

	/**
	 * 创建输入参数
	 */
	const createInputParameter = (name: string, value: string, type: 'string' | 'expression' = 'string') => {
		if (!moddle.value) return null

		const param = moddle.value.create('camunda:InputParameter', { name })

		if (type === 'string') {
			param.value = value
		} else {
			param.definition = moddle.value.create('camunda:Script', {
				scriptFormat: 'javascript',
				value
			})
		}

		return param
	}

	/**
	 * 创建输出参数
	 */
	const createOutputParameter = (name: string, value: string) => {
		if (!moddle.value) return null

		return moddle.value.create('camunda:OutputParameter', {
			name,
			value
		})
	}

	/**
	 * 创建执行监听器
	 */
	const createExecutionListener = (event: string, listenerType: string, value: string) => {
		if (!moddle.value) return null

		const listener = moddle.value.create('camunda:ExecutionListener', { event })

		switch (listenerType) {
			case 'class':
				listener.class = value
				break
			case 'expression':
				listener.expression = value
				break
			case 'delegateExpression':
				listener.delegateExpression = value
				break
			case 'script':
				listener.script = moddle.value.create('camunda:Script', {
					scriptFormat: 'javascript',
					value
				})
				break
		}

		return listener
	}

	/**
	 * 创建任务监听器
	 */
	const createTaskListener = (event: string, listenerType: string, value: string) => {
		if (!moddle.value) return null

		const listener = moddle.value.create('camunda:TaskListener', { event })

		switch (listenerType) {
			case 'class':
				listener.class = value
				break
			case 'expression':
				listener.expression = value
				break
			case 'delegateExpression':
				listener.delegateExpression = value
				break
			case 'script':
				listener.script = moddle.value.create('camunda:Script', {
					scriptFormat: 'javascript',
					value
				})
				break
		}

		return listener
	}

	/**
	 * 获取或创建扩展元素
	 */
	const getOrCreateExtensionElements = () => {
		if (!element.value || !moddle.value) return null

		const bo = getBusinessObject(element.value)

		if (!bo.extensionElements) {
			bo.extensionElements = moddle.value.create('bpmn:ExtensionElements', {
				values: []
			})
		}

		return bo.extensionElements
	}

	/**
	 * 添加扩展元素
	 */
	const addExtensionElement = (extensionElement: any) => {
		const extensionElements = getOrCreateExtensionElements()
		if (!extensionElements) return

		extensionElements.values.push(extensionElement)
		// 触发流程图更新
		modeling.value.updateProperties(toRaw(element.value), {})
	}

	/**
	 * 移除扩展元素
	 */
	const removeExtensionElement = (extensionElement: any) => {
		const extensionElements = getOrCreateExtensionElements()
		if (!extensionElements) return

		const index = extensionElements.values.indexOf(extensionElement)
		if (index > -1) {
			extensionElements.values.splice(index, 1)
		}
		// 触发流程图更新
		modeling.value.updateProperties(toRaw(element.value), {})
	}

	/**
	 * 更新扩展元素
	 */
	const updateExtensionElements = (type: string, elements: any[]) => {
		if (!element.value || !moddle.value) return

		const bo = getBusinessObject(element.value)
		const extensionElements = getOrCreateExtensionElements()
		if (!extensionElements) return

		// 移除旧的元素
		extensionElements.values = extensionElements.values?.filter(
			(e: any) => e.$type !== type
		)

		// 添加新的元素
		extensionElements.values.push(...elements)

		// 如果没有扩展元素了，删除extensionElements
		if (extensionElements.values.length === 0) {
			delete bo.extensionElements
		}
		// 触发流程图更新
		modeling.value.updateProperties(toRaw(element.value), {})
	}

	/**
	 * 创建条件表达式
	 */
	const createConditionExpression = (body: string, language = 'juel') => {
		if (!moddle.value) return null

		return moddle.value.create('bpmn:FormalExpression', {
			body,
			language
		})
	}

	/**
	 * 创建文档
	 */
	const createDocumentation = (text: string) => {
		if (!moddle.value) return null

		return moddle.value.create('bpmn:Documentation', { text })
	}

	return {
		modeling,
		moddle,
		bpmnFactory,
		updateProperties,
		updateBusinessObject,
		updateLabel,
		createCamundaProperty,
		createCamundaField,
		createInputParameter,
		createOutputParameter,
		createExecutionListener,
		createTaskListener,
		getOrCreateExtensionElements,
		addExtensionElement,
		removeExtensionElement,
		updateExtensionElements,
		createConditionExpression,
		createDocumentation
	}
}
