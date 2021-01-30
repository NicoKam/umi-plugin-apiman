import { Menu } from 'antd';
import type { MenuProps } from 'antd/lib/menu';
import classPrefix from 'prefix-classnames';
import React from 'react';
import './TopMenu.less';

const { SubMenu } = Menu;

const PREFIX = 'top-menu';
const px = classPrefix(PREFIX);

export type TopMenuData = {
  key: string;
  icon?: React.ReactElement;
  text?: React.ReactElement;
  children?: TopMenuData[];
  render?: () => React.ReactElement;
  [key: string]: unknown;
};

const renderMenuList = (menuList: TopMenuData[] = []) =>
  menuList.map((item) => {
    const { key, icon, text, children, render } = item;
    const isArray = Array.isArray(children);

    const renderItem = () =>
      typeof render === 'function' ? (
        render()
      ) : (
        <span>
          {icon}
          <span>{text}</span>
        </span>
      );

    if (isArray) {
      /* subMenu */
      return (
        <SubMenu key={key} popupClassName={px('popup')} title={renderItem()}>
          {renderMenuList(children)}
        </SubMenu>
      );
    }

    return <Menu.Item key={key}>{renderItem()}</Menu.Item>;
  });

export interface TopMenuProps extends MenuProps {
  data?: TopMenuData[];
}

const TopMenu = (props: TopMenuProps) => {
  const { className = '', data, ...otherProps } = props;
  return (
    <Menu
      className={`${PREFIX} ${className}`}
      theme="dark"
      defaultSelectedKeys={['1']}
      mode="horizontal"
      {...otherProps}
    >
      {renderMenuList(data)}
    </Menu>
  );
};

TopMenu.defaultProps = {
  className: '',
  data: [],
};

export default TopMenu;
