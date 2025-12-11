<template>
	<el-collapse-item title="输入输出映射" name="inputOutput">
		<el-tabs v-model="activeTab">
			<!-- 输入参数 -->
			<el-tab-pane label="输入参数" name="input">
				<div class="param-container">
					<el-button
						type="primary"
						size="small"
						:icon="Plus"
						@click="handleAddInput"
						style="margin-bottom: 12px"
					>
						添加输入参数
					</el-button>

					<el-table :data="inputParameters" style="width: 100%" empty-text="暂无输入参数">
						<el-table-column prop="name" label="参数名" width="100" />
						<el-table-column prop="type" label="类型" width="100">
							<template #default="{ row }">
								<el-tag size="small" :type="getParamTypeTag(row.type)">
									{{ getParamTypeLabel(row.type) }}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column
							prop="value"
							label="值"
							min-width="100"
							show-overflow-tooltip
						>
							<template #default="{ row }">
								<span v-if="row.type === 'script'" class="script-value">
									{{ row.scriptFormat }}: {{ row.value }}
								</span>
								<span v-else>{{ row.value }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="115" align="center">
							<template #default="{ row, $index }">
								<el-button
									type="primary"
									size="small"
									:icon="Edit"
									@click="handleEditInput(row, $index)"
								/>
								<el-button
									type="danger"
									size="small"
									link
									:icon="Delete"
									@click="handleDeleteInput($index)"
								/>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-tab-pane>

			<!-- 输出参数 -->
			<el-tab-pane label="输出参数" name="output">
				<div class="param-container">
					<el-button
						type="success"
						size="small"
						:icon="Plus"
						@click="handleAddOutput"
						style="margin-bottom: 12px"
					>
						添加输出参数
					</el-button>

					<el-table
						:data="outputParameters"
						style="width: 100%"
						empty-text="暂无输出参数"
					>
						<el-table-column prop="name" label="参数名" width="150" />
						<el-table-column prop="type" label="类型" width="100">
							<template #default="{ row }">
								<el-tag size="small" :type="getParamTypeTag(row.type)">
									{{ getParamTypeLabel(row.type) }}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column
							prop="value"
							label="值"
							min-width="200"
							show-overflow-tooltip
						>
							<template #default="{ row }">
								<span v-if="row.type === 'script'" class="script-value">
									{{ row.scriptFormat }}: {{ row.value }}
								</span>
								<span v-else>{{ row.value }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" align="center">
							<template #default="{ row, $index }">
								<el-button
									type="primary"
									size="small"
									link
									icon="Edit"
									@click="handleEditOutput(row, $index)"
								/>
								<el-button
									type="danger"
									size="small"
									link
									icon="Delete"
									@click="handleDeleteOutput($index)"
								/>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-tab-pane>
		</el-tabs>

		<!-- 参数配置对话框 -->
		<el-dialog
			v-model="showParamDialog"
			:title="paramDialogTitle"
			width="600px"
			@close="handleCloseDialog"
		>
			<el-form :model="currentParam" label-width="100px">
				<el-form-item label="参数名" required>
					<el-input v-model="currentParam.name" placeholder="如：customerName" />
				</el-form-item>

				<el-form-item label="参数类型" required>
					<el-select v-model="currentParam.type" @change="handleParamTypeChange">
						<el-option label="字符串/表达式" value="text" />
						<el-option label="脚本" value="script" />
						<el-option label="列表" value="list" />
						<el-option label="映射" value="map" />
					</el-select>
				</el-form-item>

				<!-- 字符串/表达式 -->
				<template v-if="currentParam.type === 'text'">
					<el-form-item label="值" required>
						<el-input
							v-model="currentParam.value"
							placeholder="如：John Doe 或 ${customer.name}"
						/>
						<div class="field-tip">可以是固定值或表达式（${...}）</div>
					</el-form-item>
				</template>

				<!-- 脚本 -->
				<template v-if="currentParam.type === 'script'">
					<el-form-item label="脚本格式" required>
						<el-select v-model="currentParam.scriptFormat">
							<el-option label="JavaScript" value="javascript" />
							<el-option label="Groovy" value="groovy" />
							<el-option label="Python" value="python" />
							<el-option label="JUEL" value="juel" />
						</el-select>
					</el-form-item>

					<el-form-item label="脚本内容" required>
						<el-input
							v-model="currentParam.value"
							type="textarea"
							:rows="6"
							placeholder="输入脚本代码..."
						/>
					</el-form-item>
				</template>

				<!-- 列表 -->
				<template v-if="currentParam.type === 'list'">
					<el-form-item label="列表项">
						<div class="list-items">
							<div
								v-for="(_item, index) in currentParam.listItems"
								:key="index"
								class="list-item"
							>
								<el-input
									v-model="currentParam.listItems[index]"
									placeholder="列表项值"
									size="small"
								/>
								<el-button
									type="danger"
									size="small"
									icon="Delete"
									@click="currentParam.listItems.splice(index, 1)"
								/>
							</div>
							<el-button
								size="small"
								:icon="Plus"
								@click="currentParam.listItems.push('')"
							>
								添加项
							</el-button>
						</div>
					</el-form-item>
				</template>

				<!-- 映射 -->
				<template v-if="currentParam.type === 'map'">
					<el-form-item label="映射项">
						<div class="map-items">
							<div
								v-for="(item, index) in currentParam.mapItems"
								:key="index"
								class="map-item"
							>
								<el-input
									v-model="item.key"
									placeholder="键"
									size="small"
									style="width: 40%"
								/>
								<el-input
									v-model="item.value"
									placeholder="值"
									size="small"
									style="width: 40%"
								/>
								<el-button
									type="danger"
									size="small"
									icon="Delete"
									@click="currentParam.mapItems.splice(index, 1)"
								/>
							</div>
							<el-button
								size="small"
								icon="Plus"
								@click="currentParam.mapItems.push({ key: '', value: '' })"
							>
								添加项
							</el-button>
						</div>
					</el-form-item>
				</template>
			</el-form>

			<template #footer>
				<el-button @click="showParamDialog = false">取消</el-button>
				<el-button type="primary" @click="handleSaveParam">保存</el-button>
			</template>
		</el-dialog>

		<!-- 说明 -->
		<el-divider content-position="left">使用说明</el-divider>
		<el-alert title="输入输出映射" type="info" :closable="false">
			<div class="tips">
				<p><strong>输入参数：</strong>在任务执行前，将流程变量映射为任务的输入</p>
				<p><strong>输出参数：</strong>在任务执行后，将任务的输出映射为流程变量</p>
				<p><strong>使用场景：</strong>服务任务、脚本任务、业务规则任务等</p>
			</div>
		</el-alert>
	</el-collapse-item>
</template>

<script setup lang="ts">
import Plus from '~icons/ep/plus'
import Edit from '~icons/ep/edit'
import Delete from '~icons/ep/delete'
import { ref, computed, watch } from 'vue'
import type { BpmnElement } from '../types'
import { getExtensionElements } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

const { moddle, updateExtensionElements } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element),
)

