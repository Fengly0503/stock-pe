import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, getConnection, getManager } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { StockDto, StockQueryDto, PageListModel } from './dto/stock.dto';
import { Stock } from '../../entities/Stock';
import { UserStock } from '../../entities/UserStock';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stStockRepository: Repository<Stock>,
  ) {}
  /**
   * 股票列表 QueryBuilder方式查询
   * leftjoin 文档缺失，使用QueryBuilder分两次查询
   * @param param
   * @returns
   */
  async getStockList(
    uid: number,
    param: StockQueryDto,
  ): Promise<PageListModel<StockDto>> {
    const pageIndex = param.pageIndex ? param.pageIndex : 1;
    const pageSize = param.pageSize ? param.pageSize : 10;
    const orderBy = param.orderBy ? param.orderBy : 0;
    let orderByMap: any = {
      'st.code': 'DESC',
    };
    switch (orderBy) {
      case 1:
        orderByMap = {
          'st.peTtmRate': 'ASC',
        };
        break;
      case 2:
        orderByMap = {
          'st.peTtmRate': 'DESC',
        };
        break;
      default:
        break;
    }
    let keyWordsWhere = 'st.is_delete = 0';
    if (param.keywords) {
      keyWordsWhere += ' and (st.code like :code or st.name like :name)';
    }
    const { totalNum } = await getRepository(Stock)
      .createQueryBuilder('st')
      .select('COUNT(1)', 'totalNum')
      .where(keyWordsWhere, {
        code: '%' + param.keywords + '%',
        name: '%' + param.keywords + '%',
      })
      .getRawOne();

    const stockList = await getRepository(Stock)
      .createQueryBuilder('st')
      .select([
        'st.id',
        'st.code',
        'st.name',
        'st.pe',
        'st.peTtm',
        'st.peTtmAvg',
        'st.peTtmMid',
        'st.peTtmRate',
        'st.updateDt',
      ])
      .where(keyWordsWhere, {
        code: '%' + param.keywords + '%',
        name: '%' + param.keywords + '%',
      })
      .orderBy(orderByMap)
      .skip((pageIndex - 1) * pageSize)
      .take(pageSize)
      .getMany();
    // 转换类型，否则需要Stock上添加 us属性
    const stocks = plainToClass(StockDto, stockList);
    for (let i = 0; i < stocks.length; i++) {
      // 查询关系表是否存在
      const us = await getConnection()
        .createQueryBuilder()
        .select(['us.uid'])
        .from(UserStock, 'us')
        .where('us.uid = :uid and us.code = :code ', {
          uid,
          code: stocks[i].code,
        })
        .getOne();
      if (us) {
        stocks[i].us = us;
      } else {
        stocks[i].us = null;
      }
    }

    return {
      list: stocks,
      totalNum,
      pageIndex,
      pageSize,
    };
  }

  /**
   * 添加自选
   * @param uid
   * @param code
   * @returns
   */
  async addUserStock(uid: number, code: string): Promise<boolean> {
    let result = false;
    // 判断关系是否已存在
    const userStock = await getConnection()
      .createQueryBuilder()
      .select(['ut.id'])
      .from(UserStock, 'ut')
      .where('ut.uid = :uid and ut.code = :code ', {
        uid,
        code,
      })
      .getOne();
    if (!userStock) {
      const ut = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserStock)
        .values([{ uid, code }])
        .execute();
      if (ut) {
        result = true;
      }
    }
    return result;
  }

  /**
   * 自选列表 原生sql语句的方式执行
   * @param uid
   * @param param
   * @returns
   */
  async getUserStocts(
    uid: number,
    param: StockQueryDto,
  ): Promise<PageListModel<UserStock>> {
    const pageIndex = param.pageIndex ? param.pageIndex : 1;
    const pageSize = param.pageSize ? param.pageSize : 10;
    const orderBy = param.orderBy ? param.orderBy : 0;
    let orderByStr = `order by s.code desc `;
    switch (orderBy) {
      case 1:
        orderByStr = `order by s.pe_ttm_rate asc `;
        break;
      case 2:
        orderByStr = `order by s.pe_ttm_rate desc `;
        break;
      default:
        break;
    }
    let keyWordsWhere = `ut.uid=${uid} and s.is_delete=0`;
    if (param.keywords) {
      keyWordsWhere += ` and (s.code like '%${param.keywords}%'  or s.name like '%${param.keywords}%') `;
    }
    const limit = ` limit ${pageSize} offset ${(pageIndex - 1) * pageSize}`;
    const manager = getManager();
    const total = await manager.query(
      `select count(1) as totalNum
       from user_stock ut inner join stock s on ut.code=s.code where ${keyWordsWhere}`,
    );
    const stockList = await manager.query(
      `select ut.uid,ut.code,s.name,
       s.pe_ttm as peTtm,
       s.pe_ttm_avg as peTtmAvg,
       s.pe_ttm_mid as peTtmMid,
       s.pe_ttm_rate as peTtmRate,
       s.update_dt as updateDt
       from user_stock ut inner join stock s on ut.code=s.code where ${keyWordsWhere} ${orderByStr} ${limit}`,
    );

    return {
      list: stockList,
      totalNum: total.length > 0 ? Number(total[0].totalNum) : 0,
      pageIndex,
      pageSize,
    };
  }
  /**
   * 删除自选
   * @param uid
   * @param code
   * @returns
   */
  async deleteUserStock(uid: number, code: string): Promise<boolean> {
    let result = false;
    const res = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserStock)
      .where('uid = :uid', { uid })
      .andWhere('code = :code', { code })
      .execute();
    if (res.affected > 0) {
      result = true;
    }
    return result;
  }
}
