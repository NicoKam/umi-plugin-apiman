import { Menu } from 'antd';
import type { MenuProps } from 'antd/lib/menu';
import type { SubMenuProps } from 'antd/lib/menu/SubMenu';
import classPrefix from 'prefix-classnames';
import React from 'react';
import './SideMenu.less';


const { SubMenu } = Menu;

const PREFIX = 'side-menu';
const px = classPrefix(PREFIX);

export type SideMenuData = {
  key: string;
  icon?: React.ReactElement;
  text?: React.ReactElement;
  children?: SideMenuData[];
  clickable?: boolean;
  render?: () => React.ReactElement;
};

const renderMenuList = (
  menuList: SideMenuData[] = [],
  onClick: SideMenuProps['onTitleClick'] = () => {},
) =>
  menuList.map((item, index) => {
    const { key, icon, text, children, render, clickable = false } = item;
    const isArray = Array.isArray(children);

    const renderItem = () => (typeof render === 'function' ? render() : text);

    if (isArray) {
      /* subMenu */
      return (
        <SubMenu
          key={key ?? index}
          popupClassName={px('popup')}
          icon={icon}
          title={renderItem()}
          onTitleClick={(...args) => {
            if (clickable) {
              onClick(...args);
            }
          }}
        >
          {renderMenuList(children, onClick)}
        </SubMenu>
      );
    }

    return (
      <Menu.Item icon={icon} key={key}>
        {renderItem()}
      </Menu.Item>
    );
  });

export interface SideMenuProps extends MenuProps {
  data?: SideMenuData[];
  onTitleClick?: SubMenuProps['onTitleClick'];
}

const SideMenu = (props: SideMenuProps) => {
  const { className, data, onTitleClick, ...otherProps } = props;
  return (
    <Menu
      className={`${PREFIX} ${className}`}
      theme="dark"
      defaultSelectedKeys={['1']}
      {...otherProps}
      mode="inline"
    >
      {renderMenuList(data, onTitleClick)}
    </Menu>
  );
};

SideMenu.defaultProps = {
  className: '',
  style: {},
  data: [],
};

export default SideMenu;
