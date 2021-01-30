import { MenuOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Layout } from 'antd';
import type { SiderProps } from 'antd/lib/layout';
import { eq } from 'lodash-es';
import classPrefix from 'prefix-classnames';
import React, { useEffect, useMemo, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import './CollapsibleSideMenu.less';
import SideMenu from './SideMenu';
import type { SideMenuProps } from './SideMenu/SideMenu';

const PREFIX = 'collapsible-sider-menu';
const px = classPrefix(PREFIX);
const { Sider } = Layout;

const getSiderWidth = (width: number) => (width > 1600 ? 250 : 208);

export interface CollapsibleSideMenuProps extends SiderProps {
  selectedKeys?: string[];
  menuData: SideMenuProps['data'];
  onMenuClick: SideMenuProps['onClick'];
}

const CollapsibleSideMenu = (props: CollapsibleSideMenuProps) => {
  const { className = '', selectedKeys = [], onMenuClick = () => {}, menuData = [] } = props;
  const { width = 1920 } = useSize(() => document.getElementById('root'));

  const siderWidth = useMemo(() => getSiderWidth(width), [width]);

  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(menuData.map(item => item.key));

  /* 菜单收起时的openKeys */
  const [openKeysC, setOpenKeysC] = useState<string[]>([]);

  useEffect(() => {
    const ok = menuData.map(item => item.key);
    if (!eq(ok, openKeys)) {
      setOpenKeys(ok);
    }
  }, [menuData]);

  return (
    <Sider
      className={`${px('root')} ${className}`}
      width={siderWidth}
      collapsed={collapsed}
      collapsedWidth={50}
    >
      <div
        className={px('collapse-button', { collapsed })}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        <MenuOutlined />
      </div>
      <PerfectScrollbar className={px('side-menu')}>
        <SideMenu
          openKeys={collapsed ? openKeysC : openKeys}
          selectedKeys={selectedKeys}
          data={menuData}
          onClick={onMenuClick}
          onOpenChange={(o) => {
            const keys = o.map(k => `${k}`);
            if (collapsed) {
              setOpenKeysC(keys);
            } else {
              setOpenKeys(keys);
            }
          }}
        />
      </PerfectScrollbar>
    </Sider>
  );
};

export default CollapsibleSideMenu;
