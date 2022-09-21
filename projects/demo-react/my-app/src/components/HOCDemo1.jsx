import React from 'react';

class HOCDemo1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      name: 'HOCDemo1'
    }
  }

  // 定义在 HOCDemo1.prototype 上，所以 HOCDemo1 的所有实例(React内部只有1个)可以访问。
  componentDidMount() {
    console.log(this.state);
    debugger;
  }

  render() {
    return <h1>HOCDemo1</h1>
  }
}

export default HOCDemo1;
