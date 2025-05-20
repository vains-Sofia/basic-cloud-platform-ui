export type ResultArray = {
  success: boolean;
  message: string;
  code: number;
  data?: Array<any>;
};

export type Result<T> = {
  success: boolean;
  message: string;
  code: number;
  data?: T;
};

export type ResultTable = {
  success: boolean;
  code: number;
  data?: {
    /** 列表数据 */
    records: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    size?: number;
    /** 当前页数 */
    current?: number;
  };
};
