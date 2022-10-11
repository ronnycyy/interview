// 力扣431: Encode N-ary Tree to Binary Tree
// 将N叉树编码为二叉树

/**
 * 定义一个结点
 * @param {number} val 结点值
 * @param {Node[]} children 孩子结点数组
 * @constructor 结点构造函数
 */
function Node(val, children) {
  this.val = val;
  this.children = children;
}

/**
 * 定义一个二叉树结点
 * @param {number} val 结点值
 * @constructor 二叉树结点构造函数
 */
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

/**
 * 您的 Codec 类将被调用如下:
 * const codec = Codec();
 * codec.decode(codec.encode(root));
 */
class Codec {
  constructor() {
  }
  
  /**
   * 将 一棵N叉树 序列化为 一棵二叉树
   * @param {Node|null} root
   * @return {TreeNode|null}
   */
  encode = function(root) {
    if (!root) {
      return null;
    }
    // N叉树的头结点，一定是二叉树的头结点
    const head = new TreeNode(root.val);
    // 头结点的所有孩子往`头结点的左树右边界`上挂
    head.left = en(head.children);
    // 返回二叉树的头结点
    return head;
    
    /**
     * 用`N叉树的孩子结点们`建出`一个二叉树的右边界`
     *
     *             a
     *    b        c      d
     *  e  f    g  h  i
     *
     *
     *                     a
     *              b
     *         e       c
     *           f   g   d
     *                 h
     *                  i
     *
     *  拿 a 的子结点 [b,c,d] 来说，先把 b这棵子树b->e->f->null 都连好，再去处理 c这棵子树(c->g->h->i)。
     *
     * @param {Node[]} children N叉树的多个结点组成的数组
     * @return {TreeNode} head 二叉树的头结点
     */
    function en(children) {
      let head = null;
      let cur = null;
      for (let i = 0, len = children.length; i < len; i++) {
        // 把N叉树的孩子结点逐一取出
        const child = children[i];
        // 每个`N叉树的孩子结点`实例化成`二叉树的结点`
        const tNode = new TreeNode(child.val);
        if (head === null) {
          // 把第一个孩子结点设置为 head
          head = tNode;
        } else {
          // 不是第一个孩子，就挂在前一个孩子的右孩子上
          cur.right = tNode;
        }
        // 指针指向当前二叉树的结点
        cur = tNode;
        // 深度优先遍历
        // 二叉树的右子树已经建立好
        // 孩子的孩子，用于建立`二叉树的左子树`
        cur.left = en(child.children);
      }
      // 返回这棵`只有右边界的二叉树`
      return head;
    }
  };
  
  /**
   * 用一个二叉树的头结点 反序列化 出 一棵N叉树，返回 N叉树的头结点。
   *
   * @param {TreeNode|null} root 二叉树头结点
   * @return {Node|null} N叉树的头结点
   */
  decode = function(root) {
    if (!root) {
      return null;
    }
    // 二叉树头结点左子树的右边界，就是 N叉树结点的孩子们，所以就这么实例化。
    return new Node(root.val, de(root.left));
  
    /**
     * head 在"反序列化后的N叉树孩子列表"中是长兄，它要把它的兄弟们(二叉树，左树右边界)，都搞成一个列表(全部是"N叉树结点")，然后返回给它的父(也是"N叉树结点")。
     *
     * @param {TreeNode} head 二叉树，左树右边界的头结点，反序列化后是"N叉树孩子结点长兄"
     * @return {Node[]} 处理完整条右边界得到的"N叉树的孩子结点列表"
     */
    function de(head) {
      const children = [];  // Array<Node>
      // 遍历整条二叉树的右边界
      while (head) {
        // 遍历二叉树的这条右边界, 右边界上的结点，就是 N叉树上的兄弟结点:
        // 1. 从二叉树的兄弟结点，建立N叉树结点
        // 2. 建立好之后，都放到 children 里等待被返回。
        
        // 要建立某个二叉树结点的N叉树结点，这个N叉树结点的孩子们，在它左树的右边界上，把你自己的孩子们搞定，再和兄弟们会合。
        // 递归: 等待我的左树右边界反序列化完毕，给我返回"N叉树孩子列表"。
        const node = new Node(head.val, de(head.left));
        // 建立好了放到数组里，等待被返回
        children.push(node);
        // 我的兄弟都在我的右侧，我要把它们都反序列化成"N叉树结点"，所以一直往右走。
        head = head.right;
      }
      return children;
    }
  };
}


