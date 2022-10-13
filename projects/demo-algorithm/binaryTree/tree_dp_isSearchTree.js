/**
 * 判断一棵树是否是搜索二叉树
 *
 * 搜索二叉树定义:
 * 在二叉树中每一棵子树，它左树上的值都比头结点的值小，它右树上的值都比头结点的值大(注意:经典的搜索二叉树里没有重复值)，这棵树就是搜索二叉树。
 *
 * @param {TreeNode} root 二叉树的头结点
 * @return {boolean} 是否是搜索二叉树
 */
function isValidBST (root) {
  return proc(root).isBST;
};

/**
 * 递归含义: 以 node 为头的二叉树，返回 Info 结构
 * @param {TreeNode} node 二叉树的头结点
 * @returns {Info} 要上交给父级的信息结构
 */
function proc(node) {
  if (!node) {
    // base case: 定义 null 是一棵搜索二叉树，且 max 为系统最小值，min 为系统最大值，便于上游处理。
    return new Info(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, true);
  }
  // 向左右子树要信息
  const leftInfo = proc(node.left);
  const rightInfo = proc(node.right);
  // 构造出自己的信息
  // 自己这棵子树最大值 = 左子树、右子树、头结点三者中最大的那个
  const max = Math.max(node.val, Math.max(leftInfo.max, rightInfo.max));
  // 自己这棵子树最小值 = 左子树、右子树、头结点三者中最小的那个
  const min = Math.min(node.val, Math.min(leftInfo.min, rightInfo.min));
  // 自己是否是搜索二叉树 = 左搜索 并且 右搜索 并且 左max < 头val < 右min
  const isBST = leftInfo.isBST && rightInfo.isBST && (leftInfo.max < node.val && node.val < rightInfo.min);
  // 返回给自己的父结点
  return new Info(max, min, isBST);
}

/**
 * 定义子树向父结点上交的信息
 * @param max 整棵子树的最大值
 * @param min 整棵子树的最小值
 * @param isBST 子树是否是搜索二叉树
 * @constructor 信息结构
 */
function Info(max, min, isBST) {
  this.max = max;
  this.min = min;
  this.isBST = isBST;
}
