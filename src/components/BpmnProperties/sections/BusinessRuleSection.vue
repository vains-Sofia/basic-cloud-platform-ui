<template>
	<el-collapse-item title="业务规则配置" name="businessRule">
		<el-form :model="formData" label-width="70px" label-position="left">
			<el-form-item label="实现类型">
				<el-radio-group v-model="formData.implementationType" @change="handleImplementationTypeChange">
					<el-radio label="dmn">DMN决策</el-radio>
					<el-radio label="class">Java类</el-radio>
					<el-radio label="expression">表达式</el-radio>
				</el-radio-group>
			</el-form-item>

			<!-- DMN决策 -->
			<template v-if="formData.implementationType === 'dmn'">
				<el-form-item label="决策引用">
					<el-input
						v-model="formData.decisionRef"
						@blur="handleUpdate"
						placeholder="如：decision_approve"
						clearable
					/>
					<div class="field-tip">DMN决策定义的ID</div>
				</el-form-item>

				<el-form-item label="绑定类型">
					<el-select v-model="formData.decisionRefBinding" @change="handleUpdate">
						<el-option label="最新版本" value="latest" />
						<el-option label="部署版本" value="deployment" />
						<el-option label="指定版本" value="version" />
					</el-select>
				</el-form-item>

				<el-form-item v-if="formData.decisionRefBinding === 'version'" label="版本号">
					<el-input-number
						v-model="formData.decisionRefVersion"
						@change="handleUpdate"
						:min="1"
						style="width: 100%"
					/>
				</el-form-item>

				<el-form-item label="租户ID">
					<el-input
						v-model="formData.decisionRefTenantId"
						@blur="handleUpdate"
						placeholder="多租户环境下的租户ID"
						clearable
					/>
				</el-form-item>

				<el-form-item label="结果映射">
					<el-select v-model="formData.mapDecisionResult" @change="handleUpdate">
						<el-option label="单结果" value="singleResult">
							<div>
								<div>单结果</div>
								<div style="font-size: 12px; color: #909399">返回单个决策结果对象</div>
							</div>
						</el-option>
						<el-option label="单条目" value="singleEntry">
							<div>
								<div>单条目</div>
								<div style="font-size: 12px; color: #909399">返回单个输出值</div>
							</div>
						</el-option>
						<el-option label="结果列表" value="resultList">
							<div>
								<div>结果列表</div>
								<div style="font-size: 12px; color: #909399">返回决策结果列表</div>
							</div>
						</el-option>
						<el-option label="收集条目" value="collectEntries">
							<div>
								<div>收集条目</div>
								<div style="font-size: 12px; color: #909399">返回所有输出值列表</div>
							</div>
						</el-option>
					</el-select>
					<div class="field-tip">决策结果如何映射到流程变量</div>
				</el-form-item>

				<el-form-item label="结果变量">
					<el-input
						v-model="formData.resultVariable"
						@blur="handleUpdate"
						placeholder="存储决策结果的变量名"
						clearable
					/>
					<div class="field-tip">决策结果将存储在此变量中</div>
				</el-form-item>
			</template>

			<!-- Java类 -->
			<template v-if="formData.implementationType === 'class'">
				<el-form-item label="Java类">
					<el-input
						v-model="formData.class"
						@blur="handleUpdate"
						placeholder="如：com.example.rules.MyBusinessRule"
						clearable
					/>
					<div class="field-tip">完整的Java类名</div>
				</el-form-item>

				<el-form-item label="结果变量">
					<el-input
						v-model="formData.resultVariable"
						@blur="handleUpdate"
						placeholder="存储返回结果的变量名"
						clearable
					/>
				</el-form-item>
			</template>

			<!-- 表达式 -->
			<template v-if="formData.implementationType === 'expression'">
				<el-form-item label="表达式">
					<el-input
						v-model="formData.expression"
						@blur="handleUpdate"
						placeholder="如：${ruleService.evaluate()}"
						clearable
					/>
					<div class="field-tip">Spring Bean方法调用表达式</div>
				</el-form-item>

				<el-form-item label="结果变量">
					<el-input
						v-model="formData.resultVariable"
						@blur="handleUpdate"
						placeholder="存储返回结果的变量名"
						clearable
					/>
				</el-form-item>
			</template>

			<!-- DMN示例 -->
			<template v-if="formData.implementationType === 'dmn'">
				<el-divider content-position="left">DMN使用说明</el-divider>

				<el-alert
					title="DMN决策表"
					type="info"
					:closable="false"
					style="margin-bottom: 12px"
				>
					<div class="dmn-tips">
						<p><strong>输入变量：</strong>从流程变量中自动获取</p>
						<p><strong>输出变量：</strong>通过结果变量存储到流程中</p>
						<p><strong>决策表结构：</strong></p>
						<ul>
							<li>输入列：定义决策输入条件</li>
							<li>输出列：定义决策输出结果</li>
							<li>规则行：定义具体的决策规则</li>
						</ul>
					</div>
				</el-alert>

				<el-collapse class="example-collapse">
					<el-collapse-item title="DMN决策表示例" name="dmn">
						<div class="dmn-example">
							<p><strong>场景：</strong>根据订单金额决定审批级别</p>
							<table class="dmn-table">
								<thead>
								<tr>
									<th>规则</th>
									<th>订单金额 (Input)</th>
									<th>审批级别 (Output)</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>1</td>
									<td>&lt; 1000</td>
									<td>经理审批</td>
								</tr>
								<tr>
									<td>2</td>
									<td>[1000..5000)</td>
									<td>总监审批</td>
								</tr>
								<tr>
									<td>3</td>
									<td>&gt;= 5000</td>
									<td>总裁审批</td>
								</tr>
								</tbody>
							</table>
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
	implementationType: 'dmn',
	decisionRef: '',
	decisionRefBinding: 'latest',
	decisionRefVersion: 1,
	decisionRefTenantId: '',
	mapDecisionResult: 'singleResult',
	resultVariable: '',
	class: '',
	expression: ''
})

