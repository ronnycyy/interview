/**
 * 并查集经典题目 -- 岛问题
 *
 * 力扣200. 岛屿数量
 * https://leetcode.cn/problems/number-of-islands/description/
 *
 * 给你一个大小为 m*n 的二进制矩阵 grid, 1 代表土地，0 代表水。
 * `岛屿`是由一些相邻的 1 构成的组合，这里的`相邻`要求两个 1 必须在 水平或者竖直的四个方向上相邻，假设 grid 的四个边缘都被 0 包围着。
 * 给定 grid，返回岛屿的数量。
 *
 * 比如, grid 是:
 * [
 *   [0,0,1,0],
 *   [0,0,0,0],
 *   [0,1,1,0],
 *   [0,1,0,0],
 * ]
 *
 * 那么要返回 2, 因为有 2 座岛屿:
 *
 *      第 1 座岛:
 *      x x 1 x
 *      x x x x
 *      x x x x
 *      x x x x
 *
 *      第 2 座岛:
 *      x x x x
 *      x x x x
 *      x 1 1 x
 *      x 1 x x
 *
*/

/**
 * 感染法
 *
 * 实现:
 * 1. 设置 islands = 0 代表岛屿数量
 * 2. 从左往右，从上往下遍历矩阵，遇到`1`的时候调用`感染方法`，把`连成一片的1`全部改成`2`, 然后 islands++。
 * 3. 遍历过程会不断有大量的`1`变成`2`，这些`2`会被跳过
 * 4. 遍历结束，返回 islands。
 *
 * 时间复杂度:
 * 假设矩阵是 M 行 N 列, 对于每个位置:
 * 1. 主过程里每个位置被碰了 1 次
 * 2. infect 过程，对于某一个位置 x，只有 x 的`上、下、左、右` 会碰它，而且一旦碰了就变成`2`, 再碰就直接返回了, 所以 infect 对任何一个位置，最多碰 4 次。
 * 把主过程和 infect 过程都算起来，每个位置最多碰 1+4=5 次，常数操作次数 5*M*N 次，那么 时间复杂度就是 O(M*N)。
 *
 * @param {char[][]} board 二进制矩阵
 * @return {number} 岛的数量
 */
function numIslands1(board) {
  // 岛的数量
  let islands = 0;
  // 遍历所有位置
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // 用第一行的长度 board[0].length 代表矩阵的列数
      if (board[i][j] === '1') {
        // 发现岛屿
        // 计数+1
        islands++;
        // 感染这个岛屿, 使这个岛屿不再被`发现`。
        infect(board, i, j);
      }
    }
  }
  return islands;
}

/**
 * 并查集1 哈希表
 * @param {number[][]} board 二进制矩阵
 * @return {number} 岛的数量
 */
function numIslands2(board) {
  // 用不同的内存地址，区分所有的`1`
  // 1: Dot实例
  // 0: null
  class Dot {}
  
  const row = board.length;
  const col = board[0].length;
  const dots = Array(row).fill(0).map(_ => Array(col).fill(null));  // Dot[row][col], 和 board 等规模, 初始化全 null
  const dotList = [];  // Array<Dot> 存放产生的 dot
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (board[i][j] === 1) {
        // 矩阵中为`1`的地方，都实例化成 dot，这样通过不同的内存地址，就能区分出不同的`1`
        dots[i][j] = new Dot();
        // 把实例加入数组
        dotList.push(dots[i][j]);
      }
    }
  }
  // 并查集
  const UnionFind = require('./UnionFind');
  // 把所有的`1`实例，拿来初始化并查集 UnionSet<Dot>
  const uf = new UnionFind(dotList);
  // 1.第0行只有`左`
  for (let j = 1; j < col; j++) {
    // 跳过 (0,0), 因为它既没有`左`也没有`上`
    // 遍历 (0,1) (0,2) (0,3) ... (0,col-1), 如果该点和它的`左点`都是`1`, 把该点和它的`左点`合并
    if (board[0][j-1] === 1 && board[0][j] === 1) {
      uf.union(dots[0][j-1], dots[0][j]);
    }
  }
  // 2.第0列只有`上`
  for (let i = 1; i < row; i++) {
    // 遍历 (0,1) (0,2) (0,3) ... (0,row-1), 如果该点和它的`上点`都是`1`, 把该点和它的`上点`合并
    if (board[i-1][0] === 1 && board[i][0] === 1) {
      uf.union(dots[i-1][0], dots[i][0]);
    }
  }
  // 3.剩下的位置，既有`左`，也有`上`
  for (let i = 1; i < row; i++) {
    for (let j = 1; j < col; j++) {
      if (board[i][j] === 1) {
        // 自己是1
        // 左边是1，合并
        if (board[i][j-1] === 1) {
          uf.union(dots[i][j], dots[i][j-1]);
        }
        // 上边是1，合并
        if (board[i-1][j] === 1) {
          uf.union(dots[i][j], dots[i-1][j]);
        }
      }
    }
  }
  // 返回有多少个独立区域，就是岛的数量
  return uf.sets();
}

