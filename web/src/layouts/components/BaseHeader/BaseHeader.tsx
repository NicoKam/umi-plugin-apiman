import classPrefix from 'prefix-classnames';
import React from 'react';
import './BaseHeader.less';
import logo from './logo.png';

const PREFIX = 'cbd-header';
const px = classPrefix(PREFIX);


export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
}

export const Logo = (props: LogoProps) => {
  const { className = '', src = logo, ...otherProps } = props;
  return (
    <div className={`${px('logo')} ${className}`} {...otherProps}>
      <img alt="logo" src={src} />
    </div>
  );
};

export const Title = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className = '', ...otherProps } = props;
  return <div className={`${px('title')} ${className}`} {...otherProps} />;
};

export interface HSpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const HSpace = (props: HSpaceProps) => {
  const { size = 0, ...otherProps } = props;
  return <div style={{ width: size }} {...otherProps} />;
};

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: boolean;
  hPadding?: number;
}

export const Item = (props: ItemProps) => {
  const { className = '', text = false, hPadding = 12, style = {}, ...otherProps } = props;
  return (
    <div
      className={`${px('item', { 'text-link': text })} ${className}`}
      style={{
        paddingLeft: hPadding,
        paddingRight: hPadding,
        ...style,
      }}
      {...otherProps}
    />
  );
};

export const BaseHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className = '', ...otherProps } = props;
  return <div className={`${PREFIX} ${className}`} {...otherProps} />;
};

export default BaseHeader;
