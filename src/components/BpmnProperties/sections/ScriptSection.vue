<template>
	<el-collapse-item title="脚本配置" name="script">
		<el-form :model="formData" label-width="70px" label-position="left">
			<el-form-item label="脚本格式">
				<el-select
					v-model="formData.scriptFormat"
					@change="handleUpdate"
					placeholder="选择脚本语言"
				>
					<el-option label="JavaScript" value="javascript" />
					<el-option label="Groovy" value="groovy" />
					<el-option label="Python" value="python" />
					<el-option label="JUEL" value="juel" />
					<el-option label="Ruby" value="ruby" />
				</el-select>
				<div class="field-tip">脚本执行引擎语言</div>
			</el-form-item>

			<el-form-item label="脚本类型">
				<el-radio-group v-model="formData.scriptType" @change="handleScriptTypeChange">
					<el-radio label="inline">内联脚本</el-radio>
					<el-radio label="external">外部资源</el-radio>
				</el-radio-group>
			</el-form-item>

			<!-- 内联脚本 -->
			<template v-if="formData.scriptType === 'inline'">
				<el-form-item label="脚本内容">
					<div class="script-editor-container">
						<el-input
							v-model="formData.script"
							type="textarea"
							:rows="12"
							@blur="handleUpdate"
							placeholder="输入脚本代码..."
							class="script-textarea"
						/>
						<div class="script-toolbar">
							<el-button size="small" :icon="DocumentCopy" v-copy="formData.script">
								复制
							</el-button>
							<el-button size="small" :icon="Document" @click="handleFormatScript">
								格式化
							</el-button>
							<el-button size="small" :icon="FullScreen" @click="handleFullScreen">
								全屏编辑
							</el-button>
						</div>
					</div>
					<div class="field-tip">
						可使用execution对象访问流程变量，如：execution.setVariable('result', value)
					</div>
				</el-form-item>
			</template>

			<!-- 外部资源 -->
			<template v-if="formData.scriptType === 'external'">
				<el-form-item label="资源路径">
					<el-input
						v-model="formData.resource"
						@blur="handleUpdate"
						placeholder="如：deployment://scripts/myScript.js"
						clearable
					/>
					<div class="field-tip">支持classpath://、deployment://、file://等协议</div>
				</el-form-item>
			</template>

			<el-divider content-position="left">执行配置</el-divider>

			<el-form-item label="结果变量">
				<el-input
					v-model="formData.resultVariable"
					@blur="handleUpdate"
					placeholder="存储脚本返回值的变量名"
					clearable
				/>
				<div class="field-tip">脚本的返回值将存储在此变量中</div>
			</el-form-item>

			<el-form-item label="自动存储变量" label-width="90px">
				<el-switch
					v-model="formData.autoStoreVariables"
					@change="handleUpdate"
					active-text="是"
					inactive-text="否"
					class="w-full"
				/>
				<div class="field-tip">自动将脚本中创建的变量存储到流程上下文</div>
			</el-form-item>

			<!-- 脚本示例 -->
			<el-divider content-position="left">示例代码</el-divider>

			<el-collapse class="example-collapse">
				<el-collapse-item title="JavaScript 示例" name="js">
					<pre class="code-example">
// 获取流程变量
var amount = execution.getVariable('amount');
var discount = execution.getVariable('discount');

// 计算
var finalAmount = amount * (1 - discount);

// 设置变量
execution.setVariable('finalAmount', finalAmount);

// 返回结果
finalAmount;</pre
					>
				</el-collapse-item>

				<el-collapse-item title="Groovy 示例" name="groovy">
					<pre class="code-example">
// 获取流程变量
def amount = execution.getVariable('amount')
def items = execution.getVariable('items')

// 处理逻辑
def total = items.sum { it.price * it.quantity }
def tax = total * 0.1

// 设置变量
execution.setVariable('total', total)
execution.setVariable('tax', tax)

// 返回
total + tax</pre
					>
				</el-collapse-item>

				<el-collapse-item title="Python 示例" name="python">
					<pre class="code-example">
# 获取流程变量
amount = execution.getVariable('amount')
rate = execution.getVariable('rate')

# 计算
result = amount * rate

