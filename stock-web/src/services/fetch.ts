import axios from 'axios';
import { message } from 'antd';
import { getAuthToken } from '@/utils/authority';

class HttpClient {
  static historyPush = () => {};

  static setBefore(hook: any) {
    axios.interceptors.request.use(
      (config: any) => {
        if (typeof hook === 'function') {
          hook();
        }
        return config;
      },
      (error: any) => Promise.reject(error),
    );
  }

  static setAfter(hook: any) {
    axios.interceptors.response.use(
      (response: any) => {
        if (typeof hook === 'function') {
          hook();
        }
        return response;
      },
      (error: any) => {
        if (typeof hook === 'function') {
          hook();
        }
        return Promise.reject(error);
      },
    );
  }

  static async request(opt: any) {
    const token = getAuthToken();
    const defaultOption = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const option = { ...opt, ...defaultOption, url: `${opt.url}` };
    return axios(option)
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        if (!error.response) {
          message.error(`没有响应：${error.message}`);
        }
        const { status } = error.response;
        if (status === 401) {
          message.error('请登陆');
        }
        if (status === 403) {
          message.error(`${status}: 没有权限访问,请联系管理员`);
        }
        if (status <= 504 && status >= 500) {
          message.error(`${status}: 服务器内部错误`);
        }
        if (status >= 404 && status < 422) {
          message.error(`${status}: 未找到资源`);
        }
        if (error.response.data && error.response.data.msg) {
          message.error(error.response.data.msg);
        }
        return error.response;
      });
  }
}

export default HttpClient;
