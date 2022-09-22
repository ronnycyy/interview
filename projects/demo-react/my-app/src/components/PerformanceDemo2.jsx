import React, { useState } from 'react';

function PerformanceDemo2() {
  return (
    <div>
      <Input />
      <ExpensiveCpu />
    </div>
  )
}

function Input() {
  const [text, setText] = useState('');
  return (
    <>
      <input onChange={(e) => setText(e.target.value)} />
      <p>text is {text}</p>
    </>
  )
}

// 每次render都会卡100ms
function ExpensiveCpu() {
  let now = Date.now();
  while (Date.now() - now < 100) { }
  console.log('耗时的组件render~');
  return <h1>耗时的组件</h1>
}

export default PerformanceDemo2;