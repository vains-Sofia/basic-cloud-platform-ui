<script setup lang="ts">
defineProps<{ settings: any }>();
</script>

<template>
  <el-card>
    <template #header>Token 设置</template>
    <el-descriptions :column="1" border :label-width="230">
      <el-descriptions-item label="授权码有效期"
        >{{ settings.authorizationCodeTimeToLive }}
        {{ settings.authorizationCodeTimeToLiveUnit }}</el-descriptions-item
      >
      <el-descriptions-item label="AccessToken 有效期"
        >{{ settings.accessTokenTimeToLive }}
        {{ settings.accessTokenTimeToLiveUnit }}</el-descriptions-item
      >
      <el-descriptions-item label="AccessToken 格式">{{
        settings.accessTokenFormat
      }}</el-descriptions-item>
      <el-descriptions-item label="设备码有效期"
        >{{ settings.deviceCodeTimeToLive }}
        {{ settings.deviceCodeTimeToLiveUnit }}</el-descriptions-item
      >
      <el-descriptions-item label="RefreshToken 有效期"
        >{{ settings.refreshTokenTimeToLive }}
        {{ settings.refreshTokenTimeToLiveUnit }}</el-descriptions-item
      >
      <el-descriptions-item label="RefreshToken 可复用">{{
        settings.reuseRefreshTokens ? "是" : "否"
      }}</el-descriptions-item>
      <el-descriptions-item label="ID Token 签名算法">{{
        settings.idTokenSignatureAlgorithm
      }}</el-descriptions-item>
      <el-descriptions-item label="绑定证书访问Token">{{
        settings.x509CertificateBoundAccessTokens ? "是" : "否"
      }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>
