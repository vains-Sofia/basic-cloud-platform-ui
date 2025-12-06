<template>
	<div class="bg-[var(--el-bg-color)]" style="padding: -20px">
		<BpmnDesigner v-model="xml" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BpmnDesigner from '@/components/BpmnDesigner'

const xml = ref()

</script>
