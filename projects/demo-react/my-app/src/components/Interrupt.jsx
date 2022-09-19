import React, { useState, useEffect, useRef } from 'react';

function Interrupt() {
  const buttonRef = useRef(null);
  const [count, updateCount] = useState(0);

  const onClick = () => {
    updateCount(c => c + 2);
  }

  useEffect(() => {
    const button = buttonRef.current;
    // 1000ms 后 count 变为 1
    // NormalPriority  (DefaultEventPriority, DefaultLane)
    setTimeout(() => updateCount(1), 1000);
    // 1001ms 后 count 增加 2
    // 这次是 UserBlockingPriority，优先级高于 NormalPriority，所以这次更新会打断上一次更新
    setTimeout(() => button.click(), 1001);
  }, [])

  return (
    <div>
      <button ref={buttonRef} onClick={onClick}>增加2</button>
      <div>
        {
          Array.from(new Array(8000)).map((v, i) => <span key={i}>{count}</span>)
        }
      </div>
    </div>
  )
}

export default Interrupt;
