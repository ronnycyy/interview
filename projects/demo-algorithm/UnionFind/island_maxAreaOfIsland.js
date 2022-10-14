/**
 * 力扣695. 岛屿的最大面积
 * https://leetcode.cn/problems/max-area-of-island/description/
 *
 * @param {number[][]} board
 * @return {number}
 */
function island_maxAreaOfIsland(board) {
  // 岛的最大面积
  let max = 0;
  // 遍历所有位置
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // 用第一行的长度 board[0].length 代表矩阵的列数
      if (board[i][j] === 1) {
        // 发现岛屿
        // 感染这个岛屿, 使这个岛屿不再被`发现`
        // 只保留最大岛屿的面积
        max = Math.max(max, infect(board, i, j, 0));
      }
    }
  }
  return max;
}

/**
 * 感染过程
 *
 * 递归含义:
 * 从 (i,j) 位置出发，把上下左右所有连成一片的`1`都感染成`2`, 返回本次感染到的面积。
 *
 * 递归步骤:
 * 1. 如果`越界了`或者`遇到了不是1的格子`，本次感染面积0，返给上游 (base case)
 * 2. (i,j) 改成 `2`
 * 3. 往上下左右走
 *
 * @param {number[][]} board 二进制矩阵
 * @param {number} i 横坐标
 * @param {number} j 纵坐标
 * @return {number} 本次感染的面积
 */
function infect(board, i, j) {
  if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] !== 1) {
    // 1. 越界了，返回感染面积0给上游
    // 2. 递归调用来到了`不是1`的位置，也停，返回感染面积0给上游
    return 0;
  }
  // 把(i,j)位置感染
  board[i][j] = 2;
  
  // 只记录从自己开始递归的感染面积，之前`递`下来的感染面积与我无关
  // 所以从 (i,j) 开始计数，已经感染了 1 个
  let area = 1;
  
  // 往上下左右四个方向感染，将`连成一片的1`都改成`2`，同时收集每个方向的感染面积。
  
  // 注意:
  // 空降到某一点，感染了这个点之后会走到下个点，下个点会往`上下左右`四个方向走，也就是说还会回到空降点。
  // 但是空降点在`递`之前就改成`2`了，所以回来也没有关系，会进入 base case 得到感染面积0，不会重复计数。
  area += infect(board, i-1, j);
  area += infect(board, i+1, j);
  area += infect(board, i, j-1);
  area += infect(board, i, j+1);
  
  // 返回`从(i,j)开始感染到的面积`给上游
  return area;
}
