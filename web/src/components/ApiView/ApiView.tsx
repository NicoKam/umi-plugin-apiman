import type { ApiProps, MethodType } from '@/utils/ApiJson';
import React from 'react';
import Method from '../Method';
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
        <div className={styles.method}>
          <Method type={method} size="large" />
        </div>
        <div className={styles.api}>{apiPath}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.request} />
      <div className={styles.response} />
    </div>
  );
};

export default ApiView;
