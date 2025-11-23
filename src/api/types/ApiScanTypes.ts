// 扫描状态枚举
import type { PageableRequest } from '@/api/types/ModelTypes.ts'

export enum ScanStatusEnum {
	NEW_FOUND = 1, // 新发现
	EXISTING = 2, // 已存在
	MISSING_ANNOTATION = 3, // 缺少注解
	IGNORE = 4 // 异常
}

export interface SysApiScanRecord {
	id: string;
	scanTime: string;
	totalCount: number;
	newCount: number;
	existCount: number;
	missingDescCount: number;
	scanResult?: string;
	createTime: string;
	updateTime: string;
}

export interface SysApiEndpoint {
	id: string;
	scanBatchId: number;
	path: string;
	requestMethod: string;
	moduleName?: string;
	permission?: string;
	title?: string;
	scanStatus: ScanStatusEnum;
	existingPermissionId?: number;
	imported: boolean;
	importTime?: string;
	errorMessage?: string;
	createTime: string;
	updateTime: string;
	createName: string;
	updateName: string;
}

export interface EndpointListParams extends PageableRequest {
	scanBatchId: string;
	scanStatus?: ScanStatusEnum | null;
	imported?: boolean | null;
	moduleName?: string;
	keyword?: string;
}

export interface FindApiScanRecordPageRequest extends PageableRequest {
	startTime?: string;
	endTime?: string;
}