/**
 * 并查集2 数组
 * 比用 哈希表 快很多!
 *
 * 实现:
 * 1. 矩阵尺寸为 m*n, 于是我们准备一个 m*n 长度的数组，存放所有元素。
 *
 *    比如一个 4*6 的矩阵，对应一个 24 长度的数组，下标对应关系是:
 *      (0,0) 认为是数组的 [0]
 *      (0,1) 认为是数组的 [1]
 *      (0,2) 认为是数组的 [2]
 *      ...
 *      (1,0) 认为是数组的 [6]
 *      (1,1) 认为是数组的 [7]
 *
 *    当位置是 (i,j), 矩阵是 row*col 尺寸时，通用公式是 index = i * col + j。
 *    完成以后，每一个位置在数组中的下标就是唯一的。
 *
 * 2.
 *
 * @param {char[][]} board 二进制矩阵 '1':陆地, '0':水
 * @return {number} 岛的数量
 */
function numIslands3(board) {
  // 数组实现的并查集
  class UnionFind {
    constructor(board) {
      this.col = board[0].length;  // 列的数量
      this.sets = 0;  // 集合的数量
      
      const row = board.length;  // 行的数量
      const len = row * col;  // 元素总数量
      this.parent = [];  // Array<number> 类比parentMap
      this.size = [];  // Array<number> 某个集合的大小，用代表结点的索引为 index, 比如 this.size[2] = 6 含义是 下标2结点代表的集合大小为6。
      this.help = [];  // Array<number> ?
      
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < this.col; j++) {
          // 遍历矩阵，遇到`1`的时候, 建立集合
          // 不是`1`的位置根本不建记录
          if (board[i][j] === '1') {
            const index = this.getIndex(i,j);
            // 初始化这个点的父是自己
            this.parent[index] = index;
            // 这个点大小是1 ? (初始化每个是`1`的位置，对应下标 size 都是 1)
            this.size[index] = 1;
            // 集合数量累加，初始化一个`1`就是一个集合
            this.sets++;
          }
        }
      }
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
      // i到代表结点的沿途，所有结点直接挂到代表结点上
      for (hi--; hi >= 0; hi--) {
        this.parent[this.help[hi]] = i;
      }
      // 返回代表结点的索引
      return i;
    }
    
    /**
     * (r1,c1)是`1`, (r2,c2)是`1`, 请将这两个集合合并
     *
     * @param {number} r1 矩阵第1点的横坐标
     * @param {number} c1 矩阵第1点的纵坐标
     * @param {number} r2 矩阵第2点的横坐标
     * @param {number} c2 矩阵第2点的纵坐标
     */
    union(r1, c1, r2, c2) {
      // 算出 (r1,c1) 和 (r2,c2) 的下标
      const i1 = this.getIndex(r1,c1);
      const i2 = this.getIndex(r2,c2);
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
    
    // 获取集合的数量
    getSetSize() {
      return this.sets;
    }
  }
  // 获取矩阵尺寸
  const row = board.length;
  const col = board[0].length;
  // 使用`数组实现的并查集`，效率更高
  const uf = new UnionFind(board);
  // 第 1 行
  // 把 `1` 和 `1`的左边 合成一个集合，上边是墙不用管。
  for (let j = 1; j < col; j++) {
    if (board[0][j-1] === '1' && board[0][j] === '1') {
      uf.union(0, j-1, 0, j);
    }
  }
  // 第 1 列
  // 把 `1` 和 `1`的上边 合成一个集合，左边是墙不用管。
  for (let i = 1; i < row; i++) {
    if (board[i-1][0] === '1' && board[i][0] === '1') {
      uf.union(i-1, 0, i, 0);
    }
  }
  // 遍历从 (1,1) 开始的所有结点，遇上`1`就合成一个集合
  for (let i = 1; i < row; i++) {
    for (let j = 1; j < col; j++) {
      if (board[i][j] === '1') {
        // 合并`左`
        if (board[i][j-1] === '1') {
          uf.union(i, j-1, i, j);
        }
        // 合并`上`
        if (board[i-1][j] === '1') {
          uf.union(i-1, j, i, j);
        }
      }
    }
  }
  // 返回集合数量，即是`能连成一片的1的数量`，也就是`岛屿数量`
  return uf.getSetSize();
}

