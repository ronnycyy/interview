// 拷贝所有静态方法

import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

function enhance(WrappedComponent) {
  class Enhance extends React.Component {
    componentDidMount() {
      console.log('HOC finished.');
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { age: 10 };
  }
  static getDerivedStateFromProps(props, state) {
    return { age: 18 }
  }
  render() {
    return <h1>MyComponent</h1>;
  }
}
MyComponent.staticMethod = function () {
  console.log('I am static.');
}
export default enhance(MyComponent);