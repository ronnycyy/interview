import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  console.log('render App~');

  const onClick = () => {
    setCount(6);
  }

  return (
    <>
      数量: {count}
      <button onClick={onClick}>重置</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>减少</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>增加</button>
    </>
  );
}