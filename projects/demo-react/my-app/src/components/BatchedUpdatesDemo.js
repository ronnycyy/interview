import React from 'react';

class BatchedUpdateDemo extends React.Component {
  state = {
    num: 0
  }

  onClick = () => {
    setTimeout(() => {
      this.setState({ num: this.state.num + 1 });
      this.setState({ num: this.state.num + 1 });
    }, 0)
  }

  render() {
    console.log('render~');
    return <p onClick={this.onClick}>{this.state.num}</p>
  }
}

export default BatchedUpdateDemo;