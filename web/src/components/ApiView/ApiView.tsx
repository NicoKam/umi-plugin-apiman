import type { ApiProps, MethodType, ParamSchema } from '@/utils/ApiJson';
import cn from 'classnames';
import React, { useMemo } from 'react';
import { Empty } from 'antd';
import SimpleTabs from '../SimpleTabs';
import JsonTable from '../JsonTable';
import Method from '../Method';
import styles from './ApiView.less';
import HeadersTable from '../HeadersTable';

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

  const noBody = method === 'GET' || method === 'DELETE';

  const hasHeader = useMemo(() => headers != null && Object.keys(headers).length > 0, [headers]);

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
        <SimpleTabs handlerPosition="top" defaultActiveKey="params">
          <SimpleTabs.Item key="headers" title="Headers">
            {hasHeader ? (
              <HeadersTable dataSource={headers} />
            ) : (
              <Empty description="未添加额外的headers" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </SimpleTabs.Item>
          <SimpleTabs.Item key="params" title={noBody ? 'Query Params' : 'Request Body'}>
            <JsonTable dataSource={params} />
          </SimpleTabs.Item>
          <SimpleTabs.Item key="response" title="Response">
            <JsonTable dataSource={responseJsonData} />
          </SimpleTabs.Item>
        </SimpleTabs>
      </div>
    </div>
  );
};

export default ApiView;
