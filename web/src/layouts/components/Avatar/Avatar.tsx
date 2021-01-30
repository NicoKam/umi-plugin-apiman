import { Dropdown, Menu } from 'antd';
import React from 'react';
import styles from './Avatar.less';
import people from './user.svg';

const menu = (
  <Menu theme="dark">
    <Menu.Item>退出登录</Menu.Item>
  </Menu>
);

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Avatar = (props: AvatarProps) => {
  const { className = '', ...otherProps } = props;
  return (
    <Dropdown overlay={menu}>
      <div className={`${styles.root} ${className}`} {...otherProps}>
        <img alt="people" src={people} />
      </div>
    </Dropdown>
  );
};

export default Avatar;
