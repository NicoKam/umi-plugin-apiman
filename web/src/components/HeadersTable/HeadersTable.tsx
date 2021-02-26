import { changeArr } from '@/utils';
import React, { useMemo } from 'react';
import EditableTextInput from '../EditableTextInput';
import type { StickyTableColumn, StickyTableProps } from '../StickyTable';
import StickyTable from '../StickyTable';
import styles from './HeadersTable.less';

export interface HeadersTableProps extends Omit<StickyTableProps, 'dataSource'> {
  editable?: boolean;
  dataSource?: Record<string, string>;
  onDataSourceChange?: (dataSource: Record<string, string>) => void;
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
      Object.entries(_dataSource)
        .map(([key, value]) => ({ key, value }))
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
      style: { width: '25%' },
      render: (value, row, index) => (
        <EditableTextInput
          className={styles.input}
          editable={editable}
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
      style: { width: '75%' },
      render: (value, row, index) => (
        <EditableTextInput
          className={styles.input}
          editable={editable}
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
