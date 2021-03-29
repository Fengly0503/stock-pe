import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStock } from './UserStock';

@Index('uk_stock_code', ['code'], { unique: true })
@Entity('stock', { schema: 'stock_demo' })
export class Stock {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键id' })
  id: number;

  @Column('varchar', {
    name: 'code',
    unique: true,
    comment: '股票代码',
    length: 10,
  })
  code: string;

  @Column('varchar', { name: 'name', comment: '股票名称', length: 30 })
  name: string;

  @Column('varchar', { name: 'market', comment: '股票市场', length: 10 })
  market: string;

  @Column('decimal', {
    name: 'price',
    comment: '当前股价',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  price: string;

  @Column('decimal', {
    name: 'pe',
    comment: '当前PE（市盈率）',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  pe: string;

  @Column('decimal', {
    name: 'pe_avg',
    comment: '平均PE（市盈率）',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  peAvg: string;

  @Column('decimal', {
    name: 'pe_ttm',
    comment: '当前PE TTM（市盈率）',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  peTtm: string;

  @Column('decimal', {
    name: 'pe_ttm_avg',
    comment: '平均PE TTM（市盈率）',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  peTtmAvg: string;

  @Column('decimal', {
    name: 'pe_ttm_rate',
    comment: '最新pet_tm与平均值的比例',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  peTtmRate: string;

  @Column('decimal', {
    name: 'pe_ttm_mid',
    comment: 'pe_ttm中位数',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  peTtmMid: string;

  @Column('decimal', {
    name: 'total_mv',
    comment: '总市值',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  totalMv: string;

  @Column('json', { name: 'source_data', nullable: true, comment: '数据源' })
  sourceData: object | null;

  @Column('datetime', {
    name: 'create_dt',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDt: Date;

  @Column('timestamp', {
    name: 'update_dt',
    nullable: true,
    comment: '修改时间',
  })
  updateDt: Date | null;

  @Column('tinyint', {
    name: 'is_delete',
    comment: '是否删除',
    width: 1,
    default: () => "'0'",
  })
  isDelete: boolean;

  @OneToMany(() => UserStock, (userStock) => userStock.code2)
  userStocks: UserStock[];
}
