/**
 * 最长公共子序列

给定两个字符串str1和str2，
返回这两个字符串的最长公共子序列长度

比如: str1 = “a12b3c456d”, str2 = “1ef23ghi4j56k”
最长公共子序列是“123456”，所以返回长度6
 */

function longestCommonSubsequence(str1, str2) {
  if (!str1 || !str2) {
    return 0;
  }
  return dpWays(str1, str2);
  return proc(str1, str2, str1.length - 1, str2.length - 1);
}

function dpWays(str1, str2) {
  const N = str1.length;
  const M = str2.length;
  const dp = Array(N).fill(0).map(_ => new Uint32Array(M));  // N*M

  dp[0][0] = str1[0] === str2[0] ? 1 : 0;

  // 第一行
  for (let j = 1; j < M; j++) {
    dp[0][j] = str1[0] === str2[j] ? 1 : dp[0][j - 1];
  }

  // 第一列
  for (let i = 1; i < N; i++) {
    dp[i][0] = str1[i] === str2[0] ? 1 : dp[i - 1][0];
  }

  // 普遍位置
  for (let i = 1; i < N; i++) {
    for (let j = 1; j < M; j++) {
      const p1 = dp[i - 1][j];
      const p2 = dp[i][j - 1];
      const p3 = str1[i] === str2[j] ? 1 + dp[i - 1][j - 1] : 0;
      dp[i][j] = Math.max(Math.max(p1, p2), p3);
    }
  }

  // 目标格子
  return dp[N - 1][M - 1];
}

// 这是样本对应模型🔥, 非常在意结尾位置, 所以定出尝试:
// 返回: `str1[0,..,i]这一段` 和 `str2[0,..,j]这一段` 两个字符串, 最长公共子序列的长度
function proc(str1, str2, i, j) {

  // 第四步
  // base case 1
  if (i === 0 && j === 0) {
    return str1[i] === str2[j] ? 1 : 0;
  }
  // 第一步  (else 是后面补的)
  // 从右往左尝试的，所以 i 到 0 的时候返回
  else if (i === 0) {
    // 第二步
    // str1只剩一个字符, str2[0,..,j]
    // `样本模型对应结尾`
    if (str1[i] === str2[j]) {
      return 1;
    }
    // 第三步
    // 有 str2[j] 没 str2[j] 都一样, 继续尝试
    // 此时i是0，但是 j-1 可能越界，所以补 base case 1
    return proc(str1, str2, i, j - 1);
  }
  else if (j === 0) {
    // 同 i === 0
    if (str1[i] === str2[j]) {
      return 1;
    }
    return proc(str1, str2, i - 1, j);
  }
  else {
    // 样本对应模型往往讨`结尾位置🔥`，这是一个经验

    // 可能性1
    // 最长公共子序列不以i结尾，有可能以j结尾， 比如"123d"和"1a23"(以j结尾)、"123d"和"123c"(不以j结尾)
    // 为啥要定成`可能以j结尾`?  因为如果定成`一定以j结尾`，就要去验证 str1[0,..,i] 里有没有 str2[j] 字符，这件事就变得很麻烦。
    const p1 = proc(str1, str2, i - 1, j);

    // 可能性2
    // 最长公共子序列有可能以i结尾，不以j结尾， 比如"a123d"和"e123f"(不以i结尾)、"a123"和"e123f"(以i结尾)
    const p2 = proc(str1, str2, i, j - 1);

    // 可能性1和可能性2是有交集的，但是目标是最长的序列，交集又如何？不影响找到答案。
    // 交集是: 不以i结尾，也不以j结尾， 比如"123d"和"a123e"

    // 可能性3
    // 最长公共子序列以i结尾，以j结尾， 比如"a123d"和"e123d"
    const p3 = str1[i] === str2[j] ? (1 + proc(str1, str2, i - 1, j - 1)) : 0;

    // 选最长的
    return Math.max(Math.max(p1, p2), p3);
  }
}
