<script setup lang="ts">
defineProps<{ settings: any }>();
</script>

<template>
  <el-card>
    <template #header>客户端设置</template>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="需要PKCE">{{
        settings.requireProofKey ? "是" : "否"
      }}</el-descriptions-item>
      <el-descriptions-item label="需要授权确认">{{
        settings.requireAuthorizationConsent ? "是" : "否"
      }}</el-descriptions-item>
      <el-descriptions-item label="JWKS地址">{{
        settings.jwkSetUrl
      }}</el-descriptions-item>
      <el-descriptions-item label="签名算法">{{
        settings.tokenEndpointAuthenticationSigningAlgorithm
      }}</el-descriptions-item>
      <el-descriptions-item label="TLS证书主题">{{
        settings.x509CertificateSubjectDN
      }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>
