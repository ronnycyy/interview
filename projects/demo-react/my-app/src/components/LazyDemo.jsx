import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function LazyDemo() {
  const [showLazy, setShowLazy] = React.useState(false);

  const load = () => {
    setShowLazy(true);
  }

  return (
    <div>
      <button onClick={load}>加载组件</button>
      {
        showLazy ? (
          <Suspense fallback={<div>正在加载...</div>}>
            <OtherComponent />
          </Suspense>
        ) : <h1>未加载组件。</h1>
      }

    </div>
  );
}

export default LazyDemo;
