import HttpClient from './fetch';

export type StockListQuery = {
  keywords: string;
  pageIndex: number;
  pageSize: number;
  orderBy: number;
};

export const stockList = async (data: StockListQuery) => {
  return HttpClient.request({
    url: `/server/stock/list`,
    method: 'POST',
    data,
  });
};

export const userStockList = async (data: StockListQuery) => {
  return HttpClient.request({
    url: `/server/stock/user-list`,
    method: 'POST',
    data,
  });
};

export const addChoice = async (code: string) => {
  return HttpClient.request({
    url: `/server/stock/add-choice`,
    method: 'POST',
    data: { code },
  });
};

export const deleteChoice = async (code: string) => {
  return HttpClient.request({
    url: `/server/stock/delete-choice`,
    method: 'POST',
    data: { code },
  });
};
