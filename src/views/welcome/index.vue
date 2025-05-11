<script setup lang="ts">
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
  name: "Welcome"
});
console.log(usePermissionStoreHook().wholeMenus);
</script>

<template>
  <h1>Pure-Admin-Thin（国际化版本）</h1>
</template>
