import React, { Suspense, useState, useTransition } from "react";

function wrapPromise(promise) {
  let result;
  let status = "pending";
  // suspender 从 { <pending> } 过 1000ms 后，转变为 { <fulfilled>: value: undefined }
  let suspender = promise.then(
    value => {
      result = value;
      status = "success";
    },
    reason => {
      result = reason;
      status = "error";
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else {
        // Promise 被抛出后，React 在内部监听这个 Promise 对象，当它 resolve 的时候，then 中会执行 ensureRootIsScheduled,
        // 然后调度 FiberRootNode, 再次更新 Fiber 树，执行函数组件，来到此处调用 read 方法，此时 status 就是 success 了，返回的就是数据了。
        return result;  // 数据，如 { time: "2022/9/19 14:08:34" } 
      }
    }
  };
}

// 传入一个 Promise 对象，返回 wrapPromise 的执行结果
function fetchTime() {
  // wrapPromise 返回一个对象，包含一个 read 方法。
  // 1000ms 内，Promise 还是 pending, 此时调用 read()，会像错误一样抛出这个 Promise 对象。
  return wrapPromise(
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ time: new Date().toLocaleString() });
      }, 1000);
    })
  );
}

function Clock({ resource }) {
  // 1. 首次调用 read，抛出 suspender 这个 Promise 对象给 Suspense 捕获，监听这个 Promise 对象，当它 resolve 时，执行 ensureRootIsScheduled 更新 React 应用。
  // 2. 更新时，再次来到此处，调用 read 方法，此时可以正常返回数据，得到 time 渲染。
  const { time } = resource.read();
  return <h3>{time}</h3>;
}

function Button({ onClick, children }) {
  // useTransition 允许组件在切换到下一个界面之前等待内容加载，从而避免不必要的加载状态。
  // 它还允许组件将速度较慢的数据获取更新推迟到随后渲染，以便能够渲染更重要的更新。(高优任务打断低优任务)

  // TODO:
  // 1. mount时
  // 2. update时
  const [isPending, startTransition] = useTransition();

  console.log('render~', isPending);

  const btnOnClick = () => {
    startTransition(() => {
      // 定义过渡任务
      onClick();
    });
  };

  return (
    <>
      <button disabled={isPending} onClick={btnOnClick}>
        {children}
      </button>
      <span>{isPending && " transition loading.."}</span>
    </>
  );
}

function SuspenseDemo() {
  // 1.初始化一个状态，值为 fetchTime 的执行结果
  const [time, setTime] = useState(fetchTime());

  const load = () => {
    setTime(fetchTime());
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Button onClick={load}>加载</Button>
      <Clock resource={time} />
    </Suspense>
  );
}

export default SuspenseDemo;
