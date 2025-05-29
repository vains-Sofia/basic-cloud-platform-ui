import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "Scope名称为必填项", trigger: "blur" }],
  scope: [{ required: true, message: "Scope编码为必填项", trigger: "blur" }]
});
