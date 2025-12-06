<template>
	<el-collapse-item title="事件配置" name="event">
		<el-form :model="formData" label-width="70px" label-position="left">
			<el-form-item label="事件类型">
				<el-select
					v-model="formData.eventType"
					@change="handleEventTypeChange"
					placeholder="选择事件类型"
				>
					<el-option label="定时器事件" value="timer" />
					<el-option label="消息事件" value="message" />
					<el-option label="错误事件" value="error" />
					<el-option label="信号事件" value="signal" />
					<el-option label="升级事件" value="escalation" />
					<el-option label="补偿事件" value="compensation" />
					<el-option label="条件事件" value="conditional" />
					<el-option label="链接事件" value="link" />
				</el-select>
			</el-form-item>

			<!-- 定时器事件 -->
			<template v-if="formData.eventType === 'timer'">
				<el-form-item label="定时类型">
					<el-radio-group v-model="formData.timerType" @change="handleUpdate">
						<el-radio label="timeDate">指定日期</el-radio>
						<el-radio label="timeDuration">持续时间</el-radio>
						<el-radio label="timeCycle">周期循环</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item :label="getTimerLabel()">
					<el-input
						v-model="formData.timerValue"
						@blur="handleUpdate"
						:placeholder="getTimerPlaceholder()"
						clearable
					/>
					<div class="field-tip">{{ getTimerTip() }}</div>
				</el-form-item>
			</template>

			<!-- 消息事件 -->
			<template v-if="formData.eventType === 'message'">
				<el-form-item label="消息名称">
					<el-input
						v-model="formData.messageName"
						@blur="handleUpdate"
						placeholder="如：PaymentReceived"
						clearable
					/>
				</el-form-item>

				<el-form-item label="消息引用">
					<el-input
						v-model="formData.messageRef"
						@blur="handleUpdate"
						placeholder="消息定义的ID"
						clearable
					/>
				</el-form-item>
			</template>

			<!-- 错误事件 -->
			<template v-if="formData.eventType === 'error'">
				<el-form-item label="错误代码">
					<el-input
						v-model="formData.errorCode"
						@blur="handleUpdate"
						placeholder="如：E001"
						clearable
					/>
				</el-form-item>

				<el-form-item label="错误消息">
					<el-input
						v-model="formData.errorMessage"
						@blur="handleUpdate"
						placeholder="错误描述信息"
						clearable
					/>
				</el-form-item>

				<el-form-item label="错误代码变量">
					<el-input
						v-model="formData.errorCodeVariable"
						@blur="handleUpdate"
						placeholder="存储错误代码的变量"
						clearable
					/>
				</el-form-item>

				<el-form-item label="错误消息变量">
					<el-input
						v-model="formData.errorMessageVariable"
						@blur="handleUpdate"
						placeholder="存储错误消息的变量"
						clearable
					/>
				</el-form-item>
			</template>

			<!-- 信号事件 -->
			<template v-if="formData.eventType === 'signal'">
				<el-form-item label="信号名称">
					<el-input
						v-model="formData.signalName"
						@blur="handleUpdate"
						placeholder="如：OrderCancelled"
						clearable
					/>
				</el-form-item>

				<el-form-item label="信号引用">
					<el-input
						v-model="formData.signalRef"
						@blur="handleUpdate"
						placeholder="信号定义的ID"
						clearable
					/>
				</el-form-item>

				<el-form-item label="信号范围">
					<el-radio-group v-model="formData.signalScope" @change="handleUpdate">
						<el-radio label="global">全局</el-radio>
						<el-radio label="processInstance">流程实例</el-radio>
					</el-radio-group>
					<div class="field-tip">全局信号可跨流程实例传播</div>
				</el-form-item>
			</template>

			<!-- 升级事件 -->
			<template v-if="formData.eventType === 'escalation'">
				<el-form-item label="升级代码">
					<el-input
						v-model="formData.escalationCode"
						@blur="handleUpdate"
						placeholder="如：ESC001"
						clearable
					/>
				</el-form-item>

				<el-form-item label="升级名称">
					<el-input
						v-model="formData.escalationName"
						@blur="handleUpdate"
						placeholder="升级描述"
						clearable
					/>
				</el-form-item>
			</template>

			<!-- 条件事件 -->
			<template v-if="formData.eventType === 'conditional'">
				<el-form-item label="条件表达式">
					<el-input
						v-model="formData.condition"
						type="textarea"
						:rows="4"
						@blur="handleUpdate"
						placeholder="如：${amount > 1000}"
					/>
					<div class="field-tip">使用JUEL表达式</div>
				</el-form-item>

				<el-form-item label="变量名称">
					<el-input
						v-model="formData.variableName"
						@blur="handleUpdate"
						placeholder="监听的变量名"
						clearable
					/>
				</el-form-item>

				<el-form-item label="变量事件">
					<el-select
						v-model="formData.variableEvents"
						@change="handleUpdate"
						multiple
						placeholder="选择触发条件的变量事件"
					>
						<el-option label="创建" value="create" />
						<el-option label="更新" value="update" />
						<el-option label="删除" value="delete" />
					</el-select>
				</el-form-item>
			</template>

			<!-- 链接事件 -->
			<template v-if="formData.eventType === 'link'">
				<el-form-item label="链接名称">
					<el-input
						v-model="formData.linkName"
						@blur="handleUpdate"
						placeholder="链接标识"
						clearable
					/>
					<div class="field-tip">链接抛出和捕获事件必须使用相同的名称</div>
				</el-form-item>
			</template>

			<!-- 定时器示例 -->
			<template v-if="formData.eventType === 'timer'">
				<el-divider content-position="left">定时器示例</el-divider>
				<el-collapse class="example-collapse">
					<el-collapse-item title="ISO 8601 格式说明" name="timer">
						<div class="timer-examples">
							<div class="example-item">
								<strong>指定日期：</strong>
								<code>2024-12-31T23:59:59</code>
								<p>在指定的日期时间触发</p>
							</div>
							<div class="example-item">
								<strong>持续时间：</strong>
								<code>PT5M</code> (5分钟), <code>PT1H</code> (1小时), <code>P1D</code> (1天)
								<p>从当前时间开始，经过指定时长后触发</p>
							</div>
							<div class="example-item">
								<strong>周期循环：</strong>
								<code>R3/PT10M</code> (重复3次，间隔10分钟)
								<code>R/P1D</code> (每天重复)
								<p>R：重复次数，不指定次数则无限重复</p>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>
			</template>
		</el-form>
	</el-collapse-item>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BpmnElement } from '../types'