# 设置变量
execution.setVariable('result', result)

# 返回结果
result</pre
					>
				</el-collapse-item>
			</el-collapse>
		</el-form>

		<!-- 全屏编辑器对话框 -->
		<el-dialog v-model="showFullScreenDialog" title="脚本编辑器" width="80%" fullscreen>
			<div class="fullscreen-editor">
				<el-input
					v-model="fullScreenScript"
					type="textarea"
					:rows="30"
					placeholder="输入脚本代码..."
				/>
			</div>
			<template #footer>
				<el-button @click="showFullScreenDialog = false">取消</el-button>
				<el-button type="primary" @click="handleSaveFullScreen">保存</el-button>
			</template>
		</el-dialog>
	</el-collapse-item>
</template>

<script setup lang="ts">
import Document from '~icons/ep/document'
import FullScreen from '~icons/ep/full-screen'
import DocumentCopy from '~icons/ep/document-copy'
import { computed, ref, watch } from 'vue'
import type { BpmnElement } from '../types'
import { getBusinessObject } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

const { updateProperties } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element),
)

const formData = ref({
	scriptFormat: 'javascript',
	scriptType: 'inline',
	script: '',
	resource: '',
	resultVariable: '',
	autoStoreVariables: true,
})

const showFullScreenDialog = ref(false)
const fullScreenScript = ref('')

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	formData.value = {
		scriptFormat: bo.scriptFormat || 'javascript',
		scriptType: bo.resource ? 'external' : 'inline',
		script: bo.script || '',
		resource: bo.resource || '',
		resultVariable: bo.resultVariable || '',
		autoStoreVariables: bo.autoStoreVariables !== false,
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

// 脚本类型切换
const handleScriptTypeChange = () => {
	if (formData.value.scriptType === 'external') {
		formData.value.script = ''
	} else {
		formData.value.resource = ''
	}
	handleUpdate()
}

// 更新配置
const handleUpdate = () => {
	const updates: any = {
		scriptFormat: formData.value.scriptFormat,
		resultVariable: formData.value.resultVariable || undefined,
		autoStoreVariables: formData.value.autoStoreVariables,
	}

	if (formData.value.scriptType === 'inline') {
		updates.script = formData.value.script || undefined
		updates.resource = undefined
	} else {
		updates.script = undefined
		updates.resource = formData.value.resource || undefined
	}

	updateProperties(updates)
}

// 格式化脚本（简单实现）
const handleFormatScript = () => {
	try {
		// 简单的格式化：添加缩进
		const lines = formData.value.script.split('\n')
		let indentLevel = 0

		formData.value.script = lines
			.map((line) => {
				const trimmed = line.trim()

				// 减少缩进
				if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
					indentLevel = Math.max(0, indentLevel - 1)
				}

				const indented = '  '.repeat(indentLevel) + trimmed

				// 增加缩进
				if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
					indentLevel++
				}

				return indented
			})
			.join('\n')
		ElMessage.success('格式化完成')
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		ElMessage.warning('格式化失败，请检查脚本语法')
	}
}

// 全屏编辑
const handleFullScreen = () => {
	fullScreenScript.value = formData.value.script
	showFullScreenDialog.value = true
}

// 保存全屏编辑
const handleSaveFullScreen = () => {
	formData.value.script = fullScreenScript.value
	showFullScreenDialog.value = false
	handleUpdate()
	ElMessage.success('保存成功')
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	line-height: 1.5;
}

.script-editor-container {
	position: relative;
	width: 100%;
}

.script-textarea {
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 13px;
}

.script-textarea :deep(textarea) {
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	line-height: 1.6;
}

.script-toolbar {
	display: flex;
	gap: 8px;
	margin-top: 8px;
}

.example-collapse {
	margin-top: 12px;
	border: none;
}

.code-example {
	background: #f5f7fa;
	padding: 12px;
	border-radius: 4px;
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 13px;
	line-height: 1.6;
	overflow-x: auto;
	margin: 0;
}

.dark .code-example {
	background: #262626;
}

.fullscreen-editor {
	height: calc(100vh - 200px);
}

.fullscreen-editor :deep(textarea) {
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 14px;
	line-height: 1.6;
}
</style>
