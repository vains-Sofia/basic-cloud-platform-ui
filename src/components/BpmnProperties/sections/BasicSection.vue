<template>
	<el-collapse-item title="基础属性" name="basic">
		<el-form :model="formData" label-width="70px" label-position="left">
			<el-form-item label="ID">
				<el-input
					v-model="formData.id"
					@input="handleUpdateId"
					placeholder="请输入元素ID"
				/>
			</el-form-item>

			<el-form-item label="名称">
				<el-input
					v-model="formData.name"
					@input="handleUpdateName"
					placeholder="请输入元素名称"
					clearable
				/>
			</el-form-item>

			<el-form-item label="文档说明">
				<el-input
					v-model="formData.documentation"
					@input="handleUpdateDocumentation"
					type="textarea"
					:rows="4"
					placeholder="请输入文档说明"
					clearable
				/>
			</el-form-item>
		</el-form>
	</el-collapse-item>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { BpmnElement } from '../types'
import { getBusinessObject, getDocumentation } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'
import { useDebounce } from '@/hooks/useDebounce.ts'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

const { updateProperties, updateLabel, createDocumentation } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element),
)

const formData = ref({
	id: '',
	name: '',
	documentation: '',
})

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(toRaw(props.element))
	formData.value = {
		id: bo.id || '',
		name: bo.name || '',
		documentation: getDocumentation(props.element),
	}
}

// 监听元素变化
watch(
	() => props.element,
	() => {
		if (props.element) {
			initFormData()
		}
	},
	{ immediate: true },
)

// 更新ID
const handleUpdateId = useDebounce(() => {
	const newId = formData.value.id.trim()
	if (!newId) {
		ElMessage.warning('ID不能为空')
		initFormData()
		return
	}

	const bo = getBusinessObject(props.element)
	if (newId === bo.id) return

	// 检查ID是否重复
	const elementRegistry = props.modeler.get('elementRegistry')
	const existingElement = elementRegistry.get(newId)

	if (existingElement) {
		ElMessage.error('ID已存在，请使用其他ID')
		initFormData()
		return
	}

	updateProperties({ id: newId })
	// ElMessage.success('ID更新成功')
}, 400)

// 更新名称
const handleUpdateName = useDebounce(() => {
	const name = formData.value.name.trim()
	const bo = getBusinessObject(props.element)

	if (name === bo.name) return

	updateProperties({ name: name || undefined })
	updateLabel(name)
}, 400)

// 更新文档说明
const handleUpdateDocumentation = useDebounce(() => {
	const text = formData.value.documentation.trim()
	const currentDoc = getDocumentation(props.element)

	if (text === currentDoc) return

	const documentation = text ? [createDocumentation(text)] : []
	updateProperties({ documentation })
}, 400)
</script>

<style scoped>
:deep(.el-form-item) {
	margin-bottom: 16px;
}

:deep(.el-form-item__label) {
	font-weight: 500;
}
</style>
