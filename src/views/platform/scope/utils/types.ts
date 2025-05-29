// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  id: string;
  /** 角色名称 */
  name: string;
  /** 角色编码 */
  scope: string;
  /** 是否启用 */
  enabled?: boolean;
  /** 备注 */
  description: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
