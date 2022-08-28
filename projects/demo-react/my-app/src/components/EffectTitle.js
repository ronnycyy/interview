import React, { useEffect, useState } from 'react';

// 在 React 更新 DOM 后会设置一个页面标题
function EffectTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('useEffect');
  }, [count]);

  return (
    <div>
      <h1>Effect Title {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default EffectTitle;