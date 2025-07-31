import { reactive, ref, watch } from "vue";
import { batchImportByBatchId, endpointScan, scanPage } from "@/api/api-scan";
import type { PaginationProps } from "@pureadmin/table";
import { dictItems } from "@/api/dict";
import { message } from "@/utils/message";

export function useApiScanRecord() {
  // 响应式数据
  const recordPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const scanFilterForm = reactive({
    size: recordPagination.pageSize,
    current: recordPagination.currentPage,
    startTime: "",
    endTime: ""
  });

  const scanRecords = ref([]);
  const moduleOptions = ref();
  const startEndTimes = ref([]);
  const scanLoading = ref(false);
  const recordTableLoading = ref(false);
  const scanStatus = ref<"idle" | "scanning" | "completed" | "error">("idle");

  // 开始扫描
  const startScan = async (applications: string[]) => {
    scanLoading.value = true;
    scanStatus.value = "scanning";

    try {
      await endpointScan(applications);
      scanStatus.value = "completed";
      // 扫描完成后刷新记录列表
      scanRecordTable();
    } catch (error) {
      scanStatus.value = "error";
      console.error("扫描失败:", error);
    } finally {
      scanLoading.value = false;
    }
  };

  /**
   * 获取扫描记录列表
   */
  const scanRecordTable = () => {
    recordTableLoading.value = true;

    scanPage(scanFilterForm)
      .then(res => {
        scanRecords.value = res.data.records;
        recordPagination.total = res.data.total;
        recordPagination.pageSize = res.data.size;
        recordPagination.currentPage = res.data.current;
      })
      .finally(() => {
        recordTableLoading.value = false;
      });
  };

  // 分页-每页条数改变
  const handleRecordSizeChange = (val: number) => {
    recordPagination.pageSize = val;
    scanFilterForm.size = val;
    scanRecordTable();
  };

  // 分页-当前页改变
  const handleRecordCurrentChange = (val: number) => {
    recordPagination.currentPage = val;
    scanFilterForm.current = val;
    scanRecordTable();
  };

  const resetScanForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    scanRecordTable();
  };

  // 加载模块列表
  dictItems("MODULE").then(res => {
    moduleOptions.value = res.data;
  });

  // 范围日期预设选项
  const shortcuts = [
    {
      text: "上周",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      }
    },
    {
      text: "上个月",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      }
    },
    {
      text: "三个月前",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      }
    }
  ];

  // 监听 startEndTimes 值的变化，然后更新 scanFilterForm
  watch(startEndTimes, newTimes => {
    if (newTimes && newTimes.length === 2) {
      scanFilterForm.startTime = newTimes[0];
      scanFilterForm.endTime = newTimes[1];
    } else {
      scanFilterForm.startTime = "";
      scanFilterForm.endTime = "";
    }
  });

  const scanRecordColumns: TableColumnList = [
    {
      label: "扫描记录id",
      prop: "id"
    },
    {
      label: "扫描时间",
      prop: "scanTime"
    },
    {
      label: "总接口数",
      prop: "totalCount"
    },
    {
      label: "新发现接口数",
      prop: "newCount"
    },
    {
      label: "已存在接口数",
      prop: "existCount"
    },
    {
      label: "缺少注释数",
      prop: "missingDescCount"
    },
    {
      label: "扫描结果摘要",
      prop: "scanResult"
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation",
      width: 210
    }
  ];

  // 导入选中行至权限表
  const importSelected = row => {
    batchImportByBatchId(row.id).then(() => {
      message("导入成功");
    });
  };

  return {
    recordPagination,
    scanFilterForm,
    scanRecords,
    moduleOptions,
    startEndTimes,
    scanLoading,
    recordTableLoading,
    scanStatus,
    startScan,
    scanRecordTable,
    handleRecordSizeChange,
    handleRecordCurrentChange,
    resetScanForm,
    shortcuts,
    scanRecordColumns,
    importSelected
  };
}
