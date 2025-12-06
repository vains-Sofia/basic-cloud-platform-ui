<template>
	<el-collapse-item title="监听器配置" name="listeners">
		<!-- 执行监听器 -->
		<div class="listener-group">
			<div class="listener-header">
				<span class="listener-title">执行监听器</span>
				<el-button
					type="primary"
					size="small"
					:icon="Plus"
					@click="handleAddExecutionListener"
				>
					添加
				</el-button>
			</div>

			<el-table
				:data="executionListeners"
				style="width: 100%; margin-top: 12px"
				empty-text="暂无执行监听器"
			>
				<el-table-column prop="event" label="事件" width="100">
					<template #default="{ row }">
						<el-tag size="small">{{ getEventLabel(row.event) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="listenerType" label="类型" width="115">
					<template #default="{ row }">
						{{ getListenerTypeLabel(row.listenerType) }}
					</template>
				</el-table-column>
				<el-table-column prop="value" label="值" show-overflow-tooltip />
				<el-table-column label="操作" width="120" align="center">
					<template #default="{ row, $index }">
						<el-button
							type="primary"
							size="small"
							link
							:icon="Edit"
							@click="handleEditExecutionListener(row, $index)"
						/>
						<el-button
							type="danger"
							size="small"
							link
							:icon="Delete"
							@click="handleDeleteExecutionListener($index)"
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 任务监听器 -->
		<div v-if="isUserTask" class="listener-group">
			<div class="listener-header">
				<span class="listener-title">任务监听器</span>
				<el-button type="primary" size="small" :icon="Plus" @click="handleAddTaskListener">
					添加
				</el-button>
			</div>

			<el-table
				:data="taskListeners"
				style="width: 100%; margin-top: 12px"
				empty-text="暂无任务监听器"
			>
				<el-table-column prop="event" label="事件" width="100">
					<template #default="{ row }">
						<el-tag size="small" type="success">{{
							getTaskEventLabel(row.event)
						}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="listenerType" label="类型" width="115">
					<template #default="{ row }">
						{{ getListenerTypeLabel(row.listenerType) }}
					</template>
				</el-table-column>
				<el-table-column prop="value" label="值" show-overflow-tooltip />
				<el-table-column label="操作" width="120" align="center">
					<template #default="{ row, $index }">
						<el-button
							type="primary"
							size="small"
							link
							:icon="Edit"
							@click="handleEditTaskListener(row, $index)"
						/>
						<el-button
							type="danger"
							size="small"
							link
							:icon="Delete"
							@click="handleDeleteTaskListener($index)"
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 监听器配置对话框 -->
		<el-dialog
			v-model="showDialog"
			:title="dialogTitle"
			width="600px"
			@close="handleCloseDialog"
		>
			<el-form :model="currentListener" label-width="100px">
				<el-form-item label="事件类型">
					<el-select v-model="currentListener.event" placeholder="请选择事件类型">
						<el-option
							v-for="event in currentEventOptions"
							:key="event.value"
							:label="event.label"
							:value="event.value"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="监听器类型">
					<el-select
						v-model="currentListener.listenerType"
						placeholder="请选择监听器类型"
						@change="handleListenerTypeChange"
					>
						<el-option label="Java类" value="class" />
						<el-option label="表达式" value="expression" />
						<el-option label="委托表达式" value="delegateExpression" />
						<el-option label="脚本" value="script" />
					</el-select>
				</el-form-item>

				<el-form-item
					v-if="currentListener.listenerType !== 'script'"
					:label="getValueLabel()"
				>
					<el-input
						v-model="currentListener.value"
						:placeholder="getValuePlaceholder()"
						clearable
					/>
				</el-form-item>

				<template v-if="currentListener.listenerType === 'script'">
					<el-form-item label="脚本格式">
						<el-select
							v-model="currentListener.scriptFormat"
							placeholder="请选择脚本格式"
						>
							<el-option label="JavaScript" value="javascript" />
							<el-option label="Groovy" value="groovy" />
							<el-option label="Python" value="python" />
							<el-option label="JUEL" value="juel" />
						</el-select>
					</el-form-item>

					<el-form-item label="脚本内容">
						<el-input
							v-model="currentListener.script"
							type="textarea"
							:rows="6"
							placeholder="请输入脚本内容"
						/>
					</el-form-item>
				</template>
			</el-form>

			<template #footer>
				<el-button @click="showDialog = false">取消</el-button>
				<el-button type="primary" @click="handleSaveListener">保存</el-button>
			</template>
		</el-dialog>
	</el-collapse-item>
</template>

<script setup lang="ts">
import Plus from '~icons/ep/plus'
import Edit from '~icons/ep/edit'
import Delete from '~icons/ep/delete'
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { BpmnElement } from '../types'
import { getExtensionElements, isUserTask } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

const { createExecutionListener, createTaskListener, updateExtensionElements } =
	useModeling(
		computed(() => props.modeler),
		computed(() => props.element),
	)

const executionListeners = ref<any[]>([])
const taskListeners = ref<any[]>([])
const showDialog = ref(false)
const dialogTitle = ref('')
const currentListener = ref<any>({})
const currentListenerIndex = ref(-1)
const currentListenerType = ref<'execution' | 'task'>('execution')

// 事件选项
const executionEventOptions = [
	{ label: '开始', value: 'start' },
	{ label: '结束', value: 'end' },
	{ label: '流转', value: 'take' },
]

const taskEventOptions = [
	{ label: '创建', value: 'create' },
	{ label: '指派', value: 'assignment' },
	{ label: '完成', value: 'complete' },
	{ label: '删除', value: 'delete' },
	{ label: '更新', value: 'update' },
	{ label: '超时', value: 'timeout' },
]

const currentEventOptions = computed(() => {
	return currentListenerType.value === 'execution' ? executionEventOptions : taskEventOptions
})

// 初始化监听器数据
const initListeners = () => {
	// const bo = getBusinessObject(props.element)

	// 执行监听器
	const execListeners = getExtensionElements(props.element, 'camunda:ExecutionListener') || []
	executionListeners.value = execListeners.map((listener: any) => ({
		event: listener.event,
		listenerType: getListenerType(listener),
		value: getListenerValue(listener),
		raw: listener,
	}))

	// 任务监听器
	if (isUserTask(props.element)) {
		const tListeners = getExtensionElements(props.element, 'camunda:TaskListener') || []
		taskListeners.value = tListeners.map((listener: any) => ({
			event: listener.event,
			listenerType: getListenerType(listener),
			value: getListenerValue(listener),
			raw: listener,
		}))
	}
}

// 获取监听器类型
const getListenerType = (listener: any): string => {
	if (listener.class) return 'class'
	if (listener.expression) return 'expression'
	if (listener.delegateExpression) return 'delegateExpression'
	if (listener.script) return 'script'
	return 'class'
}

// 获取监听器值
const getListenerValue = (listener: any): string => {
	if (listener.class) return listener.class
	if (listener.expression) return listener.expression
	if (listener.delegateExpression) return listener.delegateExpression
	if (listener.script) return listener.script.value || ''
	return ''
}

// 标签转换
const getEventLabel = (event: string) => {
	const map: Record<string, string> = {
		start: '开始',
		end: '结束',
		take: '流转',
	}
	return map[event] || event
}

const getTaskEventLabel = (event: string) => {
	const map: Record<string, string> = {
		create: '创建',
		assignment: '指派',
		complete: '完成',
		delete: '删除',
		update: '更新',
		timeout: '超时',
	}
	return map[event] || event
}

const getListenerTypeLabel = (type: string) => {
	const map: Record<string, string> = {
		class: 'Java类',
		expression: '表达式',
		delegateExpression: '委托表达式',
		script: '脚本',
	}
	return map[type] || type
}

const getValueLabel = () => {
	const map: Record<string, string> = {
		class: 'Java类',
		expression: '表达式',
		delegateExpression: '委托表达式',
	}
	return map[currentListener.value.listenerType] || '值'
}

const getValuePlaceholder = () => {
	const map: Record<string, string> = {
		class: '如：com.example.MyListener',
		expression: '如：${myBean.doSomething()}',
		delegateExpression: '如：${myListenerBean}',
	}
	return map[currentListener.value.listenerType] || ''
}

watch(
	() => props.element,
	() => {
		if (props.element) {
			initListeners()
		}
	},
	{ immediate: true },
)

// 添加执行监听器
const handleAddExecutionListener = () => {
	currentListenerType.value = 'execution'
	currentListener.value = {
		event: 'start',
		listenerType: 'class',
		value: '',
		scriptFormat: 'javascript',
		script: '',
	}
	currentListenerIndex.value = -1
	dialogTitle.value = '添加执行监听器'
	showDialog.value = true
}

// 添加任务监听器
const handleAddTaskListener = () => {
	currentListenerType.value = 'task'
	currentListener.value = {
		event: 'create',
		listenerType: 'class',
		value: '',
		scriptFormat: 'javascript',
		script: '',
	}
	currentListenerIndex.value = -1
	dialogTitle.value = '添加任务监听器'
	showDialog.value = true
}

// 编辑执行监听器
const handleEditExecutionListener = (row: any, index: number) => {
	currentListenerType.value = 'execution'
	const listener = row.raw
	currentListener.value = {
		event: listener.event,
		listenerType: getListenerType(listener),
		value: getListenerValue(listener),
		scriptFormat: listener.script?.scriptFormat || 'javascript',
		script: listener.script?.value || '',
	}
	currentListenerIndex.value = index
	dialogTitle.value = '编辑执行监听器'
	showDialog.value = true
}

// 编辑任务监听器
const handleEditTaskListener = (row: any, index: number) => {
	currentListenerType.value = 'task'
	const listener = row.raw
	currentListener.value = {
		event: listener.event,
		listenerType: getListenerType(listener),
		value: getListenerValue(listener),
		scriptFormat: listener.script?.scriptFormat || 'javascript',
		script: listener.script?.value || '',
	}
	currentListenerIndex.value = index
	dialogTitle.value = '编辑任务监听器'
	showDialog.value = true
}

// 删除执行监听器
const handleDeleteExecutionListener = (index: number) => {
	ElMessageBox.confirm('确定要删除此执行监听器吗？', '提示', {
		type: 'warning',
	})
		.then(() => {
			executionListeners.value.splice(index, 1)
			saveExecutionListeners()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 删除任务监听器
const handleDeleteTaskListener = (index: number) => {
	ElMessageBox.confirm('确定要删除此任务监听器吗？', '提示', {
		type: 'warning',
	})
		.then(() => {
			taskListeners.value.splice(index, 1)
			saveTaskListeners()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 监听器类型变化
const handleListenerTypeChange = () => {
	currentListener.value.value = ''
	currentListener.value.script = ''
}

// 保存监听器
const handleSaveListener = () => {
	if (currentListenerType.value === 'execution') {
		saveExecutionListener()
	} else {
		saveTaskListener()
	}
}

// 保存执行监听器
const saveExecutionListener = () => {
	const value =
		currentListener.value.listenerType === 'script'
			? currentListener.value.script
			: currentListener.value.value

	if (!value.trim()) {
		ElMessage.warning('请填写完整信息')
		return
	}

	const listener = createExecutionListener(
		currentListener.value.event,
		currentListener.value.listenerType,
		currentListener.value.listenerType === 'script'
			? currentListener.value.script
			: currentListener.value.value,
	)

	if (currentListenerIndex.value >= 0) {
		executionListeners.value[currentListenerIndex.value] = {
			event: currentListener.value.event,
			listenerType: currentListener.value.listenerType,
			value,
			raw: listener,
		}
	} else {
		executionListeners.value.push({
			event: currentListener.value.event,
			listenerType: currentListener.value.listenerType,
			value,
			raw: listener,
		})
	}

	saveExecutionListeners()
	showDialog.value = false
	ElMessage.success('保存成功')
}

// 保存任务监听器
const saveTaskListener = () => {
	const value =
		currentListener.value.listenerType === 'script'
			? currentListener.value.script
			: currentListener.value.value

	if (!value.trim()) {
		ElMessage.warning('请填写完整信息')
		return
	}

	const listener = createTaskListener(
		currentListener.value.event,
		currentListener.value.listenerType,
		currentListener.value.listenerType === 'script'
			? currentListener.value.script
			: currentListener.value.value,
	)

	if (currentListenerIndex.value >= 0) {
		taskListeners.value[currentListenerIndex.value] = {
			event: currentListener.value.event,
			listenerType: currentListener.value.listenerType,
			value,
			raw: listener,
		}
	} else {
		taskListeners.value.push({
			event: currentListener.value.event,
			listenerType: currentListener.value.listenerType,
			value,
			raw: listener,
		})
	}

	saveTaskListeners()
	showDialog.value = false
	ElMessage.success('保存成功')
}

// 保存到BPMN
const saveExecutionListeners = () => {
	const listeners = executionListeners.value.map((l) => l.raw)
	updateExtensionElements('camunda:ExecutionListener', listeners)
}

const saveTaskListeners = () => {
	const listeners = taskListeners.value.map((l) => l.raw)
	updateExtensionElements('camunda:TaskListener', listeners)
}

const handleCloseDialog = () => {
	currentListener.value = {}
	currentListenerIndex.value = -1
}
</script>

<style scoped>
.listener-group {
	margin-bottom: 24px;
}

.listener-group:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.listener-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.listener-title {
	font-size: 14px;
	font-weight: 600;
	color: #303133;
}
</style>
