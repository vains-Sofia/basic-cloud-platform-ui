import { http } from '@/utils/request.ts'
import type { Result } from '@/api/types/ModelTypes.ts'
import type { FindSysDictItemResponse } from '@/api/types/DictTypes.ts'
/**
 * 根据字典类型获取字典项
 */
export const dictItems = (typeCode: string) => {
	return http.request<Result<FindSysDictItemResponse[]>>(
		"get",
		`/system/dict/item/type/${typeCode}`
	);
};
