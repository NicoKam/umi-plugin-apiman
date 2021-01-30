import React from 'react';
import styles from './Editor.less';

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {}

const Editor = (props: EditorProps) => {
  const { className = '', ...otherProps } = props;
  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>

    </div>
  );
};

export default Editor;
