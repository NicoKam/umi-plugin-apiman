import { defineConfig } from 'umi';
import theme from './theme';

export default defineConfig({
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  theme,
  proxy: {
    '/api': {
      target: 'http://server-ip:8080/',
      changeOrigin: true,
      // 'pathRewrite': { '^/api' : '' },
    },
  },
});
