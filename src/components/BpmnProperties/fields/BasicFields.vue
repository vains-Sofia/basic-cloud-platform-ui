<template>
	<div class="bpmn-fields">
		<!-- ID字段 -->
		<el-form-item label="ID" prop="id">
			<el-input
				:model-value="modelValue.id"
				@update:model-value="handleUpdate('id', $event)"
				placeholder="请输入元素ID"
				clearable
			/>
		</el-form-item>

		<!-- 名称字段 -->
		<el-form-item label="名称" prop="name">
			<el-input
				:model-value="modelValue.name"
				@update:model-value="handleUpdate('name', $event)"
				placeholder="请输入元素名称"
				clearable
			/>
		</el-form-item>

		<!-- 文档说明 -->
		<el-form-item label="文档说明" prop="documentation">
			<el-input
				:model-value="modelValue.documentation"
				@update:model-value="handleUpdate('documentation', $event)"
				type="textarea"
				:rows="3"
				placeholder="请输入文档说明"
				clearable
			/>
		</el-form-item>
	</div>
</template>

<script setup lang="ts">
interface Props {
	modelValue: {
		id: string
		name?: string
		documentation?: string
	}
}

interface Emits {
	(e: 'update:modelValue', value: Props['modelValue']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleUpdate = (key: string, value: any) => {
	emit('update:modelValue', {
		...props.modelValue,
		[key]: value,
	})
}
</script>

<style scoped>
.bpmn-fields {
	padding: 16px;
}
</style>
