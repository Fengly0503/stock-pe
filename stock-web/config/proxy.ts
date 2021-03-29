/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  // 开发环境
  dev: {
    "/server/": {
      target: "http://localhost:3000",
      changeOrigin: true,
      pathRewrite: { "^/server": "" }, // 作用是在代理路径中将属性路径去除
    },
  },
  // 测试环境
  test: {
    "/server/": {
      target: "http://localhost:3000",
      changeOrigin: true,
      pathRewrite: { "^/server": "" },
    },
  },
  // 预发环境
  pre: {
    "/server/": {
      target: "http://localhost:3000",
      changeOrigin: true,
      pathRewrite: { "^/server": "" },
    },
  },
};
