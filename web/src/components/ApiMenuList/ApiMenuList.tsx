import type { MethodType } from '@/def';
import React from 'react';
import Method from '../Method';
import ReactButton from '../ReactButton';
import styles from './ApiMenuList.less';

export interface ApiMenuListProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: {
    method: MethodType;
    api: string;
  }[];
}

const ApiMenuList = (props: ApiMenuListProps) => {
  const { className = '', data = [], ...otherProps } = props;
  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      {data.map(({ method, api }) => (
        <ReactButton key={`${method}_${api}`} className={styles.item}>
          <Method className={styles.method} type={method} size="small" />
          <div className={styles.api}>{api}</div>
        </ReactButton>
      ))}
    </div>
  );
};

export default ApiMenuList;
