import { ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { findByPage, offline } from "@/api/authorization";

export function useAuthorization() {
  // 响应式数据
  const loading = ref(false);
  const tableRef = ref();
  const dataList = ref([]);
  const selectedNum = ref(0);

  // 搜索表单
  const searchForm = reactive({
    registeredClientId: "",
    principalName: "",
    authorizationGrantType: ""
  });

  // 分页配置
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  });

  // 表格列配置
  const columns: TableColumnList = [
    {
      label: "授权应用",
      prop: "registeredClientName",
      minWidth: 150
    },
    {
      label: "应用Logo",
      prop: "registeredClientLogo",
      width: 100,
      slot: "registeredClientLogo"
    },
    {
      label: "授权用户",
      prop: "principalName",
      minWidth: 120
    },
    {
      label: "授权模式",
      prop: "authorizationGrantType",
      width: 120,
      slot: "authorizationGrantType"
    },
    {
      label: "授权码",
      prop: "authorizationCodeValue",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "授权码状态",
      prop: "authorizationCodeInvalidated",
      width: 100,
      slot: "authorizationCodeInvalidated"
    },
    {
      label: "Access Token",
      prop: "accessTokenValue",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "状态",
      prop: "accessTokenInvalidated",
      width: 130,
      slot: "accessTokenInvalidated"
    },
    {
      label: "Refresh Token",
      prop: "refreshTokenValue",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "状态",
      prop: "refreshTokenInvalidated",
      width: 140,
      slot: "refreshTokenInvalidated"
    },
    {
      label: "操作",
      fixed: "right",
      width: 90,
      slot: "operation"
    }
  ];

  // 获取授权模式标签类型
  const getGrantTypeTagType = (grantType: string) => {
    const typeMap = {
      authorization_code: "primary",
      client_credentials: "success",
      refresh_token: "warning",
      device_code: "info"
    };
    return typeMap[grantType] || "info";
  };

  // 获取授权模式标签文本
  const getGrantTypeLabel = (grantType: string) => {
    const labelMap = {
      authorization_code: "授权码模式",
      client_credentials: "客户端凭证模式",
      refresh_token: "刷新令牌模式",
      device_code: "设备码模式"
    };
    return labelMap[grantType] || grantType;
  };

  // 获取数据
  const getData = async () => {
    loading.value = true;
    try {
      const params = {
        ...searchForm,
        current: pagination.currentPage,
        size: pagination.pageSize
      };

      const { data } = await findByPage(params);

      dataList.value = data.records.map(item => ({
        ...item,
        offlineLoading: false
      }));
      pagination.total = Number(data.total);
      pagination.pageSize = Number(data.size);
      pagination.currentPage = Number(data.current);
    } finally {
      loading.value = false;
    }
  };

  // 搜索
  const handleSearch = () => {
    getData();
  };

  // 重置搜索
  const resetSearch = () => {
    Object.keys(searchForm).forEach(key => {
      searchForm[key] = "";
    });
    getData();
  };

  // 分页-每页条数改变
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    getData();
  };

  // 分页-当前页改变
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    getData();
  };

  // 下线操作
  const handleOffline = async (row: any) => {
    try {
      await ElMessageBox.confirm(
        `确定要下线用户 "${row.principalName}" 在客户端 "${row.registeredClientName}" 的认证吗？`,
        "确认下线",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      row.offlineLoading = true;

      await offline(row.accessTokenValue);

      ElMessage.success("下线成功");
      getData(); // 重新获取数据
    } catch (error) {
      if (error !== "cancel") {
        console.error("下线失败:", error);
        ElMessage.error("下线失败");
      }
    } finally {
      row.offlineLoading = false;
    }
  };

  // 生命周期
  onMounted(() => {
    getData();
  });

  return {
    loading,
    tableRef,
    dataList,
    searchForm,
    pagination,
    columns,
    selectedNum,
    getGrantTypeTagType,
    getGrantTypeLabel,
    handleSearch,
    resetSearch,
    handleSizeChange,
    handleCurrentChange,
    handleOffline
  };
}
