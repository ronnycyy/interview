/**
 * 上移
 * 步骤: 从叶子开始往上窜, 直到到达根，或者不大于父，停。
 * 场景: 用户新加一个结点到大根堆的叶子。
 * 
 * @param {number[]} arr 数组作为堆
 * @param {number} i 从 i 位置开始，不断地往上窜
 */
function heapInsert(arr, i) {
  while (i > 0 && arr[i] > arr[Math.floor((i - 1) / 2)]) {
    const parentIndex = Math.floor((i - 1) / 2);
    swap(arr, i, parentIndex);
    i = parentIndex;
  }
}
/**
 * 下沉
 * 步骤: `左右孩子中取较大的那个`和新堆顶PK, 如果孩子赢了，孩子往上, 新堆顶往下沉。循环这个过程。
 * 场景: 堆顶和堆的最后一个结点交换，堆size--，把旧堆顶返回给用户，新堆顶往下沉，维持大根堆。
 * 
 * @param {number[]} arr 数组作为堆
 * @param {number} i 从 i 位置开始，不断地下沉
 * @param {number} size 堆的尺寸
 */
function heapify(arr, i, size) {
  // 1. 越界的孩子就不要了
  // 2. `左右孩子中取较大的那个`和新堆顶PK, 如果孩子赢了，新堆顶就往下。循环这个过程。
  let left = i * 2 + 1;
  // 如果左孩子越界了，那么右孩子必越界，就不用比较了
  while (left < size) {
    // 左孩子不越界，但右孩子可能会越界🤔
    // 左右孩子中较大的那个的索引
    let largestIndex = (left + 1 < size && arr[left + 1] > arr[left]) ? left + 1 : left;
    // i位置新堆顶PK，得到最大的那个的索引
    largestIndex = arr[largestIndex] > arr[i] ? largestIndex : i;
    // i位置新堆顶已经是最大的了，不用往下沉了
    if (largestIndex === i) {
      break;
    }
    // 往下沉
    swap(arr, largestIndex, i);
    // 最大索引处此时保存着新堆顶的值，所以指针来到最大索引的左孩子处
    i = largestIndex;
    // 继续以 i 为堆顶往下检查
    left = i * 2 + 1;
  }
}
// 交换堆的两个结点
function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

class Heap {
  constructor(type) {
    this.nodes = [];
    this.type = type === 0 ? 0 : 1;  // 0:小根堆  1:大根堆
  }
  
  isEmpty() {
    return this.nodes.length === 0;
  }
  
  // 返回堆顶，但是不弹出
  peek() {
    return this.nodes.length > 0 ? this.nodes[0] : null;
  }

  // 每加入一个新结点，就 heapInsert 一次
  add(value) {
    this.nodes.push(value);
    const arr = this.nodes;
    let i = arr.length > 0 ? arr.length - 1 : 0;
    while (i > 0 && this.exceedParent(i)) {
      let parentIndex = Math.floor((i - 1) / 2);
      this.swap(arr, i, parentIndex);
      i = parentIndex;
    }
  }
  
  // i 是否赢过父级
  exceedParent(i) {
    const arr = this.nodes;
    return this.type === 1 ? arr[i] > arr[Math.floor((i - 1) / 2)] : arr[i] < arr[Math.floor((i - 1) / 2)];
  }
  
  // i是否赢过j
  win(i, j) {
    const arr = this.nodes;
    return this.type === 1 ? arr[i] > arr[j] : arr[i] < arr[j];
  }
  
  // 堆的大小
  getSize() {
    return this.nodes ? this.nodes.length : 0;
  }

  // 将堆顶和最后一个数交换，新堆顶 heapify, 弹出旧堆顶
  poll() {
    if (this.nodes.length === 0) {
      throw new Error('overflow');
    }
    
    const arr = this.nodes;
    const lastIndex = arr.length - 1;
    const old = arr[0];

    this.swap(arr, 0, lastIndex);
    arr.splice(lastIndex, 1);

    let i = 0;
    let left = i * 2 + 1;
    while (left < lastIndex) {
      let bestIndex = (left + 1 < lastIndex && this.win(left+1, left)) ? left + 1 : left;
      bestIndex = this.win(bestIndex, i) ? bestIndex : i;
      if (bestIndex === i) {
        break;
      }
      this.swap(arr, bestIndex, i);
      i = bestIndex;
      left = i * 2 + 1;
    }
    
    return old;
  }

  print() {
    console.log(this.nodes);
  }

  swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

module.exports = Heap;

function main() {
  const heap = new Heap(0);
  heap.add(8);
  heap.add(1);
  heap.add(10);
  heap.add(3);
  heap.add(6);
  heap.add(16);
  heap.add(100);
  heap.add(92);
  heap.poll();
  heap.poll();
  heap.print();
}

// main();

