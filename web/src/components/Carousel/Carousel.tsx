import React, { useEffect } from 'react';
import { useControllableProps } from '@ali-whale/hooks';
import cn from 'classnames';
import Item from './Item';
import styles from './Carousel.less';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  activeKey?: number | string;
  defaultActiveKey?: number | string;
  handlerPosition?: 'top' | 'left' | 'bottom' | 'right';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  children: React.ReactElement | React.ReactElement[];
}

const Carousel: React.FC<CarouselProps> & { Item: typeof Item } = ({
  defaultActiveKey,
  ...props
}) => {
  const [
    { className, children, activeKey, handlerPosition, autoPlay, autoPlayInterval, ...otherProps },
    changeProps,
  ] = useControllableProps(props, {
    activeKey: defaultActiveKey,
  });
  const keysArray = React.Children.map(children || [], child => child.key);
  const keysMapping = keysArray.reduce(
    (obj, key, index) => ({
      ...obj,
      [key]: index,
    }),
    {},
  );

  const keyIsNumber = typeof activeKey === 'number';
  const activeIndex = keyIsNumber ? activeKey : keysMapping[activeKey] ?? 0;

  useEffect(() => {
    let timer;
    if (autoPlay) {
      timer = setTimeout(() => {
        const nextIndex = (activeIndex + 1) % keysArray.length;
        changeProps({ activeKey: keyIsNumber ? nextIndex : keysMapping[nextIndex] });
      }, autoPlayInterval);
    }
    return () => {
      if (timer != null) {
        clearTimeout(timer);
      }
    };
  }, [activeIndex, autoPlay, autoPlayInterval]);

  return (
    <div
      className={cn(styles.root, className, {
        [styles.handlerTop]: handlerPosition === 'top',
        [styles.handlerBottom]: handlerPosition === 'bottom',
        [styles.handlerLeft]: handlerPosition === 'left',
        [styles.handlerRight]: handlerPosition === 'right',
      })}
      {...otherProps}
    >
      <div className={styles.content}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const { className = '' } = child.props || {};
            let position = 'current';
            if (index < activeIndex) position = 'before';
            if (index > activeIndex) position = 'after';
            return React.cloneElement(child, {
              className: `${className} ${styles[position]}`,
              title: '',
            });
          }
          return child;
        })}
      </div>
      <div className={styles.handler}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const isCurrent = activeIndex === index;
            const { title = index } = child.props || {};
            return (
              <div
                key={child.key}
                className={cn(styles.handlerItem, {
                  [styles.current]: isCurrent,
                })}
                onClick={() => {
                  changeProps({ activeKey: keyIsNumber ? index : child.key! });
                }}
              >
                {title}
              </div>
            );
          }
          return child;
        })}
      </div>
    </div>
  );
};

Carousel.defaultProps = {
  className: '',
  defaultActiveKey: 0,
  handlerPosition: 'right',
  autoPlay: false,
  autoPlayInterval: 5000,
};

Carousel.Item = Item;

export default Carousel;
