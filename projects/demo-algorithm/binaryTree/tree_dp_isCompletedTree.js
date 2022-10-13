/**
 * 判断一棵树是否是完全二叉树
 *
 * 完全二叉树定义:
 * 完全二叉树要么是一棵满二叉树，要么是逐层从左到右依次变满的过程中的一棵树。
 *
 * 实现:
 * 树形dp的套路
 * 1. 想问题: 什么样的可能性，会使得`以 x 为头的整棵树是完全二叉树`？
 * 2. 列可能性
 * 3. 从可能性提取需要向左右子树要什么信息
 *
 * 怎么分可能性？———— 可以思考最后一层结点的最后一个到哪了。使得 x 为头的树是完全二叉树的可能性有:
 *    1.左树是满的，右树是满的，并且左右树的高度一致。
 *    2.左树是满的，右树是满的，并且左树高度比右树高 1 层。
 *    3.左树是满的，右树是完全，并且左右树的高度一致。
 *    4.左树是完全，右树是满的，并且左树高度比右树高 1 层。
 *  只有这 4 种情况了(蛋疼就在这里，你要想得全...), 只要命中了任意一种，就认为以 x 为头的整棵树是完全二叉树。
 *
 * 从可能性总结出需要向子树要的信息: isFill(是否满), isCompleted(是否完全), height(高度)
 *
 * @param {TreeNode} root 二叉树的头结点
 * @return {boolean} 是否是完全二叉树
 */
function isCompleteTree(root) {
  return proc(root).isCompleted;
};

// 以 x 为头的子树，向父级返回 Info 信息
function proc(x) {
  if (!x) {
    // 人为规定"是", 方便上游处理，也不影响实际应用，因为空结点无意义。
    return new Info(true, true, 0);
  }
  // 收取子树的信息
  const leftInfo = proc(x.left);
  const rightInfo = proc(x.right);
  // 加工自己的信息
  const isFill = leftInfo.isFill && rightInfo.isFill && leftInfo.height === rightInfo.height;
  const height = Math.max(leftInfo.height, rightInfo.height) + 1;
  // 本子树是否完全
  let isCompleted = false;
  // 但凡命中一个，就是完全，都没中才不是
  if (isFill) {
    isCompleted = true;
  } else if (leftInfo.isFill && rightInfo.isFill && leftInfo.height === rightInfo.height + 1) {
    isCompleted = true;
  } else if (leftInfo.isFill && rightInfo.isCompleted && leftInfo.height === rightInfo.height) {
    isCompleted = true;
  } else if (leftInfo.isCompleted && rightInfo.isFill && leftInfo.height === rightInfo.height + 1) {
    isCompleted = true;
  }
  // 返回给父级
  return new Info(isFill, isCompleted, height);
}

function Info(isFill, isCompleted, h) {
  this.isFill = isFill;
  this.isCompleted = isCompleted;
  this.height = h;
}

/**
 * 方法二
 * 按层遍历:
 * 1. 如果一个结点只有右孩子没有左孩子，那肯定不是完全二叉树，直接返回 false。
 * 2. 没有在`条件1`中返回的情况下，当第 1 次遇到左右孩子不双全的结点后，剩下的结点必须都是叶子结点，如果能顺利遍历完，返回 true, 如果不能，返回 false。
 * @param {TreeNode} root 二叉树的头结点
 * @returns {boolean} 是否是完全二叉树
 */
function isCompleteTree2(root) {
  if (!root) {
    // 空结点认为是完全二叉树，这个也可以视为否，随你的便~
    return true;
  }
  // 按层遍历的队列
  const queue = [];  // Array<TreeNode>
  // 一个开关，表示是否遇到过左右两个孩子不双全的结点
  let leaf = false;  // boolean
  // 头结点入队
  queue.unshift(root);
  // 层序遍历
  while (queue.length > 0) {
    // 当前结点
    const pop = queue.pop();
    // 当前结点左孩子
    let l = pop.left;
    // 当前结点右孩子
    let r = pop.right;
    // 1. 如果任意一个结点有右无左，root 肯定不是完全二叉树，直接返回 false;
    // 2. 如果遇到过左右孩子不双全的结点，并且又遇到一个非叶子结点，root 不是完全二叉树，返回 false
    if (
      (r !== null && l === null)
      ||
      (leaf && !(l === null && r === null))
    ) {
      return false;
    }
    // 层序遍历继续
    if (l) {
      queue.unshift(l);
    }
    if (r) {
      queue.unshift(r);
    }
    // 首次遇到左右孩子不双全的结点，开关打开
    if (!leaf && (l === null || r === null)) {
      leaf = true;
    }
  }
  // 能够顺利遍历完而不违规，说明 root 是一棵完全二叉树。
  return true;
}
