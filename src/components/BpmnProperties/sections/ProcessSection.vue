<template>
	<el-collapse-item title="流程定义配置" name="process">
		<el-form :model="formData" label-width="90px" label-position="left">
			<el-form-item label="流程ID">
				<el-input
					v-model="formData.id"
					@input="() => handleUpdateId()"
					placeholder="流程定义的唯一标识"
				/>
				<div class="field-tip">
					流程ID在部署后不可修改，建议使用有意义的命名
				</div>
			</el-form-item>

			<el-form-item label="流程名称">
				<el-input
					v-model="formData.name"
					@input="() => handleUpdate()"
					placeholder="流程的显示名称"
					clearable
				/>
			</el-form-item>

			<el-form-item label="版本标签">
				<el-input
					v-model="formData.versionTag"
					@input="() => handleUpdate()"
					placeholder="如：v1.0.0"
					clearable
				/>
				<div class="field-tip">
					用于标识流程版本，方便版本管理
				</div>
			</el-form-item>

			<el-form-item label="可执行">
				<el-switch
					v-model="formData.isExecutable"
					@change="() => handleUpdate()"
					active-text="是"
					inactive-text="否"
					class="w-full"
				/>
				<div class="field-tip">
					只有可执行的流程才能被流程引擎启动
				</div>
			</el-form-item>

			<el-divider content-position="left">启动权限</el-divider>

			<el-form-item label="候选启动用户">
				<el-select
					v-model="formData.candidateStarterUsers"
					@change="() => handleUpdate()"
					multiple
					filterable
					allow-create
					placeholder="输入用户ID或选择"
					style="width: 100%"
				>
					<el-option
						v-for="user in userList"
						:key="user.value"
						:label="user.label"
						:value="user.value"
					/>
				</el-select>
				<div class="field-tip">
					可以启动此流程的用户列表
				</div>
			</el-form-item>

			<el-form-item label="候选启动组">
				<el-select
					v-model="formData.candidateStarterGroups"
					@change="() => handleUpdate()"
					multiple
					filterable
					allow-create
					placeholder="输入组ID或选择"
					style="width: 100%"
				>
					<el-option
						v-for="group in groupList"
						:key="group.value"
						:label="group.label"
						:value="group.value"
					/>
				</el-select>
				<div class="field-tip">
					可以启动此流程的组列表
				</div>
			</el-form-item>

			<el-divider content-position="left">历史数据配置</el-divider>

			<el-form-item label="历史保留时间">
				<el-input
					v-model="formData.historyTimeToLive"
					@input="() => handleUpdate()"
					placeholder="如：P30D（30天）"
					clearable
				>
					<template #append>
						<el-tooltip content="ISO 8601持续时间格式" placement="top">
							<el-icon><QuestionFilled /></el-icon>
						</el-tooltip>
					</template>
				</el-input>
				<div class="field-tip">
					流程实例历史数据的保留时间，超时后会被自动清理
				</div>
			</el-form-item>

			<el-form-item label="作业优先级">
				<el-input-number
					v-model="formData.jobPriority"
					@change="() => handleUpdate()"
					:min="0"
					:max="100"
					style="width: 100%"
				/>
				<div class="field-tip">
					流程中所有作业的默认优先级（0-100）
				</div>
			</el-form-item>

			<el-form-item label="任务优先级">
				<el-input
					v-model="formData.taskPriority"
					@input="() => handleUpdate()"
					placeholder="如：50 或 ${priority}"
					clearable
				/>
				<div class="field-tip">
					流程中所有用户任务的默认优先级，支持表达式
				</div>
			</el-form-item>

			<el-divider content-position="left">流程分类</el-divider>

			<el-form-item label="流程分类">
				<el-select
					v-model="formData.processCategory"
					@change="() => handleUpdate()"
					filterable
					allow-create
					placeholder="选择或输入分类"
					clearable
				>
					<el-option label="人事流程" value="hr" />
					<el-option label="财务流程" value="finance" />
					<el-option label="采购流程" value="purchase" />
					<el-option label="审批流程" value="approval" />
					<el-option label="业务流程" value="business" />
				</el-select>
				<div class="field-tip">
					用于流程的分类管理和检索
				</div>
			</el-form-item>

			<el-form-item label="文档说明">
				<el-input
					v-model="formData.documentation"
					@input="() => handleUpdateDocumentation()"
					type="textarea"
					:rows="4"
					placeholder="输入流程的详细说明文档"
					clearable
				/>
			</el-form-item>

			<el-divider content-position="left">流程信息</el-divider>

			<el-descriptions :column="1" border>
				<el-descriptions-item label="类型">
					<el-tag>BPMN 2.0</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="命名空间">
					{{ formData.targetNamespace || 'http://bpmn.io/schema/bpmn' }}
				</el-descriptions-item>
				<el-descriptions-item label="key">
					{{ formData.id }}
				</el-descriptions-item>
			</el-descriptions>

			<el-divider content-position="left">ISO 8601 时间格式说明</el-divider>

			<el-table :data="durationExamples" style="width: 100%; margin-top: 12px">
				<el-table-column prop="format" label="格式" width="120">
					<template #default="{ row }">
						<code class="duration-code">{{ row.format }}</code>
					</template>
				</el-table-column>
				<el-table-column prop="desc" label="说明" />
			</el-table>

			<el-divider content-position="left">最佳实践</el-divider>

			<el-alert
				type="info"
				:closable="false"
			>
				<template #title>
					<div class="best-practices-title">
						<el-icon><InfoFilled /></el-icon>
						<span>流程定义配置建议</span>
					</div>
				</template>
				<ul class="best-practices-list">
					<li>
						<strong>流程ID命名：</strong>使用小写字母和下划线，如：leave_approval_process
					</li>
					<li>
						<strong>版本管理：</strong>使用语义化版本号（如v1.0.0），便于追踪变更
					</li>
					<li>
						<strong>可执行标识：</strong>开发阶段可设为否，测试通过后再设为是
					</li>
					<li>
						<strong>启动权限：</strong>合理配置候选启动用户/组，确保流程安全性
					</li>
					<li>
						<strong>历史清理：</strong>根据业务需求设置合理的保留时间，避免数据过度膨胀
					</li>
					<li>
						<strong>优先级设置：</strong>重要流程可设置较高的作业优先级，确保及时执行
					</li>
				</ul>
			</el-alert>

			<el-divider content-position="left">启动权限验证</el-divider>

			<el-collapse class="example-collapse">
				<el-collapse-item title="权限验证规则" name="auth">
					<div class="auth-rules">
						<div class="rule-item">
							<div class="rule-title">
								<el-tag type="success" size="small">规则1</el-tag>
								<span>未配置任何候选启动用户/组</span>
							</div>
							<div class="rule-desc">所有用户都可以启动流程</div>
						</div>

						<div class="rule-item">
							<div class="rule-title">
								<el-tag type="warning" size="small">规则2</el-tag>
								<span>配置了候选启动用户</span>
							</div>
							<div class="rule-desc">只有指定的用户可以启动流程</div>
						</div>

						<div class="rule-item">
							<div class="rule-title">
								<el-tag type="warning" size="small">规则3</el-tag>
								<span>配置了候选启动组</span>
							</div>
							<div class="rule-desc">该组的所有成员都可以启动流程</div>
						</div>

						<div class="rule-item">
							<div class="rule-title">
								<el-tag type="danger" size="small">规则4</el-tag>
								<span>同时配置用户和组</span>
							</div>
							<div class="rule-desc">只要满足任一条件即可启动（OR关系）</div>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</el-form>
	</el-collapse-item>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import InfoFilled from '~icons/ep/info-filled'
