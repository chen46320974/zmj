import React from 'react';

import {Button, Input, InputNumber, Modal, message} from 'antd';
import styles from "../main.css"
import {connect} from "dva/index";
import LoginModal from "./LoginModal";
import cookieHelper from "../../utils/cookieHelper";


const {TextArea} = Input;

class Demo extends React.Component {

  constructor(Props) {
    super(Props);
    this.state = {visible: false, givenPoint: 0, question: "", questionName: "", newQuestionVisible: false}
  }

  showRegistModal() {
    this.setState({visible: true})
  }

  showQuestionModal() {
    this.setState({newQuestionVisible: true})
  }

  handleAddQuestion = () => {
    if (!this.state.question || this.state.question === "") {
      message.warning("提问内容不能为空");
    } else if (!this.state.questionName || this.state.questionName === "") {
      message.warning("提问标题不能为空");
    }

    fetch(window.host + '/question/questions/publish', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        "content": this.state.question,
        "points": this.state.givenPoint,
        "questionName": this.state.questionName
      }),
      headers: {
        "Content-Type": "application/json",
        "token": cookieHelper.getCookie("token", "")
      },
    }).then((response) => {
      response.json().then((data) => {
          if (data.code === 200) {
            window.location.reload();
          }
        }
      ).catch((e) => {

      })
    })
  }


  render() {
    const {visible} = this.state;
    return <div className={styles.header}>
      <div>
        <span>希望人校园学习网</span>{/*<br/>
        <span>xxxyyyyzzzww1qw</span>*/}
      </div>
      <ul>
        <li>线上提问</li>
        <li>面对面辅导</li>
        <li>移动端产品</li>
        <li>个人中心</li>
      </ul>
      <span onClick={cookieHelper.getCookie("token", "") !== "" ? () => {
        window.location.href = "/#/personal"
      } : this.showRegistModal.bind(this)}>{cookieHelper.getCookie("user", "登陆")}</span>
      {cookieHelper.getCookie("token", "") !== "" &&
      <span style={{marginLeft: 20, fontSize: 16, color: "blue", cursor: "pointer"}}
            onClick={this.showQuestionModal.bind(this)}> 开始提问 </span>}
      <Modal style={{top: "10%"}}
             width="1000px"
             cancelText="取消"
             okText="保存内容"
             destroyOnClose={true}
             visible={visible}
             onCancel={() => {
               this.setState({visible: false})
             }}
             footer={null}
             maskClosable={false}
             wrapClassName={`${styles.addGroupMoDal} ${this.state.modalType === 1 ? styles.addMoDal : styles.editMoDal}`}
      >
        <LoginModal closeAction={() => {
          this.setState({visible: false})
          window.location.reload();
        }}/>
      </Modal>
      <Modal
        title={'提出新问题'}
        style={{top: "10%"}}
        width="600px"
        cancelText="取消"
        okText="确定"
        destroyOnClose={true}
        visible={this.state.newQuestionVisible}
        onOk={this.handleAddQuestion.bind(this)}
        onCancel={() => {
          this.setState({newQuestionVisible: false})
        }}
        maskClosable={false}
        wrapClassName={`${styles.addGroupMoDal} ${this.state.modalType === 1 ? styles.addMoDal : styles.editMoDal}`}
      >
        <div>
          <div style={{margin: "10px auto"}}> 标题：<Input value={this.state.questionName}
                                                        onChange={(e) => {
                                                          this.setState({questionName: e.target.value})
                                                        }}/></div>
          <div style={{margin: "10px auto"}}>悬赏分值：<InputNumber value={this.state.givenPoint} onChange={(value) => {
            this.setState({givenPoint: value})
          }}/></div>
          <div style={{margin: "10px auto"}}>提问内容：<TextArea value={this.state.question} onChange={(e) => {
            this.setState({question: e.target.value})
          }}/></div>
        </div>
      </Modal>
    </div>
  }
}

function mapStateToProps(status) {
  return status
}

export default connect(mapStateToProps)(Demo);

