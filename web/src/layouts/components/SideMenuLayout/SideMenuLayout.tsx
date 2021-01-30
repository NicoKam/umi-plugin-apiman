import { Layout } from 'antd';
import type { LayoutProps } from 'antd/lib/layout';
import classPrefix from 'prefix-classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CollapsibleSideMenu from './CollapsibleSideMenu';
import type { CollapsibleSideMenuProps } from './CollapsibleSideMenu/CollapsibleSideMenu';
import './SideMenuLayout.less';

const PREFIX = 'side-menu-layout';
const px = classPrefix(PREFIX);

const { Content } = Layout;

export interface SideMenuLayoutProps extends LayoutProps {
  menuData: CollapsibleSideMenuProps['menuData'];
}

const SideMenuLayout = (props: SideMenuLayoutProps) => {
  const { children, menuData = [] } = props;
  const history = useHistory();

  const { location } = history;

  return (
    <Layout className={px('root')}>
      {/* 侧边栏 */}
      <CollapsibleSideMenu
        selectedKeys={[location.pathname]}
        menuData={menuData}
        onMenuClick={(item) => {
          if (item.key) {
            history.push(item.key);
          }
        }}
      />
      <Content className={px('content')}>{children}</Content>
    </Layout>
  );
};

export default SideMenuLayout;