import {
	getBusinessObject,
	getEventDefinition,
	hasEventDefinition
} from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

// const { moddle, updateProperties } = useModeling(
// 	computed(() => props.modeler),
// 	computed(() => props.element)
// )
const { moddle } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element)
)

const formData = ref({
	eventType: '',
	timerType: 'timeDate',
	timerValue: '',
	messageName: '',
	messageRef: '',
	errorCode: '',
	errorMessage: '',
	errorCodeVariable: '',
	errorMessageVariable: '',
	signalName: '',
	signalRef: '',
	signalScope: 'global',
	escalationCode: '',
	escalationName: '',
	condition: '',
	variableName: '',
	variableEvents: [] as string[],
	linkName: ''
})

// 初始化表单数据
const initFormData = () => {
	// const bo = getBusinessObject(props.element)

	// 判断事件类型
	if (hasEventDefinition(props.element, 'bpmn:TimerEventDefinition')) {
		formData.value.eventType = 'timer'
		const timerDef = getEventDefinition(props.element, 'bpmn:TimerEventDefinition')
		if (timerDef.timeDate) {
			formData.value.timerType = 'timeDate'
			formData.value.timerValue = timerDef.timeDate.body || ''
		} else if (timerDef.timeDuration) {
			formData.value.timerType = 'timeDuration'
			formData.value.timerValue = timerDef.timeDuration.body || ''
		} else if (timerDef.timeCycle) {
			formData.value.timerType = 'timeCycle'
			formData.value.timerValue = timerDef.timeCycle.body || ''
		}
	} else if (hasEventDefinition(props.element, 'bpmn:MessageEventDefinition')) {
		formData.value.eventType = 'message'
		const msgDef = getEventDefinition(props.element, 'bpmn:MessageEventDefinition')
		formData.value.messageRef = msgDef.messageRef?.id || ''
		formData.value.messageName = msgDef.messageRef?.name || ''
	} else if (hasEventDefinition(props.element, 'bpmn:ErrorEventDefinition')) {
		formData.value.eventType = 'error'
		const errorDef = getEventDefinition(props.element, 'bpmn:ErrorEventDefinition')
		formData.value.errorCode = errorDef.errorRef?.errorCode || ''
		formData.value.errorMessage = errorDef.errorRef?.errorMessage || ''
		formData.value.errorCodeVariable = errorDef.errorCodeVariable || ''
		formData.value.errorMessageVariable = errorDef.errorMessageVariable || ''
	} else if (hasEventDefinition(props.element, 'bpmn:SignalEventDefinition')) {
		formData.value.eventType = 'signal'
		const signalDef = getEventDefinition(props.element, 'bpmn:SignalEventDefinition')
		formData.value.signalRef = signalDef.signalRef?.id || ''
		formData.value.signalName = signalDef.signalRef?.name || ''
		formData.value.signalScope = signalDef.scope || 'global'
	} else if (hasEventDefinition(props.element, 'bpmn:EscalationEventDefinition')) {
		formData.value.eventType = 'escalation'
		const escDef = getEventDefinition(props.element, 'bpmn:EscalationEventDefinition')
		formData.value.escalationCode = escDef.escalationRef?.escalationCode || ''
		formData.value.escalationName = escDef.escalationRef?.name || ''
	} else if (hasEventDefinition(props.element, 'bpmn:ConditionalEventDefinition')) {
		formData.value.eventType = 'conditional'
		const condDef = getEventDefinition(props.element, 'bpmn:ConditionalEventDefinition')
		formData.value.condition = condDef.condition?.body || ''
		formData.value.variableName = condDef.variableName || ''
		formData.value.variableEvents = condDef.variableEvents?.split(',') || []
	} else if (hasEventDefinition(props.element, 'bpmn:LinkEventDefinition')) {
		formData.value.eventType = 'link'
		const linkDef = getEventDefinition(props.element, 'bpmn:LinkEventDefinition')
		formData.value.linkName = linkDef.name || ''
	}
}

