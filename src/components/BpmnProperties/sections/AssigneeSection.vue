<template>
	<el-collapse-item title="指派配置" name="assignee">
		<el-form :model="formData" label-position="left" label-width="70px">
			<el-form-item label="指派人">
				<el-input
					v-model="formData.assignee"
					@blur="handleUpdate"
					placeholder="支持表达式，如：${initiator}"
					clearable
				>
					<template #append>
						<el-button :icon="User" @click="showUserDialog = true" />
					</template>
				</el-input>
				<div class="field-tip">支持固定值或表达式（${变量名}）</div>
			</el-form-item>

			<el-form-item label="候选用户">
				<el-select
					v-model="formData.candidateUsers"
					@change="handleUpdate"
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
				<div class="field-tip">多个用户用逗号分隔</div>
			</el-form-item>

			<el-form-item label="候选组">
				<el-select
					v-model="formData.candidateGroups"
					@change="handleUpdate"
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
				<div class="field-tip">多个组用逗号分隔</div>
			</el-form-item>

			<el-form-item label="到期日期">
				<el-input
					v-model="formData.dueDate"
					@blur="handleUpdate"
					placeholder="如：${dateVariable} 或 P7D"
					clearable
				>
					<template #append>
						<el-button :icon="Calendar" @click="showDateDialog = true" />
					</template>
				</el-input>
				<div class="field-tip">ISO 8601格式或表达式</div>
			</el-form-item>

			<el-form-item label="跟进日期">
				<el-input
					v-model="formData.followUpDate"
					@blur="handleUpdate"
					placeholder="如：${followUpVariable}"
					clearable
				/>
			</el-form-item>

			<el-form-item label="优先级">
				<el-input-number
					v-model="formData.priority"
					@change="handleUpdate"
					:min="0"
					:max="100"
					style="width: 100%"
				/>
				<div class="field-tip">数值或表达式，范围0-100</div>
			</el-form-item>
		</el-form>

		<!-- 用户选择对话框 -->
		<el-dialog v-model="showUserDialog" title="选择用户" width="500px">
			<el-input v-model="userSearch" placeholder="搜索用户" prefix-icon="Search" clearable />
			<el-table
				:data="filteredUsers"
				height="300"
				style="margin-top: 16px"
				@row-click="handleSelectUser"
			>
				<el-table-column prop="label" label="用户名" />
				<el-table-column prop="value" label="用户ID" />
			</el-table>
		</el-dialog>

		<!-- 日期表达式对话框 -->
		<el-dialog v-model="showDateDialog" title="日期配置" width="500px">
			<el-radio-group v-model="dateType" style="margin-bottom: 16px">
				<el-radio label="expression">表达式</el-radio>
				<el-radio label="duration">持续时间</el-radio>
				<el-radio label="date">固定日期</el-radio>
			</el-radio-group>

			<el-input
				v-if="dateType === 'expression'"
				v-model="dateExpression"
				placeholder="${dateVariable}"
			/>
			<el-input
				v-else-if="dateType === 'duration'"
				v-model="dateExpression"
				placeholder="P7D (7天后)"
			>
				<template #prepend>P</template>
				<template #append>D</template>
			</el-input>
			<el-date-picker
				v-else
				v-model="dateValue"
				type="datetime"
				placeholder="选择日期时间"
				style="width: 100%"
			/>

			<template #footer>
				<el-button @click="showDateDialog = false">取消</el-button>
				<el-button type="primary" @click="handleConfirmDate">确定</el-button>
			</template>
		</el-dialog>
	</el-collapse-item>
</template>

<script setup lang="ts">
import User from '~icons/ep/user'
import Calendar from '~icons/ep/calendar'
import { ref, computed, watch } from 'vue'
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
	assignee: '',
	candidateUsers: [] as string[],
	candidateGroups: [] as string[],
	dueDate: '',
	followUpDate: '',
	priority: 50,
})

// 用户和组列表（示例数据，实际应从接口获取）
const userList = ref([
	{ label: '张三', value: 'zhangsan' },
	{ label: '李四', value: 'lisi' },
	{ label: '王五', value: 'wangwu' },
])

const groupList = ref([
	{ label: '管理员组', value: 'admin' },
	{ label: '财务组', value: 'finance' },
	{ label: '人事组', value: 'hr' },
])

// 对话框状态
const showUserDialog = ref(false)
const showDateDialog = ref(false)
const userSearch = ref('')
const dateType = ref('expression')
const dateExpression = ref('')
const dateValue = ref<Date>()

// 过滤用户
const filteredUsers = computed(() => {
	if (!userSearch.value) return userList.value
	return userList.value.filter(
		(user) => user.label.includes(userSearch.value) || user.value.includes(userSearch.value),
	)
})

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)
	formData.value = {
		assignee: bo.assignee || '',
		candidateUsers: bo.candidateUsers
			? bo.candidateUsers.split(',').map((s: string) => s.trim())
			: [],
		candidateGroups: bo.candidateGroups
			? bo.candidateGroups.split(',').map((s: string) => s.trim())
			: [],
		dueDate: bo.dueDate || '',
		followUpDate: bo.followUpDate || '',
		priority: Number(bo.priority) || 50,
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

// 更新属性
const handleUpdate = () => {
	updateProperties({
		assignee: formData.value.assignee || undefined,
		candidateUsers:
			formData.value.candidateUsers.length > 0
				? formData.value.candidateUsers.join(',')
				: undefined,
		candidateGroups:
			formData.value.candidateGroups.length > 0
				? formData.value.candidateGroups.join(',')
				: undefined,
		dueDate: formData.value.dueDate || undefined,
		followUpDate: formData.value.followUpDate || undefined,
		priority: formData.value.priority,
	})
}

// 选择用户
const handleSelectUser = (row: any) => {
	formData.value.assignee = row.value
	showUserDialog.value = false
	handleUpdate()
}

// 确认日期
const handleConfirmDate = () => {
	if (dateType.value === 'date' && dateValue.value) {
		formData.value.dueDate = dateValue.value.toISOString()
	} else {
		formData.value.dueDate = dateExpression.value
	}
	showDateDialog.value = false
	handleUpdate()
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	line-height: 1.5;
}
</style>
