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
 *
 * 方法二
 * 看结点有没有右孩子:
 *   如果有，返回右孩子的左边界最左的结点;
 *   如果没有，往上找父级:
 *      如果本结点是父的左孩子，返回父;
 *      如果不是，查看父的父，同时指针往上移，直到找到"指针所指的结点是父的左孩子"，返回父。
 *      如果找到根了还不满足，就返回 null。
*/

function Node(val) {
  this.val = val;
  this.left = null;
  this.right = null;
  this.parent = null;  // 多了一个父指针
}

// 1. 找到 head
// 2. 从 head 开始中序遍历形成一个列表，找 node 的 下一个结点返回
// 时间复杂度 O(N)
function ways1(node) {
  const list = [];
  let head = node;
  // 找到根结点
  while (head.parent) {
    head = head.parent;
  }
  // 中序遍历，把结点都放进列表里
  proc(head, list);
  // 遍历中序列表，找到当前结点的下一个结点，就是后继结点
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i] === node) {
      return i+1 < len ? list[i+1] : null;
    }
  }
  return null;
  // 中序遍历递归实现
  function proc(cur, array) {
    if (!cur) {
      return;
    }
    proc(cur.left, list);
    array.push(cur);
    proc(cur.right, list);
  }
}


function ways2(node) {
  if (!node) {
    return null;
  }
  // 有右孩子，返回右孩子的左边界的最左结点
  if (node.right) {
    let cur = node.right;
    while (cur.left) {
      cur = cur.left;
    }
    return cur;
  }
  // 无右孩子，往上找
  let parent = node.parent;
  let cur = node;
  // 直到找到 "子是父的左孩子", 停🤚，返回父结点
  // 或者找到父结点是 null 了停
  while (parent !== null && cur !== parent.left) {
    cur = parent;
    parent = parent.parent;
  }
  // cur 是 parent 的 left
  return parent;
}

function main() {
  const head = new Node(1);
  head.left = new Node(2);
  head.right = new Node(3);
  head.left.parent = head;
  head.right.parent = head;
  head.left.left = new Node(4);
  head.left.right = new Node(5);
  head.left.left.parent = head.left;
  head.left.right.parent = head.left;
  head.left.right.left = new Node(6);
  head.left.right.left.parent = head.left.right;
  head.left.right.left.right = new Node(7);
  head.left.right.left.right.parent = head.left.right.left;
  
  const target = head;
  const n1 = ways1(target);
  console.log(n1.val);
  const n2 = ways2(target);
  console.log(n2.val);
}

main();
