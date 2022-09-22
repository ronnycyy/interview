// 性能优化(卡颂)
// 为什么要有 React 性能优化 API？

import React, { useState, useContext } from 'react';

const numCtx = React.createContext(0);
const updateNumCtx = React.createContext(() => { });

function Button() {
  // 虽然 Button 使用了 context，但是它使用的 context 是 updateNum，是不变的。
  const updateNum = useContext(updateNumCtx);
  console.log('btn render')
  return (
    <button onClick={() => updateNum(Math.random())}>产生随机数</button>
  )
}

function Show() {
  // context 变了，所以即使 props 没变，也照样重新渲染。
  // console.log('show render ~');
  const num = useContext(numCtx);
  return <p>num is: {num}</p>;
}

// 只有父组件传递进来的 props, 没有 state, 也没有 context。
// 造成重新渲染的原因，就是父组件重新渲染，传递了一个新的 空 props 对象，经过引用比较，发现不一致，所以 render。
// 🔥让 Middle 命中性能优化的方法:
// 通过 React.memo 包裹，把 props 对象更新前后的 引用比较 改为 浅比较，如果浅比较相同就复用上一次的渲染结果，本次不 render。
// Button 子组件收到的 props 就是上一次渲染父组件传给它的 props，那么前后 props 的引用就是相同的，state, context 都没变，所以不会 render，达到了性能优化的目的。
const Middle = React.memo(() => {
  return (
    <>
      <Button />
      <Show />
    </>
  )
});

export default function App() {
  const [num, updateNum] = useState(0);

  return (
    <numCtx.Provider value={num}>
      <updateNumCtx.Provider value={updateNum}>
        <Middle />
      </updateNumCtx.Provider>
    </numCtx.Provider>
  );
}

