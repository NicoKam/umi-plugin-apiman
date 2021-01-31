import { changeArr } from '@/utils';
import React, { useMemo } from 'react';
import type { StickyTableColumn, StickyTableProps } from '../StickyTable';
import StickyTable from '../StickyTable';
import styles from './HeadersTable.less';

export interface HeadersTableProps extends StickyTableProps {
  editable?: boolean;
  dataSource?: { key: string; value: string }[];
  onDataSourceChange?: (dataSource: { key: string; value: string }[]) => void;
}

/**
 * 专门用于编辑 headers 的表格组件
 */
const HeadersTable = (props: HeadersTableProps) => {
  const {
    className = '',
    dataSource: _dataSource = [],
    onDataSourceChange = () => {},
    editable = false,
    ...otherProps
  } = props;

  const dataSource = useMemo(
    () =>
      _dataSource
        .filter(({ key, value }) => key || value)
        .concat(editable ? [{ key: '', value: '' }] : []),
    [_dataSource, editable],
  );

  const handleDataSourceChange = (dataSource) => {
    onDataSourceChange(dataSource.filter(({ key, value }) => key || value));
  };

  const columns: StickyTableColumn[] = [
    {
      dataIndex: 'key',
      title: 'key',
      width: '5%',
      render: (value, row, index) => (
        <input
          className={styles.input}
          disabled={!editable}
          value={String(value)}
          onChange={(e) => {
            handleDataSourceChange(
              changeArr(dataSource, index, { ...dataSource[index], key: e.target.value }),
            );
          }}
        />
      ),
    },
    {
      dataIndex: 'value',
      title: 'value',
      width: '15%',
      render: (value, row, index) => (
        <input
          className={styles.input}
          disabled={!editable}
          value={String(value)}
          onChange={(e) => {
            handleDataSourceChange(
              changeArr(dataSource, index, { ...dataSource[index], value: e.target.value }),
            );
          }}
        />
      ),
    },
  ];

  return (
    <StickyTable
      className={`${styles.root} ${className}`}
      columns={columns}
      dataSource={dataSource}
      {...otherProps}
    />
  );
};

export default HeadersTable;