const activeTab = ref('input')
const inputParameters = ref<any[]>([])
const outputParameters = ref<any[]>([])
const showParamDialog = ref(false)
const paramDialogTitle = ref('')
const currentParam = ref<any>({})
const currentParamIndex = ref(-1)
const currentParamDirection = ref<'input' | 'output'>('input')

// 初始化数据
const initData = () => {
	// 获取InputOutput扩展元素
	const ioExtensions = getExtensionElements(props.element, 'camunda:InputOutput')

	if (ioExtensions && ioExtensions.length > 0) {
		const io = ioExtensions[0]

		// 输入参数
		inputParameters.value = (io.inputParameters || []).map((param: any) => {
			const type = getParameterType(param)
			return {
				name: param.name,
				type,
				value: getParameterValue(param, type),
				scriptFormat: param.definition?.scriptFormat,
				raw: param,
			}
		})

		// 输出参数
		outputParameters.value = (io.outputParameters || []).map((param: any) => {
			const type = getParameterType(param)
			return {
				name: param.name,
				type,
				value: getParameterValue(param, type),
				scriptFormat: param.definition?.scriptFormat,
				raw: param,
			}
		})
	} else {
		inputParameters.value = []
		outputParameters.value = []
	}
}

// 获取参数类型
const getParameterType = (param: any): string => {
	if (param.definition) {
		if (param.definition.$type === 'camunda:Script') return 'script'
		if (param.definition.$type === 'camunda:List') return 'list'
		if (param.definition.$type === 'camunda:Map') return 'map'
	}
	return 'text'
}

