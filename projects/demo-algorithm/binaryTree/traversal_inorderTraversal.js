/**
 * 非递归中序遍历
 * 1. 准备一个栈。
 * 2. 设置一个 cur, 从头结点开始，遍历左边界，cur 随之移动，把整条左边界放进栈里。
 * 3. cur 到达 null 时，栈弹出一个结点，cur 来到这个结点右边的位置，把弹出结点左边界压入栈。
 * 4. 只要 cur 遇到 null, 栈就弹出，弹出就打印, 打印完 cur 来到弹出结点的右孩子，继续压入整条左边界。
 * 5. 栈不为空或cur不为null，就说明还有结点要遍历，cur 要继续检查下去。
 *
 * 原理:
 * 1. 整棵二叉树树可以由`左边界`分解掉，无论什么奇形怪状的树都可以，cur 的作用就是遍历所有的左边界。
 * 2. 整条左边界压到栈里去了，弹出顺序就是: 左->..->头，如 d,c,b,a。
 *    弹出d, cur来到d的右孩子上，从右孩子开始的左边界被压入栈里，这时候就有一个现象: 如果不把d的右孩子的左边界弹完，是不会到c的。
 *    所以，对于 c 来说，必须把左子树处理完(d为头的子树)，才能到 c，然后到 c 的右子树，也就是`左头右`，中序。
 *    再往上走，对于 b 也是，对于 a 也是，于是整体来说，就是`左头右`，中序遍历。
 *
 * @param root 二叉树头结点
 * @return {number[]} 元素值
 */
function traversal_inorderTraversal(root) {
  if (!root) {
    return [];
  }
  const stack = [];
  const ans = [];
  let cur = root;
  while (stack.length > 0 || cur !== null) {
    // 弹出左边界时，有可能把栈弹空，但是弹出结点的右孩子可能存在，所以要加一个 cur !== null 继续循环。
    if (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    } else {
      // cur 来到 null, 整条左边界已经压入栈中
      // 弹出一个结点
      cur = stack.pop();
      // 处理
      ans.push(cur.val);
      // cur 来到弹出结点右边的位置
      cur = cur.right;
    }
  }
  return ans;
}


