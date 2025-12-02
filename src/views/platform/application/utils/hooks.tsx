import { form } from './enums'
import { h, ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StorageAppInfo from '@/views/platform/application/SecretInfoRemind.vue'
import {
	cardListPage,
	findById,
	openidConfiguration,
	save,
	update,
} from '@/api/platform/Application'
import type { UploadRawFile } from 'element-plus'
import { uploadByPreSignedUrl, uploadPreSigned } from '@/api/system/Common'
import type { OAuth2Metadata, SaveApplicationRequest } from '@/api/types/ApplicationTypes.ts'
import { openDialog } from '@/components/CommonDialog'
import { ImageCropper } from '@/components/ImageCropper'
import type { BasicFooterContext } from '@/stores/Plugins.ts'
import type { FindScopeResponse } from '@/api/types/ScopeTypes.ts'

export function useApplication() {
	const route = useRoute()

	// 最顶层卡片展示内容数据
	const headerCardData = ref<SaveApplicationRequest>()

	const oidcConfig = ref<OAuth2Metadata>()
	// 获取OIDC配置
	openidConfiguration().then((r) => {
		oidcConfig.value = r
	})

	// 根据下标移除数组元素，会保留最后一项
	const removeItemByIndex = (items: Array<string>, index: number) => {
		// 保留一个
		if (items.length === 1) {
			items[0] = ''
		} else {
			items.splice(index, 1)
		}
	}

	const scopeList = ref<FindScopeResponse[]>([])

	// 获取客户端详情
	const fetchDetail = async () => {
		try {
			const res = await findById(route.query.id as string)
			if (!res.redirectUris || res.redirectUris.length <= 0) {
				res.redirectUris = ['']
			}
			if (!res.postLogoutRedirectUris || res.postLogoutRedirectUris.length <= 0) {
				res.postLogoutRedirectUris = ['']
			}
			form.value = res as SaveApplicationRequest
			form.value.clientSecret = '********************************'
			headerCardData.value = JSON.parse(JSON.stringify(res))
		} catch (err) {
			console.log(err)
			ElMessage.error(`"获取详情失败"`)
		} finally {
			loading.value = false
		}
	}

	const bucket: string = 'application-picture'
	const minioBaseUrl = import.meta.env.VITE_MINIO_BASE_URL

	function handleUpload(file: UploadRawFile) {
		// 剪切后的图片blob
		const imageBlob = ref()
		openDialog({
			title: '裁剪、上传头像',
			width: '40%',
			props: {
				modelValue: file,
			},
			destroyOnClose: true,
			confirmLoading: true,
			closeOnClickModal: false,
			content: h(ImageCropper, { 'onUpdate:blob': (blob) => (imageBlob.value = blob) }),
			onConfirm: (close, closeLoading) => {
				// 头像预签名
				const fileName = file.name
				const splits = fileName.split('.')
				const name = splits[0] + '.' + crypto.randomUUID() + '.' + splits[1]
				uploadPreSigned({ name, bucket })
					.then((res) => {
						// 使用预签名URL上传
						uploadByPreSignedUrl(res.url, imageBlob.value, file.type)
							.then(() => {
								form.value.clientLogo =
									minioBaseUrl + '/' + res.bucket + '/' + res.name
								ElMessage({
									type: 'success',
									message: 'Logo上传成功.',
								})
								close() // 关闭弹框
							})
							.finally(() => closeLoading())
					})
					.finally(() => closeLoading())
			},
		})
		return false
	}

	const loading = ref(false)

	const handleBack = () => {
		// 返回逻辑
		history.back()
	}

	// 响应式数据
	const isConfirmed = ref(false)

	const handleSave = (formRef: InstanceType<any>) => {
		if (!formRef) return
		formRef.validate((valid: unknown) => {
			if (valid) {
				// 保存逻辑
				if (route.query.id) {
					update(toRaw(form.value)).then(() => {
						ElMessage({
							type: 'success',
							message: '操作成功.',
						})
					})
				} else {
					save(toRaw(form.value)).then((res) => {
						openDialog({
							width: '40%',
							showClose: false,
							appendToBody: true,
							title: 'App Secret',
							closeOnClickModal: false,
							headerClass: 'pt-[12px] text-center font-bold',
							content: () => h(StorageAppInfo, { secret: res }),
							footerRenderer: ({ close } = {} as BasicFooterContext) => {
								return h(
									<div class="flex flex-row justify-end gap-[12px] p-[20px] pt-[10px]">
										<ElButton
											disabled={!isConfirmed.value}
											onClick={() => {
												isConfirmed.value = false
												close()
												handleBack()
											}}
										>
											我已保存，关闭
										</ElButton>
										<ElButton
											type="primary"
											onClick={() => (isConfirmed.value = true)}
										>
											确认已保存{' '}
										</ElButton>
									</div>,
								)
							},
						})
					})
				}
			}
		})
	}

	const list = ref<any[]>([])
	const currentPage = ref(1)
	const pageSize = 16
	const total = ref(0)
	const finished = ref(false)
	const applicationName = ref('')

	const router = useRouter()

	const goToDetail = (id?: string | number) => {
		router.push({ name: 'ApplicationDetails', query: id ? { id } : undefined }).then()
	}

	const fetchData = async (reset = false) => {
		if (loading.value || (finished.value && !reset)) return

		if (reset) {
			list.value = []
			currentPage.value = 1
			finished.value = false
		}

		loading.value = true
		try {
			const res = await cardListPage({
				current: currentPage.value,
				size: pageSize,
				applicationName: applicationName.value.trim() || undefined,
			})

			if (res) {
				const records = res.records || []
				total.value = res.total
				list.value.push(...records)

				if (list.value.length >= total.value) {
					finished.value = true
				} else {
					currentPage.value++
				}
			}
		} catch (err) {
			console.error('数据加载失败', err)
		} finally {
			loading.value = false
		}
	}

	const handleSearch = () => {
		fetchData(true)
	}

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr)
		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
	}

	const formData = JSON.parse(JSON.stringify(form.value))
	const clearFormData = () => {
		form.value = formData
	}

	return {
		list,
		form,
		loading,
		pageSize,
		finished,
		scopeList,
		fetchData,
		formatDate,
		goToDetail,
		oidcConfig,
		handleBack,
		handleSave,
		fetchDetail,
		handleUpload,
		handleSearch,
		clearFormData,
		headerCardData,
		applicationName,
		removeItemByIndex,
	}
}
