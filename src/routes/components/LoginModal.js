import React from 'react';

import {Button, Icon, Input, message} from 'antd';
import {connect} from "dva/index";
import styles from "../main.css"
import cookieHelper from "../../utils/cookieHelper";

class LoginModal extends React.Component {

  constructor(Props) {
    super(Props);
    this.state = {
      regisFormVisible: false,
      username: "",
      password: "",
      repassword: "",
    }
  }

  showRegistForm() {
    this.setState({regisFormVisible: true})
  }

  showLoginForm() {
    this.setState({regisFormVisible: false})
  }

  registUser() {
    if (this.state.repassword !== this.state.password) {
      message.warning("两次密码输入不一致")
      return;
    }
    fetch(window.host + '/question/user/register', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
          if (data.code === 200) {
            message.info("注册成功！")
            this.setState({regisFormVisible: false})
          }
        }
      ).catch((e) => {

      });
    })
  }

  userLogin() {
    fetch(window.host + '/question/user/login', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
          if (data.code === 200) {
            message.info("登陆成功！");
            cookieHelper.setCookie("user", this.state.username);
            cookieHelper.setCookie("token", data.data.token);
            this.props.closeAction();
          }
        }
      ).catch((e) => {

      });
    })
  }

  render() {
    return <div className={styles.modal}>
      {!this.state.regisFormVisible && <div className={styles.modalLeft} style={{paddingTop: 130}}>
        <Input value={this.state.username}
               prefix={<Icon type="user"/>} title={"请输入用户名"}
               onChange={(e) => {
                 this.setState({username: e.target.value})
               }}/>
        <Input type={"password"} prefix={<Icon type="lock"/>} title={"请输入密码"} value={this.state.password}
               onChange={(e) => {
                 this.setState({password: e.target.value})
               }} style={{marginBottom: 40}}/>
        <Button onClick={this.userLogin.bind(this)} type={"primary"}>登陆</Button>
        <span onClick={this.showRegistForm.bind(this)} className={styles.shiftBtn}>注册</span>
      </div>}
      {this.state.regisFormVisible && <div className={styles.modalLeft} style={{paddingTop: 80}}>
        <Input prefix={<Icon type="user"/>} title={"请输入用户名"} onChange={(e) => {
          this.setState({username: e.target.value})
        }}/>
        <Input type={"password"} prefix={<Icon type="lock"/>} title={"请输入密码"} onChange={(e) => {
          this.setState({password: e.target.value})
        }}/>
        <Input type={"password"} prefix={<Icon type="lock"/>} title={"请再次输入密码"} onChange={(e) => {
          this.setState({repassword: e.target.value})
        }}/>
        <Input value={18888888888} prefix={<Icon type="mobile"/>} title={"请输入手机号"}/>
        <Input value={666888} prefix={<Icon type="code"/>} title={"请输入验证码"} style={{marginBottom: 40}}/>
        <Button onClick={this.registUser.bind(this)} type={"primary"}>注册</Button>
        <span onClick={this.showLoginForm.bind(this)} className={styles.shiftBtn}>有账号？现在登陆</span>
      </div>}
      <div className={styles.modalRight}>
        <span>—————— 使用合作方方式登录 ——————</span><br/>
        <span style={{cursor: "pointer"}}><Icon type="qq"/><Icon type="weibo"/><Icon type="wechat"/><Icon
          type="gitlab"/></span><br/>
        <span
          style={{cursor: "pointer"}}><label>QQ</label><label>微博</label><label>微信</label><label>GITLAB</label></span>
      </div>
    </div>
  }
}

function mapStateToProps(status) {
  return status
}

export default connect(mapStateToProps)(LoginModal);

