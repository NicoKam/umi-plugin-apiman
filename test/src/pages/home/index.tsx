import React from 'react';
import * as dd from 'dingtalk-jsapi';
import styles from './HomePage.less';

const corpId = 'ding4fe2d0fcbaa8100b35c2f4657eb6378f';

window.dd = dd;

class HomePage extends React.Component {
  state = {
    platform: '',
    info: '',
  };

  componentDidMount() {
    console.log(dd.env);
    dd.ready(() => {
      this.setState({ platform: JSON.stringify(dd.env) });
      dd.runtime.permission
        .requestAuthCode({
          corpId,
        })
        .then((info) => {
          console.log(info);
          this.setState({ info: JSON.stringify(info) });
        });
      dd.device.base.getPhoneInfo({}).then((result) => {
        console.log(info);
      });
    });
  }

  handleClick = () => {
    window.open(
      'dingtalk://dingtalkclient/action/openapp?corpid=ding4fe2d0fcbaa8100b35c2f4657eb6378f&container_type=work_platform&app_id=0_1077110314&redirect_type=jump',
    );
  };

  handlePick = () => {
    dd.ready(() => {
      dd.biz.contact.complexPicker({
        title: '标题',
        corpId: 'ding4fe2d0fcbaa8100b35c2f4657eb6378f',
        multiple: true,
        limitTips: '超出了',
        maxUsers: 1000,
        pickedUsers: [],
        pickedDepartments: [],
        disabledUsers: [],
        disabledDepartments: [],
        requiredUsers: [],
        requiredDepartments: [],
        appId: 1077110314,
        permissionType: 'GLOBAL',
        responseUserOnly: false,
        startWithDepartmentId: 0,
        onSuccess(res) {
          // 调用成功时回调
          console.log(res);
        },
        onFail(err) {
          // 调用失败时回调
          console.log(err);
        },
      });
    });
  };

  render() {
    const { info, platform } = this.state;
    return (
      <div className={styles.root}>
        This is Home
        <div>{info}</div>
        <div>{platform}</div>
        <button onClick={this.handleClick}>jump</button>
        <button onClick={this.handlePick}>pick</button>
      </div>
    );
  }
}

export default HomePage;

// dingtalk://dingtalkclient/action/openapp?corpid=ding4fe2d0fcbaa8100b35c2f4657eb6378f&container_type=work_platform&app_id=0_1077110314&redirect_type=jump&redirect_url=跳转url
