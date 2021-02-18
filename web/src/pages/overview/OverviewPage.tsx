import ApiView from '@/components/ApiView';
import HeadersTable from '@/components/HeadersTable';
import { useStoreState } from '@/store';
import { apiToArr } from '@/utils/ApiJson';
import React, { useState } from 'react';
import styles from './OverviewPage.less';

const dataSource = [
  { key: 'cookie', value: 'sessionId=123123' },
  { key: 'content-type', value: 'application/json' },
];

const OverviewPage = () => {
  const [data, setData] = useState(dataSource);
  const [{ api }] = useStoreState('api');
  return (
    <div className={`${styles.root}`}>
      {api.api &&
        apiToArr(api.api).map((apiInfo, index) => (
          <ApiView key={index} className={styles.apiView} {...apiInfo} />
        ))}
      <HeadersTable editable dataSource={data} onDataSourceChange={setData} />
      <pre>{JSON.stringify(api, null, 2)}</pre>
    </div>
  );
};

export default OverviewPage;
