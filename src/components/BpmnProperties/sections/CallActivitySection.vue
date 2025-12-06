<template>
	<el-collapse-item title="调用活动配置" name="callActivity">
		<el-form :model="formData" label-width="70px" label-position="left">
			<el-form-item label="调用类型">
				<el-radio-group v-model="formData.callType">
					<el-radio label="bpmn">BPMN流程</el-radio>
					<el-radio label="cmmn">CMMN案例</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item :label="formData.callType === 'bpmn' ? '流程定义' : '案例定义'">
				<el-input
					v-model="formData.calledElement"
					@input="handleUpdate"
					:placeholder="formData.callType === 'bpmn' ? '如：subprocess_001' : '如：case_001'"
					clearable
				/>
				<div class="field-tip">
					{{ formData.callType === 'bpmn' ? '被调用的流程定义ID' : '被调用的案例定义ID' }}
				</div>
			</el-form-item>

			<el-form-item label="绑定类型">
				<el-select v-model="formData.calledElementBinding" @change="handleUpdate">
					<el-option label="最新版本" value="latest" />
					<el-option label="部署版本" value="deployment" />
					<el-option label="指定版本" value="version" />
					<el-option label="版本标签" value="versionTag" />
				</el-select>
				<div class="field-tip">决定使用哪个版本的流程/案例定义</div>
			</el-form-item>

			<el-form-item v-if="formData.calledElementBinding === 'version'" label="版本号">
				<el-input-number
					v-model="formData.calledElementVersion"
					@change="handleUpdate"
					:min="1"
					style="width: 100%"
				/>
			</el-form-item>

			<el-form-item v-if="formData.calledElementBinding === 'versionTag'" label="版本标签">
				<el-input
					v-model="formData.calledElementVersionTag"
					@input="handleUpdate"
					placeholder="如：v1.0.0"
					clearable
				/>
			</el-form-item>

			<el-form-item label="租户ID">
				<el-input
					v-model="formData.calledElementTenantId"
					@input="handleUpdate"
					placeholder="多租户环境下的租户ID"
					clearable
				/>
			</el-form-item>

			<el-form-item label="业务键">
				<el-input
					v-model="formData.businessKey"
					@input="handleUpdate"
					placeholder="如：${execution.processBusinessKey}"
					clearable
				/>
				<div class="field-tip">支持表达式，用于关联业务数据</div>
			</el-form-item>

			<el-divider content-position="left">变量传递</el-divider>

			<el-form-item label="变量传递方式">
				<el-checkbox-group v-model="formData.variableOptions" @change="handleUpdate">
					<el-checkbox label="inheritVariables">继承所有变量</el-checkbox>
					<el-checkbox label="variableMappingClass">使用变量映射类</el-checkbox>
					<el-checkbox label="variableMappingDelegateExpression">使用委托表达式</el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<template v-if="formData.variableOptions.includes('variableMappingClass')">
				<el-form-item label="变量映射类">
					<el-input
						v-model="formData.variableMappingClass"
						@input="handleUpdate"
						placeholder="如：com.example.mapping.MyVariableMapping"
						clearable
					/>
				</el-form-item>
			</template>

			<template v-if="formData.variableOptions.includes('variableMappingDelegateExpression')">
				<el-form-item label="委托表达式">
					<el-input
						v-model="formData.variableMappingDelegateExpression"
						@input="handleUpdate"
						placeholder="如：${myVariableMappingBean}"
						clearable
					/>
				</el-form-item>
			</template>

			<!-- 输入映射 -->
			<el-form-item label="输入映射">
				<div class="mapping-container">
					<el-button
						type="primary"
						size="small"
						:icon="Plus"
						@click="handleAddInMapping"
						style="margin-bottom: 12px"
					>
						添加输入
					</el-button>
				</div>
			</el-form-item>
			<el-form-item label-width="0">
				<el-table
					:data="inMappings"
					style="width: 100%"
					empty-text="暂无输入映射"
				>
					<el-table-column prop="source" label="来源" />
					<el-table-column prop="target" label="目标" />
					<el-table-column label="操作" width="100" align="center">
						<template #default="{ row, $index }">
							<el-button
								type="primary"
								size="small"
								link
								:icon="Edit"
								@click="handleEditInMapping(row, $index)"
							/>
							<el-button
								type="danger"
								size="small"
								link
								:icon="Delete"
								@click="handleDeleteInMapping($index)"
							/>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>

			<!-- 输出映射 -->
			<el-form-item label="输出映射">
				<div class="mapping-container">
					<el-button
						type="primary"
						size="small"
						:icon="Plus"
						@click="handleAddOutMapping"
						style="margin-bottom: 12px"
					>
						添加输出
					</el-button>
				</div>
			</el-form-item>

			<el-form-item label-width="0">
				<el-table
					:data="outMappings"
					style="width: 100%"
					empty-text="暂无输出映射"
				>
					<el-table-column prop="source" label="来源" width="120" />
					<el-table-column prop="target" label="目标" width="120" />
					<el-table-column label="操作" width="100" align="center">
						<template #default="{ row, $index }">
							<el-button
								type="primary"
								size="small"
								link
								:icon="Edit"
								@click="handleEditOutMapping(row, $index)"
							/>
							<el-button
								type="danger"
								size="small"
								link
								:icon="Delete"
								@click="handleDeleteOutMapping($index)"
							/>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>

		<!-- 变量映射对话框 -->
		<el-dialog
			v-model="showMappingDialog"
			:title="mappingDialogTitle"
			width="500px"
		>
			<el-form :model="currentMapping" label-width="100px">
				<el-form-item label="映射类型">
					<el-radio-group v-model="currentMapping.type">
						<el-radio label="source">源变量</el-radio>
						<el-radio label="sourceExpression">源表达式</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item :label="currentMapping.type === 'source' ? '源变量' : '源表达式'">
					<el-input
						v-model="currentMapping.source"
						:placeholder="currentMapping.type === 'source' ? '如：orderTotal' : '如：${order.total}'"
					/>
				</el-form-item>

				<el-form-item label="目标变量">
					<el-input
						v-model="currentMapping.target"
						placeholder="如：amount"
					/>
				</el-form-item>

				<el-form-item label="本地变量">
					<el-switch v-model="currentMapping.local" />
					<div class="field-tip">是否作为本地变量传递</div>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="showMappingDialog = false">取消</el-button>
				<el-button type="primary" @click="handleSaveMapping">保存</el-button>
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