// 获取参数值
const getParameterValue = (param: any, type: string): string => {
	if (type === 'text') {
		return param.value || ''
	} else if (type === 'script') {
		return param.definition?.value || ''
	} else if (type === 'list') {
		return `[${(param.definition?.items || []).length} items]`
	} else if (type === 'map') {
		return `{${(param.definition?.entries || []).length} entries}`
	}
	return ''
}

watch(
	() => props.element,
	() => {
		if (props.element) {
			initData()
		}
	},
	{ immediate: true },
)

// 参数类型标签
const getParamTypeTag = (type: string) => {
	switch (type) {
		case 'text':
			return 'info'
		case 'script':
			return 'warning'
		case 'list':
			return 'success'
		case 'map':
			return 'primary'
		default:
			return 'info'
	}
}

const getParamTypeLabel = (type: string) => {
	const map: Record<string, string> = {
		text: '文本',
		script: '脚本',
		list: '列表',
		map: '映射',
	}
	return map[type] || type
}

// 添加输入参数
const handleAddInput = () => {
	currentParam.value = {
		name: '',
		type: 'text',
		value: '',
		scriptFormat: 'javascript',
		listItems: [],
		mapItems: [],
	}
	currentParamIndex.value = -1
	currentParamDirection.value = 'input'
	paramDialogTitle.value = '添加输入参数'
	showParamDialog.value = true
}

// 编辑输入参数
const handleEditInput = (row: any, index: number) => {
	const param = row.raw
	currentParam.value = {
		name: param.name,
		type: row.type,
		value: row.value,
		scriptFormat: param.definition?.scriptFormat || 'javascript',
		listItems: param.definition?.items?.map((i: any) => i.value) || [],
		mapItems:
			param.definition?.entries?.map((e: any) => ({ key: e.key, value: e.value })) || [],
	}
	currentParamIndex.value = index
	currentParamDirection.value = 'input'
	paramDialogTitle.value = '编辑输入参数'
	showParamDialog.value = true
}

