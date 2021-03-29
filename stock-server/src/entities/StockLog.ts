import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uk_code_log_date', ['code', 'logDate'], { unique: true })
@Index('idx_code', ['code'], {})
@Entity('stock_log', { schema: 'stock_demo' })
export class StockLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键id' })
  id: number;

  @Column('varchar', { name: 'code', comment: '股票代码', length: 10 })
  code: string;

  @Column('date', { name: 'log_date', comment: '日期' })
  logDate: string;

  @Column('decimal', {
    name: 'pe',
    comment: '当前PE（市盈率）',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  pe: string;

  @Column('decimal', {
    name: 'pe_ttm',
    comment: '当前PE TTM（市盈率）',
    precision: 12,
    scale: 4,
    default: () => "'0.0000'",
  })
  peTtm: string;

  @Column('decimal', {
    name: 'total_mv',
    comment: '总市值',
    precision: 16,
    scale: 4,
    default: () => "'0.0000'",
  })
  totalMv: string;

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
}
