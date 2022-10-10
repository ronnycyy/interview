// 非递归先序遍历
// 1. 准备一个栈，把头结点放进去
// 2. 弹出一个结点，弹出就打印。该结点有右孩子就压入右孩子，然后有左孩子再压入左孩子，一定是先右再左。
// 3. 继续弹出，维持先右再左的原则，直到栈弹空，打印的顺序就是先序。
// 原理:
// 对于任意一棵子树, 由于`头结点`弹出的时候先压右再压左，所以它的遍历顺序一定是`头,左,右`, 左子树又会分解成头,左,右, ..., 那么对于整棵树, 就是先序遍历。
// @param {Node} head 二叉树的头结点
// @return {number[]} 后序遍历的数字
function traversal_preorderTraversal(head) {
  if (!head) {
    return [];
  }
  const stack = [];
  stack.push(head);
  while (stack.length > 0) {
    head = stack.pop();
    console.log(head.val);  // 先序
    if (head.right) {
      stack.push(head.right);
    }
    if (head.left) {
      stack.push(head.left);
    }
  }
}
