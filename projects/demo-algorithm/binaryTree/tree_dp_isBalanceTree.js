/**
 * 判断一棵树是否是平衡二叉树
 *
 * @param {TreeNode} root 二叉树的头结点
 * @return {boolean} 是否是平衡二叉树
 */
function isBalanced (root) {
  return proc(root).isBalanced;
};

/**
 * 递归含义: 以 node 为头的二叉树，返回 Info 结构
 * @param node 二叉树的头结点
 * @returns {Info} 要上交给父级的信息结构
 */
function proc(node) {
  if (!node) {
    // base case: 定义 null 是一棵平衡二叉树且高度为0，便于上游处理
    return new Info(0, true);
  }
  // 向左右子树要信息
  const leftInfo = proc(node.left);
  const rightInfo = proc(node.right);
  // 构造出自己的信息
  // 自己的高度 = 左右子树中较高的那个的高度+1
  const height = Math.max(leftInfo.height, rightInfo.height) + 1;
  // 自己是否平衡 = 左平衡 并且 右平衡 并且 左右高度差不超过1
  const isBalanced = leftInfo.isBalanced && rightInfo.isBalanced && Math.abs(leftInfo.height - rightInfo.height) <= 1;
  // 返回给自己的父结点
  return new Info(height, isBalanced);
}

/**
 * 定义子树向父结点上交的信息
 * @param height 整棵子树的高度
 * @param isBalanced 子树是否平衡
 * @constructor 信息结构
 */
function Info(height, isBalanced) {
  this.height = height;
  this.isBalanced = isBalanced;
}
