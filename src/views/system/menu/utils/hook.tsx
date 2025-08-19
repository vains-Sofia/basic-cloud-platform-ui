import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import {
  batchUpdatePermissions,
  getMenuList,
  insertPermission,
  removePermissionById,
  updatePermission
} from "@/api/system";
import Sortable from "sortablejs";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import {
  h,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  type Ref,
  ref,
  toRaw
} from "vue";
import type { FormItemProps } from "../utils/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { cloneDeep, deviceDetection, isAllEmpty } from "@pureadmin/utils";

export function useMenu(tableRef: Ref) {
  const form = reactive({
    title: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const getMenuType = (type, text = false) => {
    switch (type) {
      case 0:
        return text ? "菜单" : "primary";
      case 1:
        return text ? "iframe" : "warning";
      case 2:
        return text ? "外链" : "danger";
      case 3:
        return text ? "按钮" : "info";
    }
  };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "title",
      align: "left",
      className: "menu-title",
      cellRenderer: ({ row }) => (
        <>
          {row.icon && (
            <span class="inline-block mr-1">
              {h(useRenderIcon(row.icon), {
                style: { paddingTop: "1px" }
              })}
            </span>
          )}
          <span>{transformI18n(row.title)}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "permissionType",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMenuType(row.permissionType)}
          effect="plain"
        >
          {getMenuType(row.permissionType, true)}
        </el-tag>
      )
    },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "component",
      formatter: ({ path, component }) =>
        isAllEmpty(component) ? path : component
    },
    {
      label: "权限标识",
      prop: "permission"
    },
    {
      label: "排序",
      prop: "rank",
      width: 100
    },
    {
      label: "隐藏",
      prop: "showLink",
      formatter: ({ showLink }) => (showLink ? "否" : "是"),
      width: 100
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  function onSearch() {
    loading.value = true;
    // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    getMenuList()
      .then(res => {
        let newData = res.data;
        if (!isAllEmpty(form.title)) {
          // 前端搜索菜单名称
          newData = newData.filter(item =>
            transformI18n(item.title).includes(form.title)
          );
        }

        // 处理成树结构
        dataList.value = handleTree(newData);
      })
      .finally(() => (loading.value = false));
  }

  function formatHigherMenuOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].title = transformI18n(treeList[i].title);
      formatHigherMenuOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          id: row?.id,
          deleted: row?.deleted ?? false,
          moduleName: row?.moduleName ?? "",
          requestMethod: row?.requestMethod ?? "",
          permissionType: row?.permissionType ?? 0,
          higherMenuOptions: formatHigherMenuOptions(cloneDeep(dataList.value)),
          parentId: row?.parentId ?? 0,
          title: row?.title ?? "",
          name: row?.name ?? "",
          path: row?.path ?? "",
          component: row?.component ?? "",
          rank: row?.rank ?? 99,
          redirect: row?.redirect ?? "",
          icon: row?.icon ?? "",
          extraIcon: row?.extraIcon ?? "",
          enterTransition: row?.enterTransition ?? "",
          leaveTransition: row?.leaveTransition ?? "",
          activePath: row?.activePath ?? "",
          permission: row?.permission ?? "",
          frameSrc: row?.frameSrc ?? "",
          frameLoading: row?.frameLoading ?? "",
          keepAlive: row?.keepAlive ?? false,
          hiddenTag: row?.hiddenTag ?? false,
          fixedTag: row?.fixedTag ?? false,
          showLink: row?.showLink ?? true,
          showParent: row?.showParent ?? false,
          needAuthentication: row?.needAuthentication ?? true
        }
      },
      width: "45%",
      draggable: true,
      sureBtnLoading: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options, closeLoading }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(
            `您${title}了菜单名称为${transformI18n(curData.title)}的这条数据`,
            {
              type: "success"
            }
          );
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              if (curData.permissionType === 3) {
                // 按钮
                curData.name = curData.title;
              }
              // 实际开发先调用新增接口，再进行下面操作
              // chores();
              insertPermission(toRaw(curData))
                .then(res => {
                  if (res.code === 200) {
                    chores();
                  } else {
                    message(res.message || "添加失败.", { type: "error" });
                  }
                })
                .finally(() => closeLoading());
            } else {
              if (curData.permissionType === 3) {
                // 按钮
                curData.name = curData.title;
              }
              // 实际开发先调用修改接口，再进行下面操作
              // chores();
              updatePermission(toRaw(curData))
                .then(res => {
                  if (res.code === 200) {
                    chores();
                  } else {
                    message(res.message || "修改失败.", { type: "error" });
                  }
                })
                .finally(() => closeLoading());
            }
          } else {
            closeLoading();
          }
        });
      }
    });
  }

  function handleDelete(row) {
    message(`您删除了菜单名称为${transformI18n(row.title)}的这条数据`, {
      type: "success"
    });
    removePermissionById(row.id).then(res => {
      if (res.code === 200) {
        onSearch();
      } else {
        message(res.message || "删除失败.", { type: "error" });
      }
    });
  }

  // ***************可将被拖动行成为放置行的子级

  // 新增：拖拽状态管理
  const dragState = ref({
    isDragging: false,
    draggedElement: null,
    draggedIndex: undefined, // 新增：记录被拖拽元素的索引
    dropIndicator: null,
    levelIndicator: null,
    targetElement: null,
    mouseMoveHandler: null, // 存储鼠标移动处理器的引用
    dropPosition: "before" // 'before', 'after', 'inside'
  });

  // 新增：创建拖拽指示器
  const createDropIndicator = () => {
    const indicator = document.createElement("div");
    indicator.className = "drag-drop-indicator";
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #409eff;
      z-index: 999;
      pointer-events: none;
      display: none;
    `;
    return indicator;
  };

  // 新增：创建层级指示器
  const createLevelIndicator = () => {
    const indicator = document.createElement("div");
    indicator.className = "drag-level-indicator";
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      right: 0;
      height: 100%;
      background-color: rgba(64, 158, 255, 0.1);
      border: 2px dashed #409eff;
      z-index: 998;
      pointer-events: none;
      display: none;
    `;
    return indicator;
  };

  // 新增：检查是否可以成为子级
  const canBecomeChild = (draggedId, targetId, flatData) => {
    // 防止循环引用：检查目标节点是否是被拖拽节点的后代
    const isDescendant = (nodeId, ancestorId, data) => {
      const node = data.find(item => item.id === nodeId);
      if (!node || node.parentId === 0) return false;
      if (node.parentId === ancestorId) return true;
      return isDescendant(node.parentId, ancestorId, data);
    };

    return !isDescendant(targetId, draggedId, flatData);
  };

  // 新增：获取鼠标相对于行的位置
  const getDropPosition = (event, targetRow) => {
    const rect = targetRow.getBoundingClientRect();
    const mouseY = event.clientY;
    const rowTop = rect.top;
    const rowHeight = rect.height;

    // 将行分为三个区域：上部1/4、中部1/2、下部1/4
    const topThreshold = rowTop + rowHeight * 0.25;
    const bottomThreshold = rowTop + rowHeight * 0.75;

    if (mouseY < topThreshold) {
      return "before";
    } else if (mouseY > bottomThreshold) {
      return "after";
    } else {
      return "inside";
    }
  };

  // 新增：更新拖拽指示器
  const updateDropIndicator = (targetRow, position) => {
    const indicator = dragState.value.dropIndicator;
    const levelIndicator = dragState.value.levelIndicator;

    if (!indicator || !levelIndicator) return;

    const rect = targetRow.getBoundingClientRect();
    const tableRect = tableRef.value.$el
      .querySelector(".el-table__body-wrapper")
      .getBoundingClientRect();

    // 隐藏所有指示器
    indicator.style.display = "none";
    levelIndicator.style.display = "none";

    if (position === "inside") {
      // 显示层级指示器（整行高亮）
      levelIndicator.style.display = "block";
      levelIndicator.style.top = `${rect.top - tableRect.top}px`;
      levelIndicator.style.height = `${rect.height}px`;
    } else {
      // 显示线性指示器
      indicator.style.display = "block";
      const indicatorTop =
        position === "before"
          ? rect.top - tableRect.top
          : rect.bottom - tableRect.top;
      indicator.style.top = `${indicatorTop}px`;
    }
  };

  // ***************拖拽相关******************

  // 重新计算整个树形结构的rank值
  const recalculateRanks = treeData => {
    const updateRankRecursively = (nodes, startRank = 1) => {
      return nodes.map((node, index) => {
        const newNode = { ...node, rank: startRank + index };
        // 递归更新子节点的rank
        if (newNode.children && newNode.children.length > 0) {
          newNode.children = updateRankRecursively(newNode.children, 1);
        }
        return newNode;
      });
    };

    return updateRankRecursively(treeData);
  };

  // 修改：增强的重建树形结构函数
  const rebuildTreeFromFlat = (
    flatData,
    draggedIndex,
    newIndex,
    newParentId,
    dropPosition = "after"
  ) => {
    const newFlatData = [...flatData];
    const draggedItem = {
      ...newFlatData[draggedIndex],
      parentId: newParentId,
      level: newFlatData[draggedIndex].level + 1,
      actualParentId: newParentId
    };

    // 移除原位置的项目
    newFlatData.splice(draggedIndex, 1);

    // 根据拖拽位置确定插入索引
    let realNewIndex = newIndex;

    // 对于 'inside' 位置，需要特殊处理插入位置
    if (dropPosition === "inside") {
      // 找到目标项在新数组中的位置，插入到其后面
      const targetItem = newFlatData.find(item => item.id === newParentId);
      if (targetItem) {
        const targetIndex = newFlatData.indexOf(targetItem);
        realNewIndex = targetIndex + 1;
        if (!targetItem.children || targetItem.children?.length === 0) {
          // 触发视图的刷新
          newFlatData[targetIndex].temp = Date.now();
        }
      }
    }

    // 插入到新位置
    newFlatData.splice(realNewIndex, 0, draggedItem);

    // 将扁平化数据转换回树形结构
    const buildTree = (items, parentId = 0) => {
      return items
        .filter(
          item => item.actualParentId === parentId || item.parentId === parentId
        )
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }));
    };

    return buildTree(newFlatData);
  };

  // 获取需要更新的项目列表（包含rank变化的项目）
  const getUpdatedItems = (originalTree, newTree) => {
    const updatedItems = [];

    const compareAndCollect = (originalNodes, newNodes) => {
      // 处理新节点
      newNodes.forEach(newNode => {
        const originalNode = findNodeById(originalTree, newNode.id);

        // 检查rank或parentId是否发生变化
        if (
          !originalNode ||
          originalNode.rank !== newNode.rank ||
          originalNode.parentId !== newNode.parentId
        ) {
          updatedItems.push({
            ...newNode,
            id: newNode.id,
            parentId: newNode.parentId,
            rank: newNode.rank,
            // 用于日志显示
            title: newNode.title
          });
        }

        // 递归处理子节点
        if (newNode.children && newNode.children.length > 0) {
          const originalChildren = originalNode
            ? originalNode.children || []
            : [];
          compareAndCollect(originalChildren, newNode.children);
        }
      });
    };

    compareAndCollect(originalTree, newTree);
    return updatedItems;
  };

  // 辅助函数：根据ID查找节点
  const findNodeById = (tree, id) => {
    for (const node of tree) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // 修改：增强的 onEnd 回调函数
  const onEnd = ({ oldIndex, newIndex }) => {
    const flattenedData = getFlattenedData(dataList.value);

    // 清理拖拽状态
    const cleanupDragState = () => {
      dragState.value.isDragging = false;
      dragState.value.draggedIndex = undefined;
      if (dragState.value.dropIndicator) {
        dragState.value.dropIndicator.style.display = "none";
      }
      if (dragState.value.levelIndicator) {
        dragState.value.levelIndicator.style.display = "none";
      }
      dragState.value.draggedElement = null;
      dragState.value.targetElement = null;
    };

    if (
      oldIndex === undefined ||
      newIndex === undefined ||
      oldIndex === newIndex
    ) {
      cleanupDragState();
      return;
    }

    const draggedItem = flattenedData[oldIndex];
    if (!draggedItem) {
      cleanupDragState();
      return;
    }

    // 使用记录的拖拽位置
    const dropPosition = dragState.value.dropPosition;
    const newParentId = calculateNewParentId(
      oldIndex,
      newIndex,
      flattenedData,
      dropPosition
    );

    // 防止循环引用
    if (!canBecomeChild(draggedItem.id, newParentId, flattenedData)) {
      message("不能将菜单移动到其子菜单中", { type: "warning" });
      cleanupDragState();
      return;
    }

    try {
      // 1. 重建树形结构
      const newTree = rebuildTreeFromFlat(
        flattenedData,
        oldIndex,
        newIndex,
        newParentId,
        dropPosition
      );

      // 2. 重新计算rank值
      const treeWithNewRanks = recalculateRanks(newTree);

      // 暂存列表数据，用于后续比对
      const tempDataList = cloneDeep(dataList.value);

      // 更新列表显示
      dataList.value = treeWithNewRanks;

      // 3. 获取需要更新的项目列表
      const updatedItems = getUpdatedItems(tempDataList, treeWithNewRanks);

      // 4. 批量更新到后端
      batchUpdatePermissions(updatedItems).then(() => {
        let successMessage = `成功将菜单"${transformI18n(draggedItem.title)}"`;
        if (dropPosition === "inside") {
          const targetItem = flattenedData[newIndex];
          successMessage += `移动为"${transformI18n(targetItem.title)}"的子菜单`;
        } else {
          successMessage += "移动到新位置";
        }
        successMessage += `，并更新了 ${updatedItems.length} 个项目的排序`;

        message(successMessage, { type: "success" });

        // 5. 刷新数据后重建表格
        // nextTick(onSearch);
      });
    } finally {
      cleanupDragState();
    }
  };

  // 修改：增强的计算新 parentId 函数
  const calculateNewParentId = (
    draggedIndex: number,
    targetIndex: number,
    flatData: any[],
    dropPosition: string = "after"
  ) => {
    const targetItem = flatData[targetIndex];
    const draggedItem = flatData[draggedIndex];

    if (!targetItem || !draggedItem) return draggedItem.parentId;

    switch (dropPosition) {
      case "inside":
        // 成为目标项的子级
        return targetItem.id;

      case "before":
        // 插入到目标项之前，与目标项同级
        return targetItem.actualParentId;

      case "after":
        // 插入到目标项之后，与目标项同级
        return targetItem.actualParentId;

      default:
        return targetItem.actualParentId;
    }
  };

  // 获取扁平化数据
  const getFlattenedData = (data: any[], level = 0, parentId = 0) => {
    const result: any[] = [];
    data.forEach(item => {
      result.push({ ...item, level, actualParentId: parentId });
      if (item.children && item.children.length > 0) {
        result.push(...getFlattenedData(item.children, level + 1, item.id));
      }
    });
    return result;
  };

  // 新增：处理鼠标移动事件
  const handleMouseMove = event => {
    if (!dragState.value.isDragging) return;

    // 找到鼠标下方的表格行
    const elementUnderMouse = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    const targetRow = elementUnderMouse?.closest("tr.el-table__row");

    if (!targetRow) {
      // 隐藏所有指示器
      if (dragState.value.dropIndicator) {
        dragState.value.dropIndicator.style.display = "none";
      }
      if (dragState.value.levelIndicator) {
        dragState.value.levelIndicator.style.display = "none";
      }
      return;
    }

    // 获取鼠标相对于行的位置
    const position = getDropPosition(event, targetRow);
    dragState.value.dropPosition = position;
    dragState.value.targetElement = targetRow;

    // 获取行索引用于验证
    const allRows = Array.from(targetRow.parentNode.children);
    const targetIndex = allRows.indexOf(targetRow);
    const draggedIndex = dragState.value.draggedIndex;

    if (targetIndex === -1 || draggedIndex === undefined) return;

    // 获取扁平化数据用于验证
    const flatData = getFlattenedData(dataList.value);

    let canDrop = true;

    // 检查是否可以拖拽到此位置
    if (position === "inside") {
      const draggedItem = flatData[draggedIndex];
      const targetItem = flatData[targetIndex];

      if (draggedItem && targetItem) {
        // 检查循环引用
        if (!canBecomeChild(draggedItem.id, targetItem.id, flatData)) {
          canDrop = false;
        }

        // 检查目标节点类型（按钮类型不能有子级）
        // if (targetItem.permissionType === 3) {
        //   canDrop = false;
        // }
      }
    }

    // 更新拖拽指示器
    if (canDrop) {
      updateDropIndicator(targetRow, position);
    } else {
      // 显示禁止拖拽的样式
      if (dragState.value.dropIndicator) {
        dragState.value.dropIndicator.style.display = "none";
      }
      if (dragState.value.levelIndicator) {
        dragState.value.levelIndicator.style.display = "none";
      }
    }
  };

  // 表格行拖拽对象
  let tableSortInstance;

  // 修改：增强的表格拖拽初始化
  const initTableSort = () => {
    const trs = tableRef.value.$el.querySelector(
      ".el-table__body-wrapper tbody"
    );

    const tableBodyWrapper = tableRef.value.$el.querySelector(
      ".el-table__body-wrapper"
    );

    // 创建拖拽指示器
    const dropIndicator = createDropIndicator();
    const levelIndicator = createLevelIndicator();
    tableBodyWrapper.appendChild(dropIndicator);
    tableBodyWrapper.appendChild(levelIndicator);

    dragState.value.dropIndicator = dropIndicator;
    dragState.value.levelIndicator = levelIndicator;

    tableSortInstance = new Sortable(trs, {
      animation: 150,
      fallbackOnBody: true,
      forceFallback: true,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",

      // 开始拖拽
      onStart: evt => {
        dragState.value.isDragging = true;
        dragState.value.draggedElement = evt.item;
        dragState.value.draggedIndex = evt.oldIndex;

        // 直接在表格容器上监听
        tableBodyWrapper.addEventListener("mousemove", handleMouseMove);
      },

      // 结束拖拽
      onEnd: event => {
        tableBodyWrapper.removeEventListener("mousemove", handleMouseMove);
        onEnd(event);
      }
    });

    // 添加CSS样式
    const style = document.createElement("style");
    style.textContent = `
      .sortable-ghost {
        opacity: 0.4;
        background-color: #f0f9ff;
      }
      .sortable-chosen {
        background-color: #e0f2fe;
      }
      .sortable-drag {
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .drag-drop-indicator {
        box-shadow: 0 0 4px rgba(64, 158, 255, 0.5);
      }
      .drag-level-indicator {
        border-radius: 4px;
      }
      .drag-forbidden {
        cursor: not-allowed;
        background-color: rgba(255, 0, 0, 0.1);
        border: 2px dashed #ff4757;
      }
    `;
    document.head.appendChild(style);
  };

  onMounted(() => {
    onSearch();
    nextTick(initTableSort);
  });

  onUnmounted(() => {
    if (tableSortInstance) {
      tableSortInstance.destroy();
    }
    // 清理拖拽指示器
    if (dragState.value.dropIndicator) {
      dragState.value.dropIndicator.remove();
    }
    if (dragState.value.levelIndicator) {
      dragState.value.levelIndicator.remove();
    }
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改菜单 */
    openDialog,
    /** 删除菜单 */
    handleDelete,
    handleSelectionChange
  };
}
