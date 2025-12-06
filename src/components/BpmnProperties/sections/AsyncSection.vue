<template>
	<el-collapse-item title="异步配置" name="async">
		<el-form :model="formData" label-width="80px" label-position="left">
			<el-form-item label="异步前置">
				<el-switch
					v-model="formData.asyncBefore"
					@change="handleUpdate"
					active-text="启用"
					inactive-text="禁用"
					class="!w-full"
				/>
				<div class="field-tip">
					在进入活动之前异步执行
				</div>
			</el-form-item>

			<el-form-item label="异步后置">
				<el-switch
					v-model="formData.asyncAfter"
					@change="handleUpdate"
					active-text="启用"
					inactive-text="禁用"
					class="!w-full"
				/>
				<div class="field-tip">
					在离开活动之后异步执行
				</div>
			</el-form-item>

			<template v-if="formData.asyncBefore || formData.asyncAfter">
				<el-divider content-position="left">异步执行配置</el-divider>

				<el-form-item label="排他性">
					<el-switch
						v-model="formData.exclusive"
						@change="handleUpdate"
						active-text="是"
						inactive-text="否"
					/>
					<div class="field-tip">
						排他性作业不会与同一流程实例的其他排他性作业并发执行
					</div>
				</el-form-item>

				<el-form-item label="重试周期">
					<el-input
						v-model="formData.retryTimeCycle"
						@blur="handleUpdate"
						placeholder="如：R3/PT5M"
						clearable
					/>
					<div class="field-tip">
						作业失败时的重试策略（ISO 8601格式）
					</div>
				</el-form-item>

				<el-form-item label="作业优先级">
					<el-input-number
						v-model="formData.jobPriority"
						@change="handleUpdate"
						:min="0"
						:max="100"
						style="width: 100%"
					/>
					<div class="field-tip">
						作业执行的优先级，范围0-100
					</div>
				</el-form-item>

				<el-divider content-position="left">异步原理说明</el-divider>

				<el-alert
					type="info"
					:closable="false"
				>
					<div class="async-tips">
						<div class="tip-section">
							<strong>异步前置 (Async Before)：</strong>
							<ul>
								<li>流程到达活动时，不立即执行</li>
								<li>创建一个异步作业，由作业执行器处理</li>
								<li>事务边界：在活动执行前提交事务</li>
								<li>使用场景：长时间运行的服务调用、需要重试的操作</li>
							</ul>
						</div>

						<div class="tip-section">
							<strong>异步后置 (Async After)：</strong>
							<ul>
								<li>活动执行完成后，不立即继续流程</li>
								<li>创建一个异步作业，用于继续流程</li>
								<li>事务边界：在活动执行后提交事务</li>
								<li>使用场景：将活动执行与后续流程解耦</li>
							</ul>
						</div>

						<div class="tip-section">
							<strong>排他性 (Exclusive)：</strong>
							<ul>
								<li>默认为true，同一流程实例的排他性作业串行执行</li>
								<li>设为false，允许同一流程实例的作业并发执行</li>
								<li>建议：除非确定需要并发，否则保持排他性</li>
							</ul>
						</div>
					</div>
				</el-alert>

				<el-divider content-position="left">重试周期格式</el-divider>

				<el-table :data="retryExamples" style="width: 100%">
					<el-table-column prop="format" label="格式" width="150">
						<template #default="{ row }">
							<code class="format-code">{{ row.format }}</code>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="说明" />
				</el-table>

				<el-divider content-position="left">使用示例</el-divider>

				<el-collapse class="example-collapse">
					<el-collapse-item title="外部服务调用" name="service">
						<div class="example-content">
							<p><strong>场景：</strong>调用不稳定的外部API，需要重试机制</p>
							<div class="example-config">
								<div class="config-item">
									<span class="config-label">异步前置：</span>
									<el-tag type="success">启用</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">排他性：</span>
									<el-tag>是</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">重试周期：</span>
									<code>R3/PT5M</code>
									<span class="config-desc">失败后重试3次，每次间隔5分钟</span>
								</div>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="批量数据处理" name="batch">
						<div class="example-content">
							<p><strong>场景：</strong>处理大量数据，避免长时间占用事务</p>
							<div class="example-config">
								<div class="config-item">
									<span class="config-label">异步前置：</span>
									<el-tag type="success">启用</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">异步后置：</span>
									<el-tag type="success">启用</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">排他性：</span>
									<el-tag type="warning">否</el-tag>
									<span class="config-desc">允许并发处理不同批次</span>
								</div>
							</div>
						</div>
					</el-collapse-item>

					<el-collapse-item title="消息发送" name="message">
						<div class="example-content">
							<p><strong>场景：</strong>发送邮件或通知，失败后定期重试</p>
							<div class="example-config">
								<div class="config-item">
									<span class="config-label">异步前置：</span>
									<el-tag type="success">启用</el-tag>
								</div>
								<div class="config-item">
									<span class="config-label">重试周期：</span>
									<code>R5/PT1H</code>
									<span class="config-desc">失败后重试5次，每次间隔1小时</span>
								</div>
								<div class="config-item">
									<span class="config-label">作业优先级：</span>
									<code>80</code>
									<span class="config-desc">高优先级，确保及时发送</span>
								</div>
							</div>
						</div>
					</el-collapse-item>
				</el-collapse>

				<el-divider content-position="left">注意事项</el-divider>

				<el-alert
					type="warning"
					:closable="false"
				>
					<template #title>
						<div class="warning-title">
							<el-icon><Warning /></el-icon>
							<span>使用异步配置的注意事项</span>
						</div>
					</template>
					<ul class="warning-list">
						<li>异步执行会增加流程执行的延迟</li>
						<li>需要配置作业执行器（Job Executor）</li>
						<li>重试次数用尽后，作业会进入失败状态，需要手工处理</li>
						<li>排他性作业虽然安全，但会影响并发性能</li>
						<li>合理设置重试周期，避免过于频繁或过于稀疏</li>
					</ul>
				</el-alert>
			</template>
		</el-form>
	</el-collapse-item>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Warning from '~icons/ep/warning'
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
	computed(() => props.element)
)

