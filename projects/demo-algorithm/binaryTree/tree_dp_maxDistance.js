/**
 * 在二叉树中任何 2 个结点之间都有距离，返回整棵二叉树的最大距离。
 *
 * 距离就是连接两个结点最短路径上的结点数量，如:
 *
 *                   a
 *           b                 c
 *     d        e        f          g
 *                          h
 *
 * 整棵二叉树的最大距离是 6，因为从 d 到 h 的最短路径是 d->b->a->c->f->h, 一共 6 个结点。
 *
 * @param {TreeNode} root 二叉树的头结点
 * @return {number} 二叉树的最大距离
 */
function maxDistance (root) {
  return proc(root).maxDistance;
};

/**
 * @param node
 * @return {Info}
 */
function proc(node) {
  if (!node) {
    return new Info(0, 0);
  }
  const leftInfo = proc(node.left);
  const rightInfo = proc(node.right);
  
  const height = Math.max(leftInfo.height, rightInfo.height) + 1;
  const p1 = leftInfo.height + rightInfo.height + 1;
  const p2 = leftInfo.maxDistance;
  const p3 = rightInfo.maxDistance;
  const maxDistance = Math.max(p1, p2, p3);
  
  return new Info(height, maxDistance);
}

function Info(h, m) {
  this.height = h;
  this.maxDistance = m;
}

// 本进程的主线程
function main() {
  const TreeNode = require('./TreeNode');
  const head = new TreeNode('a');
  head.left = new TreeNode('b');
  head.right = new TreeNode('c');
  head.left.left = new TreeNode('d');
  head.left.right = new TreeNode('e');
  head.right.left = new TreeNode('f');
  head.right.right = new TreeNode('g');
  head.right.left.right = new TreeNode('h');
  console.log(maxDistance(head));
}

main();
