export enum BusiErrorCode {
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 0, // 成功
  PARAM_ERROR = 10000, // 请求参数错误
  NOT_FOUND = 10001, // 查找的资源不存在
  UN_AUTHORIZED = 20000, // 用户未登录
  AUTH_FORBIDDEN = 30000, // 用户没有权限
  PWD_ERROR = 40000, // 账号或者密码错误
}
