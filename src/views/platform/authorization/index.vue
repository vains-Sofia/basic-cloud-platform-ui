<template>
  <div class="main">
    <el-form
      :model="searchForm"
      inline
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="客户端名称：">
        <el-input
          v-model="searchForm.registeredClientId"
          placeholder="请输入客户端名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <!--          <el-form-item label="认证用户名：">-->
      <!--            <el-input-->
      <!--              v-model="searchForm.principalName"-->
      <!--              placeholder="请输入认证用户名"-->
      <!--              clearable-->
      <!--              style="width: 200px"-->
      <!--            />-->
      <!--          </el-form-item>-->
      <el-form-item label="授权模式：">
        <el-select
          v-model="searchForm.authorizationGrantType"
          placeholder="请选择授权模式"
          clearable
          style="width: 200px"
        >
          <el-option label="授权码模式" value="authorization_code" />
          <el-option label="客户端凭证模式" value="client_credentials" />
          <el-option label="设备码模式" value="device_code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          <i class="ri-search-line" />
          搜索
        </el-button>
        <el-button @click="resetSearch">
          <i class="ri-refresh-line" />
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
      title="认证管理"
      :columns="columns"
      @refresh="handleSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #registeredClientLogo="{ row }">
            <el-avatar
              v-if="row.registeredClientLogo"
              :src="row.registeredClientLogo"
              :size="65"
              shape="square"
            >
              <i class="ri-apps-line" />
            </el-avatar>
            <el-avatar v-else :size="65" shape="square">
              <i class="ri-apps-line" />
            </el-avatar>
          </template>

          <template #authorizationGrantType="{ row }">
            <el-tag
              :type="getGrantTypeTagType(row.authorizationGrantType)"
              size="small"
            >
              {{ getGrantTypeLabel(row.authorizationGrantType) }}
            </el-tag>
          </template>

          <template #authorizationCodeInvalidated="{ row }">
            <el-tag
              :type="row.authorizationCodeInvalidated ? 'danger' : 'success'"
              size="small"
            >
              {{ row.authorizationCodeInvalidated ? "无效" : "有效" }}
            </el-tag>
          </template>

          <template #accessTokenInvalidated="{ row }">
            <el-tag
              :type="row.accessTokenInvalidated ? 'danger' : 'success'"
              size="small"
            >
              {{ row.accessTokenInvalidated ? "无效" : "有效" }}
            </el-tag>
          </template>

          <template #refreshTokenInvalidated="{ row }">
            <el-tag
              :type="row.refreshTokenInvalidated ? 'danger' : 'success'"
              size="small"
            >
              {{ row.refreshTokenInvalidated ? "无效" : "有效" }}
            </el-tag>
          </template>

          <template #operation="{ row }">
            <el-button
              type="danger"
              size="small"
              :loading="row.offlineLoading"
              @click="handleOffline(row)"
            >
              <i class="ri-logout-circle-r-line" />
              下线
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTable } from "@pureadmin/table";
import { useAuthorization } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({
  name: "Authorization"
});

const {
  loading,
  tableRef,
  dataList,
  searchForm,
  pagination,
  columns,
  getGrantTypeTagType,
  getGrantTypeLabel,
  handleSearch,
  resetSearch,
  handleSizeChange,
  handleCurrentChange,
  handleOffline
} = useAuthorization();
</script>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
  margin: 0;
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
