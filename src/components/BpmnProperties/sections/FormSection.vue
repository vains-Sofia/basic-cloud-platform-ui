<template>
	<el-collapse-item title="表单配置" name="form">
		<el-form :model="formData" label-position="left">
			<el-form-item label="表单类型">
				<el-radio-group v-model="formData.formType" @change="handleFormTypeChange">
					<el-radio label="formKey">表单标识</el-radio>
					<el-radio label="formRef">表单引用</el-radio>
					<el-radio label="formFields">表单字段</el-radio>
				</el-radio-group>
			</el-form-item>

			<!-- 表单标识 -->
			<template v-if="formData.formType === 'formKey'">
				<el-form-item label="Form Key">
					<el-input
						v-model="formData.formKey"
						@input="handleUpdate"
						placeholder="如：embedded:app:forms/myForm.html"
						clearable
					/>
					<div class="field-tip">嵌入式表单或外部表单路径</div>
				</el-form-item>
			</template>

			<!-- 表单引用 -->
			<template v-if="formData.formType === 'formRef'">
				<el-form-item label="表单引用">
					<el-input
						v-model="formData.formRef"
						@input="handleUpdate"
						placeholder="表单定义的ID"
						clearable
					/>
				</el-form-item>

				<el-form-item label="绑定类型">
					<el-select v-model="formData.formRefBinding" @change="handleUpdate">
						<el-option label="最新版本" value="latest" />
						<el-option label="部署版本" value="deployment" />
						<el-option label="指定版本" value="version" />
					</el-select>
				</el-form-item>

				<el-form-item v-if="formData.formRefBinding === 'version'" label="版本号">
					<el-input-number
						v-model="formData.formRefVersion"
						@change="handleUpdate"
						:min="1"
						style="width: 100%"
					/>
				</el-form-item>
			</template>

			<!-- 表单字段 -->
			<template v-if="formData.formType === 'formFields'">
				<el-form-item label="表单字段">
					<div class="form-fields-container">
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
				<el-table :data="formFields" style="width: 100%" empty-text="暂无表单字段">
					<el-table-column prop="id" label="字段ID" width="120" />
					<el-table-column prop="label" label="标签" width="100" />
					<el-table-column prop="type" label="类型" width="95">
						<template #default="{ row }">
							<el-tag size="small">{{ getFieldTypeLabel(row.type) }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100" align="center">
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
			</template>
		</el-form>

		<!-- 表单字段配置对话框 -->
		<el-dialog
			v-model="showFieldDialog"
			:title="fieldDialogTitle"
			width="600px"
			@close="handleCloseFieldDialog"
		>
			<el-form :model="currentField" label-width="100px">
				<el-form-item label="字段ID" required>
					<el-input v-model="currentField.id" placeholder="字段唯一标识" />
				</el-form-item>

				<el-form-item label="字段标签" required>
					<el-input v-model="currentField.label" placeholder="显示名称" />
				</el-form-item>

				<el-form-item label="字段类型" required>
					<el-select v-model="currentField.type" placeholder="选择字段类型">
						<el-option label="字符串" value="string" />
						<el-option label="长整型" value="long" />
						<el-option label="布尔值" value="boolean" />
						<el-option label="日期" value="date" />
						<el-option label="枚举" value="enum" />
					</el-select>
				</el-form-item>

				<el-form-item label="默认值">
					<el-input v-model="currentField.defaultValue" placeholder="字段默认值" />
				</el-form-item>

				<el-form-item label="验证规则">
					<el-select
						v-model="currentField.validation"
						multiple
						placeholder="选择验证规则"
					>
						<el-option label="必填" value="required" />
						<el-option label="最小长度" value="minlength" />
						<el-option label="最大长度" value="maxlength" />
						<el-option label="最小值" value="min" />
						<el-option label="最大值" value="max" />
						<el-option label="正则表达式" value="pattern" />
					</el-select>
				</el-form-item>

				<!-- 枚举值配置 -->
				<template v-if="currentField.type === 'enum'">
					<el-form-item label="枚举值">
						<el-input
							v-model="currentField.enumValues"
							type="textarea"
							:rows="3"
							placeholder="每行一个值，格式：value:label"
						/>
						<div class="field-tip">示例：1:选项一</div>
					</el-form-item>
				</template>

				<el-form-item label="属性配置">
					<div class="properties-container">
						<el-button size="small" :icon="Plus" @click="handleAddProperty">
							添加属性
						</el-button>
						<div
							v-for="(prop, index) in currentField.properties"
							:key="index"
							class="property-item"
						>
							<el-input
								v-model="prop.id"
								placeholder="属性ID"
								size="small"
								style="width: 40%"
							/>
							<el-input
								v-model="prop.value"
								placeholder="属性值"
								size="small"
								style="width: 40%"
							/>
							<el-button
								type="danger"
								size="small"
								icon="Delete"
								@click="currentField.properties.splice(index, 1)"
							/>
						</div>
					</div>
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
import { computed, ref, watch } from 'vue'
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

const { moddle, updateProperties, updateExtensionElements } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element),
)

const formData = ref({
	formType: 'formKey',
	formKey: '',
	formRef: '',
	formRefBinding: 'latest',
	formRefVersion: 1,
})

