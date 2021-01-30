import { Layout } from 'antd';
import classPrefix from 'prefix-classnames';
import React, { useMemo } from 'react';
import { history, useLocation } from 'umi';
import BaseHeader, { HSpace, Item, Logo, Title } from '../BaseHeader';
import SideMenuLayout from '../SideMenuLayout';
import type { SideMenuData } from '../SideMenuLayout/CollapsibleSideMenu/SideMenu/SideMenu';
import TopMenu from '../TopMenu';
// import type { TopMenuData } from '../TopMenu/TopMenu';
import './MenuLayout.less';

const { Header, Content } = Layout;

const PREFIX = 'base-layout';
const px = classPrefix(PREFIX);

type MenuData = SideMenuData;

const findPrefixSelectedIndex = (menu: MenuData[] = [], key = ''): number[] | boolean => {
  for(let i = 0; i < menu.length; i += 1) {
    const item = menu[i];
    if (key === item.key) {
      return [i];
    }
    if (Array.isArray(item.children)) {
      const res = findPrefixSelectedIndex(item.children, key);
      if (Array.isArray(res)) {
        return [i, ...res];
      }
    }
  }
  return false;
};

const handleMenuClick = (item) => {
  if (item.key) {
    history.push(item.key);
  }
};

export interface MenuLayoutProps {
  menuData: MenuData[];
  children?: React.ReactElement;
}

const MenuLayout = (props: MenuLayoutProps) => {
  const { children, menuData } = props;

  const location = useLocation();

  /* 根据路由找出当前匹配的菜单 */
  const matchedMenuIndex = useMemo(() => findPrefixSelectedIndex(menuData, location.pathname), [
    menuData,
    location.pathname,
  ]);

  /* 找出顶级菜单的key和子菜单 */
  const { key: topMenuKey, children: subMenu } = useMemo<{
    key?: string;
    children?: MenuData[];
  }>(() => {
    if (Array.isArray(matchedMenuIndex)) {
      return menuData[matchedMenuIndex[0]];
    }
    return {};
  }, [menuData, matchedMenuIndex]);

  const topMenuKeys = useMemo(() => (topMenuKey ? [topMenuKey] : []), []);

  const topMenu = useMemo(
    () => menuData.map(({ children: nouse, ...item }) => item as TopMenuData),
    [menuData],
  );

  return (
    <Layout className={`${px('root')}`}>
      {/* 顶栏 */}
      <Header className={px('header')}>
        <BaseHeader>
          <Logo />
          <Title>Whale Cloud ApiMan</Title>
          <HSpace size={50} />
          <TopMenu
            selectedKeys={topMenuKeys}
            data={topMenu}
            onClick={handleMenuClick}
            style={{ flex: 1 }}
          />
          <Item>当前工程：</Item>
          {/* <Avatar /> */}
        </BaseHeader>
      </Header>
      <Content className={px('content')}>
        {subMenu ? <SideMenuLayout {...props} menuData={subMenu} /> : children}
      </Content>
    </Layout>
  );
};

export default MenuLayout;
