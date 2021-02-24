import React from 'react';
import styles from './Carousel.less';

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Item: React.FC<ItemProps> = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div className={`${styles.item} ${className}`} {...otherProps} />
  );
};

Item.defaultProps = {
  className: '',
};

export default Item;
