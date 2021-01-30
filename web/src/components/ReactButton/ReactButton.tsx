import React from 'react';
import styles from './ReactButton.less';

export interface ReactButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const ReactButton = (props: ReactButtonProps) => {
  const { className = '', ...otherProps } = props;
  return (
    <div className={`${styles.root} ${className}`} {...otherProps} />
  );
};

export default ReactButton;
