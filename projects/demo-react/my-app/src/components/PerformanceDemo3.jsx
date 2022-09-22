// 这个例子也是将变的部分与不变的部分分离，但是需要把父组件的也考虑进去

import React, { useState } from 'react';

function PerformanceDemo1() {
  const [text, setText] = useState('');

  return (
    <div title={text}>
      <input onChange={(e) => setText(e.target.value)} />
      <p>text is {text}</p>
      <ExpensiveCpu />
    </div>
  )
}

// 每次render都会卡100ms
function ExpensiveCpu() {
  let now = Date.now();
  while (Date.now() - now < 100) { }
  console.log('耗时的组件render~');
  return <h1>耗时的组件</h1>
}

export default PerformanceDemo1;