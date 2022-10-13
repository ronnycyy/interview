/**
 * 一些项目要占用一个会议室宣讲，会议室不能同时容纳两个项目的宣讲。
 * 给你每一个项目开始的时间和结束的时间, 你来安排宣讲的日程，要求会议室进行的宣讲的场次最多。
 * 返回最多的宣讲场次。
*/

/**
 * @constructor 项目
*/
function Program(s, e) {
  this.start = s;  // 项目宣讲开始时间
  this.end = e;  // 项目宣讲结束时间
}

/**
 * 贪心策略: 每次都选结束时间早的。(无脑测试，不管证明，反正每道题都不一样..)
 * @param {Array<Program>} programs
 * @return {number}
*/
function ways2(programs) {
  // 按结束时间排序
  programs.sort((a,b) => a.end - b.end);
  // 已经安排到哪个时间，只有这个时间之后的才可以安排
  let timeline = 0;
  // 安排了多少个项目
  let count = 0;
  // 遍历每一个项目，符合条件的就安排
  for (let i = 0, len = programs.length; i < len; i++) {
    if (programs[i].start >= timeline) {
      count++;
      timeline = programs[i].end;
    }
  }
  // 返回这种贪心策略下的场次
  return count;
}

/**
 * 暴力法 (作为对数器)
 * 尝试每一个项目，每一次尝试都得到一个`宣讲场次`，统计最大的`宣讲场次`返回。
 *
 * [p1, p2, p3, ..., pn]
 * 选 p1, 下面选 px, ..., 尝试出一个最大场次 m1
 * 选 p2, 下面选 px, ..., 尝试出一个最大场次 m2
 * 选 p3, 下面选 px, ..., 尝试出一个最大场次 m3
 * ...
 * 选 pn, 下面选..., 尝试出一个最大场次 mn
 *
 * 返回 Math.max(m1,m2,m3,...mn);
 *
 * @param {Array<Program>} programs
 * @return {number}
*/
function ways1(programs) {
  return proc(0, programs, 0);
}

// 已经安排了 done 个项目，目前来到的时间点是 timeline, 剩余 programs 个项目可以自由安排
// 包括 done 在内，返回能安排下的最大场次
function proc(done, programs, timeline) {
  if (programs.length === 0) {
    // 没有剩余项目了，最大场次就是已经安排的。
    return done;
  }
  // 本次遍历能得到的最大场次,
  // 初始值是前面已经安排的场次。
  let max = done;
  // 遍历所有剩余项目
  for (let i = 0, len = programs.length; i < len; i++) {
    const p = programs[i];
    if (p.start >= timeline) {
      /* 安排这个项目 */
      // 已安排数量+1
      const alreadyDone = done+1;
      // 从`可选项目列表`中剔除这个项目
      const remainingPrograms = copyButExcept(programs, p);
      // 下一个`能安排的项目`必须等这个项目结束
      const nextTimeline = p.end;
      // 安排这个项目(done+1)，进递归等待返回最大场次
      // 所有剩余项目都安排一遍，经过比较，得到最大的场次
      max = Math.max(max, proc(alreadyDone, remainingPrograms, nextTimeline));
    }
  }
  return max;
}

function copyButExcept(programs, deleteOne) {
  const copy = [];
  for (let i = 0, len = programs.length; i < len; i++) {
    if (programs[i] !== deleteOne) {
      copy.push(programs[i])
    }
  }
  return copy;
}

/**
 * 随机生成项目列表
 * @param programSize 最大项目数
 * @param timeMax 最大时间
 */
function generatePrograms(maxSize, maxTime) {
  const ans = [];
  for (let i = 0; i < 1 + Math.floor(Math.random() * (maxSize + 1)); i++) {
    const start = Math.floor(Math.random() * (maxTime + 1));
    const end = Math.floor(Math.random() * (maxTime + 1));
    if (start === end) {
      ans[i] = new Program(start, end + 1);
    } else {
      ans[i] = new Program(Math.min(start, end), Math.max(start, end));
    }
  }
  return ans;
}

function main() {
  const maxSize = 100;
  const maxTime = 1000;
  const testTime = 100000;
  
  console.time('test');
  for (let i = 0; i < testTime; i++) {
    const programs = generatePrograms(6,100);
    if (ways1(programs) !== ways2(programs)) {
      console.log('Oops!');
      console.log(programs);
      break;
    }
  }
  console.timeEnd('test');
  console.log('finished');
}

main();
