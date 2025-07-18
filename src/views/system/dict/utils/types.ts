interface FormItemProps {
  id?: string;
  /** 用于判断是`新增`还是`修改` */
  typeCode: string;
  itemCode: string;
  itemName: string;
  sortOrder: number;
  i18nJson: string;
  status: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