const formData = ref({
	asyncBefore: false,
	asyncAfter: false,
	exclusive: true,
	retryTimeCycle: '',
	jobPriority: 50
})

// 重试周期示例
const retryExamples = [
	{ format: 'R3/PT5M', desc: '重试3次，每次间隔5分钟' },
	{ format: 'R5/PT1H', desc: '重试5次，每次间隔1小时' },
	{ format: 'R/PT30S', desc: '无限重试，每次间隔30秒' },
	{ format: 'PT10M,PT20M,PT1H', desc: '逐步延长间隔：10分钟、20分钟、1小时' }
]

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	formData.value = {
		asyncBefore: bo.asyncBefore || false,
		asyncAfter: bo.asyncAfter || false,
		exclusive: bo.exclusive !== false, // 默认为true
		retryTimeCycle: bo.retryTimeCycle || '',
		jobPriority: Number(bo.jobPriority) || 50
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

// 更新配置
const handleUpdate = () => {
	updateProperties({
		asyncBefore: formData.value.asyncBefore,
		asyncAfter: formData.value.asyncAfter,
		exclusive: formData.value.exclusive,
		retryTimeCycle: formData.value.retryTimeCycle || undefined,
		jobPriority: formData.value.jobPriority
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

.async-tips {
	font-size: 13px;
	line-height: 1.8;
}

.tip-section {
	margin-bottom: 16px;
}

.tip-section:last-child {
	margin-bottom: 0;
}

.tip-section strong {
	display: block;
	margin-bottom: 8px;
	color: var(--el-text-color-primary);
}

.tip-section ul {
	margin: 0;
	padding-left: 20px;
}

.tip-section li {
	margin: 4px 0;
}

.format-code {
	font-family: 'Consolas', 'Monaco', monospace;
	font-size: 12px;
	padding: 2px 8px;
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
	background: #f5f7fa;
	padding: 12px;
	border-radius: 4px;
}

.config-item {
	margin: 8px 0;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
}

.config-label {
	font-weight: 500;
	min-width: 80px;
}

.config-item code {
	font-family: 'Consolas', 'Monaco', monospace;
	font-size: 12px;
	background: var(--el-bg-color);
	padding: 2px 8px;
	border: 1px solid #dcdfe6;
	border-radius: 3px;
}

.config-desc {
	font-size: 12px;
	color: #909399;
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
}

.warning-list li {
	margin: 4px 0;
}

.dark .example-config {
	background: #24292e;
}
</style>
