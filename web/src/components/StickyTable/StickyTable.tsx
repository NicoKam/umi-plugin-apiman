import React from 'react';
import styles from './StickyTable.less';

export type StickyTableColumn = {
  key?: string;
  dataIndex: string;
  title?: string;
  width?: React.ReactText;
  render?: (
    text: unknown,
    row: Record<string | number, unknown>,
    index: number,
  ) => React.ReactElement;
};

export interface StickyTableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns?: StickyTableColumn[];
  dataSource?: Record<string | number, unknown>[];
  rowKey?: string;
}

const StickyTable = (props: StickyTableProps) => {
  const { className = '', rowKey = 'id', columns = [], dataSource = [], ...otherProps } = props;
  return (
    <table className={`${styles.root} ${className}`} {...otherProps}>
      <thead>
        <tr>
          {columns.map(({ key, dataIndex, title, width }) => (
            <th scope="col" key={key || dataIndex} style={{ width }}>
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((item, index) => (
          <tr key={String(item[rowKey] ?? index)}>
            {columns.map(({ key, dataIndex, render = v => v as React.ReactElement }) => (
              <td key={key || dataIndex}>{render(item[dataIndex], item, index) ?? ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StickyTable;
