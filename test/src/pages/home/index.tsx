import React from 'react';
import * as dd from 'dingtalk-jsapi';
import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';

import styles from './HomePage.less';

const corpId = 'ding4fe2d0fcbaa8100b35c2f4657eb6378f';

window.dd = dd;

const agentId = '1077110314';
const nonceStr = '123456';
const timeStamp = new Date().getTime();
const jsTicket = 'ksI0Bjvb52MjqdxE3JCcyhcso6RWXOp38L2QXKn4vQiVyJNxLV5HplxbRjgpZbIgTcm9EglHFHBNJBKpXJcZmQ';

const sign = (jsTicket: string, nonceStr: string, timeStamp: number) => {
  const url = window.location.href;
  const plain = `jsapi_ticket=${jsTicket}&noncestr=${nonceStr}&timestamp=${timeStamp}&url=${url}`;
  const res = sha256(plain);
  return res.toString(CryptoJS.enc.Hex);
};

class HomePage extends React.Component {
  state = {
    platform: '',
    info: '',
  };

  componentDidMount() {
    console.log(dd.env);

    // dd.ready(() => {
    //   this.setState({ platform: JSON.stringify(dd.env) });
    //   dd.runtime.permission
    //     .requestAuthCode({
    //       corpId,
    //     })
    //     .then((info) => {
    //       console.log(info);
    //       this.setState({ info: JSON.stringify(info) });
    //     });
    //   dd.device.base.getPhoneInfo({}).then((result) => {
    //     console.log(info);
    //   });
    // });
  }

  handleClick = () => {
    window.open(
      'dingtalk://dingtalkclient/action/openapp?corpid=ding4fe2d0fcbaa8100b35c2f4657eb6378f&container_type=work_platform&app_id=0_1077110314&redirect_type=jump',
    );
  };

  handlePick = () => {
    dd.config({
      agentId, // 必填，微应用ID
      corpId, // 必填，企业ID
      timeStamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature: sign(jsTicket, nonceStr, timeStamp), // 必填，签名
      type: 0, // 选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
      jsApiList: [
        'runtime.info',
        'biz.contact.choose',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.ding.post',
        'biz.util.openLink',
        'biz.contact.complexPicker',
      ], // 必填，需要使用的jsapi列表，注意：不要带dd。
    });

    dd.ready(() => {
      dd.biz.contact.complexPicker({
        title: '标题',
        corpId,
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
