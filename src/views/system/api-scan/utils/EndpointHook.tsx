import { computed, reactive, type Ref, ref } from "vue";
import {
  batchIgnore,
  batchImport,
  endpointList,
  scanPage,
  ScanStatusEnum,
  type SysApiEndpoint
} from "@/api/api-scan";
import type { PaginationProps } from "@pureadmin/table";
import { message } from "@/utils/message";
import dayjs from "dayjs";
import { dictItems } from "@/api/dict";

export function useApiEndpoints(tableRef: Ref) {
  // 响应式数据
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const filterForm = reactive({
    size: pagination.pageSize,
    current: pagination.currentPage,
    scanStatus: null,
    imported: null,
    moduleName: "",
    scanBatchId: null,
    keyword: ""
  });

  const moduleOptions = ref([]);
  const selectedNum = ref(0);
  const tableLoading = ref(false);
  const tableData = ref<SysApiEndpoint[]>([]);
  const selectedRows = ref<SysApiEndpoint[]>([]);
  const currentScanBatchId = ref<number | null>(null);

  const loadData = () => {
    tableLoading.value = true;

    const params = {
      scanBatchId: filterForm.scanBatchId,
      current: pagination.currentPage,
      size: pagination.pageSize,
      scanStatus: filterForm.scanStatus,
      imported: filterForm.imported,
      moduleName: filterForm.moduleName,
      keyword: filterForm.keyword
    };

    endpointList(params)
      .then(res => {
        tableData.value = res.data.records;
        pagination.total = res.data.total;
        pagination.pageSize = res.data.size;
        pagination.currentPage = res.data.current;
      })
      .finally(() => {
        tableLoading.value = false;
      });
  };

  /**
   * 获取扫描记录列表（用于远程选择组件）
   */
  const scanRecordPage = async ({ keyword, current, size }) => {
    return scanPage({ current, size, keyword });
  };

  const exportReport = async () => {
    if (!currentScanBatchId.value) {
      message(`请先选择扫描批次`, {
        type: "error"
      });
      return;
    }

    /*try {
      await interfaceScanStore.exportReport(currentScanBatchId.value);
      ElMessage.success("导出成功");
    } catch (error) {
      ElMessage.error("导出失败：" + error);
    }*/
  };

  const importBatch = () => {
    const newEndpoints = selectedRows.value.filter(
      row => row.scanStatus === ScanStatusEnum.NEW_FOUND && !row.imported
    );

    if (newEndpoints.length === 0) {
      message(`请选择需要导入的新接口`, {
        type: "error"
      });
      return;
    }

    batchImport(newEndpoints.map(item => item.id)).then(() => {
      message(`成功导入 ${newEndpoints.length} 个接口`, {
        type: "success"
      });
      loadData(); // 刷新数据
    });
  };

  const ignoreBatch = () => {
    const ignoreList = selectedRows.value.filter(
      row => row.scanStatus !== ScanStatusEnum.IGNORE && !row.imported
    );
    if (ignoreList.length === 0) {
      message(`请选择需要忽略的接口`, {
        type: "error"
      });
      return;
    }

    const ignoreCount = ignoreList.length;
    batchIgnore(ignoreList.map(item => item.id)).then(() => {
      message(`成功忽略 ${ignoreCount} 个接口`, {
        type: "success"
      });
      // 取消选择
      onSelectionCancel();
      loadData(); // 刷新数据
    });
  };

  // 忽略选中的行
  const ignoreSelected = row => {
    if (row.scanStatus === ScanStatusEnum.IGNORE) {
      message(`接口 ${row.requestMethod} - ${row.path} 已被忽略`, {
        type: "error"
      });
      return;
    }

    batchIgnore([row.id]).then(() => {
      message(`成功忽略 1 个接口`, {
        type: "success"
      });
      loadData(); // 刷新数据
    });
  };

  // 计算属性
  const hasSelectedNewEndpoints = computed(() => {
    return selectedRows.value.some(
      row => row.scanStatus === ScanStatusEnum.NEW_FOUND && !row.imported
    );
  });

  const hasSelectedNonIgnoreEndpoints = computed(() => {
    return selectedRows.value.some(
      row => row.scanStatus !== ScanStatusEnum.IGNORE && !row.imported
    );
  });

  const selectedNewCount = computed(() => {
    return selectedRows.value.filter(
      row => row.scanStatus === ScanStatusEnum.NEW_FOUND && !row.imported
    ).length;
  });

  const selectedNonIgnoreCount = computed(() => {
    return selectedRows.value.filter(
      row => row.scanStatus !== ScanStatusEnum.IGNORE && !row.imported
    ).length;
  });

  const importedCount = computed(() => {
    return tableData.value.filter(item => item.imported).length;
  });

  // 分页-每页条数改变
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    filterForm.size = val;
    loadData();
  };

  // 分页-当前页改变
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    filterForm.current = val;
    loadData();
  };

  // 工具方法
  const getMethodTagType = (method: string) => {
    const typeMap: Record<string, string> = {
      GET: "success",
      POST: "primary",
      PUT: "warning",
      DELETE: "danger",
      PATCH: "info"
    };
    return typeMap[method] || "info";
  };

  const getScanStatusTagType = (status: ScanStatusEnum) => {
    const typeMap: Record<number, string> = {
      [ScanStatusEnum.NEW_FOUND]: "success",
      [ScanStatusEnum.EXISTING]: "primary",
      [ScanStatusEnum.MISSING_ANNOTATION]: "warning",
      [ScanStatusEnum.IGNORE]: "info"
    };
    return typeMap[status] || "info";
  };

  const getScanStatusLabel = (status: ScanStatusEnum) => {
    const labelMap: Record<number, string> = {
      [ScanStatusEnum.NEW_FOUND]: "新发现",
      [ScanStatusEnum.EXISTING]: "已存在",
      [ScanStatusEnum.MISSING_ANNOTATION]: "缺少注释",
      [ScanStatusEnum.IGNORE]: "已忽略"
    };
    return labelMap[status] || "未知";
  };

  const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
  };

  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "请求路径",
      prop: "path",
      align: "left"
    },
    {
      label: "请求方式",
      prop: "requestMethod",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getMethodTagType(row.requestMethod)}
          effect="plain"
        >
          {row.requestMethod}
        </el-tag>
      )
    },
    {
      label: "权限码",
      align: "left",
      prop: "permission",
      cellRenderer: ({ row }) =>
        row.permission ? (
          <span class="permission-code">{row.permission}</span>
        ) : (
          <span class="text-gray-400">-</span>
        )
    },
    {
      label: "所属模块",
      prop: "moduleName",
      cellRenderer: ({ row }) =>
        row.moduleName ? (
          <span>
            {(
              moduleOptions.value.find(
                item => item.itemCode === row.moduleName
              ) || {}
            ).itemName || row.moduleName}
          </span>
        ) : (
          <span class="text-gray-400">-</span>
        )
    },
    {
      label: "接口描述",
      prop: "title",
      align: "left",
      cellRenderer: ({ row }) =>
        row.title ? (
          <span>{row.title}</span>
        ) : (
          <span class="text-gray-400">暂无描述</span>
        )
    },
    {
      label: "扫描状态",
      prop: "scanStatus",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getScanStatusTagType(row.scanStatus)}
          effect="plain"
        >
          {getScanStatusLabel(row.scanStatus)}
        </el-tag>
      )
    },
    {
      label: "导入状态",
      prop: "imported",
      width: 100,
      cellRenderer: ({ row }) => (
        <>
          <el-tag type={row.imported ? "success" : "info"} size="small">
            {row.imported ? "已导入" : "未导入"}
          </el-tag>
          {row.imported && row.importTime && (
            <div class="import-time">{formatDateTime(row.importTime)}</div>
          )}
        </>
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 260,
      align: "left",
      slot: "operation"
    }
  ];

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val: SysApiEndpoint[]) {
    selectedRows.value = val;
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    loadData();
  };

  // 加载模块列表
  dictItems("MODULE").then(res => {
    moduleOptions.value = res.data;
  });

  return {
    columns,
    loadData,
    resetForm,
    tableData,
    pagination,
    hasSelectedNewEndpoints,
    hasSelectedNonIgnoreEndpoints,
    selectedNewCount,
    selectedNonIgnoreCount,
    importedCount,
    selectedRows,
    importBatch,
    ignoreBatch,
    selectedNum,
    tableLoading,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    onSelectionCancel,
    filterForm,
    moduleOptions,
    scanRecordPage,
    exportReport,
    formatDateTime,
    ignoreSelected
  };
}
