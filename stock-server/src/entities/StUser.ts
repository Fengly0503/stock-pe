import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStock } from './UserStock';

@Index('uk_mobile', ['mobile'], { unique: true })
@Entity('st_user', { schema: 'stock_demo' })
export class StUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '主键id' })
  id: number;

  @Column('varchar', {
    name: 'mobile',
    unique: true,
    comment: '手机号',
    length: 20,
  })
  mobile: string;

  @Column('varchar', { name: 'name', comment: '昵称', length: 20 })
  name: string;

  @Column('tinyint', {
    name: 'role',
    comment: '角色：100 超级管理员，0 普通用户',
    width: 1,
    default: () => "'0'",
  })
  role: boolean;

  @Column('varchar', { name: 'password', comment: '密码', length: 100 })
  password: string;

  @Column('varchar', { name: 'salt', comment: '密码盐', length: 100 })
  salt: string;

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

  @OneToMany(() => UserStock, (userStock) => userStock.u)
  userStocks: UserStock[];
}
