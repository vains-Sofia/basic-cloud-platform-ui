import type { ProcessModelResponse } from '@/api/types/ProcessModelTypes.ts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getByProcessKey, saveProcessModel } from '@/api/workflow/ProcessModel.ts'
import { useDebounce } from '@/hooks/useDebounce.ts'

export function useDesignerHooks() {
	const route = useRoute()

	// bpmn xml
	const bpmnXml = ref()
	// 按钮加载状态
	const confirmLoading = ref(false)
	// 流程定义详情
	const processDefinition = ref<ProcessModelResponse>()
	const processKey = route.query.processKey as string

	/**
	 * 初始化流程定义
	 */
	const loadProcessDefinition = () => {
		if (!processKey) {
			return
		}
		getByProcessKey(processKey).then((res) => {
			processDefinition.value = res
			bpmnXml.value = res.processXml
		})
	}

	const saveDefinitionDraft = useDebounce(() => {
		if (!processDefinition.value) {
			ElNotification({
				title: '保存失败',
				message: `流程模型初始化失败，请从流程模型管理进入该页面`,
				type: 'error',
			})
			return
		}

		if (!bpmnXml.value) {
			ElNotification({
				title: '保存失败',
				message: `请绘制流程后保存.`,
				type: 'error',
			})
			return
		}

		confirmLoading.value = true
		processDefinition.value.processXml = bpmnXml.value
		saveProcessModel(processDefinition.value)
			.then(() => {
				ElNotification({
					type: 'success',
					message: `流程模型 ${processDefinition.value?.processName} 保存成功.`,
					title: '保存成功',
				})
				loadProcessDefinition()
			})
			.finally(() => (confirmLoading.value = false))
	})

	onMounted(loadProcessDefinition)
	return {
		bpmnXml,
		confirmLoading,
		processDefinition,
		saveDefinitionDraft,
	}
}
