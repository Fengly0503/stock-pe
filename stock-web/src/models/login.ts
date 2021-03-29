import { stringify } from 'querystring';
import type { Reducer, Effect } from 'umi';
import { history } from 'umi';

import { mobileLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

// export type StateType = {
//   status?: 'ok' | 'error';
//   type?: string;
//   currentAuthority?: 'user' | 'guest' | 'admin';
// };

export type StateType = {
  code?: number;
  data?: any;
  // currentAuthority?: 'user' | 'guest' | 'admin';
};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    setLoginError: Reducer<StateType>;
  };
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    code: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(mobileLogin, payload);
      if (response && response.code === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            // 加上 /stock-web 的长度
            redirect = redirect.substr(urlParams.origin.length + 10);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        // console.log('url是：', redirect);
        history.replace(redirect || '/');
      } else {
        yield put({
          type: 'setLoginError',
          payload: response.code,
        });
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      // 清除localstorage
      localStorage.setItem('user-role', '');
      localStorage.setItem('user-token', '');
      if (window.location.pathname !== '/login' && !redirect) {
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload);
      return {
        ...state,
        code: payload.code,
        type: payload.type,
      };
    },
    setLoginError(state, { payload }) {
      return {
        ...state,
        code: payload,
      };
    },
  },
};

export default Model;