const { moddle, updateProperties, updateExtensionElements } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element)
)

const formData = ref({
	callType: 'bpmn',
	calledElement: '',
	calledElementBinding: 'latest',
	calledElementVersion: 1,
	calledElementVersionTag: '',
	calledElementTenantId: '',
	businessKey: '',
	variableOptions: ['inheritVariables'] as string[],
	variableMappingClass: '',
	variableMappingDelegateExpression: ''
})

const inMappings = ref<any[]>([])
const outMappings = ref<any[]>([])
const showMappingDialog = ref(false)
const mappingDialogTitle = ref('')
const currentMapping = ref<any>({})
const currentMappingIndex = ref(-1)
const currentMappingDirection = ref<'in' | 'out'>('in')

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	formData.value = {
		callType: bo.caseRef ? 'cmmn' : 'bpmn',
		calledElement: bo.calledElement || bo.caseRef || '',
		calledElementBinding: bo.calledElementBinding || 'latest',
		calledElementVersion: bo.calledElementVersion || 1,
		calledElementVersionTag: bo.calledElementVersionTag || '',
		calledElementTenantId: bo.calledElementTenantId || '',
		businessKey: bo.businessKey || '',
		variableOptions: [],
		variableMappingClass: bo.variableMappingClass || '',
		variableMappingDelegateExpression: bo.variableMappingDelegateExpression || ''
	}

	if (bo.inheritVariables !== false) {
		formData.value.variableOptions.push('inheritVariables')
	}
	if (bo.variableMappingClass) {
		formData.value.variableOptions.push('variableMappingClass')
	}
	if (bo.variableMappingDelegateExpression) {
		formData.value.variableOptions.push('variableMappingDelegateExpression')
	}

	// 加载输入映射
	const inExts = getExtensionElements(props.element, 'camunda:In')
	inMappings.value = (inExts || []).map((mapping: any) => ({
		source: mapping.source || mapping.sourceExpression,
		target: mapping.target,
		type: mapping.source ? 'source' : 'sourceExpression',
		local: mapping.local,
		raw: mapping
	}))

	// 加载输出映射
	const outExts = getExtensionElements(props.element, 'camunda:Out')
	outMappings.value = (outExts || []).map((mapping: any) => ({
		source: mapping.source || mapping.sourceExpression,
		target: mapping.target,
		type: mapping.source ? 'source' : 'sourceExpression',
		local: mapping.local,
		raw: mapping
	}))
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

