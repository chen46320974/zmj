import React from 'react';

import {Button, Input, message, Modal} from 'antd';
import styles from "./main.css"
import Header from "./components/Header";
import cookieHelper from "../utils/cookieHelper";


const {TextArea} = Input;

class IndexPage extends React.Component {

  constructor(Props) {
    super(Props);
    this.state = {
      requests: [],
      current: 1,
      total: 0,
      showIndex: -1,
      answer: "",
      answersToQuestion: [],
      recommendAnswer: null
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
  }

  addQuestionAnswer() {
    if (this.state.answer && this.state.answer !== "") {
      const _this = this;
      fetch(window.host + '/question/answers/add', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          "content": this.state.answer,
          "questionId": this.state.showIndex
        }),
        headers: {
          "Content-Type": "application/json",
          "token": cookieHelper.getCookie("token", "")
        },
      }).then((response) => {
        response.json().then((data) => {
            if (data.code === 200) {
              fetch(window.host + '/question/answers/page', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                  "questionId": _this.state.showIndex,
                  "size": 5,
                  "page": 1
                }),
                headers: {
                  "Content-Type": "application/json",
                  "token": cookieHelper.getCookie("token", "")
                },
              }).then((response) => {
                response.json().then((data) => {
                    if (data.code === 200) {
                      let recomoadedAnswer = data.data.filter(item => item.isRecommend === 1);
                      if (recomoadedAnswer.length) {
                        _this.setState({
                          showIndex: _this.state.showIndex,
                          answer: "",
                          answersToQuestion: data.data,
                          recommendAnswer: recomoadedAnswer[0]
                        })
                      } else {
                        _this.setState({
                          showIndex: _this.state.showIndex,
                          answer: "",
                          answersToQuestion: data.data,
                          recommendAnswer: null
                        })
                      }
                    }
                  }
                ).catch((e) => {

                })
              })
            }
          }
        ).catch((e) => {

        })
      })
    } else {
      message.info("回复内容不能为空");
      return;
    }
  }

  showQuestionResultAndAnswer = (id) => {
    const _this = this;
    fetch(window.host + '/question/answers/all', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        "questionId": id,
        "size": 5,
        "page": 1
      }),
      headers: {
        "Content-Type": "application/json",
        "token": cookieHelper.getCookie("token", "")
      },
    }).then((response) => {
      response.json().then((data) => {
          if (data.code === 200) {
            let recomoadedAnswer = data.data.filter(item => item.isRecommend === 1);
            if (recomoadedAnswer.length) {
              _this.setState({
                showIndex: id,
                answer: "",
                answersToQuestion: data.data,
                recommendAnswer: recomoadedAnswer[0]
              })
            } else {
              _this.setState({
                showIndex: id,
                answer: "",
                answersToQuestion: data.data,
                recommendAnswer: null
              })
            }
          }
        }
      ).catch((e) => {

      })
    })
  }

  chooseAnswer = (id) => {
    const _this = this;
    Modal.confirm({
      title: '是否选为最佳回答?',
      okText: '确定',
      cancelText: "取消",
      onOk() {
        fetch(window.host + '/question/answers/setRecommend', {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({
            "questionId": _this.state.showIndex,
            "answerId": id
          }),
          headers: {
            "Content-Type": "application/json",
            "token": cookieHelper.getCookie("token", "")
          },
        }).then((response) => {
          response.json().then((data) => {
              if (data.code === 200) {
                _this.showQuestionResultAndAnswer(_this.state.showIndex)
              }
            }
          ).catch((e) => {

          })
        })
      }
    })
  }

  render() {
    return <div className={styles.basicContainer}>
      <Header/>
      <div className={styles.requestsContainer}>
        {
          this.state.requests.map(item => <div className={styles.questionBlock}
                                               onClick={this.showQuestionResultAndAnswer.bind(this, item.id)}>
            <div style={{display: "inline-flex", cursor: "pointer"}}>
              <div className={styles.headIcon}>头 像</div>
              <div>
                <span style={{fontSize: 32, color: "#333333"}}>JavaScript</span><span
                style={{fontSize: 24, color: "#999999", marginLeft: 20}}>{item.publishName}</span><br/><span
                style={{fontSize: 24, color: "#999999"}}>女 18岁 计算机专业1班</span>
              </div>
              <div style={{color: "#ffc600", fontSize: 30, position: "absolute", right: 380}}>悬赏金:{item.points}元</div>
            </div>
            <div style={{height: 90, paddingTop: 20, fontSize: 30, color: "#cccccc"}}>{item.questionName}</div>
            <div style={{fontSize: 24, color: "#999999"}}>{item.gmtCreate}</div>
            <div style={{display: this.state.showIndex === item.id ? "" : "none", height: 100}}>
              {item.content}
            </div>
            {
              this.state.recommendAnswer &&
              <div style={{display: this.state.showIndex === item.id ? "" : "none", height: 100}}>
                <span>最佳回答:</span>
                <div style={{backgroundColor: "lightgreen"}}>{this.state.recommendAnswer.content}</div>
              </div>
            }
            <div style={{display: this.state.showIndex === item.id ? "" : "none", height: 100}}>
              <span>回答:</span>
              {this.state.answersToQuestion.filter(item => item.isRecommend === 1).map(item => {
                return <div
                  onClick={this.state.recommendAnswer ? this.chooseAnswer.bind(this, item.id) : void(0)}>{item.content}</div>

              })}
            </div>
            <div style={{
              // display: this.state.showIndex === item.id ? "" : "none",
              display: this.state.showIndex === item.id && item.publishName !== cookieHelper.getCookie("user", "") ? "" : "none",
              height: 150
            }}>
              <span>我的回答:</span>
              <TextArea value={this.state.answer} onChange={(e) => {
                this.setState({answer: e.target.value})
              }}></TextArea>
              <Button onClick={this.addQuestionAnswer.bind(this)} type={"primary"}>回复问题</Button>
              <Button onClick={() => {
                this.setState({showIndex: -1, answer: ""})
              }}>取消</Button>
            </div>
          </div>)
        }
      </div>
    </div>
  }
}

export default IndexPage;
