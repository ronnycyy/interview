/**
 * 微软面试题 - 二叉树折纸问题
 *
 * 请把一段纸条竖着放在桌子上，然后从纸条的下边向上方对折1次，压出折痕后展开。此时折痕是凹下去的，即折痕突起的方向指向纸条的背面。
 * 如果从纸条的下边向上方连续对折2次，压出折痕后展开，此时有三条折痕，从上到下依次是下折痕、下折痕和上折痕。
 * 给定一个输入参数N，代表纸条都从下边向上方连续对折N次。 请从上到下打印所有折痕的方向。
 * 例如:
 *  N=1时，打印: 凹
 *  N=2时，打印: 凹 凹 凸
 *  N=3时，打印: 凹 凹 凸 凹 凹 凸 凸
 *
 *
 * 实验发现:
 * 1. 第一次对折产生头结点 "凹"
 * 2. 以后的每次对折，都是上层的结点不变，每个结点产生左右两个结点，左边是"凹", 右边是"凸"。
 *
 * 所以，对折完成就是一棵二叉树，每次对折，上层的每个结点都产生自己的两个孩子，左孩子是"凹"，右孩子是"凸"。从上往下打印的结果，就是这棵二叉树的中序遍历。
 *
 * N=1                           凹
 * N=2              凹                       凸
 * N=3         凹         凸            凹          凸
 * N=4      凹    凸    凹   凸       凹   凸     凹    凸
 *
 * 中序遍历即可得到 N 的答案的对应关系。
*/


/**
 * 二叉树折纸问题📄
 * @param N 折叠次数
 * @return {string[]} 打印的字符列表
 */
function microsoft_paper(N) {
  if (N === 0) {
    return [];
  }
  // 生成二叉树
  const head = generateTree("凹", N);
  // 中序遍历，结果保存到列表
  const chars = [];
  proc(head, chars);
  // 返回打印的字符列表
  return chars;
  
  function proc(node, array) {
    if (!node) {
      return;
    }
    proc(node.left, array);
    array.push(node.val);
    proc(node.right, array);
  }
}

/**
 *  以 str 为头结点的值，建出 N 层折纸二叉树。
 * @param {"凹"|"凸"} str 头结点的值
 * @param N 层级
 * @returns {TreeNode} N层折纸二叉树的头结点
 */
function generateTree(str, N) {
  const TreeNode = require('./TreeNode');
  const head = new TreeNode(str);
  if (N === 1) {
    // 只建 1 层，直接返回单个结点。
    return head;
  }
  // 建出左子树: 头结点是"凹"，层级是N-1
  head.left = generateTree("凹", N-1);
  // 建出右子树: 头结点是"凸"，层级是N-1
  head.right = generateTree("凸", N-1);
  // N 层二叉树建好了，返回头结点
  return head;
}

function main() {
  console.log(paper(3));
}

main();
