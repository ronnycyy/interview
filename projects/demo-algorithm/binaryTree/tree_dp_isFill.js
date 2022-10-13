/**
 * 判断一棵树是否是满二叉树
 *
 * 满二叉树的定义:
 * 如果满二叉树的高度是 h, 那么它的结点数量一定是 2**h-1。
 *
 * @param {TreeNode} root 二叉树的头结点
 * @return {boolean} 是否是平衡二叉树
 */
function isFilled (root) {
  const info = proc(root);
  return info.count === Math.pow(2, info.height) - 1;
};

/**
 * 递归含义: 以 node 为头的二叉树，返回 Info 结构
 * @param node 二叉树的头结点
 * @returns {Info} 要上交给父级的信息结构
 */
function proc(node) {
  if (!node) {
    return new Info(0, 0);
  }
  // 向左右子树要信息
  const leftInfo = proc(node.left);
  const rightInfo = proc(node.right);
  // 构造出自己的信息
  const height = Math.max(leftInfo.height, rightInfo.height) + 1;
  const count = leftInfo.count + rightInfo.count + 1;
  // 返给父结点
  return new Info(height, count);
}

/**
 * 定义子树向父结点上交的信息
 * @param height 子树的高度
 * @param count 子树的结点数量
 * @constructor 信息结构
 */
function Info(height, count) {
  this.height = height;
  this.count = count;
}

function main() {
  const TreeNode = require('./TreeNode');
  const head = new TreeNode(1);
  head.left = new TreeNode(2);
  head.right = new TreeNode(3);
  head.left.left = new TreeNode(4);
  head.left.right = new TreeNode(5);
  // head.right.left = new TreeNode(6);
  head.right.right = new TreeNode(7);
  console.log(isFilled(head));
}

main();
