<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="startEndTimes"
          type="datetimerange"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期时间"
          end-placeholder="结束日期时间"
          :popper-options="{
            placement: 'bottom-start'
          }"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri/search-line')"
          :loading="recordTableLoading"
          @click="scanRecordTable"
        >
          搜索
        </el-button>
        <el-button
          :icon="useRenderIcon(Refresh)"
          @click="resetScanForm(formRef)"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar
      style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
      title="接口扫描记录"
      :columns="scanRecordColumns"
      @refresh="scanRecordTable"
    >
      <template #buttons>
        <el-button
          type="primary"
          :loading="scanLoading"
          :icon="Refresh"
          @click="dialogVisible = true"
        >
          开始扫描
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="recordTableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="recordTableLoading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="scanRecords"
          :columns="dynamicColumns"
          :pagination="{ ...recordPagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleRecordSizeChange"
          @page-current-change="handleRecordCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              type="primary"
              size="small"
              :icon="View"
              @click="handleRecordClick(row.id)"
            >
              详情
            </el-button>
            <el-popconfirm title="是否确认导入?" @confirm="importSelected(row)">
              <template #reference>
                <el-button type="success" size="small"> 导入权限表 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 模块选择弹框 -->
    <el-dialog v-model="dialogVisible" title="选择模块" width="500px">
      <!-- 搜索框 -->
      <el-input
        v-model="searchText"
        placeholder="搜索模块..."
        prefix-icon="Search"
        style="margin-bottom: 20px"
        clearable
      />

      <!-- 模块列表 -->
      <el-scrollbar height="300px">
        <el-checkbox-group v-model="selectedModules">
          <!-- 全部选项 -->
          <div
            style="
              display: block;
              margin-bottom: 15px;
              padding: 10px;
              border: 1px solid #e4e7ed;
              border-radius: 4px;
            "
          >
            <el-checkbox value="all">
              <div style="display: flex; align-items: center" class="ml-2">
                <div>
                  <div style="font-weight: 500">全部</div>
                  <div style="font-size: 12px; color: #909399">
                    包含所有可用模块
                  </div>
                </div>
              </div>
            </el-checkbox>
          </div>

          <!-- 具体模块选项 -->
          <div
            v-for="module in filteredModules"
            :key="module.id"
            style="
              display: block;
              margin-bottom: 10px;
              padding: 10px;
              border: 1px solid #e4e7ed;
              border-radius: 4px;
            "
          >
            <el-checkbox :value="module.itemCode">
              <div style="display: flex; align-items: center" class="ml-2">
                <div>
                  <div style="font-weight: 500">{{ module.itemCode }}</div>
                  <div style="font-size: 12px; color: #909399">
                    {{ module.itemName }}
                  </div>
                </div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </el-scrollbar>

      <!-- 空状态 -->
      <el-empty
        v-if="filteredModules.length === 0"
        description="没有找到匹配的模块"
        :image-size="80"
      />

      <!-- 底部操作按钮 -->
      <template #footer>
        <div style="text-align: right">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import View from "~icons/ep/view";
import Refresh from "~icons/ep/refresh";
import { message } from "@/utils/message";
import { PureTable } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useApiScanRecord } from "./utils/ApiScanHook";

defineOptions({
  name: "ApiScan"
});

const router = useRouter();
// 响应式数据
const dialogVisible = ref(false);
const searchText = ref("");
const selectedModules = ref([]);

// 计算属性
const filteredModules = computed(() => {
  if (!searchText.value) {
    return moduleOptions.value;
  }
  return moduleOptions.value.filter(
    module =>
      module.itemCode.toLowerCase().includes(searchText.value.toLowerCase()) ||
      module.itemName.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

// 处理扫描确认
const handleConfirm = () => {
  if (selectedModules.value.length === 0) {
    message(`请至少选择一个模块`, { type: "error" });
    return;
  }

  // 判断是否带有全部
  const modulesToScan = selectedModules.value.includes("all")
    ? []
    : selectedModules.value;

  startScan(modulesToScan);
  dialogVisible.value = false;
  selectedModules.value = [];
};

// 跳转到接口列表
const handleRecordClick = id => {
  router.push({ name: "ApiEndpoints", query: { id } }).catch().finally();
};

const formRef = ref();

// 页面加载后执行
onMounted(() => {
  nextTick(() => {
    scanRecordTable();
  });
});

const {
  startScan,
  resetScanForm,
  scanLoading,
  recordPagination,
  recordTableLoading,
  handleRecordSizeChange,
  handleRecordCurrentChange,
  moduleOptions,
  startEndTimes,
  shortcuts,
  scanRecordColumns,
  scanRecordTable,
  scanRecords,
  importSelected
} = useApiScanRecord();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