// 删除输入参数
const handleDeleteInput = (index: number) => {
	ElMessageBox.confirm('确定要删除此输入参数吗？', '提示', {
		type: 'warning',
	})
		.then(() => {
			inputParameters.value.splice(index, 1)
			saveParameters()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 添加输出参数
const handleAddOutput = () => {
	currentParam.value = {
		name: '',
		type: 'text',
		value: '',
		scriptFormat: 'javascript',
		listItems: [],
		mapItems: [],
	}
	currentParamIndex.value = -1
	currentParamDirection.value = 'output'
	paramDialogTitle.value = '添加输出参数'
	showParamDialog.value = true
}

// 编辑输出参数
const handleEditOutput = (row: any, index: number) => {
	const param = row.raw
	currentParam.value = {
		name: param.name,
		type: row.type,
		value: row.value,
		scriptFormat: param.definition?.scriptFormat || 'javascript',
		listItems: param.definition?.items?.map((i: any) => i.value) || [],
		mapItems:
			param.definition?.entries?.map((e: any) => ({ key: e.key, value: e.value })) || [],
	}
	currentParamIndex.value = index
	currentParamDirection.value = 'output'
	paramDialogTitle.value = '编辑输出参数'
	showParamDialog.value = true
}

// 删除输出参数
const handleDeleteOutput = (index: number) => {
	ElMessageBox.confirm('确定要删除此输出参数吗？', '提示', {
		type: 'warning',
	})
		.then(() => {
			outputParameters.value.splice(index, 1)
			saveParameters()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 参数类型变化
const handleParamTypeChange = () => {
	currentParam.value.value = ''
	currentParam.value.listItems = []
	currentParam.value.mapItems = []
}

// 保存参数
const handleSaveParam = () => {
	if (!currentParam.value.name) {
		ElMessage.warning('请输入参数名')
		return
	}

	// 创建参数对象
	const paramData: any = {
		name: currentParam.value.name,
	}

	switch (currentParam.value.type) {
		case 'text':
			if (!currentParam.value.value) {
				ElMessage.warning('请输入参数值')
				return
			}
			paramData.value = currentParam.value.value
			break
		case 'script':
			if (!currentParam.value.value) {
				ElMessage.warning('请输入脚本内容')
				return
			}
			paramData.definition = moddle.value.create('camunda:Script', {
				scriptFormat: currentParam.value.scriptFormat,
				value: currentParam.value.value,
			})
			break
		case 'list':
			const items = currentParam.value.listItems
				.filter((v: string) => v)
				.map((v: string) => moddle.value.create('camunda:Value', { value: v }))
			paramData.definition = moddle.value.create('camunda:List', { items })
			break
		case 'map':
			const entries = currentParam.value.mapItems
				.filter((m: any) => m.key && m.value)
				.map((m: any) =>
					moddle.value.create('camunda:Entry', { key: m.key, value: m.value }),
				)
			paramData.definition = moddle.value.create('camunda:Map', { entries })
			break
	}

	const paramType =
		currentParamDirection.value === 'input'
			? 'camunda:InputParameter'
			: 'camunda:OutputParameter'

	const param = moddle.value.create(paramType, paramData)

	const targetArray =
		currentParamDirection.value === 'input' ? inputParameters.value : outputParameters.value

	const displayValue =
		currentParam.value.type === 'text'
			? currentParam.value.value
			: currentParam.value.type === 'script'
				? currentParam.value.value
				: currentParam.value.type === 'list'
					? `[${currentParam.value.listItems.length} items]`
					: `{${currentParam.value.mapItems.length} entries}`

	if (currentParamIndex.value >= 0) {
		targetArray[currentParamIndex.value] = {
			name: currentParam.value.name,
			type: currentParam.value.type,
			value: displayValue,
			scriptFormat: currentParam.value.scriptFormat,
			raw: param,
		}
	} else {
		targetArray.push({
			name: currentParam.value.name,
			type: currentParam.value.type,
			value: displayValue,
			scriptFormat: currentParam.value.scriptFormat,
			raw: param,
		})
	}

	saveParameters()
	showParamDialog.value = false
	ElMessage.success('保存成功')
}

// 保存参数到BPMN
const saveParameters = () => {
	if (inputParameters.value.length === 0 && outputParameters.value.length === 0) {
		updateExtensionElements('camunda:InputOutput', [])
		return
	}

	const io = moddle.value.create('camunda:InputOutput', {
		inputParameters: inputParameters.value.map((p) => p.raw),
		outputParameters: outputParameters.value.map((p) => p.raw),
	})

	updateExtensionElements('camunda:InputOutput', [io])
}

const handleCloseDialog = () => {
	currentParam.value = {}
	currentParamIndex.value = -1
}
</script>

<style scoped>
.param-container {
	padding: 12px 0;
}

.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
}

.script-value {
	font-family: 'Consolas', 'Monaco', monospace;
	font-size: 12px;
}

.list-items,
.map-items {
	width: 100%;
}

.list-item,
.map-item {
	display: flex;
	gap: 8px;
	margin-bottom: 8px;
	align-items: center;
}

.tips {
	font-size: 13px;
	line-height: 1.8;
}

.tips p {
	margin: 8px 0;
}
</style>