watch(
	() => props.element,
	() => {
		if (props.element) {
			initFormData()
		}
	},
	{ immediate: true }
)

// 事件类型切换
const handleEventTypeChange = () => {
	// 清空当前事件定义，创建新的
	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = []
	handleUpdate()
}

// 更新事件定义
const handleUpdate = () => {
	// const bo = getBusinessObject(props.element)

	switch (formData.value.eventType) {
		case 'timer':
			updateTimerDefinition()
			break
		case 'message':
			updateMessageDefinition()
			break
		case 'error':
			updateErrorDefinition()
			break
		case 'signal':
			updateSignalDefinition()
			break
		case 'escalation':
			updateEscalationDefinition()
			break
		case 'conditional':
			updateConditionalDefinition()
			break
		case 'link':
			updateLinkDefinition()
			break
	}
}

const updateTimerDefinition = () => {
	const timerDef = moddle.value.create('bpmn:TimerEventDefinition')
	const expression = moddle.value.create('bpmn:FormalExpression', {
		body: formData.value.timerValue
	})

	switch (formData.value.timerType) {
		case 'timeDate':
			timerDef.timeDate = expression
			break
		case 'timeDuration':
			timerDef.timeDuration = expression
			break
		case 'timeCycle':
			timerDef.timeCycle = expression
			break
	}

	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = [timerDef]
}

const updateMessageDefinition = () => {
	const messageDef = moddle.value.create('bpmn:MessageEventDefinition')
	if (formData.value.messageRef || formData.value.messageName) {
		const message = moddle.value.create('bpmn:Message', {
			id: formData.value.messageRef || `Message_${Date.now()}`,
			name: formData.value.messageName
		})
		messageDef.messageRef = message
	}

	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = [messageDef]
}

