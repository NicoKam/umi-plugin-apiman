import React from 'react';
import cn from 'classnames';
import type { ParamVariableType } from '@/utils/ApiJson';
import styles from './VarType.less';

export interface MethodProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ParamVariableType;
  size?: 'small' | 'default' | 'large';
}

const VarType = (props: MethodProps) => {
  const { className = '', type = 'string', size = 'default', children, ...otherProps } = props;
  return (
    <div
      className={`${styles.root} ${className} ${cn({
        [styles.string]: type === 'string',
        [styles.number]: type === 'number',
        [styles.boolean]: type === 'boolean',
        [styles.object]: type === 'object',
        [styles.small]: size === 'small',
        [styles.large]: size === 'large',
      })}`}
      {...otherProps}
    >
      {children ?? type}
    </div>
  );
};

export default VarType;