/**
 * 感染过程
 *
 * 递归含义:
 * 从 (i,j) 位置出发，把上下左右所有连成一片的`1`都改成`2`
 *
 * 递归步骤:
 * 1. 如果`越界了`或者`遇到了不是1的格子`，就返回上游 (base case)
 * 2. (i,j) 改成 `2`
 * 3. 往上下左右走
 *
 * @param {number[][]} board 二进制矩阵
 * @param {number} i 横坐标
 * @param {number} j 纵坐标
 */
function infect(board, i, j) {
  if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] !== '1') {
    // 1. 越界了，返回上游
    // 2. 递归调用来到了`不是1`的位置，也停\U0001f91a，返回上游
    return;
  }
  // 把(i,j)位置感染
  board[i][j] = '2';
  // 往上下左右四个方向感染，将`连成一片的1`都改成`2`。
  // 注意:
  // 空降到某一点，感染了这个点之后会走到下个点，下个点会往`上下左右`四个方向走，也就是说还会回到空降点。
  // 但是空降点在`递`之前就改成`2`了，所以回来也没有关系，会进入 base case 直接退出，递归不会跑不完。
  infect(board, i-1, j);
  infect(board, i+1, j);
  infect(board, i, j-1);
  infect(board, i, j+1);
}


/**
 * 进阶: 如果我的 matrix 极大，比如是一张世界地图，请设计一种可行的并行方案。
 *
 * 例子:
 *                 ｜
 * 1 1 1 1 1 1 1 1 ｜1 1 1 1 1 1 1 1 1
 * 1 0 0 0 0 0 0 0 ｜0 0 0 0 0 0 0 0 1
 * 1 0 0 1 1 1 1 1 ｜1 1 1 1 1 1 1 1 1
 * 1 0 0 1 0 0 0 0 ｜0 0 0 0 0 0 0 0 0
 * 1 0 0 1 1 1 1 1 ｜1 1 1 1 1 1 1 1 1
 * 1 0 0 0 0 0 0 0 ｜0 0 0 0 0 0 0 0 1
 * 1 1 1 1 1 1 1 1 ｜1 1 1 1 1 1 1 1 1
 *                 ｜
 *    CPU1                CPU2
 *
 * 1.CPU1 算出{A},{B}两个岛(集合)
 * 2.CPU2 算出{C},{D}两个岛(集合)
 * 3.检查边界，发现:
 *    {A},{C} 是同一个，调用并查集合并，集合数量--
 *    {A,C}和{B} 是同一个，调用并查集合并，集合数量--
 *    {A,B,C}和{D} 是同一个，调用并查集合并，集合数量--
 * 4.最后只剩 {A,B,C,D} 是同一个，集合数量也变为 1 了，返回 1。
 *
 * 总结:
 * 1. 切成很多个块，每个块让一颗 CPU 去做并查集法，得到很多个集合，以及集合总数。
 * 2. 边界上如果是: 一边有一个`1`的话，就说明在整张图上 2 片`1`是连在一起的，把 2 个集合合并，然后总数量--。
 * 3. 所有边界都检查完，返回总数量，即是世界上所有岛屿的数量。
*/
