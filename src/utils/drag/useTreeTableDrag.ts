import Sortable from "sortablejs";
import type { Ref } from "vue";

interface TreeItem {
  id: string | number;
  children?: TreeItem[];
  [key: string]: any;
}

interface FindItemResult {
  item: TreeItem | null;
  parentItems: TreeItem[] | null;
  itemIndex: number | null;
}

export class TreeTableDraggable {
  private sortable: Sortable | null = null;

  constructor(
    private tableEl: HTMLElement,
    private data: Ref<TreeItem[]>,
    private options: {
      rowKey?: string;
      childrenKey?: string;
      onUpdate?: (newData: TreeItem[]) => void;
    } = {}
  ) {}

  public init() {
    const tbody = this.tableEl.querySelector(".el-table__body-wrapper tbody");
    if (!tbody) return;

    // 设置行样式
    const rows = tbody.querySelectorAll(".el-table__row");
    rows.forEach(row => {
      // row.style.cursor = "move";
      if (!row.getAttribute("data-id")) {
        const rowId = row.getAttribute("data-row-key");
        if (rowId) row.setAttribute("data-id", rowId);
      }
    });

    this.sortable = new Sortable(tbody as HTMLElement, {
      animation: 150,
      ghostClass: "sortable-ghost-row",
      chosenClass: "sortable-chosen-row",
      onEnd: evt => this.handleDragEnd(evt)
    });
  }

  private handleDragEnd(evt: Sortable.SortableEvent) {
    const { newIndex, oldIndex, item } = evt;
    if (
      newIndex === undefined ||
      oldIndex === undefined ||
      newIndex === oldIndex
    )
      return;

    const rowKey = this.options.rowKey || "id";
    const childrenKey = this.options.childrenKey || "children";
    const draggedId = item.getAttribute("data-id");
    console.log("draggedId", draggedId);
    if (!draggedId) return;

    // 深拷贝数据以避免响应性问题
    const newData = JSON.parse(JSON.stringify(this.data.value));

    // 查找拖拽项
    const findResult = this.findItemById(
      newData,
      draggedId,
      rowKey,
      childrenKey
    );
    console.log("findResult", findResult);
    if (
      !findResult.item ||
      !findResult.parentItems ||
      findResult.itemIndex === null
    )
      return;

    // 从原位置移除
    const [removedItem] = findResult.parentItems.splice(
      findResult.itemIndex,
      1
    );

    // 找到新位置的父级
    const newParentRow = this.findParentRow(item);
    let newParentItems: TreeItem[] = newData;

    console.log("newParentRow", newParentRow);
    if (newParentRow) {
      const newParentId = newParentRow.getAttribute("data-id");
      console.log("newParentId", newParentId);
      if (newParentId) {
        const newParentResult = this.findItemById(
          newData,
          newParentId,
          rowKey,
          childrenKey
        );
        if (newParentResult.item) {
          newParentItems = newParentResult.item[childrenKey] =
            newParentResult.item[childrenKey] || [];
        }
      }
    }

    // 插入到新位置
    newParentItems.splice(newIndex, 0, removedItem);

    // 更新数据
    this.data.value = newData;
    this.options.onUpdate?.(newData);
  }

  private findItemById(
    items: TreeItem[],
    id: string | number,
    rowKey: string,
    childrenKey: string,
    parentItems: TreeItem[] | null = null
  ): FindItemResult {
    for (let i = 0; i < items.length; i++) {
      if (items[i][rowKey] == id) {
        return {
          item: items[i],
          parentItems: parentItems || items,
          itemIndex: i
        };
      }

      if (items[i][childrenKey]?.length) {
        const result = this.findItemById(
          items[i][childrenKey],
          id,
          rowKey,
          childrenKey,
          items[i][childrenKey]
        );
        if (result.item) return result;
      }
    }
    return { item: null, parentItems: null, itemIndex: null };
  }

  private findParentRow(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains("el-table__row") && parent !== element) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  public destroy() {
    this.sortable?.destroy();
  }
}
