<template>
	<el-collapse-item title="多实例配置" name="multiInstance">
		<el-form :model="formData" label-width="80px" label-position="left">
			<el-form-item label="启用多实例">
				<el-switch
					v-model="formData.enabled"
					@change="handleEnabledChange"
					active-text="是"
					inactive-text="否"
					class="!w-full"
				/>

				<div class="field-tip">
					启用后，此活动将执行多次
				</div>
			</el-form-item>

			<template v-if="formData.enabled">
				<el-form-item label="执行方式">
					<el-select
						v-model="formData.isSequential"
						placeholder="请选择"
						clearable
						class="!w-full"
						@select="handleUpdate"
					>
						<el-option label="并行" :value="false" />
						<el-option label="串行" :value="true" />
					</el-select>
<!--					<el-radio-group v-model="formData.isSequential" @change="handleUpdate">
						<el-radio :label="false">
							<div class="radio-content flex items-center">
								<strong>并行</strong>
								<div class="radio-desc">所有实例同时执行</div>
							</div>
						</el-radio>
						<el-radio :label="true">
							<div class="radio-content flex items-center">
								<strong>串行</strong>
								<div class="radio-desc">实例按顺序依次执行</div>
							</div>
						</el-radio>
					</el-radio-group>-->

					<div v-if="!formData.isSequential" class="radio-desc">所有实例同时执行</div>
					<div v-else class="radio-desc">实例按顺序依次执行</div>
				</el-form-item>

				<el-divider content-position="left">实例数量配置</el-divider>

				<el-form-item label="配置方式">
					<el-radio-group v-model="formData.configurationType" @change="handleConfigTypeChange">
						<el-radio label="loopCardinality">循环基数</el-radio>
						<el-radio label="collection">集合</el-radio>
					</el-radio-group>
				</el-form-item>

				<!-- 循环基数 -->
				<template v-if="formData.configurationType === 'loopCardinality'">
					<el-form-item label="循环基数">
						<el-input
							v-model="formData.loopCardinality"
							@blur="handleUpdate"
							placeholder="如：3 或 ${approvers.size()}"
							clearable
						/>
						<div class="field-tip">
							指定实例数量，可以是固定数字或表达式
						</div>
					</el-form-item>
				</template>

				<!-- 集合 -->
				<template v-if="formData.configurationType === 'collection'">
					<el-form-item label="集合表达式">
						<el-input
							v-model="formData.collection"
							@blur="handleUpdate"
							placeholder="如：${approverList}"
							clearable
						/>
						<div class="field-tip">
							指向集合类型的流程变量，实例数量等于集合元素数量
						</div>
					</el-form-item>

					<el-form-item label="元素变量">
						<el-input
							v-model="formData.elementVariable"
							@blur="handleUpdate"
							placeholder="如：approver"
							clearable
						/>
						<div class="field-tip">
							每个实例中，当前集合元素的变量名
						</div>
					</el-form-item>
				</template>

				<el-divider content-position="left">完成条件</el-divider>

				<el-form-item label="完成条件">
					<el-input
						v-model="formData.completionCondition"
						type="textarea"
						:rows="3"
						@blur="handleUpdate"
						placeholder="如：${nrOfCompletedInstances/nrOfInstances >= 0.6}"
						clearable
					/>
					<div class="field-tip">
						定义何时完成多实例，不填写则等待所有实例完成
					</div>
				</el-form-item>

				<el-divider content-position="left">内置变量说明</el-divider>

				<el-table :data="builtInVariables" style="width: 100%">
					<el-table-column prop="name" label="变量名" width="200">
						<template #default="{ row }">
							<code class="variable-name">{{ row.name }}</code>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="说明" />
				</el-table>

				<el-divider content-position="left">使用示例</el-divider>

				<el-collapse class="example-collapse">
					<el-collapse-item title="并行审批示例" name="parallel">
						<div class="example-content">
							<p><strong>场景：</strong>3个审批人同时审批，2个通过即可</p>
							<div class="example-config">
								<div class="config-item">
									<span class="config-label">执行方式：</span>
									<el-tag>并行</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">循环基数：</span>
									<code>3</code>
								</div>
								<div class="config-item">
									<span class="config-label">完成条件：</span>
									<code>${nrOfCompletedInstances >= 2}</code>
								</div>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="串行审批示例" name="sequential">
						<div class="example-content">
							<p><strong>场景：</strong>审批人列表依次审批，一个拒绝即终止</p>
							<div class="example-config">
								<div class="config-item">
									<span class="config-label">执行方式：</span>
									<el-tag type="warning">串行</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">集合：</span>
									<code>${approverList}</code>
								</div>
								<div class="config-item">
									<span class="config-label">元素变量：</span>
									<code>currentApprover</code>
								</div>
								<div class="config-item">
									<span class="config-label">完成条件：</span>
									<code>${approved == false}</code>
								</div>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="投票示例" name="vote">
						<div class="example-content">
							<p><strong>场景：</strong>5人投票，超过60%赞成即通过</p>
							<div class="example-config">
								<div class="config-item">
									<span class="config-label">执行方式：</span>
									<el-tag>并行</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">循环基数：</span>
									<code>5</code>
								</div>
								<div class="config-item">
									<span class="config-label">完成条件：</span>
									<code>${nrOfCompletedInstances/nrOfInstances >= 0.6}</code>
								</div>
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
import { getLoopCharacteristics, isMultiInstance } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

