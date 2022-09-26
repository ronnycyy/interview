import React from 'react';

export default class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: 'Hello!' };
    // 这一行很重要！
    // this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    debugger;
    console.log(this);
  }

  render() {
    // 由于 `this.handleClick` 已经绑定至实例，因此我们才可以用它来处理点击事件
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}