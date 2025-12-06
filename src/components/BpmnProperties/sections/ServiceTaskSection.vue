<template>
	<el-collapse-item title="服务任务配置" name="serviceTask">
		<el-form :model="formData" label-width="80px" label-position="left">
			<el-form-item label="实现类型">
				<el-select
					v-model="formData.implementationType"
					@change="handleImplementationTypeChange"
					placeholder="选择实现类型"
				>
					<el-option label="Java类" value="class" />
					<el-option label="表达式" value="expression" />
					<el-option label="委托表达式" value="delegateExpression" />
					<el-option label="外部任务" value="external" />
					<el-option label="连接器" value="connector" />
				</el-select>
			</el-form-item>

			<!-- Java类 -->
			<template v-if="formData.implementationType === 'class'">
				<el-form-item label="Java类">
					<el-input
						v-model="formData.class"
						@input="handleUpdate"
						placeholder="如：com.example.service.MyDelegate"
						clearable
					/>
					<div class="field-tip">完整的Java类名，需实现JavaDelegate接口</div>
				</el-form-item>
			</template>

			<!-- 表达式 -->
			<template v-if="formData.implementationType === 'expression'">
				<el-form-item label="表达式">
					<el-input
						v-model="formData.expression"
						@input="handleUpdate"
						placeholder="如：${myBean.execute(execution)}"
						clearable
					/>
					<div class="field-tip">Spring Bean方法调用表达式</div>
				</el-form-item>
			</template>

			<!-- 委托表达式 -->
			<template v-if="formData.implementationType === 'delegateExpression'">
				<el-form-item label="委托表达式">
					<el-input
						v-model="formData.delegateExpression"
						@input="handleUpdate"
						placeholder="如：${myDelegateBean}"
						clearable
					/>
					<div class="field-tip">指向JavaDelegate实现的Spring Bean</div>
				</el-form-item>
			</template>

			<!-- 外部任务 -->
			<template v-if="formData.implementationType === 'external'">
				<el-form-item label="任务主题">
					<el-input
						v-model="formData.topic"
						@input="handleUpdate"
						placeholder="如：invoice-processing"
						clearable
					/>
					<div class="field-tip">外部任务的主题名称</div>
				</el-form-item>

				<el-form-item label="任务优先级">
					<el-input
						v-model="formData.taskPriority"
						@input="handleUpdate"
						placeholder="如：100 或 ${priority}"
						clearable
					/>
					<div class="field-tip">支持数值或表达式</div>
				</el-form-item>
			</template>

			<!-- 连接器 -->
			<template v-if="formData.implementationType === 'connector'">
				<el-form-item label="连接器ID">
					<el-select
						v-model="formData.connectorId"
						@change="handleUpdate"
						placeholder="选择连接器类型"
					>
						<el-option label="HTTP连接器" value="http-connector" />
						<el-option label="SOAP连接器" value="soap-http-connector" />
						<el-option label="REST连接器" value="rest-connector" />
						<el-option label="邮件连接器" value="mail-connector" />
					</el-select>
				</el-form-item>
			</template>

			<!-- 通用配置 -->
			<el-divider content-position="left">通用配置</el-divider>

			<el-form-item label="结果变量">
				<el-input
					v-model="formData.resultVariable"
					@input="handleUpdate"
					placeholder="存储返回结果的变量名"
					clearable
				/>
				<div class="field-tip">将方法返回值存储到指定变量中</div>
			</el-form-item>

			<!-- 字段注入 -->
			<el-form-item label="字段注入">
				<div class="fields-container">
					<el-button
						type="primary"
						size="small"
						:icon="Plus"
						@click="handleAddField"
						style="margin-bottom: 12px"
					>
						添加字段
					</el-button>
				</div>
			</el-form-item>
			<el-table :data="fields" style="width: 100%" empty-text="暂无字段注入">
				<el-table-column prop="name" label="字段名" width="120" />
				<el-table-column prop="type" label="类型" width="80">
					<template #default="{ row }">
						<el-tag size="small" :type="row.type === 'string' ? 'success' : 'warning'">
							{{ row.type === 'string' ? '字符串' : '表达式' }}
						</el-tag>
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
							@click="handleEditField(row, $index)"
						/>
						<el-button
							type="danger"
							size="small"
							link
							:icon="Delete"
							@click="handleDeleteField($index)"
						/>
					</template>
				</el-table-column>
			</el-table>
		</el-form>

		<!-- 字段注入对话框 -->
		<el-dialog
			v-model="showFieldDialog"
			:title="fieldDialogTitle"
			width="500px"
			@close="handleCloseFieldDialog"
		>
			<el-form :model="currentField" label-width="100px">
				<el-form-item label="字段名" required>
					<el-input v-model="currentField.name" placeholder="字段名称" />
				</el-form-item>

				<el-form-item label="类型" required>
					<el-radio-group v-model="currentField.type">
						<el-radio label="string">字符串</el-radio>
						<el-radio label="expression">表达式</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item
					:label="currentField.type === 'string' ? '字符串值' : '表达式'"
					required
				>
					<el-input
						v-model="currentField.value"
						:placeholder="
							currentField.type === 'string' ? '输入字符串值' : '如：${variableName}'
						"
					/>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="showFieldDialog = false">取消</el-button>
				<el-button type="primary" @click="handleSaveField">保存</el-button>
			</template>
		</el-dialog>
	</el-collapse-item>
</template>

<script setup lang="ts">
import Plus from '~icons/ep/plus'
import Edit from '~icons/ep/edit'
import Delete from '~icons/ep/delete'
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { BpmnElement } from '../types'
import { getBusinessObject, getExtensionElements } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'
import { useDebounce } from '@/hooks/useDebounce.ts'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

