import { Exclude } from 'class-transformer';

// 股票列表类型
export class StockDto {
  readonly code: string;
  readonly name: string;
  readonly market: string;
  readonly price: string;
  readonly peTtm: string;
  readonly peTtmAvg: string;
  readonly peTtmRate: string;
  readonly peTtmMid: string;
  @Exclude()
  readonly sourceData: object | null;

  us: any;
}

// 列表查询参数类型
export class StockQueryDto {
  readonly pageSize: number;
  readonly pageIndex: number;
  readonly keywords: string;
  readonly orderBy: number;
}

export class UserStockDto {
  readonly code: string;
}

// 分页数据类型
export class PageListModel<T> {
  totalNum: number; // 总数
  pageSize: number; // 页数量
  pageIndex: number; // 当前页码
  list: T[];
}
