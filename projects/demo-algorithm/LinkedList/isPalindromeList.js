/**
 * 给定一个链表的头结点head, 请判断该链表是否是回文结构
 *
 * 1->2->3->2->1 是回文
 * 1->2->2->1 是回文
 * 1->2->2 不是回文
 * 2->1 不是回文
 * 1-2->3->3->2->1 是回文
 * 1->20->3->2->0->1 不是回文
 * 1->20->3->20->1 是回文
 *
 * @param {ListNode} head  链表头结点
 * @return {boolean} isPalindrome 是否回文
 */
function isPalindromeList(head) {}

// 方法二 (面试，和面试官聊)
// 1. 找到链表的中点: 如果是奇数返回`中点`，如果是偶数返回`上中点`。
// 2. 从中点开始，中点指向 null, 右半部分的指针往回指。
// 3. 设置 L,R 指针分别指向头尾，两边同时往中间遍历直到有一个到达 null。如果每一步的值都一致，那就是回文; 如果有某一步不一致，那就不是回文。
// 4. 在返回结果之前，把右半部分的指向调整回来。
// 时间复杂度: O(N)
// 空间复杂度: O(1)  只用了有限的几个变量，没有用容器
function isPalindromeList2(head) {
  if (!head) {
    // https://leetcode.cn/problems/palindrome-linked-list-lcci/
    // 认为空链表是 true, 这个看题目就行
    return true;
  }
  let c1 = head;
  let c2 = head;   // 找中点
  while (c1 && c1.next && c1.next.next) {
    c1 = c1.next.next;
    c2 = c2.next;
  }
  let middle = c2;  // 记录一下中点的位置
  // 右半部分
  c1 = c2.next;
  // 中点指向 null
  c2.next = null;
  // 往回的指针
  let pre = c2;
  // 右半部分往回指
  while (c1) {
    // 抓一下
    const next = c1.next;
    // 往回指
    c1.next = pre;
    // 遍历右半部分
    pre = c1;
    c1 = next;
  }
  // 右半部分反转完成
  // c1 从尾开始
  c1 = pre;
  // c2 从头开始
  c2 = head;
  let isPalindrome = true;
  // 两个指针往中间走，直到有一个到达 null 停
  while (c1 && c2) {
    if (c1.val !== c2.val) {
      // 但凡有一个不一样，就不是回文;
      // 每一个都一样，回文
      isPalindrome = false;
      break;
    }
    c1 = c1.next;
    c2 = c2.next;
  }
  // 在返回之前，把右半部分调整回来。
  // 用 c1 当 cur
  c1 = pre;
  // pre 从 null 开始
  pre = null;
  // 到达中点位置就停
  while (c1 !== middle) {
    // 抓一下
    const next = c1.next;
    // 往回指
    c1.next = pre;
    // 往中间走
    pre = c1;
    c1 = next;
  }
  // c1 已经到达 middle, c1.next 连上右半部分，还原链表
  c1.next = pre;
  // 返回`是否是回文`这个结果
  return isPalindrome;
}

// 方法一 (笔试)
// 1. 准备一个栈，遍历链表，把结点放到栈里
// 2. 再遍历一遍链表，每走一步从栈里弹出一个来比较，如果每一步都一样，那就是回文
// 原理:
// 由于栈弹出顺序是链表的逆序，所以如果链表是回文，那么弹出的每一个结点值都会和链表正序的结点值一样。
// 方法论:
// 如果是笔试，就用这个方法!! 因为这样是最快的! 赶紧到下一道题!🔥
// 时间复杂度: O(N)
// 空间复杂度: O(N)  用了一个`和链表同等规模`的栈
function isPalindromeList1(head) {
  if (!head) {
    return true;
  }
  let cur = head;
  const stack = [];
  while (cur) {
    stack.push(cur);
    cur = cur.next;
  }
  cur = head;
  while (cur) {
    const p = stack.pop();
    if (p.val !== cur.val) {
      return false;
    }
    cur = cur.next;
  }
  return true;
}

function main() {
  const ListNode = require('./ListNode');
  const node = new ListNode(1);
  node.next = new ListNode(2);
  node.next.next = new ListNode(3);
  node.next.next.next = new ListNode(2);
  node.next.next.next.next = new ListNode(1);
  console.log(isPalindromeList2(node));
}

main();
