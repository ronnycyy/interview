/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

// 小根堆，一种完全二叉树，任意一棵子树，假设以 x 为头，x 都是子树结点中最小的。

// 用一个数组，代表堆结构
type Heap = Array<Node>;
// 堆结点就是 Scheduler 的任务
type Node = {|
  id: number,
    sortIndex: number,
|};

export function push(heap: Heap, node: Node): void {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

// 返回堆顶，但不弹出
export function peek(heap: Heap): Node | null {
  return heap.length === 0 ? null : heap[0];
}

// 弹出堆顶并返回，把数组末尾的结点放到堆顶，然后 heapify 恢复成小根堆
export function pop(heap: Heap): Node | null {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    // 把堆的最后一个结点放到堆顶，往下窜，恢复成小根堆
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  // 返回堆顶给用户
  return first;
}

// heapInsert 过程:  新加入一个结点，往上看自己的父，如果比父小，就和父交换，一路窜上去，直到父比自己小，或者到达小根堆顶。
function siftUp(heap, node, i) {
  let index = i;
  while (index > 0) {
    // 找到父
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    // 子往上窜，如果子比父小，就把子放上去，把父换下来。
    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

// heapify: 新结点在堆顶，往下窜恢复成小根堆
function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // If the left or right node is smaller, swap with the smaller of those.
    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
