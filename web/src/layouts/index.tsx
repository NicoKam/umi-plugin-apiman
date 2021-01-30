import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import menuData from './menuData';
import MenuLayout from './components/MenuLayout';
import ProdErrorCatch from './ProdErrorCatch';

/**
 * /layouts/index 会默认作为所有页面的容器
 */
export default props => (
  // antd配置
  <ConfigProvider locale={zhCN}>
    {/* 运行时错误拦截 */}
    <ProdErrorCatch {...props}>
      {/* 全局多级菜单布局 */}
      <MenuLayout menuData={menuData} {...props} />
    </ProdErrorCatch>
  </ConfigProvider>
);
