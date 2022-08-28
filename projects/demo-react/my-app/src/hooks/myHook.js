// 极简 useState hook

// 首次render时是mount
let isMount = true;
// App组件对应的fiber对象
const fiber = {
  // 保存该FunctionComponent对应的Hooks链表
  memoizedState: null,
  // 指向App函数
  stateNode: App
};
// App 返回的 ReactElement
let AppElement = null;
// 当前正在处理的 hook
let workInProgressHook = null;

/**
 * 1. 创建 update 对象，加入 hook.queue
 * 2. 执行调度，重新渲染函数组件
 */
// 参数 queue 在 useState 中被 bind 绑定为 hook.queue。
// 所以调用时只需要传入 action, 比如 setCount(c => c + 1),其中 c => c + 1 这个箭头函数就是 action。
// dispatchAction 的作用就是新建 update， 加入 hook.queue, 连成环，至于如何计算，交给 useState 处理。
function dispatchAction(queue, action) {
  // 创建update
  const update = {
    action,
    next: null
  }
  // 环状单向链表操作
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;
  // 模拟React开始调度更新
  schedule();
}

/**
 * 1. 获取当前 hook
 * 2. 计算当前 hook 的状态值
 */
function useState(initialState) {
  // 当前useState使用的hook会被赋值该该变量
  let hook;

  // 1. 获取 hook
  if (isMount) {
    // mount时为该useState生成hook
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }

    // 将hook插入fiber.memoizedState链表末尾
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    // 移动workInProgressHook指针
    workInProgressHook = hook;
  } else {
    // update时找到对应hook
    hook = workInProgressHook;
    // 移动workInProgressHook指针
    workInProgressHook = workInProgressHook.next;
  }

  // 2. 计算 hook.memoizedState
  // update执行前的初始state
  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // 获取update环状单向链表中第一个update
    let firstUpdate = hook.queue.pending.next;
    do {
      // 执行update action
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;

      // 最后一个update执行完后跳出循环
    } while (firstUpdate !== hook.queue.pending.next)
    // 清空queue.pending
    hook.queue.pending = null;
  }
  // 将update action执行完后的state作为memoizedState
  hook.memoizedState = baseState;

  // 返回 [state, setState]
  return [baseState, dispatchAction.bind(null, hook.queue)];
}

/**
 * 1. 顺序执行所有 hook 方法
 * 2. 得到 state 渲染 React 元素
 */
function App() {
  const [num, updateNum] = useState(0);
  console.log(`${isMount ? 'mount' : 'update'} num: `, num);
  return {
    click() {
      updateNum(num => num + 1);
    }
  }
}

/**
 * 调度本次更新，执行 App 函数组件。
 */
function schedule() {
  // 更新前将workInProgressHook重置为fiber保存的第一个Hook
  workInProgressHook = fiber.memoizedState;
  // 触发组件render
  // 得到 app，可通过 app.click() 模拟点击事件
  AppElement = fiber.stateNode();
  // 组件首次render为mount，以后再触发的更新为update
  isMount = false;
}

schedule();

setTimeout(() => {
  console.log('click');
  AppElement.click();
}, 0);

setTimeout(() => {
  console.log('click after 1s');
  AppElement.click();
}, 1000);
