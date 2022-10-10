// 非递归后序遍历
// 1. 准备 2 个栈 s1, s2，把头结点放到 s1 里去。
// 2. 从 s1 从弹出结点，弹出之后先压左孩子再压右孩子到 s1，弹出的结点压入到 s2 中。(压入顺序保证先左后右，使得弹出顺序是`头右左`)
// 3. 循环往复，直到 s1 为空，再依次弹出 s2 的结点，就是答案。
// 原理:
// 由于 s1 弹出的顺序是`头右左`, 这个也是压入到 s2 中的顺序，所以 s2 的弹出顺序就是反过来 ———— `左右头`，即后序。
// @param {Node} root 二叉树的头结点
// @return {number[]} 后序遍历的数字
function traversal_postorderTraversal(root) {
  if (!root) {
    return [];
  }
  const s1 = [];
  const s2 = [];
  s1.push(root);
  while (s1.length > 0) {
    root = s1.pop();
    s2.unshift(root.val);
    if (root.left) {
      s1.push(root.left);
    }
    if (root.right) {
      s1.push(root.right);
    }
  }
  return s2;  // s2 的顺序就是后序
}
