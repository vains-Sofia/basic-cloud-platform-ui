import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  typeCode: [{ required: true, message: "字典类型必选", trigger: "blur" }],
  itemKey: [{ required: true, message: "字典键不能为空", trigger: "blur" }],
  itemValue: [{ required: true, message: "字典值不能为空", trigger: "blur" }]
});
