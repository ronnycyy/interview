/**
 * 力扣305. 岛屿数量 II
 * https://leetcode.cn/problems/number-of-islands-ii/description/
 *
 * 技巧:
 * 动态加1，动态初始化
 *
 * 时间复杂度:
 *  1. 矩阵是 m*n 的，初始化并查集需要一个 O(m*n) 的过程。
 *  2. 如果我空降 k 个`1`, 每个`1`都跟自己`上下左右`连一下，连的过程在并查集里是O(1)的，所以时间复杂度就是 O(k)。
 * 综合起来，时间复杂度是 O(m*n) + O(k)。
 *
 * @param {number} m 行数
 * @param {number} n 列数
 * @param {number[][]} positions 每一次空降陆地的位置，形成一个列表
 * @returns {number[]} 每一步形成的岛屿数量
*/
function numIslands21(m, n, positions) {
  // 数组实现的并查集
  class UnionFind {
    constructor(m,n) {
      this.row = m;
      this.col = n;
      this.sets = 0;
      const len = this.row * this.col;  // 元素总数量
      this.parent = Array(len).fill(len);  // Array<number> 类比parentMap
      // 如果 i 要挂到 j 上，那么:
      // size[j] += size[i] 这是原来的操作，不变。
      // 但是 size[i]=0 这一步就别做了，因为我们要这样一个机制: size[i]!=0 表示 i 被初始化过，如果 size[i]===0 表示 i 从来没被初始化过。
      this.size = Array(len).fill(0);  // Array<number> 某个集合的大小，用代表结点的索引为 index, 比如 this.size[2] = 6 含义是 下标2结点代表的集合大小为6。
      this.help = Array(len).fill(0);  // Array<number>
    }
    
    // (i,j)位置的点，在数组中的下标
    getIndex(i,j) {
      return i * this.col + j;
    }
    
    // i 是下标值，是并查集数组的位置，不是矩阵的位置
    // 找到 index 结点的代表结点的索引，返回
    find(i) {
      let hi = 0;
      // i一直往父结点上移动，直到找到代表结点
      while (i != this.parent[i]) {
        this.help[hi++] = i;
        i = this.parent[i];
      }
      // 提升性能🔥
      // i往上窜到代表结点的沿途结点，直接挂到代表结点上
      for (hi--; hi >= 0; hi--) {
        this.parent[this.help[hi]] = i;
      }
      // 返回代表结点的索引
      return i;
    }
    
    /**
     * 检查 (r1,c1) 和 (r2,c2)，如果两个点都是`1`，就将这两个集合合并，含义就是把两个`1`连起来。
     *
     * @param {number} r1 矩阵第1点的横坐标
     * @param {number} c1 矩阵第1点的纵坐标
     * @param {number} r2 矩阵第2点的横坐标
     * @param {number} c2 矩阵第2点的纵坐标
     */
    union(r1, c1, r2, c2) {
      // 越界检查
      if (r1 < 0 || r1 >= this.row || r2 < 0 || r2 >= this.row || c1 < 0 || c1 >= this.col || c2 < 0 || c2 >= this.col) {
        return;
      }
      // 算出 (r1,c1) 和 (r2,c2) 的下标
      const i1 = this.getIndex(r1,c1);
      const i2 = this.getIndex(r2,c2);
      if (this.size[i1] === 0 || this.size[i2] === 0) {
        // 任意一个是 0 就不能连，必须两个都是 1 才行。
        return;
      }
      // 找到各自代表结点的索引
      const f1 = this.find(i1);
      const f2 = this.find(i2);
      // 如果代表结点不是同一个，才合并
      if (f1 !== f2) {
        // 小集合去挂上大集合, 小集合的首指针连上大集合的头
        if (this.size[f1] >= this.size[f2]) {
          this.size[f1] += this.size[f2];
          this.parent[f2] = f1;
        } else {
          this.size[f2] += this.size[f1];
          this.parent[f1] = f2;
        }
        // 两个集合合成一个，所以集合数量-1
        this.sets--;
      }
    }
    
    /**
     * 获取集合的数量
     * @returns {number} 集合数量
     */
    getSetSize() {
      return this.sets;
    }
  
    /**
     * (i,j) 上来了个`1`, 步骤:
     *    1. 把小集合建出来
     *    2. 上下左右连
     *    3. 返回全局的集合数
     *
     * @param {number} i 横坐标
     * @param {number} j 纵坐标
     */
    connect(i, j) {
      // 算出该坐标点在数组中的下标
      const index = this.getIndex(i,j);
      // this.size[index]===1 表示这个位置已经有过1了，那就不用再处理了，
      // 比如 (5,3), (5,3), (5,3) 多次出现，只有第 1 次有效，后面的行为都是不用处理的。
      if (this.size[index] === 0) {
        // 空降的`1`从来没有出现过，那么`现场建立集合`
        // 该集合的父就是自己
        this.parent[index] = index;
        // 集合只有 1 结点，所以大小是 1
        this.size[index] = 1;
        // 单独成 1 个集合，所以总集合加 1 个
        this.sets++;
        // 上下左右，能连就连起来
        this.union(i-1, j, i, j);
        this.union(i+1, j, i, j);
        this.union(i, j-1, i, j);
        this.union(i, j+1, i, j);
      }
      // 返回集合数量，即`连成一片的1的数量`，在题目里就是岛屿的数量。
      return this.sets;
    }
  }
  
  const uf = new UnionFind(m,n);
  const ans = [];  // Array<number> 存放每一次空降形成的岛屿数量
  
  for (let i = 0, len = positions.length; i < len; i++) {
    // 1.每一步空降的陆地，都在并查集里`连接`一下，连完并查集能立即查到集合数量，也就是`岛屿数量`
    // 2.把岛屿数量都加到数组里
    const ps = positions[i];
    ans.push(uf.connect(ps[0], ps[1]));
  }
  
  return ans;
}
