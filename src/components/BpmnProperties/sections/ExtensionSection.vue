<template>
	<el-collapse-item title="扩展属性" name="extension">
		<div class="extension-container">
			<div class="extension-header">
				<el-button type="primary" size="small" :icon="Plus" @click="handleAddProperty">
					添加属性
				</el-button>
			</div>

			<el-table
				:data="properties"
				style="width: 100%; margin-top: 12px"
				empty-text="暂无扩展属性"
			>
				<el-table-column prop="name" label="属性名" width="150" />
				<el-table-column
					prop="value"
					label="属性值"
					min-width="150"
					show-overflow-tooltip
				/>
				<el-table-column label="操作" width="110" align="center">
					<template #default="{ row, $index }">
						<el-button
							type="primary"
							size="small"
							link
							:icon="Edit"
							@click="handleEditProperty(row, $index)"
						/>
						<el-button
							type="danger"
							size="small"
							link
							:icon="Delete"
							@click="handleDeleteProperty($index)"
						/>
					</template>
				</el-table-column>
			</el-table>

			<el-divider content-position="left">使用说明</el-divider>

			<el-alert title="扩展属性" type="info" :closable="false">
				<div class="tips">
					<p><strong>用途：</strong>存储自定义的业务属性，可在流程执行时通过API访问</p>
					<p><strong>示例场景：</strong></p>
					<ul>
						<li>业务单据类型标识</li>
						<li>审批级别配置</li>
						<li>通知模板ID</li>
						<li>自定义业务规则参数</li>
					</ul>
					<p><strong>访问方式：</strong></p>
					<pre class="code-example">
// 在Java代码中访问
Map&lt;String, String&gt; properties =
  element.getExtensionElements()
	.getElementsQuery()
	.filterByType(Properties.class)
	.singleResult()
	.getProperties();

String value = properties.get("propertyName");
					</pre>
				</div>
			</el-alert>

			<el-divider content-position="left">常用扩展属性示例</el-divider>

			<el-collapse class="example-collapse">
				<el-collapse-item title="业务配置" name="business">
					<el-table :data="businessExamples" style="width: 100%">
						<el-table-column prop="name" label="属性名" width="130" />
						<el-table-column prop="value" label="示例值" width="140" />
						<el-table-column prop="desc" label="说明" />
					</el-table>
				</el-collapse-item>

				<el-collapse-item title="通知配置" name="notification">
					<el-table :data="notificationExamples" style="width: 100%">
						<el-table-column prop="name" label="属性名" width="130" />
						<el-table-column prop="value" label="示例值" width="140" />
						<el-table-column prop="desc" label="说明" />
					</el-table>
				</el-collapse-item>

				<el-collapse-item title="UI配置" name="ui">
					<el-table :data="uiExamples" style="width: 100%">
						<el-table-column prop="name" label="属性名" width="130" />
						<el-table-column prop="value" label="示例值" width="140" />
						<el-table-column prop="desc" label="说明" />
					</el-table>
				</el-collapse-item>
			</el-collapse>
		</div>

		<!-- 属性编辑对话框 -->
		<el-dialog
			v-model="showPropertyDialog"
			:title="propertyDialogTitle"
			width="500px"
			@close="handleCloseDialog"
		>
			<el-form :model="currentProperty" label-width="100px">
				<el-form-item label="属性名" required>
					<el-input v-model="currentProperty.name" placeholder="如：documentType" />
					<div class="field-tip">
						建议使用驼峰命名法，如：approvalLevel、notifyTemplate
					</div>
				</el-form-item>

				<el-form-item label="属性值" required>
					<el-input
						v-model="currentProperty.value"
						type="textarea"
						:rows="3"
						placeholder="如：PurchaseOrder"
					/>
					<div class="field-tip">可以是任何字符串值，支持多行文本</div>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="showPropertyDialog = false">取消</el-button>
				<el-button type="primary" @click="handleSaveProperty">保存</el-button>
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

const properties = ref<any[]>([])
const showPropertyDialog = ref(false)
const propertyDialogTitle = ref('')
const currentProperty = ref<any>({})
const currentPropertyIndex = ref(-1)

// 示例数据
const businessExamples = [
	{ name: 'documentType', value: 'PurchaseOrder', desc: '业务单据类型' },
	{ name: 'approvalLevel', value: 'Manager', desc: '审批级别' },
	{ name: 'department', value: 'Finance', desc: '所属部门' },
	{ name: 'priority', value: 'High', desc: '业务优先级' },
]

