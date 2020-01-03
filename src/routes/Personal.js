import React from 'react';

import {message, Tabs} from 'antd';
import styles from "./main.css"
import Header from "./components/Header";
import cookieHelper from "../utils/cookieHelper";


const {TabPane} = Tabs;

class Personal extends React.Component {

  constructor(Props) {
    super(Props);
    this.state = {
      myreply: [],
      requests: [],
      current: 1,
      total: 0
    }
  }

  componentDidMount() {
    let token = cookieHelper.getCookie("token", "");
    if (token === "") {
      cookieHelper.removeCookie("user");
      message.info("请登陆")
      return;
    }
    const _this = this;
    fetch(window.host + '/question/questions/page', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        pageQuery: {
          page: _this.state.current,
          size: 12,
          questionName: "",
          status: 0,
        }
      }),
      headers: {
        "Content-Type": "application/json",
        "token": cookieHelper.getCookie("token", "")
      },
    }).then((response) => {
      response.json().then((data) => {
          if (data.code === 200) {
            _this.setState({requests: data.data})
          }
        }
      ).catch((e) => {

      })
    })
    fetch(window.host + '/question/answers/myReplay', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "token": cookieHelper.getCookie("token", "")
      },
    }).then((response) => {
      response.json().then((data) => {
          if (data.code === 200) {
            _this.setState({myreply: data.data})
          }
        }
      ).catch((e) => {

      })
    })
  }

  render() {
    return <div className={styles.basicContainer}>
      <Header/>
      <div style={{width: 1100, margin: "0 auto"}}>
        <Tabs>
          <TabPane tab={"我的提问"} key={1}>
            <div className={styles.requestsContainer}>
              {
                this.state.requests.map(item => <div className={styles.questionBlock}>
                  <div style={{display: "inline-flex", cursor: "pointer"}}>
                    <div className={styles.headIcon}>头 像</div>
                    <div>
                      <span style={{fontSize: 32, color: "#333333"}}>JavaScript</span><span
                      style={{fontSize: 24, color: "#999999", marginLeft: 20}}>{item.publishName}</span><br/><span
                      style={{fontSize: 24, color: "#999999"}}>女 18岁 计算机专业1班</span>
                    </div>
                    <div style={{color: "#ffc600", fontSize: 30, position: "absolute", right: 380}}>悬赏金:{item.points}元
                    </div>
                  </div>
                  <div style={{height: 90, paddingTop: 20, fontSize: 30, color: "#cccccc"}}>{item.questionName}</div>
                  <div style={{fontSize: 24, color: "#999999"}}>{item.gmtCreate}</div>
                  <div style={{display: this.state.showIndex === item.id ? "" : "none", height: 100}}>
                    {item.content}
                  </div>
                </div>)
              }
            </div>
          </TabPane>
          <TabPane tab={"我的回答"} key={2}>
            <div className={styles.requestsContainer}>
              <div className={styles.requestsContainer}>
                {
                  this.state.myreply.map(item => <div className={styles.questionBlock}>
                    <div style={{height: 90, paddingTop: 20, fontSize: 30, color: "#cccccc"}}>{item.questionName}</div>
                    <div style={{
                      height: 90,
                      paddingTop: 20,
                      fontSize: 30,
                      color: "#cccccc",
                      backgroundColor: item.isRecommend === 1 ? "green" : ""
                    }} title={item.isRecommend === 1 ? "答案被评为最佳回答":""}>{item.content}</div>
                    <div style={{fontSize: 24, color: "#999999"}}>{item.gmtCreate}</div>
                    <div style={{display: this.state.showIndex === item.id ? "" : "none", height: 100}}>
                      {item.content}
                    </div>
                  </div>)
                }
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  }
}

export default Personal;