// 初始化表单数据
const initFormData = () => {
	const bo = getBusinessObject(props.element)

	// 判断实现类型
	if (bo.decisionRef) {
		formData.value.implementationType = 'dmn'
		formData.value.decisionRef = bo.decisionRef
		formData.value.decisionRefBinding = bo.decisionRefBinding || 'latest'
		formData.value.decisionRefVersion = bo.decisionRefVersion || 1
		formData.value.decisionRefTenantId = bo.decisionRefTenantId || ''
		formData.value.mapDecisionResult = bo.mapDecisionResult || 'singleResult'
	} else if (bo.class) {
		formData.value.implementationType = 'class'
		formData.value.class = bo.class
	} else if (bo.expression) {
		formData.value.implementationType = 'expression'
		formData.value.expression = bo.expression
	}

	formData.value.resultVariable = bo.resultVariable || ''
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

// 实现类型切换
const handleImplementationTypeChange = () => {
	updateProperties({
		decisionRef: undefined,
		decisionRefBinding: undefined,
		decisionRefVersion: undefined,
		decisionRefTenantId: undefined,
		mapDecisionResult: undefined,
		class: undefined,
		expression: undefined
	})
}

// 更新配置
const handleUpdate = () => {
	const updates: any = {
		resultVariable: formData.value.resultVariable || undefined
	}

	switch (formData.value.implementationType) {
		case 'dmn':
			updates.decisionRef = formData.value.decisionRef || undefined
			updates.decisionRefBinding = formData.value.decisionRefBinding
			if (formData.value.decisionRefBinding === 'version') {
				updates.decisionRefVersion = formData.value.decisionRefVersion
			} else {
				updates.decisionRefVersion = undefined
			}
			updates.decisionRefTenantId = formData.value.decisionRefTenantId || undefined
			updates.mapDecisionResult = formData.value.mapDecisionResult
			updates.class = undefined
			updates.expression = undefined
			break
		case 'class':
			updates.decisionRef = undefined
			updates.decisionRefBinding = undefined
			updates.decisionRefVersion = undefined
			updates.decisionRefTenantId = undefined
			updates.mapDecisionResult = undefined
			updates.class = formData.value.class || undefined
			updates.expression = undefined
			break
		case 'expression':
			updates.decisionRef = undefined
			updates.decisionRefBinding = undefined
			updates.decisionRefVersion = undefined
			updates.decisionRefTenantId = undefined
			updates.mapDecisionResult = undefined
			updates.class = undefined
			updates.expression = formData.value.expression || undefined
			break
	}

	updateProperties(updates)
}
</script>

<style scoped>
.field-tip {
	font-size: 12px;
	color: var(--el-text-color-secondary);
	margin-top: 4px;
	line-height: 1.5;
}

.dmn-tips {
	font-size: 13px;
	line-height: 1.8;
}

.dmn-tips p {
	margin: 8px 0;
}

.dmn-tips ul {
	margin: 8px 0;
	padding-left: 20px;
}

.dmn-tips li {
	margin: 4px 0;
}

.example-collapse {
	margin-top: 12px;
	border: none;
}

.dmn-example {
	font-size: 13px;
}

.dmn-example p {
	margin-bottom: 12px;
}

.dmn-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;
}

.dmn-table th,
.dmn-table td {
	border: 1px solid var(--el-border-color);
	padding: 8px 12px;
	text-align: left;
}

.dmn-table th {
	font-weight: 600;
}
</style>