const notificationExamples = [
	{ name: 'emailTemplate', value: 'approval_notify', desc: '邮件模板ID' },
	{ name: 'smsTemplate', value: 'task_remind', desc: '短信模板ID' },
	{ name: 'notifyReceivers', value: 'manager,director', desc: '通知接收人' },
	{ name: 'notifyTime', value: '09:00', desc: '通知时间' },
]

const uiExamples = [
	{ name: 'formColor', value: '#409EFF', desc: '表单主题色' },
	{ name: 'iconClass', value: 'el-icon-document', desc: '图标样式' },
	{ name: 'showInDashboard', value: 'true', desc: '是否显示在仪表板' },
	{ name: 'category', value: '采购流程', desc: '流程分类' },
]

// 初始化数据
const initData = () => {
	const propsExt = getExtensionElements(props.element, 'camunda:Properties')

	if (propsExt && propsExt.length > 0) {
		const camundaProperties = propsExt[0].values || []
		properties.value = camundaProperties.map((prop: any) => ({
			name: prop.name,
			value: prop.value,
			raw: prop,
		}))
	} else {
		properties.value = []
	}
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

// 添加属性
const handleAddProperty = () => {
	currentProperty.value = {
		name: '',
		value: '',
	}
	currentPropertyIndex.value = -1
	propertyDialogTitle.value = '添加扩展属性'
	showPropertyDialog.value = true
}

// 编辑属性
const handleEditProperty = (row: any, index: number) => {
	currentProperty.value = { ...row }
	currentPropertyIndex.value = index
	propertyDialogTitle.value = '编辑扩展属性'
	showPropertyDialog.value = true
}

// 删除属性
const handleDeleteProperty = (index: number) => {
	ElMessageBox.confirm('确定要删除此扩展属性吗？', '提示', {
		type: 'warning',
	})
		.then(() => {
			properties.value.splice(index, 1)
			saveProperties()
			ElMessage.success('删除成功')
		})
		.catch(() => {})
}

// 保存属性
const handleSaveProperty = () => {
	if (!currentProperty.value.name || !currentProperty.value.value) {
		ElMessage.warning('请填写完整信息')
		return
	}

	// 检查属性名是否重复（编辑时排除自身）
	const isDuplicate = properties.value.some(
		(prop, index) =>
			prop.name === currentProperty.value.name && index !== currentPropertyIndex.value,
	)

	if (isDuplicate) {
		ElMessage.warning('属性名已存在，请使用其他名称')
		return
	}

	const property = moddle.value.create('camunda:Property', {
		name: currentProperty.value.name,
		value: currentProperty.value.value,
	})

	if (currentPropertyIndex.value >= 0) {
		properties.value[currentPropertyIndex.value] = {
			name: currentProperty.value.name,
			value: currentProperty.value.value,
			raw: property,
		}
	} else {
		properties.value.push({
			name: currentProperty.value.name,
			value: currentProperty.value.value,
			raw: property,
		})
	}

	saveProperties()
	showPropertyDialog.value = false
	ElMessage.success('保存成功')
}

// 保存属性到BPMN
const saveProperties = () => {
	if (properties.value.length === 0) {
		updateExtensionElements('camunda:Properties', [])
		return
	}

	const camundaProperties = moddle.value.create('camunda:Properties', {
		values: properties.value.map((p) => p.raw),
	})

	updateExtensionElements('camunda:Properties', [camundaProperties])
}

const handleCloseDialog = () => {
	currentProperty.value = {}
	currentPropertyIndex.value = -1
}
</script>

<style scoped>
.extension-container {
	padding: 12px 0;
}

.extension-header {
	display: flex;
	justify-content: flex-start;
}

.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	line-height: 1.5;
}

.tips {
	font-size: 13px;
	line-height: 1.8;
}

.tips p {
	margin: 8px 0;
}

.tips ul {
	margin: 8px 0;
	padding-left: 20px;
}

.tips li {
	margin: 4px 0;
}

.code-example {
	background: #f5f7fa;
	padding: 12px;
	border-radius: 4px;
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 12px;
	line-height: 1.6;
	overflow-x: auto;
	margin: 8px 0 0 0;
}

.dark .code-example {
	background: #262626;
}

.example-collapse {
	margin-top: 12px;
}
</style>
