/**
 * 力扣 333. 最大 BST 子树
 * https://leetcode.cn/problems/largest-bst-subtree/submissions/
 *
 * 找到是搜索二叉树的子树中，最大的那棵，"最大"的意义是: 结点数量最多，返回该子树的结点数量。
 *
 * [实现]
 * 根据 x 是否为子树头划分情况:
 *
 * 1. x 不作为最大搜索二叉子树头, 需要信息:
 *    1.1  x 左子树的最大搜索二叉子树的大小
 *    1.2  x 右子树的最大搜索二叉子树的大小
 *   两者取其大者，作为 x 的值，返给父级。
 *
 * 2. x 作为最大搜索二叉子树头, 需要满足:
 *    2.1  左子树是搜索二叉树
 *    2.2  右子树是搜索二叉树
 *    2.3  左子树的最大结点值 < x.val
 *    2.4  x.val < 右子树的最小结点值
 *    满足以后，x 的数据 = 左子树的结点数量 + 1 + 右子树的结点数量
 *
 * 综上，Info 需要的属性有: maxBSTSize(整棵树上最大搜索二叉子树大小), isBST, max, min, size(整棵树的结点数量)。
 * 其中 isBST 可以由 maxBSTSize === size 获得，所以可以省去 isBST 这个属性。
 */
function largestBSTSubtree(root) {
  if (!root) {
    return 0;
  }
  return proc(root).maxBSTSubtreeSize;
}

/**
 *
 * @param {TreeNode} x
 * @returns {Info|null}
 */
function proc(x) {
  if (!x) {
    // 空结点，Info 全部设置无效信息，使它在上游使用时，不打破搜索二叉树的规则。
    return new Info(0, 0, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  }
  
  // 收集左右子树上交的信息
  const leftInfo = proc(x.left);
  const rightInfo = proc(x.right);
  
  // 生成本结点的 4 个信息，返给父结点
  let max = x.val;  // 初始化为 x 的值
  let min = x.val;  // 初始化为 x 的值
  let size = 1;  // 初始化只有 x 这一个结点
  let maxBSTSubtreeSize = 0;  // 初始化最大搜索二叉树大小为0
  
  max = Math.max(max, leftInfo.max, rightInfo.max);
  min = Math.min(min, leftInfo.min, rightInfo.min);
  size = size + leftInfo.size + rightInfo.size;
  // 最大搜索二叉子树，可能是左右子树中较大的那个
  maxBSTSubtreeSize = Math.max(maxBSTSubtreeSize, leftInfo.maxBSTSubtreeSize, rightInfo.maxBSTSubtreeSize);
  
  // 处理 x 可能为搜索二叉树头的情况，以更新 maxBSTSubtreeSize
  // 满足: 左右子树都是BST, 并且 左max < x.val < 右min, 那么 x 就可以作为搜索二叉树的头，有资格 PK 一下上面得到的 maxBSTSubtreeSize。
  if (
    leftInfo.maxBSTSubtreeSize === leftInfo.size &&
    rightInfo.maxBSTSubtreeSize === rightInfo.size &&
    leftInfo.max < x.val
    && x.val < rightInfo.min
  ) {
    // 以 x 为头的二叉搜索大小 = 左树大小 + 本结点 + 右树大小
    maxBSTSubtreeSize = Math.max(maxBSTSubtreeSize, leftInfo.size + 1 + rightInfo.size);
  }
  
  // 返回信息给父级
  return new Info(maxBSTSubtreeSize, size, max, min);
}

function Info(ms, s, ma, mi) {
  this.maxBSTSubtreeSize = ms; // 最大搜索二叉子树结点数量
  this.size = s;  // 整棵树的结点数量
  this.max = ma;  // 最大结点值
  this.min = mi;  // 最小结点值
}
