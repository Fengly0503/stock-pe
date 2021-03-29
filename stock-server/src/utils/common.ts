import * as dayjs from 'dayjs';

export const getOneDayTimeStamp = () => {
  const date = new Date();
  const time = date.getTime(); //当前的毫秒数
  const oneDay = 86400000; //1000 * 60 * 60 * 24; //一天的毫秒数
  return time + oneDay;
};
// 休眠函数
export const sleepPromise = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));
/**
 * 返回当前时间
 */
export const currentDateTime = () => {
  return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 返回若干年、月、日、前的日期，默认：day 格式 20210101
 */
export const getDateOfBefore = (
  n: number,
  scale: 'day' | 'month' | 'year' = 'day',
) => {
  return dayjs().subtract(n, scale).format('YYYYMMDD');
};
