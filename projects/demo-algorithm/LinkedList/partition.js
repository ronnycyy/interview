/**
 * 给你一个链表的头节点 head 和一个特定值 x, 请你对链表进行分隔，使得:
 * 1. 所有小于x的结点都在左边
 * 2. 所有等于x的结点都在中间
 * 3. 所有大于x的结点都在右边
*/
function partition(head, x) {}

// 方法一 (笔试)
// 把链表的所有结点都放到数组里, 在数组里玩 partition, 搞定以后再连起来。
function partition1(head, x) {}

// 方法二 (面试)
function partition2(head, x) {
  // 1. 定义分区
  let sH = null;  // 小头
  let sT = null;  // 小尾
  let eH = null;  // 等头
  let eT = null;  // 等尾
  let mH = null;  // 大头
  let mT = null;  // 大尾
  let next = null;
  
  // 2. 结点分区
  while (head) {
    // 抓一下 next 结点
    next = head.next;
    // next 置为空
    head.next = null;
    // 每个结点按值分区
    if (head.val < x) {
      // 结点值小于 x
      if (sH === null) {
        // `小于区`没有结点进来过
        sH = head;
        sT = head;
      } else {
        // `小于区`有结点了，连接新结点，小尾指向最后一个结点
        sT.next = head;
        sT = head;
      }
    }
    else if (head.val === x) {
      // 结点值等于 x
      if (eH === null) {
        eH = head;
        eT = head;
      } else {
        eT.next = head;
        eT = head;
      }
    }
    else {
      // 结点值大于 x
      if (mH === null) {
        mH = head;
        mT = head;
      } else {
        mT.next = head;
        mT = head;
      }
    }
    // 下一个结点
    head = next;
  }
  
  // 3. 连接分区
  // 小于区域的尾 连接 等于区域的头，等于区域的尾 连接 大于区域的头。
  if (sT) {
    // 有小于区域
    // 小尾指向等头，不用管`等头`有没有。
    sT.next = eH;
    // 谁去连`大于区域的头`，谁就变成 eT
    eT = eT === null ? sT : eT;
  }
  // 如果有等于区域，eT 是等尾
  // 如果无等于区域，eT 是小尾
  // eT 变成尽量不为空的指针
  if (eT !== null) {
    // eT 不为空，连上`大头`
    eT.next = mH;
  }
  // 如果`小于区域`不为空，就返回小头
  // 如果`小于区域`为空，`等于区域`不为空，就返回`等头`
  // 如果`小于区域`为空，`等于区域`为空，就返回`大头`
  return sH !== null ? sH : (eH !== null ? eH : mH);
}
