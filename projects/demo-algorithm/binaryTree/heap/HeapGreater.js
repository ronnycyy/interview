/**
 * 加强堆
 *
 * 增加的功能:
 * 1. 通过 node 反向查询它在堆中的位置，也就是在数组中的索引。
*/

// 如果有基础类型的需求，就让 node 包一层 Inner, 从而拥有独立的内存地址。
class Inner {
  constructor(v) {
    this.value = v;
  }
}

// T 仅支持非基础类型
class HeapGreater {
  constructor(c) {
    // 存储结点 <T>
    this.heap = [];
    // 反向索引表 <T, number>:  结点->在堆中的位置(结点在数组中的索引)
    this.indexMap = new Map();
    // 堆的大小
    this.heapSize = 0;
    // 比较器
    this.comp = c;
  }
  
  // 堆是否为空
  isEmpty() {
    return this.heapSize === 0;
  }
  
  // 堆的大小，使用 getter, 通过 instance.size 直接拿
  get size() {
    return this.heapSize;
  }
  
  // 查询堆中是否含有 node
  // java的原生堆需要遍历才能找到 node，而加强堆可以通过反向索引表。
  contains(node) {
    return this.indexMap.has(node);
  }
  
  // 返回堆顶，但是不弹出
  // 使用前需调用 isEmpty 进行检查，确保堆不为空。如果不先检查导致程序出错了，那是你活该。
  peek() {
    return this.heap[0];
  }
  
  // 加入一个新的 node
  push(node) {
    // 加到堆里
    this.heap.push(node);
    // `反向索引表`记录 node 在堆中的位置
    this.indexMap.set(node, this.heapSize);
    // node 往上窜，但凡有位置的交换，就有`反向索引表`的调整
    this.heapInsert(this.heapSize++);
  }
  
  // 弹出堆顶, 返回给用户
  // 使用前需调用 isEmpty 进行检查，确保堆不为空。如果不先检查导致程序出错了，那是你活该。
  pop() {
    // 取得堆顶
    const top = this.heap[0];
    // 把堆的最后一个结点和堆顶交换，期间更新`反向索引表`
    this.swap(0, this.heapSize-1);
    // 删除`反向索引表`中的 `top结点` 这一项
    this.indexMap.delete(top);
    // 经过交换，此时 top 的索引位置一定是最后的位置，把 top 从堆中去除。
    this.heap.splice(--this.heapSize, 1);
    // 0 位置是新换过来的，现在需要把结点调整成大根堆，所以从 0 位置开始往下调整。
    this.heapify(0);
    // 返回堆顶给用户
    return top;
  }
  
  // 移除 node 结点
  // O(logN) 非常高效🔥
  remove(node) {
    // 不需要用遍历去找 node 的位置, 避免了 O(N) 的时间复杂度
    // 拿到`node`和`末尾结点`
    // 移除末尾
    const last = this.heap[this.heapSize-1];
    const index = this.indexMap.get(node);
    this.indexMap.delete(node);
    this.heap.splice(--this.heapSize, 1);
    
    // 新换过来的结点可能要往上，也可能要往下，所以 heapInsert, heapify。
    // 如果删的就是最后一个结点，那就不用`交换`、heapInsert 或 heapify 了。
    if (node !== last) {
      // 把`末尾结点`放到`node`的位置
      this.heap[index] = last;
      // 记录`末尾结点`的索引
      this.indexMap.set(last, index);
      // 以空降的结点开始，重新调整堆
      this.resign(last);
    }
  }
  
  // 以 node 结点为出发点，重新调整堆
  // 场景是: node 用于比较的属性(如id,age,score)变化了，所以要重新调整堆
  resign(node) {
    // 指标要么变大，要么变小，所以 heapInsert 和 heapify 只会发生一个。
    // 往上调整
    this.heapInsert(this.indexMap.get(node));
    // 往下调整
    this.heapify(this.indexMap.get(node));
  }
  
  // 返回堆上的所有元素
  getAllElements() {
    return JSON.parse(JSON.stringify(this.heap));
  }
  
  // 往上窜
  // 从 index 位置开始往上调整，有交换时更新`反向索引表`
  // O(logN)
  heapInsert(index) {
    // 不断地用 index结点 和 它的父结点 比较
    while ( index > 0 && this.isBetter(index, Math.floor((index-1)/2)) ) {
      const parentIndex = Math.floor((index-1)/2);
      // 交换 index结点 和 父结点
      this.swap( index, parentIndex );
      // 往上窜
      index = parentIndex;
    }
  }
  
  // 往下沉
  // 从 index 位置开始往下调整，有交换时更新`反向索引表`
  // O(logN)
  heapify(index) {
    // 找到 index 和 左右孩子 中 `最优` 的那个结点 best, index 和 best 交换，循环这个过程，index 持续下沉。
    let left = index * 2 + 1;
    while (left < this.heapSize) {
      // 找最优孩子
      // 右孩子不越界 并且 右孩子优于父结点，那就是右孩子，否则是左孩子。
      let best = left+1 < this.heapSize && this.isBetter(left+1, left) ? left+1 : left;
      // 最优孩子和父结点比较，找到最优结点
      best = this.isBetter(best, index) ? best : index;
      if (best === index) {
        // 最优结点就是父结点，不用往下沉了，结束。
        break;
      }
      // 交换父结点(index)和最优结点
      this.swap(best, index);
      // index 来到最优位置，继续往下检查
      index = best;
      left = index * 2 + 1;
    }
  }
  
  // i 是否优于 j, 也就是说，i 是否应该在 j 上面
  isBetter(i, j) {
    // 通过用户提供的 comp 来比较，可能是通过属性比较，比如 id,age,score 等。如果结果小于 0，说明`i胜出`。
    return this.comp.compare(this.heap[i], this.heap[j]) < 0;
  }
  
  // 交换堆中两个 node 的位置, 同时更新反向索引表
  swap(i, j) {
    const n1 = this.heap[i];
    const n2 = this.heap[j];
    this.heap[i] = n2;
    this.heap[j] = n1;
    this.indexMap.set(n1, j);
    this.indexMap.set(n2, i);
  }
}
