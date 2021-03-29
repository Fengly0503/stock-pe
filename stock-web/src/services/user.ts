import request from "@/utils/request";
import HttpClient from "./fetch";

export async function query(): Promise<any> {
  return request("/api/users");
}

export async function queryCurrent(): Promise<any> {
  // console.log('token是 1：', (window as any).userToken);
  // return request(`${API_SERVER}/server/profile`);
  return HttpClient.request({
    url: `/server/profile`,
  });
}

export async function queryNotices(): Promise<any> {
  return request("/api/notices");
}
