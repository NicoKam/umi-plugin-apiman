import { defineConfig } from 'umi';
import theme from './theme';

export default defineConfig({
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  theme,
  chainWebpack(memo) {
    memo.module
      .rule('less')
      .oneOf('css-modules')
      .use('css-loader')
      .options({
        modules: {
          localIdentName: '[name]__[local]__[hash:base64:5]',
        },
      });
  },
  plugins: ['D:/project/plugins/umi-plugin-dev-ui/lib'],
  proxy: {
    '/api': {
      target: 'http://server-ip:8080/',
      changeOrigin: true,
      // 'pathRewrite': { '^/api' : '' },
    },
  },
});
