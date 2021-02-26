import { toggleArr } from '@/utils';
import type { ParamSchema, ParamVariableType } from '@/utils/ApiJson';
import { useControllableProps } from '@ali-whale/hooks';
import { CaretRightOutlined } from '@ant-design/icons';
import cn from 'classnames';
import React, { useMemo } from 'react';
import EditableTextInput from '../EditableTextInput';
import type { StickyTableColumn, StickyTableProps } from '../StickyTable';
import StickyTable from '../StickyTable';
import VarType from '../VarType';
import styles from './JsonTable.less';

type JsonType = {
  key: string;
  name: string;
  type: ParamVariableType;
  description?: string;
  required?: boolean;
  array?: boolean;
  expanded?: boolean;
  level?: number;
};

/**
 * 递归将 dataSource 拍平
 * @param data dataSource
 * @param expandedKeys 展开的key
 * @param level 递归层级
 * @param parentKey 前缀
 */
function flattenDataSource(
  data: Record<string, ParamSchema>,
  expandedKeys: Record<string, boolean>,
  level: number = 0,
  parentKey: string = '@',
) {
  const res: JsonType[] = [];
  Object.entries(data).forEach(([paramName, item]) => {
    const key = `${parentKey}.${paramName}`;
    const expanded = expandedKeys[key];
    const paramInfo = {
      key,
      name: paramName,
      type: item.type,
      required: item.required,
      description: item.description,
      array: item.array,
      expanded,
      level,
    };
    res.push(paramInfo);
    if ('properties' in item && expanded) {
      const subResult = flattenDataSource(item.properties, expandedKeys, level + 1, key);
      if (Array.isArray(subResult)) {
        res.push(...subResult);
      }
    }
  });
  return res;
}

export interface JsonTableTableProps extends Omit<StickyTableProps, 'dataSource'> {
  editable?: boolean;
  defaultExpandedAll?: boolean;
  dataSource?: Record<string, ParamSchema>;
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  indentWidth?: number;
  onDataSourceChange?: (dataSource: ParamSchema) => void;
}

const eArr = [];

// function getExpandableKeys (dataSource:Record<string, ParamSchema>):string[]{

// }

/**
 * 专门用于编辑 headers 的表格组件
 */
const JsonTable = ({ defaultExpandedKeys, defaultExpandedAll, ...props }: JsonTableTableProps) => {
  const [
    {
      className = '',
      dataSource: _dataSource = {},
      // onDataSourceChange = () => {},
      expandedKeys,
      editable = false,
      indentWidth = 22,
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    expandedKeys: defaultExpandedAll ? [] : (defaultExpandedKeys || eArr),
  });

  // TODO
  const dataSource = useMemo(
    () =>
      flattenDataSource(
        _dataSource,
        expandedKeys.reduce(
          (state, nextKey) => ({
            ...state,
            [nextKey]: true,
          }),
          {},
        ),
      ),
    [_dataSource, expandedKeys],
  );

  // const handleDataSourceChange = (dataSource) => {
  // onDataSourceChange(dataSource.filter(({ key, value }) => key || value));
  // };

  const columns: StickyTableColumn[] = [
    {
      dataIndex: 'name',
      title: '字段名',
      style: { width: '200px' },
      render: (value, row, index) => {
        const { type, expanded, level = 0, key } = row as JsonType;
        const isObj = type === 'object';
        return (
          <div className={cn(styles.cell, styles.keyColumn, { [styles.required]: row.required })}>
            <div className={styles.indent} style={{ width: level * indentWidth }} />
            <div
              className={cn(styles.indent, { [styles.arrow]: isObj, [styles.rotate]: expanded })}
              onClick={() => {
                changeProps({ expandedKeys: toggleArr(expandedKeys, key) });
              }}
              style={{ width: indentWidth }}
            >
              {isObj ? <CaretRightOutlined /> : <div className={styles.point} />}
            </div>

            <EditableTextInput className={styles.input} editable={editable} value={String(value)} />
          </div>
        );
      },
    },
    {
      dataIndex: 'type',
      title: '类型',
      style: { width: '0px' },
      render: (value, row, index) => {
        const { array } = row as JsonType;
        return editable ? (
          <input
            className={`${styles.input} ${styles.typeColumn}`}
            disabled={!editable}
            value={String(value)}
          />
        ) : (
          <VarType className={styles.typeColumn} type={value as ParamVariableType}>
            {value + (array ? '[]' : '')}
          </VarType>
        );
      },
    },
    {
      dataIndex: 'description',
      title: '描述',
      style: { width: '100%' },
      render: (value = '', row, index) => (
        <EditableTextInput className={styles.input} editable={editable} value={String(value)} />
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
