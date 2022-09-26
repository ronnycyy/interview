import React, { useState, useContext } from 'react';

const numCtx = React.createContext(0);
const updateNumCtx = React.createContext(() => { });

function Button() {
  const updateNum = useContext(updateNumCtx);
  const now = Date.now();

  while (Date.now() - now < 100) { }
  console.log('耗时的组件render~');

  return (
    <button onClick={() => updateNum(Math.random())}>产生随机数</button>
  )
}

function Show() {
  const num = useContext(numCtx);
  return <p>num is: {num}</p>;
}

const Middle = React.memo(() => {
  return (
    <>
      <Button />
      <Show />
    </>
  )
})

export default function App() {
  const [num, updateNum] = useState(0);

  const onRenderCallback = (
    id, // 发生提交的 Profiler 树的 “id”
    phase, // "mount" 或 "update" 
    actualDuration, // 本次更新 committed 花费的渲染时间
    baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
    startTime, // 本次更新中 React 开始渲染的时间
    commitTime, // 本次更新中 React committed 的时间
    interactions // 属于本次更新的 interactions 的集合
  ) => {
    // 合计或记录渲染时间。。。
    console.log('id', id);
    console.log('phase', phase);
    console.log('actualDuration', actualDuration);
    console.log('baseDuration', baseDuration);
    console.log('startTime', startTime);
    console.log('commitTime', commitTime);
    console.log('interactions', interactions);
  }

  return (
    <numCtx.Provider value={num}>
      <updateNumCtx.Provider value={updateNum}>
        <React.Profiler id="Middle" onRender={onRenderCallback}>
          <Middle />
        </React.Profiler>
      </updateNumCtx.Provider>
    </numCtx.Provider>
  );
}

