import { onMounted, ref } from 'vue'
import type { FormSchema } from '@/components/FormDesigner'
import { closeDialog } from '@/components/CommonDialog'
import router from '@/router'
import {
	getProcessFormById,
	saveProcessForm,
	updateProcessForm,
} from '@/api/workflow/ProcessForm.ts'
import type { ProcessFormResponse, SaveProcessFormRequest } from '@/api/types/ProcessFormTypes.ts'
import { openDrawer } from '@/components/CommonDrawer'
import FormUpdate from '@/views/workflow/form/pages/FormUpdate.vue'

export function useDesignerHooks(dialogId = '', formId = '') {
	// 修改表单实例
	const formRef = ref<InstanceType<typeof FormUpdate>>()
	// 表单初始化schema
	const initSchema = ref<FormSchema>()
	// 表单schema
	const formSchema = ref<FormSchema>()
	// 流程表单
	const processForm = ref<ProcessFormResponse>()

	// 获取表单详情
	const loadProcessForm = () => {
		if (!formId) {
			return
		}
		getProcessFormById(formId).then((res) => {
			processForm.value = res
			initSchema.value = JSON.parse(res.formContent)
		})
	}

	const handleBack = () => {
		if (dialogId) {
			closeDialog(dialogId)
		} else {
			router.go(-1)
		}
	}

	const openUpdatePanel = (title = '新增', row?: ProcessFormResponse) => {
		if (!formSchema.value) {
			ElMessage.info('表单不能为空.')
			return
		}

		if (!formSchema.value.fields || formSchema.value.fields.length === 0) {
			ElMessage.info('表单项不能为空.')
			return
		}
		openDrawer({
			title: `${title}表单`,
			bodyPadding: 20,
			confirmLoading: true,
			size: 620,
			content: () => <FormUpdate ref={formRef} formInline={row as SaveProcessFormRequest} />,
			onConfirm(close, closeLoading) {
				const updateFormRef = formRef.value?.getRef()
				const formData = formRef.value?.getData()?.value

				function chores() {
					ElMessage({
						type: 'success',
						message: `${title}成功.`,
					})
					close() // 关闭弹框
					handleBack() // 刷新表格数据
				}

				updateFormRef.validate((valid: unknown) => {
					if (valid) {
						if (!formData) {
							ElMessage.info('获取表单数据失败.')
							return
						}
						formData.formContent = JSON.stringify(formSchema.value)
						// 表单规则校验通过
						if (title === '新增') {
							// 添加表单
							saveProcessForm(formData)
								.then(() => chores())
								.finally(() => closeLoading())
						} else if (row) {
							// 修改表单
							updateProcessForm(row.id, formData)
								.then(() => chores())
								.finally(() => closeLoading())
						}
					} else {
						closeLoading()
					}
				})
			},
		})
	}

	onMounted(loadProcessForm)
	return { formSchema, handleBack, processForm, initSchema, openUpdatePanel }
}
