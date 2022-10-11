/**
 * 给你一棵二叉树的某个结点，返回该结点的后继结点。
 *
 * 啥叫后继结点？
 * 一棵二叉树的中序遍历中，一个结点的下一个结点，就是后继结点。
 *
 * 比如这棵二叉树:
 *       a
 *    b     c
 *  d  e   f
 *
 * 中序遍历的结果是 [d,b,e,a,f,c],  e 的后继结点就是 a。
 *
 *
 * 方法一
 * 就用中序遍历，结果存到数组里，找到目标结点的下一个结点，返回。
 * 这样一来，时间复杂度就是 O(N), N 是结点的数量。
*/

function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
  this.parent = null;  // 多了一个父指针
}

function b() {}
