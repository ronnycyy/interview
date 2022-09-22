import React from 'react';

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };
    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <React.Fragment>
        <h1>{this.state.isToggleOn ? '已打开' : '已关闭'}</h1>
        <button onClick={this.handleClick}>切换</button>
      </React.Fragment>

    );
  }
}

export default Toggle;