const { moddle, updateProperties } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element)
)

const formData = ref({
	enabled: false,
	isSequential: false,
	configurationType: 'loopCardinality',
	loopCardinality: '',
	collection: '',
	elementVariable: '',
	completionCondition: ''
})

// 内置变量
const builtInVariables = [
	{ name: 'nrOfInstances', desc: '实例总数' },
	{ name: 'nrOfActiveInstances', desc: '当前活动实例数' },
	{ name: 'nrOfCompletedInstances', desc: '已完成实例数' },
	{ name: 'loopCounter', desc: '当前实例的循环计数器（从0开始）' }
]

// 初始化表单数据
const initFormData = () => {
	const loopCharacteristics = getLoopCharacteristics(props.element)

	if (loopCharacteristics && isMultiInstance(props.element)) {
		formData.value.enabled = true
		formData.value.isSequential = loopCharacteristics.isSequential || false

		// 循环基数或集合
		if (loopCharacteristics.loopCardinality) {
			formData.value.configurationType = 'loopCardinality'
			formData.value.loopCardinality = loopCharacteristics.loopCardinality.body || ''
		} else if (loopCharacteristics.collection) {
			formData.value.configurationType = 'collection'
			formData.value.collection = loopCharacteristics.collection || ''
			formData.value.elementVariable = loopCharacteristics.elementVariable || ''
		}

		formData.value.completionCondition = loopCharacteristics.completionCondition?.body || ''
	} else {
		formData.value.enabled = false
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

// 启用/禁用多实例
const handleEnabledChange = () => {
	if (!formData.value.enabled) {
		// 禁用多实例
		updateProperties({ loopCharacteristics: undefined })
	} else {
		// 启用多实例
		handleUpdate()
	}
}

// 配置类型切换
const handleConfigTypeChange = () => {
	formData.value.loopCardinality = ''
	formData.value.collection = ''
	formData.value.elementVariable = ''
	handleUpdate()
}

// 更新配置
const handleUpdate = () => {
	if (!formData.value.enabled) return

	const loopCharacteristics = moddle.value.create('bpmn:MultiInstanceLoopCharacteristics', {
		isSequential: formData.value.isSequential
	})

	// 配置实例数量
	if (formData.value.configurationType === 'loopCardinality' && formData.value.loopCardinality) {
		loopCharacteristics.loopCardinality = moddle.value.create('bpmn:FormalExpression', {
			body: formData.value.loopCardinality
		})
	} else if (formData.value.configurationType === 'collection' && formData.value.collection) {
		loopCharacteristics.collection = formData.value.collection
		if (formData.value.elementVariable) {
			loopCharacteristics.elementVariable = formData.value.elementVariable
		}
	}

	// 完成条件
	if (formData.value.completionCondition) {
		loopCharacteristics.completionCondition = moddle.value.create('bpmn:FormalExpression', {
			body: formData.value.completionCondition
		})
	}

	updateProperties({ loopCharacteristics })
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	line-height: 1.5;
}

.radio-desc {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	font-weight: normal;
	margin-top: 2px;
}

.variable-name {
	font-family: 'Consolas', 'Monaco', monospace;
	font-size: 12px;
	padding: 2px 6px;
	border-radius: 3px;
	color: #e6a23c;
}

.example-collapse {
	margin-top: 12px;
}

.example-content {
	font-size: 13px;
}

.example-content p {
	margin-bottom: 12px;
}

.example-config {
	/*background: #f5f7fa;*/
	border: 1px solid var(--el-border-color);
	padding: 12px;
	border-radius: 4px;
}

.config-item {
	margin: 8px 0;
	display: flex;
	align-items: center;
}

.config-label {
	font-weight: 500;
	margin-right: 8px;
	min-width: 80px;
}

.config-item code {
	font-family: 'Consolas', 'Monaco', monospace;
	font-size: 12px;
	background: var(--el-bg-color);
	padding: 2px 8px;
	border: 1px solid var(--el-border-color);
	border-radius: 3px;
}
</style>
