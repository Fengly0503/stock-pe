import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('user-role') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}
/**
 * 获取用户登录的token
 */
export const getAuthToken = () => {
  // console.log(typeof localStorage.getItem('user-token'));
  return localStorage ? localStorage.getItem('user-token') : '';
};

export function setAuthority(response: any): void {
  if (response.code === 0) {
    // const proAuthority = typeof response.data.roles === 'string' ? [response.data.roles] : response.data.roles;
    localStorage.setItem('user-role', JSON.stringify(response.data.roles));
    localStorage.setItem('user-token', response.data.accessToken);
    // auto reload
    reloadAuthorized();
  }
}
