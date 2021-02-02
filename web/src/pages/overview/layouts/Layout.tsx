import type { ApiMenuListProps } from '@/components/ApiMenuList';
import ApiMenuList from '@/components/ApiMenuList';
import ReactButton from '@/components/ReactButton';
import type { MethodType } from '@/def';
import { getApiJson } from '@/services/public';
import { useStoreState } from '@/store';
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
      return Object.keys(api).map((apiKey) => {
        const [method, apiPath] = apiKey.split('|');
        return {
          api: apiPath,
          method: method as MethodType,
        };
      });
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
