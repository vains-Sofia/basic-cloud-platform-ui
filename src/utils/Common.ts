import { type Ref } from 'vue'

/**
 * 根据传入列名和顺序对对象数组排序
 * @param arr 原始数组
 * @param key 排序列名
 * @param order 排序顺序 'asc' | 'desc'
 * @returns 排序后的新数组
 */
export function sortByKey<T extends Record<string, unknown>>(
	arr: T[],
	key: keyof T,
	order: 'asc' | 'desc' = 'asc',
): T[] {
	return [...arr].sort((a, b) => {
		const valA = a[key] as unknown
		const valB = b[key] as unknown

		// 处理 undefined/null
		if (valA == null && valB == null) return 0
		if (valA == null) return order === 'asc' ? 1 : -1
		if (valB == null) return order === 'asc' ? -1 : 1

		// 类型检查
		const isNumA = typeof valA === 'number'
		const isNumB = typeof valB === 'number'

		if (isNumA && isNumB) {
			return order === 'asc' ? valA - valB : valB - valA
		}

		// 统一转为字符串比较
		return order === 'asc'
			? // eslint-disable-next-line @typescript-eslint/no-base-to-string
				String(valA).localeCompare(String(valB))
			: // eslint-disable-next-line @typescript-eslint/no-base-to-string
				String(valB).localeCompare(String(valA))
	})
}

export class AdaptiveTable {
	props: { adaptive: boolean; extraGap: number; pagination: any, showToolbar: boolean }
	tableContainerRef: Ref<HTMLElement | null>
	paginationRef: Ref<HTMLElement | null>
	tableHeight: Ref<number>
	tableWidth?: Ref<number>

	constructor(
		props: { adaptive: boolean; extraGap: number; pagination: any, showToolbar: boolean },
		tableContainerRef: Ref<HTMLElement | null>,
		paginationRef: Ref<HTMLElement | null>,
		tableHeight: Ref<number>,
		tableWidth?: Ref<number>,
	) {
		this.props = props
		this.tableWidth = tableWidth
		this.tableHeight = tableHeight
		this.paginationRef = paginationRef
		this.tableContainerRef = tableContainerRef
	}

	calcTableHeight() {
		if (!this.props.adaptive || !this.tableContainerRef.value) return

		const container = getScrollContainer(this.tableContainerRef.value)
		const containerHeight =
			container instanceof Window ? window.innerHeight : container.clientHeight

		const rect = this.tableContainerRef.value.getBoundingClientRect()
		const containerRect =
			container instanceof Window ? { top: 0 } : container.getBoundingClientRect()
		const tableTop = rect.top - containerRect.top

		const paginationHeight = this.paginationRef.value?.offsetHeight || 0

		// 表格高度
		this.tableHeight.value =
			containerHeight - tableTop - paginationHeight - this.props.extraGap - (this.props.showToolbar === undefined || this.props.showToolbar ? 33 : -14)
		if (this.tableHeight.value < 200) this.tableHeight.value = 200

		// 表格宽度
		if (this.tableWidth) {
			this.tableWidth.value =
				(containerRect instanceof DOMRect ? containerRect.width : rect.width) - 20
		}
	}
}

export function getScrollContainer(el: HTMLElement | null): HTMLElement | Window {
	while (el) {
		const overflowY = window.getComputedStyle(el).overflowY
		if (overflowY === 'auto' || overflowY === 'scroll') return el
		el = el.parentElement
	}
	return window
}

export interface TreeNode {
	id: number | string
	parentId: number | string | null
	[key: string]: any
}

export function listToTree<T extends TreeNode>(list: T[]): T[] {
	const result: T[] = []
	const map = new Map<string | number, T>()

	// 预创建所有节点的 children
	list.forEach(item => {
		map.set(item.id, { ...item, children: [] })
	})

	list.forEach(item => {
		const node = map.get(item.id)!
		if (item.parentId == null || !map.has(item.parentId)) {
			// 顶级节点
			result.push(node)
		} else {
			// 放入父节点中
			const parent = map.get(item.parentId)!
			parent.children.push(node)
		}
	})

	return result
}

export function generateUUID() {
	let dt = new Date().getTime();

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (dt + Math.random() * 16) % 16 | 0
		dt = Math.floor(dt / 16)
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
	})
}
