import type { ParamSchema } from '@/def';
import { changeArr } from '@/utils';
import React, { useMemo } from 'react';
import type { StickyTableColumn, StickyTableProps } from '../StickyTable';
import StickyTable from '../StickyTable';
import styles from './JsonTable.less';

type TreeData<S extends string> = Record<string, unknown> &
  {
    [P in S]: TreeData<S>[];
  };

function flattenTree<S extends string, T extends TreeData<S> = TreeData<S>>(
  tree: T[],
  callback: (item: T) => T[] | undefined,
): T[] {
  const res: T[] = [];
  tree.forEach((item) => {
    res.push(item);
    const children = callback(item);
    if (children) {
      res.push(...children);
    }
  });
  return res;
}

export interface JsonTableTableProps extends Omit<StickyTableProps, 'dataSource'> {
  editable?: boolean;
  dataSource?: ParamSchema;
  expandedKeys?: string[];
  onDataSourceChange?: (dataSource: ParamSchema) => void;
}

/**
 * 专门用于编辑 headers 的表格组件
 */
const JsonTable = (props: JsonTableTableProps) => {
  const {
    className = '',
    dataSource: _dataSource = [],
    onDataSourceChange = () => {},
    editable = false,
    ...otherProps
  } = props;

  // TODO
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
      width: '10%',
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
      dataIndex: 'type',
      title: 'type',
      width: '10%',
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

export default JsonTable;
