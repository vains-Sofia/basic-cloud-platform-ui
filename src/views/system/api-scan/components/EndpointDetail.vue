<template>
	<el-descriptions :column="1" border>
		<el-descriptions-item label-class-name="non-background" label="ID">{{
				data.id
			}}</el-descriptions-item>
		<el-descriptions-item
			label-class-name="non-background"
			label="扫描批次ID"
		>{{ data.scanBatchId }}</el-descriptions-item
		>
		<el-descriptions-item label-class-name="non-background" label="请求路径">{{
				data.path
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="请求方式">{{
				data.requestMethod
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="所属模块">{{
				data.moduleName
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="权限码">{{
				data.permission
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="接口描述">{{
				data.title || "-"
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="扫描状态">{{
				scanStatusText(data.scanStatus)
			}}</el-descriptions-item>
		<el-descriptions-item
			label-class-name="non-background"
			label="已存在接口ID"
		>{{ data.existingPermissionId ?? "-" }}</el-descriptions-item
		>
		<el-descriptions-item label-class-name="non-background" label="是否已导入">
			<el-tag :type="data.imported ? 'success' : 'info'" size="small">
				{{ data.imported ? "已导入" : "未导入" }}
			</el-tag>
		</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="导入时间">{{
				formatDateTime(data.importTime)
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="创建人">{{
				data.createName
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="修改人">{{
				data.updateName
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="创建时间">{{
				formatDateTime(data.createTime)
			}}</el-descriptions-item>
		<el-descriptions-item label-class-name="non-background" label="修改时间">{{
				formatDateTime(data.updateTime)
			}}</el-descriptions-item>
	</el-descriptions>
</template>

<script setup lang="ts">
import type { SysApiEndpoint } from "@/api/types/ApiScanTypes";

// 父组件通过 data 传入数据
defineProps<{
	data: SysApiEndpoint;
}>();

// 状态码转文字
const scanStatusText = (status: number): string => {
	switch (status) {
		case 1:
			return "新发现";
		case 2:
			return "已存在";
		case 3:
			return "缺少注解";
		case 4:
			return "忽略";
		default:
			return "-";
	}
};

// 时间格式化
const formatDateTime = (val: string | undefined): string =>
	val ? val : "-";
</script>

<style scoped>
:deep(.non-background) {
	background: transparent !important;
}
</style>
