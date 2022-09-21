import React from 'react';

function OtherComponent() {

  React.useEffect(() => {
    console.log('OtherComponent加载完毕~')
  }, [])

  return <h1>一个被懒加载的组件</h1>
}

export default OtherComponent;
