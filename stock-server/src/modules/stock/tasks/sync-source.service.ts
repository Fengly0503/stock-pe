import { Injectable, Logger, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Stock } from '../../../entities/Stock';
import { Cron } from '@nestjs/schedule';
import { getDateOfBefore } from '../../../utils/common';

@Injectable()
export class TasksService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron('30 * * * * *')
  async taskDemo() {
    console.log('每分钟第30秒执行一次');
  }

  /**
   * 获取第三方pe数据略
   */

  /**
   * 计算PE_TTM_AVG
   */
  @Cron('0 30 7 * * *')
  async culculatePeTtmAvg() {
    this.logger.debug('每天凌晨7点30分--计算PE_TTM_AVG');
    const manager = getManager();
    const dateOfFiveYearAgo = getDateOfBefore(5, 'year');
    await manager.query(`update stock st set st.pe_ttm_avg=(select IFNULL(ROUND(avg(pe_ttm),4),0)
     as pe_av from stock_log sl where sl.code=st.code and
    sl.log_date>${dateOfFiveYearAgo} and sl.pe_ttm>0) where st.id>0 and st.is_delete=0`);
  }

  /**
   * 计算最新PE_TTM
   */
  @Cron('0 40 7 * * *')
  async culculatePeTtm() {
    this.logger.debug('每天凌晨7点40分--计算最新PE_TTM');
    const manager = getManager();
    await manager.query(`update stock st set st.pe_ttm=(select IFNULL(sl.pe_ttm,0) as pe_ttm from stock_log sl
     where sl.code=st.code order by sl.log_date desc limit 1)
    where st.id>0 and st.code in (select code from stock_log group by code) and st.is_delete=0`);
  }

  /**
   * 计算最新PE_TTM_RATE
   */
  @Cron('0 50 7 * * *')
  async culculatePeTtmRate() {
    this.logger.debug('每天凌晨7点50分--计算最新PE_TTM_RATE');
    const manager = getManager();
    await manager.query(
      `update stock set pe_ttm_rate= IFNULL(ROUND(pe_ttm/pe_ttm_avg,4),0) where id>0 and pe_ttm_avg>0`,
    );
  }
}
