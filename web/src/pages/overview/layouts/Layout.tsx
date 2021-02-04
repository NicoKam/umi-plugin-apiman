import type { ApiMenuListProps } from '@/components/ApiMenuList';
import ApiMenuList from '@/components/ApiMenuList';
import ReactButton from '@/components/ReactButton';
import { getApiJson } from '@/services/public';
import { useStoreState } from '@/store';
import { apiToArr } from '@/utils/ApiJson';
import { SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo } from 'react';
import { useRequest } from 'umi';
import styles from './Layout.less';

const Layout = (props) => {
  const { children } = props;
  const { data } = useRequest(getApiJson);

  const [, setApi] = useStoreState('api');

  useEffect(() => {
    if (data) {
      setApi({
        api: data,
      });
    }
  }, [data]);

  const menuList = useMemo<ApiMenuListProps['data']>(() => {
    if (data) {
      const { api } = data;
      return apiToArr(api).map(({ method, apiPath }) => ({ method, api: apiPath }));
    }
    return [];
  }, [data]);

  return (
    <div className={`${styles.root}`}>
      <div className={styles.menuBar}>
        <ReactButton className={styles.menuBarItem}>
          <UnorderedListOutlined />
        </ReactButton>
        <div style={{ flex: 1 }} />
        <ReactButton className={styles.menuBarItem}>
          <SettingOutlined />
        </ReactButton>
      </div>
      <div className={styles.menu}>
        <div className={styles.menuTitle}>Api 列表</div>
        <ApiMenuList data={menuList} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Layout;
