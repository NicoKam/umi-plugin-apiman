import React from 'react';
import { history } from 'umi';
import { message } from 'antd';

class ProdErrorCatch extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== state.errorPage) {
      return {
        errorPage: false,
      };
    }
    return null;
  }

  static getDerivedStateFromError(error) {
    if (process.env.NODE_ENV !== 'development') {
      message.error({
        content: `非常抱歉，您当前访问的页面:${history.location.pathname}因为意外的错误崩溃了`,
        duration: 2,
        key: 'error',
      });
      history.replace('/exception/500');
      // eslint-disable-next-line no-console
      console.error(error);
      return { errorPage: history.location.pathname };
    }
    throw error;
  }

  state = {
    errorPage: false,
  };


  render() {
    const { children, location } = this.props;
    const { errorPage } = this.state;
    if (errorPage === location.pathname) {
      return null;
    }
    return children;
  }
}

export default ProdErrorCatch;
