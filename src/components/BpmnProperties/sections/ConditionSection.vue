<template>
	<el-collapse-item title="流转条件" name="condition">
		<el-form :model="formData" label-width="70px" label-position="left">
			<el-form-item label="条件类型">
				<el-radio-group v-model="formData.conditionType" @change="handleConditionTypeChange">
					<el-radio label="none">无条件</el-radio>
					<el-radio label="expression">表达式</el-radio>
					<el-radio label="script">脚本</el-radio>
				</el-radio-group>
			</el-form-item>

			<!-- 表达式条件 -->
			<template v-if="formData.conditionType === 'expression'">
				<el-form-item label="条件表达式">
					<el-input
						v-model="formData.conditionExpression"
						type="textarea"
						:rows="4"
						@input="handleUpdate"
						placeholder="如：${amount > 1000}"
						clearable
					/>
					<div class="field-tip">
						使用JUEL表达式，返回布尔值true或false
					</div>
				</el-form-item>

				<el-divider content-position="left">常用表达式示例</el-divider>

				<el-collapse class="example-collapse">
					<el-collapse-item title="数值比较" name="number">
						<div class="example-list">
							<div class="example-item" @click="applyExample('${amount > 1000}')">
								<code>${'${amount > 1000}'}</code>
								<span>金额大于1000</span>
							</div>
							<div class="example-item" @click="applyExample('${score >= 60}')">
								<code>${'${score >= 60}'}</code>
								<span>分数大于等于60</span>
							</div>
							<div class="example-item" @click="applyExample('${price > 100 && price < 1000}')">
								<code v-text="'${price > 100 && price < 1000}'"></code>
								<span>价格在100到1000之间</span>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="字符串比较" name="string">
						<div class="example-list">
							<div class="example-item" @click="applyExample('${status == \'approved\'}')">
								<code>${'${status == \'approved\'}'}</code>
								<span>状态等于approved</span>
							</div>
							<div class="example-item" @click="applyExample('${result != \'rejected\'}')">
								<code>${'${result != \'rejected\'}'}</code>
								<span>结果不等于rejected</span>
							</div>
							<div class="example-item" @click="applyExample('${type.equals(\'urgent\')}')">
								<code>${'${type.equals(\'urgent\')}'}</code>
								<span>类型等于urgent（推荐）</span>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="布尔值判断" name="boolean">
						<div class="example-list">
							<div class="example-item" @click="applyExample('${approved}')">
								<code>${'${approved}'}</code>
								<span>审批通过（布尔变量为true）</span>
							</div>
							<div class="example-item" @click="applyExample('${!rejected}')">
								<code>${'${!rejected}'}</code>
								<span>未被拒绝</span>
							</div>
							<div class="example-item" @click="applyExample('${approved && verified}')">
								<code>${'${approved && verified}'}</code>
								<span>已审批且已验证</span>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="逻辑组合" name="logic">
						<div class="example-list">
							<div class="example-item" @click="applyExample('${approved || urgent}')">
								<code>${'${approved || urgent}'}</code>
								<span>已审批或紧急</span>
							</div>
							<div class="example-item" @click="applyExample('${amount > 1000 && department == \'finance\'}')">
								<code>${'${amount > 1000 && department == \'finance\'}'}</code>
								<span>金额大于1000且部门是财务</span>
							</div>
							<div class="example-item" @click="applyExample('${(score >= 90) || (score >= 60 && extra > 10)}')">
								<code>${'${(score >= 90) || (score >= 60 && extra > 10)}'}</code>
								<span>分数90以上或60以上且有加分</span>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="集合判断" name="collection">
						<div class="example-list">
							<div class="example-item" @click="applyExample('${approvers.size() > 0}')">
								<code>${'${approvers.size() > 0}'}</code>
								<span>审批人列表不为空</span>
							</div>
							<div class="example-item" @click="applyExample('${items.contains(\'special\')}')">
								<code>${'${items.contains(\'special\')}'}</code>
								<span>列表包含special元素</span>
							</div>
							<div class="example-item" @click="applyExample('${users.isEmpty()}')">
								<code>${'${users.isEmpty()}'}</code>
								<span>用户列表为空</span>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="空值判断" name="null">
						<div class="example-list">
							<div class="example-item" @click="applyExample('${comment != null && comment != \'\'}')">
								<code>${'${comment != null && comment != \'\'}'}</code>
								<span>备注不为空</span>
							</div>
							<div class="example-item" @click="applyExample('${empty(assignee)}')">
								<code>${'${empty(assignee)}'}</code>
								<span>指派人为空</span>
							</div>
							<div class="example-item" @click="applyExample('${!empty(result)}')">
								<code>${'${!empty(result)}'}</code>
								<span>结果不为空</span>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>
			</template>

			<!-- 脚本条件 -->
			<template v-if="formData.conditionType === 'script'">
				<el-form-item label="脚本格式">
					<el-select v-model="formData.scriptFormat" @change="handleUpdate">
						<el-option label="JavaScript" value="javascript" />
						<el-option label="Groovy" value="groovy" />
						<el-option label="Python" value="python" />
						<el-option label="JUEL" value="juel" />
					</el-select>
				</el-form-item>

				<el-form-item label="脚本内容">
					<div class="script-editor-container">
						<el-input
							v-model="formData.script"
							type="textarea"
							:rows="10"
							@input="handleUpdate"
							placeholder="输入脚本代码，返回true或false..."
							class="script-textarea"
						/>
						<div class="script-toolbar">
							<el-button size="small" icon="DocumentCopy" v-copy:click="formData.script">
								复制
							</el-button>
							<el-button size="small" icon="FullScreen" @click="handleFullScreen">
								全屏编辑
							</el-button>
						</div>
					</div>
					<div class="field-tip">
						脚本必须返回布尔值（true或false）
					</div>
				</el-form-item>

				<el-divider content-position="left">脚本示例</el-divider>

				<el-collapse class="example-collapse">
					<el-collapse-item title="JavaScript 示例" name="js">
            <pre class="code-example">// 复杂业务逻辑判断
