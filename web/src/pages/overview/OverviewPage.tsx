import HeadersTable from '@/components/HeadersTable';
import React, { useState } from 'react';
import styles from './OverviewPage.less';

const dataSource = [
  { key: 'cookie', value: 'sessionId=123123' },
  { key: 'content-type', value: 'application/json' },
];

const OverviewPage = () => {
  const [data, setData] = useState(dataSource);
  return (
    <div className={`${styles.root}`}>
      <HeadersTable dataSource={data} onDataSourceChange={setData} />
    </div>
  );
};

export default OverviewPage;
