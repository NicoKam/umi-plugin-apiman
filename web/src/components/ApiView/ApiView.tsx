import type { ApiProps, MethodType } from '@/def';
import React from 'react';
import styles from './ApiView.less';

export interface ApiViewProps extends React.HTMLAttributes<HTMLDivElement>, ApiProps {
  method?: MethodType;
  apiPath: string;
}

const ApiView = (props: ApiViewProps) => {
  const {
    className = '',
    method = 'GET',
    apiPath,
    serviceName,
    description,
    headers,
    params,
    requestType,
    responseType,
    response,
    errorHandler,
    ...otherProps
  } = props;
  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      <div className={styles.header}>
        <div className={styles.method}>{method}</div>
        <div className={styles.api}>{apiPath}</div>
        <div className={styles.description}>{description}</div>
      </div>
      
    </div>
  );
};

export default ApiView;