var amount = execution.getVariable('amount');
var department = execution.getVariable('department');
var urgent = execution.getVariable('urgent');

// 判断逻辑
if (urgent) {
  // 紧急情况直接通过
  true;
} else if (department == 'finance') {
  // 财务部门金额判断
  amount > 1000;
} else {
  // 其他部门
  amount > 5000;
}</pre>
					</el-collapse-item>

					<el-collapse-item title="Groovy 示例" name="groovy">
            <pre class="code-example">// Groovy脚本判断
def approved = execution.getVariable('approved')
def score = execution.getVariable('score')

// 返回判断结果
approved && score >= 60</pre>
					</el-collapse-item>
				</el-collapse>
			</template>

			<!-- 无条件提示 -->
			<template v-if="formData.conditionType === 'none'">
				<el-alert
					title="无条件流转"
					type="info"
					:closable="false"
				>
					<div class="tips">
						<p>该流转线没有条件限制，流程执行时将直接通过。</p>
						<p><strong>适用场景：</strong></p>
						<ul>
							<li>并行网关的出口（所有路径都执行）</li>
							<li>排他网关的默认流转</li>
							<li>流程的主要路径</li>
						</ul>
					</div>
				</el-alert>
			</template>

			<!-- 表达式语法说明 -->
			<template v-if="formData.conditionType === 'expression'">
				<el-divider content-position="left">JUEL表达式语法</el-divider>

				<el-table :data="syntaxReference" style="width: 100%">
					<el-table-column prop="operator" label="操作符" width="100">
						<template #default="{ row }">
							<code class="operator-code">{{ row.operator }}</code>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="说明" width="150" />
					<el-table-column prop="example" label="示例">
						<template #default="{ row }">
							<code class="example-code">{{ row.example }}</code>
						</template>
					</el-table-column>
				</el-table>
			</template>

			<!-- 测试建议 -->
			<el-divider content-position="left">测试建议</el-divider>

			<el-alert
				type="warning"
				:closable="false"
			>
				<template #title>
					<div class="warning-title">
						<el-icon><Warning /></el-icon>
						<span>条件表达式测试要点</span>
					</div>
				</template>
				<ul class="warning-list">
					<li>确保条件表达式返回布尔值（true或false）</li>
					<li>引用的流程变量必须在流程执行前被设置</li>
					<li>字符串比较推荐使用.equals()方法而不是==</li>
					<li>注意空值（null）判断，避免NullPointerException</li>
					<li>复杂逻辑建议使用脚本而不是复杂的表达式</li>
					<li>在测试环境充分测试各种边界情况</li>
				</ul>
			</el-alert>
		</el-form>

		<!-- 全屏编辑器对话框 -->
		<el-dialog
			v-model="showFullScreenDialog"
			title="脚本编辑器"
			width="80%"
			fullscreen
		>
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
import { ref, computed, watch } from 'vue'
import Warning from '~icons/ep/warning'
import type { BpmnElement } from '../types'
import { getBusinessObject } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'
import { useDebounce } from '@/hooks/useDebounce.ts'

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
	conditionType: 'none',
	conditionExpression: '',
	scriptFormat: 'javascript',
	script: ''
})

