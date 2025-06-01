import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import { getMenuList } from "@/api/system";

import {
  getScopeList,
  insertScope,
  updateScope,
  getScopeMenuIds,
  updateScopePermissions,
  removeScopeById
} from "@/api/scope";
import { h, onMounted, reactive, type Ref, ref, toRaw, watch } from "vue";

export function useRole(treeRef: Ref) {
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const treeIds = ref([]);
  const treeData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const isLinkage = ref(true);
  const treeSearchValue = ref();
  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const treeProps = {
    value: "id",
    label: "title",
    children: "children"
  };
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive({
    name: "",
    scope: "",
    current: pagination.currentPage,
    size: pagination.pageSize
  });

  const columns: TableColumnList = [
    {
      label: "Scope编号",
      prop: "id"
    },
    {
      label: "Scope名称",
      prop: "name"
    },
    {
      label: "Scope编码",
      prop: "scope"
    },
    {
      label: "备注",
      prop: "description",
      minWidth: 160
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 100,
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];
  // const buttonClass = computed(() => {
  //   return [
  //     "!h-[20px]",
  //     "reset-margin",
  //     "!text-gray-500",
  //     "dark:!text-white",
  //     "dark:hover:!text-primary"
  //   ];
  // });
  function handleDelete(row) {
    message(`您删除了Scope名称为${row.name}的这条数据`, { type: "success" });
    removeScopeById(row.id).then(res => {
      if (res.code === 200) {
        onSearch();
      } else {
        message(res.message || "删除失败.", { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    form.size = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    form.current = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getScopeList(toRaw(form)).finally(
      () => (loading.value = false)
    );
    dataList.value = data.records;
    pagination.total = Number(data.total);
    pagination.pageSize = Number(data.size);
    pagination.currentPage = Number(data.current);

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
    addDialog({
      title: `${title}Scope`,
      props: {
        formInline: {
          id: row?.id ?? "",
          name: row?.name ?? "",
          scope: row?.scope ?? "",
          enabled: row?.enabled ?? true,
          description: row?.description ?? ""
        }
      },
      width: "40%",
      draggable: true,
      sureBtnLoading: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了Scope名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            // console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 添加Scope
              insertScope(toRaw(curData)).then(res => {
                if (res.code === 200) {
                  chores();
                } else {
                  message(res.message || "新增Scope失败.", { type: "error" });
                }
              });
            } else {
              // 修改Scope
              updateScope(toRaw(curData)).then(res => {
                if (res.code === 200) {
                  chores();
                } else {
                  message(res.message || "修改Scope失败.", { type: "error" });
                }
              });
            }
          }
        });
      }
    });
  }

  /** 菜单权限 */
  async function handleMenu(row?: any) {
    const { id, scope } = row;
    if (id) {
      curRow.value = row;
      isShow.value = true;
      const { data } = await getScopeMenuIds(scope);
      treeRef.value.setCheckedKeys(data);
    } else {
      curRow.value = null;
      isShow.value = false;
    }
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  function handleSave() {
    const { scope } = curRow.value;
    // 根据用户 id 调用实际项目中菜单权限修改接口
    const permissionsId = [
      ...treeRef.value.getCheckedKeys(),
      ...treeRef.value.getHalfCheckedKeys()
    ];
    updateScopePermissions({ scope, permissionsId }).then(res => {
      if (res.code === 200) {
        message(`Scope名称为${scope}的菜单权限修改成功`, {
          type: "success"
        });
      } else {
        message(res.message || "修改Scope权限失败.", { type: "error" });
      }
    });
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.title)!.includes(query);
  };

  onMounted(async () => {
    onSearch();
    const { data } = await getMenuList();
    treeIds.value = getKeyList(data, "id");
    treeData.value = handleTree(data);
  });

  watch(isExpandAll, val => {
    val
      ? treeRef.value.setExpandedKeys(treeIds.value)
      : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
    val
      ? treeRef.value.setCheckedKeys(treeIds.value)
      : treeRef.value.setCheckedKeys([]);
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    rowStyle,
    dataList,
    treeData,
    treeProps,
    isLinkage,
    pagination,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    handleSave,
    handleDelete,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
