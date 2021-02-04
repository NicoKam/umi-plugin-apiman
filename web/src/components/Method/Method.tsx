import React from 'react';
import cn from 'classnames';
import type { MethodType } from '@/utils/ApiJson';
import styles from './Method.less';

export interface MethodProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: MethodType;
  size?: 'small' | 'default' | 'large';
}

const Method = (props: MethodProps) => {
  const { className = '', type = 'GET', size = 'default', ...otherProps } = props;
  return (
    <div
      className={`${styles.root} ${className} ${cn({
        [styles.get]: type === 'GET',
        [styles.post]: type === 'POST',
        [styles.put]: type === 'PUT',
        [styles.del]: type === 'DELETE',
        [styles.small]: size === 'small',
        [styles.large]: size === 'large',
      })}`}
      {...otherProps}
    >
      {type === 'DELETE' ? 'DEL' : type}
    </div>
  );
};

export default Method;
