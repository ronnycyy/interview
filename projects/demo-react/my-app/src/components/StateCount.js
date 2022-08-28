import React, { useState } from 'react';

function Count() {

  /**
   * hook.memoized = 0;
   * hook.queue = Update 环;
   * hook.next = null;   下一个 useState/useEffect/useRef...
   * 
   * fiber(Count).memoizedState = hook;
   */
  const [count, setCount] = useState(0);
  const [count1] = useState(1);

  return (
    <div>
      <p>You clicked {count} times</p>
      <p>You clicked count1: {count1} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default Count;
