import "./reset.css";
import { h, onMounted, reactive, ref, type Ref, toRaw } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import type { FormItemProps } from "@/views/system/dict/utils/types";
import { addDialog } from "@/components/ReDialog/index";
import editForm from "@/views/system/dict/form/index.vue";
import { createItem, deleteItem, pageItem, updateItem } from "@/api/dict";
import { usePublicHooks } from "@/views/system/hooks";
import { ElMessageBox } from "element-plus";

export function useDict(tableRef: Ref) {
  const formRef = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive({
    typeCode: "",
    keyword: "",
    status: "",
    current: pagination.currentPage,
    size: pagination.pageSize
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "编号",
      prop: "id",
      width: 90
    },
    {
      label: "类型代码",
      prop: "typeCode",
      width: 80
    },
    {
      label: "字典键",
      prop: "itemCode",
      minWidth: 80
    },
    {
      label: "字典值",
      prop: "itemName",
      minWidth: 80
    },
    {
      label: "排序编号",
      prop: "sortOrder"
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={"Y"}
          inactive-value={"N"}
          active-text="启用"
          inactive-text="禁用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 140,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "禁用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.itemCode + " - " + row.itemName
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        const id = row.id;
        const updateData = toRaw(row);
        delete updateData.id;
        updateItem(id, updateData).then(res => {
          if (res.code === 200) {
            message("已成功修改字典状态", {
              type: "success"
            });
            switchLoadMap.value[index] = Object.assign(
              {},
              switchLoadMap.value[index],
              {
                loading: false
              }
            );
            onSearch();
          } else {
            message(res.message || "修改失败.", { type: "error" });
          }
        });
      })
      .catch(() => {
        row.status === "Y" ? (row.status = "N") : (row.status = "Y");
      });
  }

  function handleDelete(row) {
    message(`您删除了字典${row.itemCode + " - " + row.itemName}的这条数据`, {
      type: "success"
    });
    deleteItem(row.id).then(res => {
      if (res.code === 200) {
        onSearch();
      } else {
        message(res.message || "删除失败.", { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    // console.log(`${val} items per page`);
    form.size = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    // console.log(`current page: ${val}`);
    form.current = val;
    onSearch();
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
    // console.log(val);
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await pageItem(toRaw(form)).finally(
      () => (loading.value = false)
    );
    dataList.value = data.records;
    pagination.total = data.total;
    pagination.pageSize = data.size;
    pagination.currentPage = data.current;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    const typeCode = title !== "新增" ? (row?.typeCode ?? "") : form.typeCode;
    const sortOrder =
      title !== "新增" ? (row?.sortOrder ?? 0) : pagination.total;
    addDialog({
      title: `${title}字典项`,
      props: {
        formInline: {
          title,
          id: row?.id ?? "",
          // parentId: row?.dept.id ?? 0,
          typeCode: typeCode,
          itemCode: row?.itemCode ?? "",
          itemName: row?.itemName ?? "",
          sortOrder: sortOrder,
          status: row?.status ?? "Y",
          i18nJson: row?.i18nJson ?? ""
        }
      },
      width: "46%",
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
            `您${title}了字典${curData.itemCode + " - " + curData.itemName}的这条数据`,
            {
              type: "success"
            }
          );
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            // console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // chores();
              createItem(toRaw(curData))
                .then(res => {
                  if (res.code === 200) {
                    chores();
                  } else {
                    closeLoading();
                    message(res.message || "添加失败.", { type: "error" });
                  }
                })
                .finally(() => closeLoading());
            } else {
              const id = curData.id;
              const updateData = toRaw(curData);
              delete updateData.id;
              updateItem(id, updateData)
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

  /**
   * 选择字典类型时触发
   * @param item 选择的字典类型
   */
  function handleSelectType(item: any) {
    form.typeCode = item.typeCode;
    onSearch();
  }

  /**
   * 删除字典类型时触发
   */
  function handleDeleteType() {
    form.typeCode = "";
    onSearch();
  }

  onMounted(async () => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    handleDelete,
    handleSelectType,
    handleDeleteType,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
