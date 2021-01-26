import React from 'react';
import * as dd from 'dingtalk-jsapi';
import styles from './HomePage.less';

const corpId = 'ding4fe2d0fcbaa8100b35c2f4657eb6378f';

class HomePage extends React.Component {
  state = {
    info: '',
  };

  componentDidMount() {
    dd.ready(() => {
      dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: (info) => {
          this.setState({ info });
        },
      });
    });
  }

  render() {
    const { info } = this.state;
    return (
      <div className={styles.root}>
        This is Home
        {info}
      </div>
    );
  }
}

export default HomePage;
