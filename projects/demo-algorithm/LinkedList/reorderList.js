/**
 * 重排链表
 * https://leetcode.cn/problems/reorder-list/
 *
 * 给定一个单链表 L 的头节点 head ，单链表 L 表示为:
 * L0 → L1 → L2 -> … -> Ln-2 → Ln-1 → Ln
 *
 * 请将其重新排列后变为:
 * L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → … (到达链表中点)
 *
 * 注意:
 * 不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。
*/

// 方法
// 1. 找到链表的中点 (奇数找到中点，偶数找到上中点)
// 2. 从中点开始，后面的结点全部反转，中点的 next 指向 null
// 3. 设置 L,R 指向头尾，分别从两头开始往中间走
// 4. 每走一步:
//  4.1 Li改成指向Ri，然后L走到Li+1;
//  4.2 Ri改成指向Li+1，然后R走到R-1。
// 这样就形成了 L0->Ln->L1->Ln-1->... 的螺旋指针，L和R有一个到达 null 了就停，调整完成。
function reorderList(head) {
  if (!head || !head.next) {
    return;
  }
  // 1.找到链表中点
  let c1 = head;
  let c2 = head;  // 指向中点
  while (c1 && c1.next && c1.next.next) {
    c1 = c1.next.next;
    c2 = c2.next;
  }
  // 2.从中点开始，后面的结点全部反转，中点的 next 指向 null
  c1 = c2.next;
  c2.next = null;
  let pre = c2;
  while (c1) {
    // 抓一下
    const next = c1.next;
    // 往前指
    c1.next = pre;
    // 两个指针都往前走
    pre = c1;
    c1 = next;
  }
  // 3. L,R 从两头往中间走, 每走一步就调整一下，形成螺旋指针
  let L = head;
  let R = pre;
  // 有一个走到 null 了就停
  while (L && R) {
    // Li->Ln
    const nextL = L.next;
    L.next = R;
    L = nextL;
    // Ln->Li+1
    const nextR = R.next;
    R.next = L;
    // R:Ln-1
    R = nextR;
  }
}

function main() {
  const ListNode = require('./ListNode');
  const node = new ListNode(10);
  node.next = new ListNode(21);
  node.next.next = new ListNode(30);
  node.next.next.next = new ListNode(20);
  node.next.next.next.next = new ListNode(11);
  reorderList(node)
  console.log(node);
}

main();
