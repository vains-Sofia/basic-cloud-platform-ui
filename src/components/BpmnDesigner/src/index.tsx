import {
	defineComponent,
	nextTick,
	onBeforeUnmount,
	onMounted,
	type PropType,
	ref,
	watch,
} from 'vue'
import { bpmnXml } from './defaultBpmn'
import Modeler from 'bpmn-js/lib/Modeler'
import TokenSimulationModule from 'bpmn-js-token-simulation'
// import {
// 	BpmnPropertiesPanelModule,
// 	BpmnPropertiesProviderModule,
// 	CamundaPlatformPropertiesProviderModule,
// } from 'bpmn-js-properties-panel'

// 网格背景
// import GridLineModule from 'diagram-js-grid-bg'
import './bpmn-designers.css'

/**
 * 引入 Camunda Moddle 描述符，用于扩展 BPMN 模型以支持 Camunda 特性。
 */
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
import { getScrollContainer, makeValidBpmnId } from '@/utils/Common.ts'
import { Icon } from '@iconify/vue'
import { openDialog } from '@/components/CommonDialog'
import { useDebounce } from '@/hooks/useDebounce.ts'
import type { SaveSVGResult, SaveXMLResult } from 'bpmn-js/lib/BaseViewer'
import type { BasicFooterContext } from '@/stores/Plugins.ts'

import type { BpmnElement } from '@/components/BpmnProperties'
import { PropertiesPanel } from '@/components/BpmnProperties'

/**
 * 汉化
 */
import BpmnTranslator from '@/components/BpmnDesigner/src/translater/BpmnTranslator.ts'
import { CodeViewer } from '@/components/CodeViewer'

type ToolbarAction =
	| 'zoomIn'
	| 'zoomOut'
	| 'fit-viewport'
	| 'undo'
	| 'redo'
	| 'saveXML'
	| 'loadXML'
	| 'exportSVG'
	| 'exportPNG'

const style = `
#bio-properties-panel-id {
	border-color: var(--input-disabled-border-color);
    background-color: var(--input-disabled-background-color);
    color: var(--input-disabled-color);
    pointer-events: none;
}
`