const updateErrorDefinition = () => {
	const errorDef = moddle.value.create('bpmn:ErrorEventDefinition')
	if (formData.value.errorCode || formData.value.errorMessage) {
		const error = moddle.value.create('bpmn:Error', {
			id: `Error_${Date.now()}`,
			errorCode: formData.value.errorCode,
			errorMessage: formData.value.errorMessage
		})
		errorDef.errorRef = error
	}
	errorDef.errorCodeVariable = formData.value.errorCodeVariable || undefined
	errorDef.errorMessageVariable = formData.value.errorMessageVariable || undefined

	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = [errorDef]
}

const updateSignalDefinition = () => {
	const signalDef = moddle.value.create('bpmn:SignalEventDefinition')
	if (formData.value.signalRef || formData.value.signalName) {
		const signal = moddle.value.create('bpmn:Signal', {
			id: formData.value.signalRef || `Signal_${Date.now()}`,
			name: formData.value.signalName
		})
		signalDef.signalRef = signal
	}
	signalDef.scope = formData.value.signalScope

	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = [signalDef]
}

const updateEscalationDefinition = () => {
	const escDef = moddle.value.create('bpmn:EscalationEventDefinition')
	if (formData.value.escalationCode || formData.value.escalationName) {
		const escalation = moddle.value.create('bpmn:Escalation', {
			id: `Escalation_${Date.now()}`,
			escalationCode: formData.value.escalationCode,
			name: formData.value.escalationName
		})
		escDef.escalationRef = escalation
	}

	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = [escDef]
}

const updateConditionalDefinition = () => {
	const condDef = moddle.value.create('bpmn:ConditionalEventDefinition')
	if (formData.value.condition) {
		condDef.condition = moddle.value.create('bpmn:FormalExpression', {
			body: formData.value.condition
		})
	}
	condDef.variableName = formData.value.variableName || undefined
	condDef.variableEvents = formData.value.variableEvents.join(',') || undefined

	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = [condDef]
}

const updateLinkDefinition = () => {
	const linkDef = moddle.value.create('bpmn:LinkEventDefinition', {
		name: formData.value.linkName
	})

	const bo = getBusinessObject(props.element)
	bo.eventDefinitions = [linkDef]
}

const getTimerLabel = () => {
	const labels: Record<string, string> = {
		timeDate: '指定日期',
		timeDuration: '持续时间',
		timeCycle: '周期循环'
	}
	return labels[formData.value.timerType] || '定时值'
}

const getTimerPlaceholder = () => {
	const placeholders: Record<string, string> = {
		timeDate: '如：2024-12-31T23:59:59 或 ${dueDate}',
		timeDuration: '如：PT5M (5分钟) 或 ${duration}',
		timeCycle: '如：R3/PT10M (重复3次，间隔10分钟)'
	}
	return placeholders[formData.value.timerType] || ''
}

const getTimerTip = () => {
	const tips: Record<string, string> = {
		timeDate: 'ISO 8601日期时间格式或表达式',
		timeDuration: 'ISO 8601持续时间格式或表达式',
		timeCycle: 'ISO 8601重复间隔格式或表达式'
	}
	return tips[formData.value.timerType] || ''
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: #909399;
	margin-top: 4px;
}

.example-collapse {
	margin-top: 12px;
}

.timer-examples {
	font-size: 13px;
}

.example-item {
	margin-bottom: 16px;
	padding: 12px;
	background: #f5f7fa;
	border-radius: 4px;
}

.example-item strong {
	display: block;
	margin-bottom: 4px;
	color: #303133;
}

.example-item code {
	display: inline-block;
	margin: 4px 0;
	padding: 2px 8px;
	background: #fff;
	border: 1px solid #dcdfe6;
	border-radius: 3px;
	font-family: 'Consolas', 'Monaco', monospace;
	font-size: 12px;
}

.example-item p {
	margin: 8px 0 0 0;
	color: #606266;
	line-height: 1.5;
}
</style>