import QuestionFilled from '~icons/ep/question-filled'
import type { BpmnElement } from '../types'
import { getBusinessObject, getDocumentation } from '../utils/bpmnHelper'
import { useModeling } from '../composables/useModeling'
import { useDebounce } from '@/hooks/useDebounce.ts'

interface Props {
	element: BpmnElement
	modeler: any
}

const props = defineProps<Props>()

const { updateProperties, createDocumentation } = useModeling(
	computed(() => props.modeler),
	computed(() => props.element)
)

const formData = ref({
	id: '',
	name: '',
	versionTag: '',
	isExecutable: true,
	candidateStarterUsers: [] as string[],
	candidateStarterGroups: [] as string[],
	historyTimeToLive: '',
	jobPriority: 50,
	taskPriority: '',
	processCategory: '',
	documentation: '',
	targetNamespace: ''
})

// 用户和组列表（示例数据，实际应从接口获取）
const userList = ref([
	{ label: '张三', value: 'zhangsan' },
	{ label: '李四', value: 'lisi' },
	{ label: '王五', value: 'wangwu' }
])

const groupList = ref([
	{ label: '管理员组', value: 'admin' },
	{ label: '财务组', value: 'finance' },
	{ label: '人事组', value: 'hr' }
])

// ISO 8601 持续时间示例
const durationExamples = [
	{ format: 'P7D', desc: '7天' },
	{ format: 'P1M', desc: '1个月' },
	{ format: 'P6M', desc: '6个月' },
	{ format: 'P1Y', desc: '1年' },
	{ format: 'PT1H', desc: '1小时（注意：需要T前缀表示时间部分）' }
]

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	// 获取候选启动用户和组（从扩展元素中获取）
	let candidateStarterUsers: string[] = []
	let candidateStarterGroups: string[] = []

	if (bo.extensionElements) {
		const values = bo.extensionElements.values || []
		values.forEach((ext: any) => {
			if (ext.$type === 'camunda:PotentialStarter') {
				if (ext.resourceAssignmentExpression) {
					const expression = ext.resourceAssignmentExpression.body
					// 解析表达式获取用户或组
					if (expression) {
						const match = expression.match(/user\((.*?)\)|group\((.*?)\)/)
						if (match) {
							if (match[1]) {
								candidateStarterUsers = match[1].split(',').map((u: string) => u.trim())
							}
							if (match[2]) {
								candidateStarterGroups = match[2].split(',').map((g: string) => g.trim())
							}
						}
					}
				}
			}
		})
	}

	formData.value = {
		id: bo.id || '',
		name: bo.name || '',
		versionTag: bo.versionTag || '',
		isExecutable: bo.isExecutable !== false,
		candidateStarterUsers,
		candidateStarterGroups,
		historyTimeToLive: bo.historyTimeToLive || '',
		jobPriority: bo.jobPriority || 50,
		taskPriority: bo.taskPriority || '',
		processCategory: bo.processCategory || '',
		documentation: getDocumentation(props.element),
		targetNamespace: bo.$parent?.targetNamespace || ''
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

// 更新ID
const handleUpdateId = useDebounce(() => {
	const newId = formData.value.id.trim()
	if (!newId) {
		ElMessage.warning('流程ID不能为空')
		initFormData()
		return
	}

	const bo = getBusinessObject(props.element)
	if (newId === bo.id) return

	updateProperties({ id: newId })
	ElMessage.success('流程ID更新成功')
}, 400)

// 更新属性
const handleUpdate = useDebounce(() => {
	const updates: any = {
		name: formData.value.name || undefined,
		versionTag: formData.value.versionTag || undefined,
		isExecutable: formData.value.isExecutable,
		historyTimeToLive: formData.value.historyTimeToLive || undefined,
		jobPriority: formData.value.jobPriority,
		taskPriority: formData.value.taskPriority || undefined,
		processCategory: formData.value.processCategory || undefined
	}

	updateProperties(updates)

	// TODO: 更新候选启动用户和组（需要通过扩展元素）
	// 这部分较复杂，需要创建 camunda:PotentialStarter 元素
	updateCandidateStarters()
}, 400)

// 更新文档说明
const handleUpdateDocumentation = useDebounce(() => {
	const text = formData.value.documentation.trim()
	const currentDoc = getDocumentation(props.element)

	if (text === currentDoc) return

	const documentation = text ? [createDocumentation(text)] : []
	updateProperties({ documentation })
}, 400)

// 更新候选启动者（简化实现）
const updateCandidateStarters = () => {
	// 这里可以根据需要实现候选启动用户/组的更新
	// 需要创建 camunda:PotentialStarter 扩展元素
	console.log('Candidate starters:', {
		users: formData.value.candidateStarterUsers,
		groups: formData.value.candidateStarterGroups
	})
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	line-height: 1.5;
}

.duration-code {
	font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	font-size: 12px;
	background: #f5f7fa;
	padding: 2px 8px;
	border-radius: 3px;
	color: #e6a23c;
}

.best-practices-title {
	display: flex;
	align-items: center;
	gap: 8px;
	font-weight: 600;
}

.best-practices-list {
	margin: 12px 0;
	padding-left: 20px;
	line-height: 1.8;
	font-size: 13px;
}

.best-practices-list li {
	margin: 8px 0;
}

.best-practices-list strong {
	color: var(--el-text-color-primary);
}

.example-collapse {
	margin-top: 12px;
}

.auth-rules {
	font-size: 13px;
}

.rule-item {
	margin-bottom: 16px;
	padding: 12px;
	background: #f5f7fa;
	border-radius: 4px;
}
.dark .rule-item {
	background: #24292e;
}

.rule-item:last-child {
	margin-bottom: 0;
}

.rule-title {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 4px;
	font-weight: 500;
	color: var(--el-text-color-primary);
}

.rule-desc {
	color: var(--el-text-color-secondary);
	line-height: 1.6;
	margin-left: 56px;
}

:deep(.el-descriptions) {
	margin-top: 12px;
}

:deep(.el-descriptions-item__label) {
	font-weight: 500;
}
</style>
