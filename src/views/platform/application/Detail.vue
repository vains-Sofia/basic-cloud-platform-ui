<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import ClientSettings from "./components/ClientSettings.vue";
import TokenSettings from "./components/TokenSettings.vue";
import { findById } from "@/api/application";

const route = useRoute();
const detail = ref<any>(null);
const loading = ref(true);

const fetchDetail = async () => {
  try {
    const res = await findById(route.query.id);
    detail.value = res.data;
  } catch (err) {
    ElMessage.error("获取详情失败");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDetail);
</script>

<template>
  <div class="p-4">
    <el-skeleton :loading="loading" animated rows="10" />

    <template v-if="!loading && detail">
      <!-- 顶部Logo与标题 -->
      <el-card class="mb-4">
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
        >
          <el-image
            :src="detail.clientLogo"
            style="width: 64px; height: 64px"
            fit="cover"
          />
          <div>
            <h2 class="text-xl font-bold">{{ detail.clientName }}</h2>
            <p class="text-sm text-gray-500">{{ detail.clientId }}</p>
          </div>
        </div>
      </el-card>

      <!-- 基础信息 -->
      <el-card class="mb-4">
        <template #header>基本信息</template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="客户端ID签发时间">{{
            detail.clientIdIssuedAt
          }}</el-descriptions-item>
          <el-descriptions-item label="客户端密钥过期时间">{{
            detail.clientSecretExpiresAt
          }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{
            detail.createName
          }}</el-descriptions-item>
          <el-descriptions-item label="修改人">{{
            detail.updateName
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            detail.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="修改时间">{{
            detail.updateTime
          }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 授权信息 -->
      <el-card class="mb-4">
        <template #header>授权信息</template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="认证方式">{{
            detail.clientAuthenticationMethods?.join(", ")
          }}</el-descriptions-item>
          <el-descriptions-item label="授权类型">{{
            detail.authorizationGrantTypes?.join(", ")
          }}</el-descriptions-item>
          <el-descriptions-item label="回调地址">{{
            detail.redirectUris?.join(", ")
          }}</el-descriptions-item>
          <el-descriptions-item label="登出后跳转地址">{{
            detail.postLogoutRedirectUris?.join(", ")
          }}</el-descriptions-item>
          <el-descriptions-item label="权限范围">{{
            detail.scopes?.join(", ")
          }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 客户端设置 -->
      <client-settings :settings="detail.clientSettings" class="mb-4" />

      <!-- Token 设置 -->
      <token-settings :settings="detail.tokenSettings" />
    </template>
  </div>
</template>

<style scoped>
.text-gray-500 {
  color: #6b7280;
}
</style>
