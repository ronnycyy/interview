/**
 背包问题🎒
 给定两个长度都为N的数组weights和values，weights[i]和values[i]分别代表 i号物品的重量和价值。
 给定一个正数bag，表示一个载重bag的袋子，你装的物品不能超过这个重量。
 返回你能装下的最多价值。
*/
function knapsack(weights, values, bag) {
  return dpWays(weights, values, bag);
  return proc(weights, values, 0, bag);
}

// 从左往右的尝试模型，每一个货物`要`或`不要`全展开。

// 在不超过rest重量的情况下，自由选择[index,N-1]的物品, 返回最多能得到的价值。
function proc(weights, values, index, rest) {
  // 剩余载重是负数，说明上游有选择是错的
  // 这个是左神后来加的，由此可见，尝试是非常轻的，上游有特殊情况处理时，下游加一个base case返回去，就能满足。
  if (rest < 0) {
    return -1;  // 本次尝试失败，返回-1给上一级处理。
  }

  // 有剩余载重，但是没有货物📦了，返回价值0。
  if (index === weights.length) {
    return 0;
  }

  // index < weights.length 
  // 还有货物, 面对 index 号货物，我可以选择`要`或`不要`。

  // 尝试1: 要 index 的货物
  let p1 = 0;
  const next = proc(weights, values, index + 1, rest - weights[index]);
  // 如果要了 index 货物，结果超重了，这个尝试就是失败的，价值维持一开始的0
  if (next !== -1) {
    // 如果到最后没有超重，本次选择方案有效，index货物的价值+后续过程的价值和=本次尝试的价值。
    p1 = values[index] + next;
  }

  // 尝试2: 不要 index 的货物
  // 得到 背包剩余载重还是rest的情况下，在[index+1,N-1]上自由选择货物得到的最大价值
  const p2 = proc(weights, values, index + 1, rest);

  // 当前货物只能`选`或`不选`，所以返回 `两种尝试中价值大的那个`。
  return Math.max(p1, p2);
}

// index: 0~weight.length
// rest: 0~bag
function dpWays(weights, values, bag) {
  const N = weights.length + 1;
  const M = bag + 1;
  const dp = Array(N).fill(0).map(_ => new Uint32Array(M));

  //  最后一行全是0，默认就是0，不用填

  // 从倒数第二行开始，从下往上，每行再从左往右填
  for (let i = N - 2; i >= 0; i--) {
    for (let j = 0; j < M; j++) {
      let p1 = 0;
      if (j - weights[i] > -1) {
        p1 = values[i] + dp[i + 1][j - weights[i]];
      }
      const p2 = dp[i + 1][j];
      dp[i][j] = Math.max(p1, p2);
    }
  }

  return dp[0][M - 1];
}

// [2,9,5]  w
// [9,5,8]  v
// 10      bag

console.log(knapsack([2, 9, 5], [9, 5, 8], 10));   // 17
