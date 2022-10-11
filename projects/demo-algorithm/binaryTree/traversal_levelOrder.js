/**
 * 二叉树的层序遍历
 *
 * 实现:
 * 如果把二叉树理解为图的话，其实就是图的宽度优先遍历，用队列实现。
 *
 * 步骤:
 * 1. 准备一个队列，把头结点放进去。
 * 2. 队列不为空时，队首出队，出队就打印，然后出队的结点有左孩子就左孩子入队，有右孩子就右孩子入队，没有就不入队。
 * 3. 周而复始，直到队列为空。
 *
 * @param {Node} root 二叉树的头结点
 * @return {number[]} 遍历的结果数组
*/
function traversal_levelOrder(root) {
  if (!root) {
   return [];
  }
  const queue = [];
  const ans = [];
  queue.unshift(root);
  while (queue.length > 0) {
   root = queue.pop();
   ans.push(root.val);
   if (root.left) {
     queue.unshift(root.left);
   }
   if (root.right) {
     queue.unshift(root.right);
   }
  }
  return ans;
}