// 更新配置
const handleUpdate = useDebounce(() => {
	const updates: any = {
		calledElementBinding: formData.value.calledElementBinding,
		calledElementTenantId: formData.value.calledElementTenantId || undefined,
		businessKey: formData.value.businessKey || undefined,
		inheritVariables: formData.value.variableOptions.includes('inheritVariables'),
		variableMappingClass: formData.value.variableOptions.includes('variableMappingClass')
			? formData.value.variableMappingClass || undefined
			: undefined,
		variableMappingDelegateExpression: formData.value.variableOptions.includes('variableMappingDelegateExpression')
			? formData.value.variableMappingDelegateExpression || undefined
			: undefined
	}

	if (formData.value.callType === 'bpmn') {
		updates.calledElement = formData.value.calledElement || undefined
		updates.caseRef = undefined
	} else {
		updates.calledElement = undefined
		updates.caseRef = formData.value.calledElement || undefined
	}

	if (formData.value.calledElementBinding === 'version') {
		updates.calledElementVersion = formData.value.calledElementVersion
		updates.calledElementVersionTag = undefined
	} else if (formData.value.calledElementBinding === 'versionTag') {
		updates.calledElementVersion = undefined
		updates.calledElementVersionTag = formData.value.calledElementVersionTag || undefined
	} else {
		updates.calledElementVersion = undefined
		updates.calledElementVersionTag = undefined
	}

	updateProperties(updates)
}, 400)

// 添加输入映射
const handleAddInMapping = () => {
	currentMapping.value = { type: 'source', source: '', target: '', local: false }
	currentMappingIndex.value = -1
	currentMappingDirection.value = 'in'
	mappingDialogTitle.value = '添加输入映射'
	showMappingDialog.value = true
}

// 编辑输入映射
const handleEditInMapping = (row: any, index: number) => {
	currentMapping.value = { ...row }
	currentMappingIndex.value = index
	currentMappingDirection.value = 'in'
	mappingDialogTitle.value = '编辑输入映射'
	showMappingDialog.value = true
}

// 删除输入映射
const handleDeleteInMapping = (index: number) => {
	ElMessageBox.confirm('确定要删除此输入映射吗？', '提示', {
		type: 'warning'
	}).then(() => {
		inMappings.value.splice(index, 1)
		saveMappings()
		ElMessage.success('删除成功')
	}).catch(() => {})
}

// 添加输出映射
const handleAddOutMapping = () => {
	currentMapping.value = { type: 'source', source: '', target: '', local: false }
	currentMappingIndex.value = -1
	currentMappingDirection.value = 'out'
	mappingDialogTitle.value = '添加输出映射'
	showMappingDialog.value = true
}

// 编辑输出映射
const handleEditOutMapping = (row: any, index: number) => {
	currentMapping.value = { ...row }
	currentMappingIndex.value = index
	currentMappingDirection.value = 'out'
	mappingDialogTitle.value = '编辑输出映射'
	showMappingDialog.value = true
}

// 删除输出映射
const handleDeleteOutMapping = (index: number) => {
	ElMessageBox.confirm('确定要删除此输出映射吗？', '提示', {
		type: 'warning'
	}).then(() => {
		outMappings.value.splice(index, 1)
		saveMappings()
		ElMessage.success('删除成功')
	}).catch(() => {})
}

// 保存映射
const handleSaveMapping = () => {
	if (!currentMapping.value.source || !currentMapping.value.target) {
		ElMessage.warning('请填写完整信息')
		return
	}

	const mappingData: any = {
		target: currentMapping.value.target,
		local: currentMapping.value.local
	}

	if (currentMapping.value.type === 'source') {
		mappingData.source = currentMapping.value.source
	} else {
		mappingData.sourceExpression = currentMapping.value.source
	}

	const mappingElement = moddle.value.create(
		currentMappingDirection.value === 'in' ? 'camunda:In' : 'camunda:Out',
		mappingData
	)

	const targetArray = currentMappingDirection.value === 'in' ? inMappings.value : outMappings.value

	if (currentMappingIndex.value >= 0) {
		targetArray[currentMappingIndex.value] = {
			...currentMapping.value,
			raw: mappingElement
		}
	} else {
		targetArray.push({
			...currentMapping.value,
			raw: mappingElement
		})
	}

	saveMappings()
	showMappingDialog.value = false
	ElMessage.success('保存成功')
}

// 保存映射到BPMN
const saveMappings = () => {
	const inElements = inMappings.value.map(m => m.raw)
	const outElements = outMappings.value.map(m => m.raw)

	updateExtensionElements('camunda:In', inElements)
	updateExtensionElements('camunda:Out', outElements)
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
}

.mapping-container {
	width: 100%;
}
</style>
