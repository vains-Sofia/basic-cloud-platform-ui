import type { Directive, DirectiveBinding } from 'vue'
import { ElMessage } from 'element-plus'

interface HTMLElementCopy extends HTMLElement {
	__vCopyValue?: any
	__vCopyEvent?: string
	__vCopyHandler?: (e: Event) => void
}


// 回退方案
function fallbackCopyTextToClipboard(text: string): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			const textarea = document.createElement('textarea')
			textarea.value = text
			textarea.style.position = 'fixed'
			textarea.style.left = '-9999px'
			textarea.style.top = '0'
			document.body.appendChild(textarea)
			textarea.select()
			const ok = document.execCommand('copy')
			document.body.removeChild(textarea)
			if (ok) {
				resolve()
			} else {
				reject(new Error('execCommand failed'))
			}
		} catch (err) {
			reject(err)
		}
	})
}

function doCopy(text: string): void {
	const trimmed = text ? text.toString().trim() : ''

	if (!trimmed) {
		ElMessage.info('没有可复制的内容')
		return
	}

	const onSuccess = function () {
		ElMessage.success('已复制: ' + trimmed)
	}
	const onFail = function () {
		ElMessage.error('复制失败')
	}

	// Clipboard API
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard
			.writeText(trimmed)
			.then(onSuccess)
			.catch(() => {
				fallbackCopyTextToClipboard(trimmed).then(onSuccess).catch(onFail)
			})
		return
	}

	// fallback
	fallbackCopyTextToClipboard(trimmed).then(onSuccess).catch(onFail)
}

const vCopy: Directive<HTMLElementCopy, string | (() => string)> = {
	mounted(el: HTMLElementCopy, binding: DirectiveBinding<string | (() => string)>) {
		// 支持自定义触发事件：v-copy:click、v-copy:dblclick
		const event = binding.arg || 'click'

		// 保存最新的值
		el.__vCopyValue = binding.value

		const handler = () => {
			const value = el.__vCopyValue
			const text = typeof value === 'function' ? value() : value
			doCopy(text || '')
		}

		el.__vCopyEvent = event
		el.__vCopyHandler = handler

		el.addEventListener(event, handler)
	},

	updated(el, binding) {
		// 每次响应式值更新时更新内部存储
		el.__vCopyValue = binding.value
	},

	beforeUnmount(el) {
		const event = el.__vCopyEvent
		const handler = el.__vCopyHandler
		if (event && handler) {
			el.removeEventListener(event, handler)
		}
		delete el.__vCopyEvent
		delete el.__vCopyHandler
		delete el.__vCopyValue
	},
}

export default vCopy
