import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StUser } from './StUser';
import { Stock } from './Stock';

@Index('uk_uid_code', ['uid', 'code'], { unique: true })
@Index('code', ['code'], {})
@Entity('user_stock', { schema: 'stock_demo' })
export class UserStock {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键id' })
  id: number;

  @Column('int', { name: 'uid', comment: '用户id', default: () => "'0'" })
  uid: number;

  @Column('varchar', { name: 'code', comment: '股票代码', length: 10 })
  code: string;

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

  @ManyToOne(() => StUser, (stUser) => stUser.userStocks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'uid', referencedColumnName: 'id' }])
  u: StUser;

  @ManyToOne(() => Stock, (stock) => stock.userStocks, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'code', referencedColumnName: 'code' }])
  code2: Stock;
}