const formFields = ref<any[]>([])
const showFieldDialog = ref(false)
const fieldDialogTitle = ref('')
const currentField = ref<any>({})
const currentFieldIndex = ref(-1)

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	// 检查表单配置类型
	if (bo.formKey) {
		formData.value.formType = 'formKey'
		formData.value.formKey = bo.formKey
	} else if (bo.formRef) {
		formData.value.formType = 'formRef'
		formData.value.formRef = bo.formRef
		formData.value.formRefBinding = bo.formRefBinding || 'latest'
		formData.value.formRefVersion = bo.formRefVersion || 1
	} else {
		formData.value.formType = 'formFields'
	}

	// 加载表单字段
	const formDataExt = getExtensionElements(props.element, 'camunda:FormData')
	if (formDataExt && formDataExt.length > 0) {
		const fields = formDataExt[0].fields || []
		formFields.value = fields.map((field: any) => ({
			id: field.id,
			label: field.label,
			type: field.type,
			defaultValue: field.defaultValue,
			validation: field.validation?.constraints || [],
			properties: field.properties || [],
			raw: field,
		}))
	} else {
		formFields.value = []
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

// 表单类型切换
const handleFormTypeChange = () => {
	// const bo = getBusinessObject(props.element)

	// 清空所有表单配置
	updateProperties({
		formKey: undefined,
		formRef: undefined,
		formRefBinding: undefined,
		formRefVersion: undefined,
	})

	// 清空表单字段
	updateExtensionElements('camunda:FormData', [])
}

// 更新表单配置
const handleUpdate = useDebounce(() => {
	const updates: any = {}

	if (formData.value.formType === 'formKey') {
		updates.formKey = formData.value.formKey || undefined
		updates.formRef = undefined
		updates.formRefBinding = undefined
		updates.formRefVersion = undefined
	} else if (formData.value.formType === 'formRef') {
		updates.formKey = undefined
		updates.formRef = formData.value.formRef || undefined
		updates.formRefBinding = formData.value.formRefBinding
		if (formData.value.formRefBinding === 'version') {
			updates.formRefVersion = formData.value.formRefVersion
		} else {
			updates.formRefVersion = undefined
		}
	} else {
		updates.formKey = undefined
		updates.formRef = undefined
		updates.formRefBinding = undefined
		updates.formRefVersion = undefined
	}

	updateProperties(updates)
}, 400)

// 字段类型标签
const getFieldTypeLabel = (type: string) => {
	const map: Record<string, string> = {
		string: '字符串',
		long: '长整型',
		boolean: '布尔',
		date: '日期',
		enum: '枚举',
	}
	return map[type] || type
}

// 添加字段
const handleAddField = () => {
	currentField.value = {
		id: '',
		label: '',
		type: 'string',
		defaultValue: '',
		validation: [],
		properties: [],
		enumValues: '',
	}
	currentFieldIndex.value = -1
	fieldDialogTitle.value = '添加表单字段'
	showFieldDialog.value = true
}

// 编辑字段
const handleEditField = (row: any, index: number) => {
	const field = row.raw
	currentField.value = {
		id: field.id,
		label: field.label,
		type: field.type,
		defaultValue: field.defaultValue || '',
		validation: field.validation?.constraints.map((c: any) => c.name) || [],
		properties: field.properties ? [...field.properties] : [],
		enumValues: field.values
			? field.values.map((v: any) => `${v.id}:${v.name}`).join('\n')
			: '',
	}
	currentFieldIndex.value = index
	fieldDialogTitle.value = '编辑表单字段'
	showFieldDialog.value = true
}

// 删除字段
const handleDeleteField = (index: number) => {
	ElMessageBox.confirm('确定要删除此表单字段吗？', '提示', {
		type: 'warning',
	})
		.then(() => {
			formFields.value.splice(index, 1)
			saveFormFields()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 添加属性
const handleAddProperty = () => {
	if (!currentField.value.properties) {
		currentField.value.properties = []
	}
	currentField.value.properties.push({ id: '', value: '' })
}

// 保存字段
const handleSaveField = () => {
	if (!currentField.value.id || !currentField.value.label) {
		ElMessage.warning('请填写字段ID和标签')
		return
	}

	// 创建字段对象
	const field = moddle.value.create('camunda:FormField', {
		id: currentField.value.id,
		label: currentField.value.label,
		type: currentField.value.type,
		defaultValue: currentField.value.defaultValue || undefined,
	})

	// 验证规则
	if (currentField.value.validation && currentField.value.validation.length > 0) {
		const constraints = currentField.value.validation.map((name: string) => {
			return moddle.value.create('camunda:Constraint', { name, config: '' })
		})
		field.validation = moddle.value.create('camunda:Validation', { constraints })
	}

	// 属性
	if (currentField.value.properties && currentField.value.properties.length > 0) {
		field.properties = currentField.value.properties
			.filter((p: any) => p.id && p.value)
			.map((p: any) => moddle.value.create('camunda:Property', p))
	}

	// 枚举值
	if (currentField.value.type === 'enum' && currentField.value.enumValues) {
		field.values = currentField.value.enumValues
			.split('\n')
			.filter((line: string) => line.trim())
			.map((line: string) => {
				const [id, name] = line.split(':').map((s: string) => s.trim())
				return moddle.value.create('camunda:Value', { id, name: name || id })
			})
	}

	if (currentFieldIndex.value >= 0) {
		formFields.value[currentFieldIndex.value] = {
			...currentField.value,
			raw: field,
		}
	} else {
		formFields.value.push({
			...currentField.value,
			raw: field,
		})
	}

	saveFormFields()
	showFieldDialog.value = false
	ElMessage.success('保存成功')
}

// 保存表单字段到BPMN
const saveFormFields = () => {
	if (formFields.value.length === 0) {
		updateExtensionElements('camunda:FormData', [])
		return
	}

	const fields = formFields.value.map((f) => f.raw)
	const formDataElement = moddle.value.create('camunda:FormData', { fields })
	updateExtensionElements('camunda:FormData', [formDataElement])
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

.form-fields-container {
	width: 100%;
}

.properties-container {
	width: 100%;
}

.property-item {
	display: flex;
	gap: 8px;
	margin-top: 8px;
	align-items: center;
}
</style>
