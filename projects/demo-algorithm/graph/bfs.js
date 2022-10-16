/**
 * 图的宽度优先遍历
 *
 * 思想:
 * 其实和二叉树的BFS差不多，都是用队列，弹一个加多个，但是在加入之前，要检查一下是不是已经加入过了，防止跑不完。
 *
 * 实现:
 * 1. 准备一个队列，把`出发结点`加进去。
 * 2. 准备一个集合，把`出发结点`加进去。
 * 3. 弹出结点，弹出就处理。找到检查结点下一步能到达的所有结点，在集合中检查，如果已经加入过的就不要再加了，没加入的就依次加入队列。
 * 4. 重复`弹出`、`加入`，直到队列为空，返回处理结果。
 *
 * @param {Node} start 用户提供的出发结点
 * @return {number[]} 遍历结果
*/
function bfs(start) {
  if (!start) {
    return [];
  }
  const queue = [];
  const set = new Set();
  queue.unshift(start);
  set.add(start);
  const ans = [];
  while (queue.length > 0) {
    const pop = queue.pop();
    ans.push(pop.value);
    const nexts = pop.nexts;
    for (let i = 0, len = nexts.length; i < len; i++) {
      const node = nexts[i];
      if (!set.has(node)) {
        set.add(node);
        queue.unshift(node);
      }
    }
  }
  return ans;
}
