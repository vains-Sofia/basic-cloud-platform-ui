<script setup lang="ts">
import RouteTabs from './RouteTabs/Index.vue'
import { useLayoutStore } from '@/stores/Layout'
import { Logo, MainContent, Navbar, Sidebar } from '@/components/Layout'

const LayoutStore = useLayoutStore()
</script>

<template>
	<el-container>
		<el-aside
			:width="`${LayoutStore.menuWidth}px`"
			style="transition: var(--el-transition-all); z-index: 999"
		>
			<Logo />
			<Sidebar />
		</el-aside>
		<el-container>
			<el-header style="padding: 0">
				<Navbar />
			</el-header>
			<RouteTabs />
			<MainContent />
		</el-container>
	</el-container>
</template>

<style scoped></style>
