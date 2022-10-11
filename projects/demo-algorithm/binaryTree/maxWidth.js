/**
 * 求二叉树最宽的层有多少个结点
 *
 * 1               a
 * 2         b           c
 * 3     d     e       f   g
 * 4      h          i
 *
 * 返回 4，因为第 3 层有 4 个结点，是所有层中结点数量最多的。
 *
 * 思路:
 * 1. 在层序遍历的基础上，增加标识，以检查每一层是否结束。
 *
 * 实现:
 * 1. 准备两个变量: curEnd 代表本层的结尾结点，nextEnd 代表下层的结尾结点。
 * 2. 通过队列来实现层序遍历:
 *    当结点入队的时候，通过结点的 left,right 更新下层的结尾 (nextEnd)
 *    当结点出队的时候，通过 curEnd 检查是否是本层结尾，如果是，结算本层的结点数。
 * 3. 统计最大的结点数返回。
 *
 * 核心:
 * 1. 在遍历本层的时候，要准备下层的结尾(通过本层的left,right可以检查下一层)，不然到达下层的时候，就不知道是哪里结束了。
*/

/**
 * 求二叉树最宽的层有多少个结点
 * @param {TreeNode} head 二叉树的结点
 * @return {number} 最宽层的结点数量
 */
function maxWidth(head) {
  if (!head) {
    return 0;
  }
  let curEnd = null;   // TreeNode  本层结尾
  let nextEnd = null;  // TreeNode  下层结尾
  const queue = [];  // 用于层序遍历的队列
  let max = 0;  // 最宽的层的结点数
  let countInCur = 0;  // 某一层的结点数
  queue.unshift(head);
  curEnd = head;
  while (queue.length > 0) {
    // 弹出一个结点
    const pop = queue.pop();
    // 弹出就统计本层结点数
    countInCur++;
  
    // 不管弹出的是不是本层结尾，只要弹出结点有孩子，就要更新下一层的结尾。
    // 因为是从左到右层序遍历，所以先检查左孩子，再检查右孩子。
    if (pop.left) {
      nextEnd = pop.left;
      queue.unshift(pop.left);
    }
    if (pop.right) {
      nextEnd = pop.right;
      queue.unshift(pop.right);
    }
  
    if (pop === curEnd) {
      // 弹出的是本层结尾
      // 结算本层结点数
      max = Math.max(max, countInCur);
      // 本层结点数归零，准备给下层统计
      countInCur = 0;
      // 接下来要遍历下层，所以下层结点的结尾要替换到 curEnd 上
      curEnd = nextEnd;
      // 下层的结尾重新记录
      nextEnd = null;
    }
  }
  // 返回最宽的层的结点数
  return max;
}
