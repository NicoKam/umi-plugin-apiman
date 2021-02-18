import type { ApiProps, MethodType, ParamSchema } from '@/utils/ApiJson';
import React, { useMemo } from 'react';
import cn from 'classnames';
import Method from '../Method';
import styles from './ApiView.less';
import JsonTable from '../JsonTable';

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

  const responseJsonData = useMemo(
    () => (response ? { response } : ({} as Record<string, ParamSchema>)),
    [response],
  );

  return (
    <div
      className={cn(`${styles.root} ${className}`, {
        [styles.get]: method === 'GET',
        [styles.post]: method === 'POST',
        [styles.put]: method === 'PUT',
        [styles.del]: method === 'DELETE',
      })}
      {...otherProps}
    >
      <div className={styles.header}>
        <div className={styles.method}>
          <Method type={method} size="large" />
        </div>
        <div className={styles.api}>{apiPath}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.request}>
        <JsonTable dataSource={params} />
      </div>
      <div className={styles.response}>
        <JsonTable dataSource={responseJsonData} />
      </div>
    </div>
  );
};

export default ApiView;