export default defineComponent({
	name: 'BpmnDesigner',

	props: {
		// BPMN XML 值
		modelValue: {
			type: String as PropType<string | null>,
			default: null,
		},
		// 是否只读(暂未实现)
		readonly: {
			type: Boolean,
			default: false,
		},
		// 默认 BPMN XML
		initialDiagram: {
			type: String,
			default: bpmnXml,
		},
		// 扩展 Module
		additionalModules: {
			type: Array as PropType<any[]>,
			default: () => [],
		},
		// 扩展
		moddleExtensions: {
			type: Object as PropType<Record<string, any>>,
			default: () => ({}),
		},
		// 流程定义key，不传入时自动生成 `Process_${UUID}`
		processKey: {
			type: String,
			default: '',
		},
	},

	emits: ['update:modelValue', 'loaded', 'changed', 'error'],

	setup(props, { emit }) {
		const containerRef = ref<HTMLDivElement>()
		// const panelRef = ref<HTMLDivElement | null>(null)
		let modeler: any = null
		// 流程模拟状态
		const isSimulating = ref(false)

		const selectedElement = ref<BpmnElement>()

		/**
		 * BPMN 设计器初始化
		 */
		const createModeler = async () => {
			if (!containerRef.value) return

			// 汉化翻译器
			const translateModule = {
				translate: ['value', BpmnTranslator],
			}

			const modules = [
				translateModule,
				// BpmnPropertiesPanelModule,
				...props.additionalModules,
				// BpmnPropertiesProviderModule,
				// CamundaPlatformPropertiesProviderModule,
				// 流程模拟
				TokenSimulationModule,
			]

			modeler = new Modeler({
				container: containerRef.value,
				// propertiesPanel: { parent: panelRef.value },
				additionalModules: modules,
				moddleExtensions: {
					...props.moddleExtensions,
					camunda: CamundaBpmnModdle,
				},
			})

			const eventBus = modeler.get('eventBus')

			eventBus.on('selection.changed', (event: any) => {
				const { newSelection } = event
				selectedElement.value = (newSelection?.[0] as BpmnElement) || undefined
			})

			modeler.on('import.done', (event: any) => {
				if (event.error) emit('error', event.error)
				else emit('loaded')
				// 如果传入processKey则固定值，不允许修改
				nextTick(() => fixedProcessKey())

				eventBus.on(
					'commandStack.changed',
					useDebounce(() => {
						// 当Change事件触发modelValue的改变时，阻止watch的更新
						internalUpdating = true
						saveToModelValue()
							.catch((err) => emit('error', err))
							.finally(() => (internalUpdating = false))
						emit('changed')
					}, 500),
				)
			})

			const xml = props.modelValue ?? props.initialDiagram
			if (xml) {
				await loadDiagram(xml)
			}
		}

		// 当前bpmn是否在更新中，在更新中则阻止watch的更新
		let internalUpdating = false

		/**
		 * 加载 BPMN XML
		 * @param xml BPMN XML
		 */
		const loadDiagram = async (xml: string) => {
			if (!modeler) return
			internalUpdating = true
			try {
				if (props.processKey) {
					// 如果传入process key则替换
					xml = xml.replace(
						/<process id="[^"]+"/,
						`<process id="${makeValidBpmnId(props.processKey)}"`,
					)
					xml = xml.replace(
						/<bpmn2:process id="[^"]+"/,
						`<bpmn2:process id="${makeValidBpmnId(props.processKey)}"`,
					)
				}
				await modeler.importXML(xml)
				modeler.get('canvas').zoom('fit-viewport')
				internalUpdating = false
				emit('update:modelValue', xml)
			} catch (e) {
				emit('error', e)
			} finally {
				internalUpdating = false
			}
		}

		/**
		 * 固定processKey，禁止修改(如果传入processKey)
		 */
		const fixedProcessKey = () => {
			if (!props.processKey) return
			const processKeyInput = document.getElementById(
				'bio-properties-panel-id',
			) as HTMLInputElement
			if (processKeyInput) {
				processKeyInput.disabled = true
			}

			// 禁用process_key
			if (!document.getElementById('bpmn-designer-style')) {
				const el = document.createElement('style')
				el.id = 'bpmn-designer-style'
				el.innerHTML = style
				document.head.appendChild(el)
			}
		}

		/**
		 * 获取BPMN设计器容器高度
		 */
		const initContainerHeight = () => {
			if (!containerRef.value) return
			const container = getScrollContainer(containerRef.value)
			const containerHeight =
				container instanceof Window ? window.innerHeight : container.clientHeight

			const rect = containerRef.value.getBoundingClientRect()
			const containerRect =
				container instanceof Window ? { top: 0 } : container.getBoundingClientRect()
			const tableTop = rect.top - containerRect.top

			modelerDesignerHeight.value = containerHeight - tableTop
		}

		const debounceContainerHeight = useDebounce(initContainerHeight, 100)

		/**
		 * 获取 BPMN 设计器中的 BPMN XML 并修改modelValue
		 */
		const saveToModelValue = async () => {
			if (!modeler) return
			try {
				const { xml } = await modeler.saveXML({ format: true })
				emit('update:modelValue', xml)
				// console.log(xml)
				return xml
			} catch (e) {
				emit('error', e)
			}
		}

		/**
		 * 工具栏点击触发对应
		 * @param action 根据action判断点击什么
		 */
		const executeToolbar = async (action: ToolbarAction) => {
			if (!modeler) return
			const canvas = modeler.get('canvas')
			const commandStack = modeler.get('commandStack')

			switch (action) {
				case 'zoomIn':
					// 放大
					canvas.zoom(canvas.zoom() * 1.1 || 1.1)
					break
				case 'zoomOut':
					// 缩小
					canvas.zoom(canvas.zoom() * 0.9 || 0.9)
					break
				case 'fit-viewport':
					// 聚焦
					canvas.zoom('fit-viewport')
					break
				case 'undo':
					// 撤销
					commandStack.undo()
					break
				case 'redo':
					// 撤销撤销
					commandStack.redo()
					break
				case 'loadXML':
					// 重新加载 BPMN XML
					return await loadDiagram(props.modelValue ?? props.initialDiagram)
			}
		}

		/**
		 * 处理下载
		 * @param command 文件类型
		 */
		const handleDownloadCommand = (command: string) => {
			if (!modeler) {
				ElMessage.info('模型加载失败，请刷新重试')
				return
			}

			switch (command) {
				case 'BPMN':
					modeler.saveXML({ format: true }).then(({ xml }: SaveXMLResult) => {
						if (!xml) {
							ElMessage.error('获取流程图内容失败.')
							return
						}
						const blob = new Blob([xml], { type: 'text/plain;charset=utf-8' })
						const url = URL.createObjectURL(blob)
						const link = document.createElement('a')
						link.href = url
						link.setAttribute('download', 'diagram.bpmn')
						document.body.appendChild(link)
						link.click()
						document.body.removeChild(link)

						// 释放临时 URL
						URL.revokeObjectURL(url)
					})
					break

				case 'XML':
					modeler.saveXML({ format: true }).then(({ xml }: SaveXMLResult) => {
						if (!xml) {
							ElMessage.error('获取流程图内容失败.')
							return
						}
						const blob = new Blob([xml], { type: 'text/plain;charset=utf-8' })
						const url = URL.createObjectURL(blob)
						const link = document.createElement('a')
						link.href = url
						link.setAttribute('download', 'diagram.bpmn20.xml')
						document.body.appendChild(link)
						link.click()
						document.body.removeChild(link)

						// 释放临时 URL
						URL.revokeObjectURL(url)
					})
					break

				case 'PNG':
					modeler.saveSVG({ format: true }).then(({ svg }: SaveSVGResult) => {
						if (!svg) {
							ElMessage.error('获取流程图内容失败.')
							return
						}

						// 1. SVG → Blob URL
						const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
						const url = URL.createObjectURL(svgBlob)

						// 2. 用 Image 加载 SVG
						const img = new Image()
						img.onload = () => {
							// 3. 创建 canvas
							const canvas = document.createElement('canvas')
							canvas.width = img.width
							canvas.height = img.height
							const ctx = canvas.getContext('2d')!
							ctx.drawImage(img, 0, 0)

							// 4. Canvas 导出 PNG
							canvas.toBlob((blob) => {
								if (!blob) {
									ElMessage.error('PNG 生成失败')
									return
								}

								const pngUrl = URL.createObjectURL(blob)
								const link = document.createElement('a')
								link.href = pngUrl
								link.setAttribute('download', 'diagram.png')
								document.body.appendChild(link)
								link.click()
								document.body.removeChild(link)
							})

							// 释放临时 URL
							URL.revokeObjectURL(url)
						}

						img.onerror = () => {
							ElMessage.error('SVG 转 PNG 失败')
						}

						img.src = url
					})
					break

				case 'SVG':
					modeler.saveSVG({ format: true }).then(({ svg }: SaveSVGResult) => {
						if (!svg) {
							ElMessage.error('获取流程图内容失败.')
							return
						}
						const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
						const url = URL.createObjectURL(blob)
						const link = document.createElement('a')
						link.href = url
						link.setAttribute('download', 'diagram.svg')
						document.body.appendChild(link)
						link.click()
						document.body.removeChild(link)

						// 释放临时 URL
						URL.revokeObjectURL(url)
					})
					break

				default:
					ElMessage.info(`不支持下载为 ${command}`)
			}
		}

		/**
		 * 处理预览
		 * @param command 预览类型
		 */
		const handlePreviewCommand = async (command: string) => {
			if (!modeler) {
				ElMessage.error('模型加载失败，请刷新重试')
				return
			}

			switch (command) {
				case 'XML':
				case 'BPMN': {
					// 直接展示 BPMN 文本
					const xml = props.modelValue ?? props.initialDiagram

					openDialog({
						title: 'BPMN 预览',
						draggable: true,
						top: '8vh',
						destroyOnClose: true,
						width: '60%',
						content: () => <CodeViewer code={xml} language={'xml'} />,
						footerRenderer: ({ close } = {} as BasicFooterContext) => (
							<div class="flex justify-end">
								<ElButton plain onClick={close}>
									关闭
								</ElButton>
								<ElButton
									type={'primary'}
									onClick={() => handleDownloadCommand('BPMN')}
								>
									下载
								</ElButton>
							</div>
						),
					})
					break
				}

				case 'SVG': {
					try {
						const { svg } = await modeler.saveSVG({ format: true })

						openDialog({
							title: 'SVG 预览',
							draggable: true,
							destroyOnClose: true,
							width: '80%',
							content: () => (
								<div
									class="max-h-[70vh] overflow-auto flex justify-center items-center"
									innerHTML={svg}
								/>
							),
							footerRenderer: ({ close } = {} as BasicFooterContext) => (
								<div class="flex justify-end">
									<ElButton plain onClick={close}>
										关闭
									</ElButton>
									<ElButton
										type={'primary'}
										onClick={() => handleDownloadCommand('SVG')}
									>
										下载
									</ElButton>
								</div>
							),
						})
					} catch (err) {
						console.error(err)
						ElMessage.error('SVG 生成失败')
					}
					break
				}

				case 'PNG': {
					try {
						const { svg } = await modeler.saveSVG({ format: true })

						// 将 SVG 转成 PNG
						const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
						const url = URL.createObjectURL(svgBlob)

						const img = new Image()
						img.src = url

						img.onload = () => {
							const canvas = document.createElement('canvas')
							canvas.width = img.width
							canvas.height = img.height
							const ctx = canvas.getContext('2d')!

							ctx.drawImage(img, 0, 0)

							const pngUrl = canvas.toDataURL('image/png')

							openDialog({
								top: '10vh',
								title: 'PNG 预览',
								draggable: true,
								destroyOnClose: true,
								width: '80%',
								content: () => (
									<div class="max-h-[70vh] flex justify-center">
										<img alt="" src={pngUrl} class="max-w-full" />
									</div>
								),
								footerRenderer: ({ close } = {} as BasicFooterContext) => (
									<div class="flex justify-end">
										<ElButton plain onClick={close}>
											关闭
										</ElButton>
										<ElButton
											type={'primary'}
											onClick={() => handleDownloadCommand('PNG')}
										>
											下载
										</ElButton>
									</div>
								),
							})

							URL.revokeObjectURL(url)
						}

						img.onerror = () => {
							ElMessage.error('PNG 生成失败')
						}
					} catch (err) {
						console.error(err)
						ElMessage.error('PNG 生成失败')
					}

					break
				}

				default:
					ElMessage.info(`不支持预览 ${command}`)
			}
		}

		/**
		 * 从上传的BPMN文件中读取 BPMN XML
		 * @param file
		 */
		const handleUploadBpmn = (file: File) => {
			if (!file) return false

			const reader = new FileReader()

			reader.onload = (e) => {
				const xml = e.target?.result as string

				loadDiagram(xml).then(() => ElMessage.success('上传成功.'))
			}

			reader.readAsText(file)
			return false
		}

		const toggleSimulationMode = () => {
			if (!modeler) return

			// 通过 toggleMode 方法切换模拟状态[citation:8]
			modeler.get('toggleMode').toggleMode()
			isSimulating.value = !isSimulating.value
		}

		// 设计器高度，始终占满可视化区域
		const modelerDesignerHeight = ref()
		onMounted(() => {
			// 初始化 BPMN 设计器
			createModeler().catch((e) => emit('error', e))
			// 获取设计器容器高度
			initContainerHeight()
			// 页面尺寸变化时重新 获取设计器容器高度
			window.addEventListener('resize', debounceContainerHeight)
		})

		onBeforeUnmount(() => {
			modeler?.destroy()
			modeler = null
			window.removeEventListener('resize', debounceContainerHeight)
		})

		// 监听外部modelValue变化事件，重新加载BPMN XML
		watch(
			() => props.modelValue,
			(nv, ov) => {
				// 如果bpmn设计器在更新中则跳过，防止触发套娃更新
				if (internalUpdating) return
				if (!nv || nv === ov) return
				loadDiagram(nv).catch((e) => emit('error', e))
			},
		)

		return () => (
			<div style="display:flex;flex-direction:column;width:100%;height:100%;position:relative;">
				<div
					style={{
						zIndex: 10,
						position: 'absolute',
						top: `10px`,
						left: '20px',
						display: 'flex',
						gap: '8px',
						padding: '6px 10px',
						borderRadius: '8px',
						background: 'var(--cropper-toolbar-bg, rgba(0,0,0,0.4))',
						backdropFilter: 'blur(6px)',
					}}
					class="items-center justify-center flex-wrap toolbar-container"
				>
					<ElTooltip content="放大">
						<button
							onClick={() => void executeToolbar('zoomIn')}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							<Icon icon="ep:zoom-in" />
						</button>
					</ElTooltip>
					<ElTooltip content="聚焦">
						<button
							onClick={() => void executeToolbar('fit-viewport')}
							style={{
								color: 'white',
								cursor: 'pointer',
								fontSize: '14px',
							}}
						>
							<Icon icon="ep:aim" />
						</button>
					</ElTooltip>
					<ElTooltip content="缩小">
						<button
							onClick={() => void executeToolbar('zoomOut')}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							<Icon icon="ep:zoom-out" />
						</button>
					</ElTooltip>
					<ElTooltip content="撤销">
						<button
							onClick={() => void executeToolbar('undo')}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							<Icon icon="ep:refresh-left" />
						</button>
					</ElTooltip>
					<ElTooltip content="重做">
						<button
							onClick={() => void executeToolbar('redo')}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							<Icon icon="ep:refresh-right" />
						</button>
					</ElTooltip>
					<ElTooltip content="上传">
						<ElUpload action="#" show-file-list={false} beforeUpload={handleUploadBpmn}>
							<Icon icon="ep:upload" />
						</ElUpload>
					</ElTooltip>
					<ElDropdown onCommand={handleDownloadCommand}>
						{{
							default: () => <Icon icon="ep:download" />,
							dropdown: () => (
								<ElDropdownMenu>
									<ElDropdownItem command="BPMN">下载为BPMN</ElDropdownItem>
									<ElDropdownItem command="XML">下载为XML</ElDropdownItem>
									<ElDropdownItem command="PNG">下载为PNG</ElDropdownItem>
									<ElDropdownItem command="SVG">下载为SVG</ElDropdownItem>
								</ElDropdownMenu>
							),
						}}
					</ElDropdown>
					<ElTooltip content="预览SVG">
						<button
							onClick={() => void handlePreviewCommand('SVG')}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							<Icon icon="ep:picture" />
						</button>
					</ElTooltip>
					<ElTooltip content="预览图片">
						<button
							onClick={() => void handlePreviewCommand('PNG')}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							<Icon icon="ep:picture-filled" />
						</button>
					</ElTooltip>
					<ElTooltip content="预览XML">
						<button
							onClick={() => void handlePreviewCommand('XML')}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							<Icon icon="ri:code-view" />
						</button>
					</ElTooltip>
					<ElTooltip content={`${isSimulating.value ? '关闭' : '打开'}流程模拟器`}>
						<button
							onClick={toggleSimulationMode}
							style={{ color: 'white', cursor: 'pointer' }}
						>
							{isSimulating.value ? (
								<Icon icon="ep:video-pause" />
							) : (
								<Icon icon="ep:video-play" />
							)}
						</button>
					</ElTooltip>
				</div>

				<div class="bpmn-body">
					<div style="flex:1;position:relative;">
						<div
							ref={containerRef}
							class="bpmn-canvas"
							style={`height: ${modelerDesignerHeight.value}px;`}
						/>
					</div>
					{/*<div
						ref={panelRef}
						class="bpmn-properties-panel"
						style={`height: ${modelerDesignerHeight.value}px;`}
					/>*/}
					{modeler && (
						<PropertiesPanel
							modeler={modeler}
							element={selectedElement.value}
							style={`height: ${modelerDesignerHeight.value}px;`}
						/>
					)}
				</div>
			</div>
		)
	},
})
