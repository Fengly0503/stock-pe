import HttpClient from "./fetch";

// config define 中的 API_SERVER 可直接使用

export type LoginParamsType = {
  username: string;
  password: string;
  // mobile: string;
  // captcha: string;
};

// export async function fakeAccountLogin(params: LoginParamsType) {
//   return request('/app/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

// export async function getFakeCaptcha(mobile: string) {
//   return request(`/app/login/captcha?mobile=${mobile}`);
// }

// server 会在 proxy pathRewrite 中去除
export async function mobileLogin(data: LoginParamsType) {
  return HttpClient.request({
    url: `/server/auth/login`,
    method: "POST",
    data,
  });
}
