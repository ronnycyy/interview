/**
 * 找到二叉树中的距离。
 *
 * 实现:
 * 1. 遍历二叉树，建立一张表 Map<TreeNode, TreeNode>, 通过结点能找到父结点。
 * 2. p 在 Map 中查找，一路往上，把 p 到 root 路径上的所有结点，放到 Set 里。
 * 3. q 在 Map 中查找，一路往上，每到达一个结点，就在 Set 中查找，找到的结点就是 p,q 的最近公共祖先。
 * 4. p,q 的距离 = p 到祖先的距离 + q 到祖先的距离。
*/

/**
 * @param {TreeNode} root
 * @param {number} p
 * @param {number} q
 * @return {number}
 */
function findDistance(root, p, q) {
  if (!root) {
    return 0;
  }
  const map = new Map();  // Map<number, number>
  const set = new Set();  // Set<number>
  const queue = [];
  queue.unshift(root);
  // 头结点的父设置为null
  map.set(root.val, null);
  // 按层遍历, 建立 结点->父结点 表
  while (queue.length > 0) {
    const pop = queue.pop();
    if (pop.left) {
      queue.unshift(pop.left);
      map.set(pop.left.val, pop.val);
    }
    if (pop.right) {
      queue.unshift(pop.right);
      map.set(pop.right.val, pop.val);
    }
  }
  // p 的父结点全放到 set 里
  let cur = p;
  while (cur !== null) {
    set.add(cur);
    cur = map.get(cur);
  }
  // q 往上窜，第 1 个在 set 里遇到的，就是 p,q 的最近公共祖先
  cur = q;
  while (cur !== null) {
    if (set.has(cur)) {
      break;
    }
    cur = map.get(cur);
  }
  
  // 分别计算 p,q 到达祖先的距离, d1,d2 代表 p,q 到达 ancestor 需要的"边"的数量
  let d1 = 0;
  let d2 = 0;
  let c1 = p;
  let c2 = q;
  let ancestor = cur;
  while (c1 !== ancestor) {
    d1++;
    c1 = map.get(c1);
  }
  while (c2 !== ancestor) {
    d2++;
    c2 = map.get(c2);
  }
  
  // 综合起来就是 p,q 的距离。
  return d1+d2;
};
