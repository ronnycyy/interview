import React from 'react';

function Demo() {

  const onClick1 = () => {
    console.log('parent click');
  }

  const onClick2 = (e) => {
    // e.stopPropagation();
    console.log('son click');
  }

  return (
    <div onClick={onClick1}>
      <h1>阻止冒泡</h1>
      <button onClick={onClick2}>onClick2</button>
    </div>
  )
}

export default Demo;
