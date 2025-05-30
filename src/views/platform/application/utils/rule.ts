import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  clientName: [
    { required: true, message: "客户端名称不能为空", trigger: "blur" }
  ],
  clientAuthenticationMethods: [
    {
      type: "array",
      required: true,
      message: "请选择认证方式",
      trigger: "change"
    }
  ],
  authorizationGrantTypes: [
    {
      type: "array",
      required: true,
      message: "请选择授权类型",
      trigger: "change"
    }
  ]
});
