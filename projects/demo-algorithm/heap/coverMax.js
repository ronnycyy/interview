/**
 * 最大线段重合问题 (用堆的实现)
 * 给定很多线段，每个线段都有两个数组 [start,end], 表示线段开始位置和结束位置, 左右都是闭区间。
 *
 * 规定:
 * 1. 线段的开始和结束位置一定都是整数值
 * 2. 线段重合区域的长度必须 >= 1
 *
 * 返回:
 * 最多重合的线段数量。
*/

/**
 * 思路:
 *
 * 方法一(暴力解)
 * 1. 找到所有线段start中的最小值min，以及所有线段end中的最大值max，那么所有线段都会坐落在[min,max]上。
 * 2. 从 min 开始，每隔 0.5 定一个坐标点 p, 算出有多少重合线段数盖住了 p 得到一个重合线段数量，直到把 p 定到 max, 返回所有重合线段数量中最大的数量。
 * 时间复杂度:
 * 有 O(max-min) 个数量级的 0.5, 每次到达一个 0.5, 都要遍历所有的线段(N条)，统计有多少条线段包含了这个 0.5，所以时间复杂度是 O((max-min)*N)。
 * 笔试中从数据规模推测能否Accept:
 * 1. 我们知道指令条数不超过 10^8 的就能过，那么如果 max-min 是 10^2, 而线段条数 N 是 10^4, 根据时间复杂度一综合得到 10^2*10^4 = 10^6 < 10^8, 所以即使是这样的矬办法，在这种数据量的情况下，笔试也是能过的。
 * 2. 面试不同，面试官可能临时调整数据规模，这时候就要考虑别的办法。
 *
 * 方法二
 * 1. 把所有的线段，按照 start 位置从小到大排序。(同样的 start, end 顺序不一定)
 * 2. 准备一个小根堆，用于存放线段的 end。
 * 3. 按顺序遍历线段，拿出该线段的 start 和 end，让小根堆把 <= start 的数都弹出去，然后把 end 放入小根堆。(移走不重合的)
 * 4. 任意遍历的时刻，小根堆里有几个数，就是遍历到的当前线段和其他线段重合的线段数。
 * 5. 最后，每次把小根堆的`有几个数`记录一下，保留着最大值到最后返回，就是答案。
 * 时间复杂度:
 * 所有线段的 end 进 1 次小根堆，出 1 次小根堆，每次进出小根堆的调整代价是 O(logN), 所以综合起来的时间复杂度是 O(N*logN)。
 *
*/

const Heap = require('./heap');

class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

// 方法一(暴力解)
function maxCover1(m) {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  let maxCount = 0;
  for (let i = 0; i < m.length; i++) {
    const l = new Line(m[i][0], m[i][1]);
    min = Math.min(min, l.start);
    max = Math.max(max, l.end);
  }
  for (let p = min + 0.5; p < max; p += 0.5) {
    let count = 0;
    for (let i = 0; i < m.length; i++) {
      const l = new Line(m[i][0], m[i][1]);
      if (l.start < p && l.end > p) {
        count++;
      }
    }
    maxCount = Math.max(maxCount, count);
  }
  return maxCount;
}

// 方法二
function maxCover2(m) {
  const lines = [];
  for (let i = 0; i < m.length; i++) {
    lines.push(new Line(m[i][0], m[i][1]));
  }
  lines.sort((a, b) => a.start - b.start);
  const minHeap = new Heap(0);
  
  let maxCount = 0;
  for (let i = 0, len = lines.length; i < len; i++) {
    const l = lines[i];
    while (!minHeap.isEmpty() && minHeap.peek() <= l.start) {
      minHeap.poll();
    }
    minHeap.add(l.end);
    maxCount = Math.max(maxCount, minHeap.getSize());
  }
  
  return maxCount;
}

// 产生 [0,N] 条的范围在 [L,R] 的 线段
function generateLines(N, L, R) {
  const size = Math.floor(Math.random() * N) + 1;
  const ans = Array(size).fill(0).map(_ => Array(2).fill(0));  // size 行 2 列的矩阵，也就是 [start,end] 这样的线段集。
  for (let i = 0; i < size; i++) {
    let a = L + Math.floor(Math.random() * (R - L + 1));
    let b = L + Math.floor(Math.random() * (R - L + 1));
    if (a === b) {
      b = a + 1;
    }
    ans[i][0] = Math.min(a, b);
    ans[i][1] = Math.max(a, b);
  }
  return ans;
}

function main() {
  // 对数器
  console.time('test time');
  const N = 100;
  const L = 0;
  const R = 200;
  const testTimes = 10000;
  
  for (let i = 0; i < testTimes; i++) {
    const lines = generateLines(N, L, R);
    const ans1 = maxCover1(lines);
    const ans2 = maxCover2(lines);
    // const ans3 = maxCover3(lines);
    if (ans1 !== ans2) {
      console.timeLog("tester", "Oops!", lines);
      break;
    }
  }
  console.timeEnd('test time');
}

main();
