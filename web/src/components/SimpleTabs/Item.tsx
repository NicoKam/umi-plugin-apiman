import { useSize } from 'ahooks';
import React, { useEffect, useRef } from 'react';
import styles from './SimpleTabs.less';

const ef = () => {};

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onResize?: (size: { width: number; height: number }) => void;
}

const Item: React.FC<ItemProps> = (props) => {
  const { className, onResize = ef, ...otherProps } = props;
  const ref = useRef(null);
  const size = useSize(() => ref.current);

  useEffect(() => {
    if (size.width != null && size.height != null) {
      onResize({
        width: size.width,
        height: size.height,
      });
    }
  }, [size.width, size.height]);

  return <div ref={ref} className={`${styles.item} ${className}`} {...otherProps} />;
};

Item.defaultProps = {
  className: '',
};

export default Item;
