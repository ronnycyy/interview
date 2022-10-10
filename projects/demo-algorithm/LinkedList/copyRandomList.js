/**
 * 复制带随机指针的链表
 * https://leetcode.cn/problems/copy-list-with-random-pointer/
*/

function Node(val, next, random) {
  this.val = val;
  this.next = next;
  this.random = random;  // 随机指向链表中的某个结点，可能指向自己，也可能指向空。
}

// 方法一
// 1. 准备一个 Map, 遍历链表，把`原结点`依次 set 进去，set 的时候 new 出克隆结点。如 1->1', 2->2', 3->3'。
// 2. 遍历这个 Map, 每个`原结点`找到自己的`克隆结点`，然后`原结点`的 next, random 通过 Map 找到`克隆结点`的 next, random 结点，
//    `克隆结点`连好 next 和 random 结点，如 1.next=2 对应 1'.next=2', 1.random=3 对应 1'.random=3'。
// 3. 返回`克隆结点`的头，算法执行完毕。
// 时间复杂度 O(N)
// 空间复杂度 O(N), N 是结点数量
function copyRandomList1(head) {
  if (!head) {
    return null;
  }
  const map = new Map();
  
  let cur = head;
  while (cur) {
    map.set(cur, new Node(cur.val, null, null));
    cur = cur.next;
  }
  
  map.forEach((cloneNode, oldNode, m) => {
    cloneNode.next = oldNode.next ? m.get(oldNode.next) : null;
    cloneNode.random = oldNode.random ? m.get(oldNode.random) : null;
  });
  
  return map.get(head);
}

// 方法二  时间O(N) 空间O(1)
// 1.遍历链表，每一步都生成克隆结点，插在原结点中间。
// 2.再遍历一次，一对一对地，设置克隆结点的 random: `原结点`的 random 的 next, 就是`克隆结点`的 random 结点。
// 3.用一个新指针指向克隆结点的头，把原结点的 next 和克隆结点的 next 拆开，返回新指针。
// 形成的结构是:
// 1->2->3->4->null
// 1->1'->2->2'->3->3'->4->4'->null
function copyRandomList2(head) {
  if (!head) {
    return null;
  }
  let cur = head;
  // 1.遍历链表，每一步都生成克隆结点，插在原结点中间。
  while (cur) {
    // 生成克隆结点，插到原结点中间，如 生成 1', 然后 1->1'->2。
    const next = cur.next;
    const clone = new Node(cur.val, null, null);
    cur.next = clone;
    clone.next = next;
    cur = next;
  }
  cur = head;
  // 2.再遍历一次，`一对一对`地设置克隆结点的 random: `原结点`的 random 的 next, 就是`克隆结点`的 random 结点。
  while (cur && cur.next) {
    const clone = cur.next;
    clone.random = cur.random ? cur.random.next : null;
    cur = clone.next;
  }
  // 3.用一个新指针指向克隆结点的头，把原结点的 next 和克隆结点的 next 拆开，返回新指针。
  const cloneHead = head.next;
  cur = head;
  while (cur && cur.next) {
    const clone = cur.next;
    // `原结点`连上`克隆结点`后面的结点
    cur.next = clone.next;
    // 游标到达下一个`原结点`
    cur = clone.next;
    // cur, cur.next 一定有，但是现在是 cur.next.next, 可能没有，所以要判断一下。
    clone.next = cur ? cur.next : null;
  }
  return cloneHead;
}
