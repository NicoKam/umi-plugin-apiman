import React, { useEffect, useState } from 'react';
import { useControllableProps } from '@ali-whale/hooks';
import pc from 'prefix-classnames';
import { usePersistFn } from 'ahooks';
import { changeArr } from '@/utils';
import Item from './Item';
import './SimpleTabs.less';

const px = pc('simple-tabs');

export interface SimpleTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  activeKey?: number | string;
  defaultActiveKey?: number | string;
  handlerPosition?: 'top' | 'left' | 'bottom' | 'right';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  children: React.ReactElement | React.ReactElement[];
}

type Size = {
  width: number;
  height: number;
};

const SimpleTabs: React.FC<SimpleTabsProps> & { Item: typeof Item } = ({
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

  const [itemSize, setItemSize] = useState<Size[]>([]);
  const handleResize = usePersistFn((size: Size, index: number) => {
    const arr = changeArr(itemSize, index, size);
    setItemSize(arr);
  });

  const keyIsNumber = typeof activeKey === 'number';
  const activeIndex: number = keyIsNumber ? activeKey : keysMapping[activeKey] ?? 0;

  const contentSize = itemSize[activeIndex] ?? { width: 'auto', height: 'auto' };

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
      className={`${px('root', {
        handlerTop: handlerPosition === 'top',
        handlerBottom: handlerPosition === 'bottom',
        handlerLeft: handlerPosition === 'left',
        handlerRight: handlerPosition === 'right',
      })} ${className}`}
      {...otherProps}
    >
      <div className={px('content')} style={{ minHeight: contentSize.height }}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const { className = '' } = child.props || {};
            let position = 'current';
            if (index < activeIndex) position = 'before';
            if (index > activeIndex) position = 'after';
            return React.cloneElement(child, {
              className: `${className} ${px('item', position)}`,
              title: '',
              onResize: (size) => {
                handleResize(size, index);
              },
            });
          }
          return child;
        })}
      </div>
      <div className={px('handler')}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const isCurrent = activeIndex === index;
            const { title = index } = child.props || {};
            return (
              <div
                key={child.key}
                className={px('handlerItem', {
                  current: isCurrent,
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

SimpleTabs.defaultProps = {
  className: '',
  defaultActiveKey: 0,
  handlerPosition: 'right',
  autoPlay: false,
  autoPlayInterval: 5000,
};

SimpleTabs.Item = Item;

export default SimpleTabs;
