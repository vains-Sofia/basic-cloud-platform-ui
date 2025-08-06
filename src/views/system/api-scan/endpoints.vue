<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="filterForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="关键字：" prop="keyword">
        <el-input
          v-model="filterForm.keyword"
          placeholder="搜索路径、权限码或描述"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="模块筛选：" prop="moduleName">
        <el-select
          v-model="filterForm.moduleName"
          placeholder="模块筛选"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="module in moduleOptions"
            :key="module.id"
            :label="module.itemName"
            :value="module.itemCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="扫描状态：" prop="scanStatus">
        <el-select
          v-model="filterForm.scanStatus"
          placeholder="扫描状态"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="status in scanStatusSelect"
            :key="status.label"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="导入状态：" prop="imported">
        <el-select
          v-model="filterForm.imported"
          placeholder="导入状态"
          clearable
          style="width: 150px"
        >
          <el-option :key="0" label="已导入" :value="true" />
          <el-option :key="1" label="未导入" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="导入批次：" prop="scanBatchId">
        <RemoteSelectV2
          v-model="filterForm.scanBatchId"
          label-key="scanTime"
          clearable
          style="width: 240px"
          :disabled="route.query.id !== null && route.query.id !== ''"
          :fetch-function="scanRecordPage"
          :label-formatter="
            item =>
              `${formatDateTime(item.scanTime)} - 总数: ${item.totalCount}`
          "
          placeholder="选择导入批次"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri/search-line')"
          :loading="tableLoading"
          @click="loadData"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar
      style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
      title="接口列表"
      :columns="columns"
      @refresh="loadData"
    >
      <template v-slot="{ size, dynamicColumns }">
        <div
          v-if="selectedNum > 0"
          v-motion-fade
          class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 pr-3 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ selectedNum }} 项
            </span>
            <el-button type="primary" text @click="onSelectionCancel">
              取消选择
            </el-button>
          </div>
          <el-popconfirm title="是否确认导入?" @confirm="importBatch">
            <template #reference>
              <el-button type="success" :disabled="!hasSelectedNewEndpoints">
                批量导入 ({{ selectedNewCount }})
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="是否确认忽略?" @confirm="ignoreBatch">
            <template #reference>
              <el-button
                type="warning"
                :disabled="!hasSelectedNonIgnoreEndpoints"
              >
                批量忽略 ({{ selectedNonIgnoreCount }})
              </el-button>
            </template>
          </el-popconfirm>
        </div>
        <pure-table
          ref="tableRef"
          row-key="id"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="tableLoading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="tableData"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              type="primary"
              size="small"
              :icon="View"
              @click="openDetailDialog(row)"
            >
              详情
            </el-button>
            <el-button
              v-if="row.scanStatus === 1 && !row.imported"
              type="success"
              size="small"
              :icon="Plus"
            >
              导入
            </el-button>
            <el-button
              v-if="row.scanStatus !== 4 && !row.imported"
              type="danger"
              size="small"
              :icon="Warning"
              @click="ignoreSelected(row)"
            >
              忽略
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import Plus from "~icons/ep/plus";
import View from "~icons/ep/view";
import Refresh from "~icons/ep/refresh";
import Warning from "~icons/ep/warning";
import { PureTable } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { nextTick, onMounted, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { scanStatusSelect } from "@/views/platform/application/utils/enums";
import RemoteSelectV2 from "@/components/RemoteSelectV2/Index.vue";
import dayjs from "dayjs";
import { useRoute } from "vue-router";
import { useApiEndpoints } from "@/views/system/api-scan/utils/EndpointHook";

const route = useRoute();

defineOptions({
  name: "ApiEndpoints"
});

const formRef = ref();
const tableRef = ref();

const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm");
};

// 页面加载后执行
onMounted(() => {
  nextTick(() => {
    filterForm.scanBatchId = route.query.id;
    loadData();
  });
});

const {
  columns,
  resetForm,
  hasSelectedNewEndpoints,
  hasSelectedNonIgnoreEndpoints,
  selectedNewCount,
  selectedNonIgnoreCount,
  importBatch,
  ignoreBatch,
  tableData,
  pagination,
  selectedNum,
  tableLoading,
  loadData,
  scanRecordPage,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  onSelectionCancel,
  filterForm,
  moduleOptions,
  ignoreSelected,
  openDetailDialog
} = useApiEndpoints(tableRef);
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
