/**
 * 图的深度优先遍历
 *
 *        a
 *   b -> c -> d <- k
 * e -----^
 *
 * 1. 先一条路插到底，如 a->b->e->c->d->null
 * 2. 然后往回走一步，如 a->b->e->c, 检查 c 有没有除了 d 的 next:
 *      如果有，就选下一个 c.next 走 a->b->e->c->c.next->...->null, 往下插到底;
 *      如果没有，就继续往回走一步, a->b->e, 检查 e 除了 c 的其他 next, 往下插到底。
 * 3.每次插到底以后，都往回走一步，尝试下一个 next 插到底
 *
 * @param {Node} start 开始结点
 * @returns {number[]}
*/
function dfs(start) {
  if (!start) {
    return [];
  }
  // 可以用递归实现，如果不用递归，就要自己压栈
  const stack = [];
  const set = new Set();
  const ans = [];
  // 头结点压栈，头结点放入登记表
  stack.push(start);
  set.add(start);
  // 入栈就打印 (🔥这可不是出栈了啊!)
  ans.push(start.value);
  while (stack.length > 0) {
    const pop = stack.pop();
    // 从栈中弹出一个结点，然后遍历它所有的邻居
    // 弹出的时候就不用打印了，因为入栈的时候已经打印过了
    for (let i = 0, len = pop.nexts.length; i < len; i++) {
      const next = pop.nexts[i];
      if (!set.has(next)) {
        // 如果邻居没有被登记
        // 把弹出的结点重新压回去
        stack.push(pop);
        // 把 next 加入栈中,这两步能保留深度优先的路径
        stack.push(next);
        // 把邻居登记到表里
        set.add(next);
        // 深度优先，找到了一个结点
        // 压入就打印
        ans.push(next.value);
        // 这不是宽度优先遍历，所以走一个 next 以后，下一步绝对不是走下一个 next, 而是沿着这个 next 继续往下走
        // 不再遍历 nexts 了，跳出 for 循环。
        break;
      }
    }
  }
  return ans;
}
