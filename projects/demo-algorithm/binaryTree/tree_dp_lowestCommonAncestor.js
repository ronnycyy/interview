/**
 * 剑指 Offer 68 - II. 二叉树的最近公共祖先
 * https://leetcode.cn/problems/er-cha-shu-de-zui-jin-gong-gong-zu-xian-lcof/description/
 *
   树形 dp 的套路解法:
 
   一、想问题
   以 x 为头的子树，找到的最低公共祖先是谁？
   
   二、讨论可能性
   1. x 不参与
   这种情况下，答案 ans 有以下情况:
   1.1  ans 在左树
   1.2  ans 在右树
   1.3  null (左右子树都没有答案)
   
   2. 在"x不参与"没有命中的情况下，考虑"x参与的情况"，这种情况下需要满足:
   2.1 子树findP && 子树findQ
   此时必然是左树一个，右树一个，在 x 处首次汇聚。答案 ans 就是 x。
   
   三、提取 Info 的属性
   1. 子树 findP ?
   2. 子树 findQ ?
   3. 子树有 ans ?
 *
*/

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
  return proc(root, p, q).ans;
};


// 后序遍历，返回 Info 给上级
function proc(x, p, q) {
  if (!x) {
    return new Info(null, null, null);
  }
  const leftInfo = proc(x.left, p, q);
  const rightInfo = proc(x.right, p, q);
  
  const findP = x === p || leftInfo.findP || rightInfo.findP;
  const findQ = x === q || leftInfo.findQ || rightInfo.findQ;
  let ans = null;
  if (leftInfo.ans) {
    ans = leftInfo.ans;
  }
  else if (rightInfo.ans) {
    ans = rightInfo.ans;
  }
  else {
    if (findP && findQ) {
      // 祖先不在左子树也不在右子树，但是子树发现了 p,q。
      // 那必然是:
      //   1. 一边一个
      //   2. x 是 p,q 中的一个
      // 这些情况祖先都是 x。
      ans = x;
    }
  }
  
  return new Info(findP, findQ, ans);
}

function Info(fp, fq, ans) {
  this.findP = fp;  // 子树是否发现过 p
  this.findQ = fq;  // 子树是否发现过 q
  this.ans = ans;   // 子树找到的最近公共祖先是谁
}

/**
 * 不用树形dp的解法:
 * 1. 遍历整棵树，建立<子,父>这张表 fatherMap。
 * 2. 从 p 通过 fatherMap 往上窜，直到 root, 把 p 的祖先全部放到 set 里。
 * 3. 从 q 通过 fatherMap 往上窜，每次往上之前都在 set 里找一下有没有一样的结点:
 *    如果有，这个结点就是 p,q 的最近公共祖先，直接返回。
 *    如果没有就继续往上，到达 root 还没有，返回 null。
*/
