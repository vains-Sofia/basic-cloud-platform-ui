<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Plugins from '@/components/Layout/Plugins/Index.vue'
</script>

<template>
	<el-config-provider :locale="zhCn">
		<RouterView class="app-router" />
		<Plugins />
	</el-config-provider>
</template>

<style scoped>
.app-router {
	height: 100%;
}
</style>