const { moddle, updateProperties, createCamundaField, updateExtensionElements } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element),
)

const formData = ref({
	implementationType: 'class',
	class: '',
	expression: '',
	delegateExpression: '',
	topic: '',
	taskPriority: '',
	connectorId: '',
	resultVariable: '',
})

const fields = ref<any[]>([])
const showFieldDialog = ref(false)
const fieldDialogTitle = ref('')
const currentField = ref<any>({})
const currentFieldIndex = ref(-1)

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	// 判断实现类型
	if (bo.class) {
		formData.value.implementationType = 'class'
		formData.value.class = bo.class
	} else if (bo.expression) {
		formData.value.implementationType = 'expression'
		formData.value.expression = bo.expression
	} else if (bo.delegateExpression) {
		formData.value.implementationType = 'delegateExpression'
		formData.value.delegateExpression = bo.delegateExpression
	} else if (bo.type === 'external') {
		formData.value.implementationType = 'external'
		formData.value.topic = bo.topic || ''
		formData.value.taskPriority = bo.taskPriority || ''
	} else {
		// 检查是否有连接器
		const connectors = getExtensionElements(props.element, 'camunda:Connector')

		if (connectors && connectors.length > 0) {
			formData.value.implementationType = 'connector'
			formData.value.connectorId = connectors?.[0].connectorId || ''
		}
	}

	formData.value.resultVariable = bo.resultVariable || ''

	// 加载字段注入
	const extensions = getExtensionElements(props.element, 'camunda:Field')
	if (extensions && extensions.length > 0) {
		fields.value = extensions.map((field: any) => ({
			name: field.name,
			type: field.string ? 'string' : 'expression',
			value: field.string || field.expression || '',
			raw: field,
		}))
	} else {
		fields.value = []
	}
}

watch(
	() => props.element,
	() => {
		if (props.element) {
			initFormData()
		}
	},
	{ immediate: true },
)

// 实现类型切换
const handleImplementationTypeChange = () => {
	// 清空所有实现相关属性
	updateProperties({
		class: undefined,
		expression: undefined,
		delegateExpression: undefined,
		type: undefined,
		topic: undefined,
		taskPriority: undefined,
	})

	// 清空连接器
	if (formData.value.implementationType !== 'connector') {
		updateExtensionElements('camunda:Connector', [])
	}

	// 设置外部任务类型
	if (formData.value.implementationType === 'external') {
		updateProperties({ type: 'external' })
	}
}

// 更新配置
const handleUpdate = useDebounce(() => {
	const updates: any = {
		resultVariable: formData.value.resultVariable || undefined,
	}

	switch (formData.value.implementationType) {
		case 'class':
			updates.class = formData.value.class || undefined
			updates.expression = undefined
			updates.delegateExpression = undefined
			updates.type = undefined
			updates.topic = undefined
			updates.taskPriority = undefined
			break
		case 'expression':
			updates.class = undefined
			updates.expression = formData.value.expression || undefined
			updates.delegateExpression = undefined
			updates.type = undefined
			updates.topic = undefined
			updates.taskPriority = undefined
			break
		case 'delegateExpression':
			updates.class = undefined
			updates.expression = undefined
			updates.delegateExpression = formData.value.delegateExpression || undefined
			updates.type = undefined
			updates.topic = undefined
			updates.taskPriority = undefined
			break
		case 'external':
			updates.class = undefined
			updates.expression = undefined
			updates.delegateExpression = undefined
			updates.type = 'external'
			updates.topic = formData.value.topic || undefined
			updates.taskPriority = formData.value.taskPriority || undefined
			break
		case 'connector':
			updates.class = undefined
			updates.expression = undefined
			updates.delegateExpression = undefined
			updates.type = undefined
			updates.topic = undefined
			updates.taskPriority = undefined
			// 创建连接器
			if (formData.value.connectorId) {
				const connector = moddle.value.create('camunda:Connector', {
					connectorId: formData.value.connectorId,
				})
				updateExtensionElements('camunda:Connector', [connector])
			}
			break
	}

	updateProperties(updates)
}, 400)

// 添加字段
const handleAddField = () => {
	currentField.value = {
		name: '',
		type: 'string',
		value: '',
	}
	currentFieldIndex.value = -1
	fieldDialogTitle.value = '添加字段注入'
	showFieldDialog.value = true
}

// 编辑字段
const handleEditField = (row: any, index: number) => {
	currentField.value = { ...row }
	currentFieldIndex.value = index
	fieldDialogTitle.value = '编辑字段注入'
	showFieldDialog.value = true
}

// 删除字段
const handleDeleteField = (index: number) => {
	ElMessageBox.confirm('确定要删除此字段吗？', '提示', {
		type: 'warning',
	})
		.then(() => {
			fields.value.splice(index, 1)
			saveFields()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 保存字段
const handleSaveField = () => {
	if (!currentField.value.name || !currentField.value.value) {
		ElMessage.warning('请填写完整信息')
		return
	}

	const field = createCamundaField(
		currentField.value.name,
		currentField.value.value,
		currentField.value.type,
	)

	if (currentFieldIndex.value >= 0) {
		fields.value[currentFieldIndex.value] = {
			...currentField.value,
			raw: field,
		}
	} else {
		fields.value.push({
			...currentField.value,
			raw: field,
		})
	}

	saveFields()
	showFieldDialog.value = false
	ElMessage.success('保存成功')
}

// 保存字段到BPMN
const saveFields = () => {
	const fieldElements = fields.value.map((f) => f.raw)
	updateExtensionElements('camunda:Field', fieldElements)
}

const handleCloseFieldDialog = () => {
	currentField.value = {}
	currentFieldIndex.value = -1
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
}

.fields-container {
	width: 100%;
}
</style>