const showFullScreenDialog = ref(false)
const fullScreenScript = ref('')

// 语法参考表
const syntaxReference = [
	{ operator: '==', desc: '等于', example: '${status == \'approved\'}' },
	{ operator: '!=', desc: '不等于', example: '${result != \'rejected\'}' },
	{ operator: '>', desc: '大于', example: '${amount > 1000}' },
	{ operator: '>=', desc: '大于等于', example: '${score >= 60}' },
	{ operator: '<', desc: '小于', example: '${age < 18}' },
	{ operator: '<=', desc: '小于等于', example: '${count <= 10}' },
	{ operator: '&&', desc: '逻辑与', example: '${approved && verified}' },
	{ operator: '||', desc: '逻辑或', example: '${urgent || vip}' },
	{ operator: '!', desc: '逻辑非', example: '${!rejected}' },
	{ operator: 'empty', desc: '判断空', example: '${empty(comment)}' },
	{ operator: '.equals()', desc: '字符串相等', example: '${type.equals(\'A\')}' },
	{ operator: '.contains()', desc: '包含', example: '${list.contains(item)}' },
	{ operator: '.size()', desc: '集合大小', example: '${users.size() > 0}' }
]

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	if (!bo.conditionExpression) {
		formData.value.conditionType = 'none'
	} else {
		const condition = bo.conditionExpression

		if (condition.language === 'juel' || !condition.language) {
			// JUEL表达式
			formData.value.conditionType = 'expression'
			formData.value.conditionExpression = condition.body || ''
		} else {
			// 脚本
			formData.value.conditionType = 'script'
			formData.value.scriptFormat = condition.language || 'javascript'
			formData.value.script = condition.body || ''
		}
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

// 条件类型切换
const handleConditionTypeChange = () => {
	formData.value.conditionExpression = ''
	formData.value.script = ''
	handleUpdate()
}

// 更新条件
const handleUpdate = useDebounce(() => {
	let conditionExpression = null

	if (formData.value.conditionType === 'expression' && formData.value.conditionExpression) {
		// 表达式条件
		conditionExpression = moddle.value.create('bpmn:FormalExpression', {
			body: formData.value.conditionExpression,
			language: 'juel'
		})
	} else if (formData.value.conditionType === 'script' && formData.value.script) {
		// 脚本条件
		conditionExpression = moddle.value.create('bpmn:FormalExpression', {
			body: formData.value.script,
			language: formData.value.scriptFormat
		})
	}

	updateProperties({
		conditionExpression
	})
}, 400)

// 应用示例
const applyExample = (example: string) => {
	formData.value.conditionExpression = example
	handleUpdate()
	ElMessage.success('已应用示例表达式')
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

<style scoped lang="scss">
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	line-height: 1.5;
}

.example-collapse {
	margin-top: 12px;
	border: none;
}

.example-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.example-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	border: 1px solid var(--el-border-color);
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.3s;
}

.example-item:hover {
	transform: translateX(4px);
	border: 1px solid var(--el-color-primary);
	& code {
		color: var(--el-color-primary);
	}
}

.example-item code {
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 12px;
	color: #e6a23c;
	flex: 1;
}

.example-item span {
	font-size: 12px;
	color: #606266;
	margin-left: 12px;
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

.code-example {
	background: #f5f7fa;
	padding: 12px;
	border-radius: 4px;
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 12px;
	line-height: 1.6;
	overflow-x: auto;
	margin: 0;
}

.dark .code-example {
	background: #262626;
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

.operator-code,
.example-code {
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 12px;
	background: #f5f7fa;
	padding: 2px 6px;
	border-radius: 3px;
}

.operator-code {
	color: #e6a23c;
	font-weight: 600;
}

.example-code {
	color: #606266;
}

.warning-title {
	display: flex;
	align-items: center;
	gap: 8px;
	font-weight: 600;
}

.warning-list {
	margin: 8px 0;
	padding-left: 20px;
	line-height: 1.8;
	font-size: 13px;
}

.warning-list li {
	margin: 4px 0;
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
