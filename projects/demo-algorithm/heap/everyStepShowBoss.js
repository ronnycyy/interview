/**
 * 手动改写堆题目练习
 *
 * 给定一个整型数组 int[] arr 和一个布尔类型数组 boolean[] op, 两个数组一定等长，假设长度为N，arr[i]表示客户编号，op[i]表示客户操作。
 * arr = [3, 3, 1, 2, 1, 2, 5…]
 * op  = [T, T, T, T, F, T, F…]
 * 依次表示：
 * 3用户购买了一件商品，
 * 3用户购买了一件商品，
 * 1用户购买了一件商品，
 * 2用户购买了一件商品，
 * 1用户退货了一件商品，
 * 2用户购买了一件商品，
 * 5用户退货了一件商品…
 *
 * 一对 arr[i] 和 op[i] 就代表一个事件:
 * 用户号为 arr[i]，op[i] == T 就代表这个用户购买了一件商品, op[i] == F 就代表这个用户退货了一件商品。
 * 现在你作为电商平台负责人，你想在每一个事件到来的时候，都给购买次数最多的前 K 名用户颁奖。
 * 所以每个事件发生后，你都需要一个得奖名单（得奖区）。
 *
 * 得奖系统的规则：
 * 1，如果某个用户购买商品数为0，但是又发生了退货事件，则认为该事件无效，得奖名单和上一个事件发生后一致，例子中的5用户。
 * 2，某用户发生购买商品事件，购买商品数+1，发生退货事件，购买商品数-1。
 * 3，每次都是最多K个用户得奖，K也为传入的参数。如果根据全部规则，得奖人数确实不够K个，那就以不够的情况输出结果。
 * 4，得奖系统分为得奖区和候选区，任何用户只要购买数>0，一定在这两个区域中的一个。
 * 5，购买数最大的前K名用户进入得奖区，在最初时如果得奖区没有到达K个用户，那么新来的用户直接进入得奖区
 * 6，如果购买数不足以进入得奖区的用户，进入候选区
 * 7，如果候选区购买数最多的用户，已经足以进入得奖区，该用户就会替换得奖区中购买数最少的用户（大于才能替换），
 * 如果得奖区中购买数最少的用户有多个，就替换最早进入得奖区的用户
 * 如果候选区中购买数最多的用户有多个，机会会给最早进入候选区的用户
 * 8，候选区和得奖区是两套时间，因用户只会在其中一个区域，所以只会有一个区域的时间，另一个没有。
 * 从得奖区出来进入候选区的用户，得奖区时间删除，进入候选区的时间就是当前事件的时间（可以理解为arr[i]和op[i]中的i）
 * 从候选区出来进入得奖区的用户，候选区时间删除，进入得奖区的时间就是当前事件的时间（可以理解为arr[i]和op[i]中的i）
 * 9，如果某用户购买数==0，不管在哪个区域都离开，区域时间删除，
 * 离开是指彻底离开，哪个区域也不会找到该用户
 * 如果下次该用户又发生购买行为，产生>0的购买数，会再次根据之前规则回到某个区域中，进入区域的时间重记
 *
 * 需要的结果:
 * 请遍历arr数组和op数组，遍历每一步输出一个得奖名单。
 */

const HeapGreater = require('./HeapGreater');

class WhoIsYourDaddy {
  constructor(limit) {
    this.customers = new Map();  // <number, Customer> <用户id,用户>
    this.candHeap = new HeapGreater(compareCands);  // 候选区加强堆 - 大根堆，谁 buy 最大谁排上面
    this.daddyHeap = new HeapGreater(compareDaddy);  // 得奖区加强堆 - 小根堆，谁 buy 最小谁排上面
    this.daddyLimit = limit;  // 得奖区的大小，top K 问题
  }
  
  // `id代表的用户`在 time 的时刻发生了 buyOrRefund 的操作
  operate(time, id, buyOrRefund) {
    if (!buyOrRefund && !this.customers.has(id)) {
      // 退货并且用户表里没有这个用户，这个事就等同于没发生
      return;
    }
    if (!this.customers.has(id)) {
      // 如果没有这个用户，那就实例化一个
      this.customers.set(id, new Customer(id, 0, 0));
    }
    // 拿出 id 这个用户
    const c = this.customers.get(id);
    // 根据操作调整 c.buy
    if (buyOrRefund) {
      c.buy++;
    } else {
      c.buy--;
    }
    // 如果当前用户购买数清到零了，从表中移除
    if (c.buy === 0) {
      this.customers.delete(id);
    }
    // 上面都是 O(1) 的，看不出来多高效，下面就开始高效了👇   O(logN)
    // push pop remove resign 都是 O(logN) 的过程，非常高效🔥
    if (!this.candHeap.contains(c) && !this.daddyHeap.contains(c)) {
      // 候选区和得奖区都不包含当前用户
      if (this.daddyHeap.size < this.daddyLimit) {
        // 得奖区还有空位，直接把用户加进来
        c.enterTime = time;
        this.daddyHeap.push(c);
      } else {
        // 得奖区满了，把用户加入候选区
        c.enterTime = time;
        this.candHeap.push(c);
      }
    }
    // 当前用户在两个区的其中一个
    else if (this.candHeap.contains(c)) {
      // 在候选区
      if (c.buy === 0) {
        // 如果购买数为0, 移除
        this.candHeap.remove(c);
      } else {
        // 如果购买数不为0，说明 buy 变化了，根据调整策略来调整堆。
        this.candHeap.resign(c);
      }
    }
    else {
      // 在得奖区，同样的道理
      if (c.buy === 0) {
        this.daddyHeap.remove(c);
      } else {
        this.daddyHeap.resign(c);
      }
    }
    // 看看有没有爹移动到得奖区
    this.daddyMove(time);
  }
  
  // 看看有没有爹移动到得奖区
  daddyMove(time) {
    if (this.candHeap.isEmpty()) {
      // 如果候选区为空，那就啥也不干
      return;
    }
    if (this.daddyHeap.size < this.daddyLimit) {
      // 如果得奖区还有空位
      // 弹出最顶的候选区用户
      const p = this.candHeap.pop();
      // 更新进入时间
      p.enterTime = time;
      // 候选区的最优用户，进入得奖区
      this.daddyHeap.push(p);
    } else {
      // 候选区有用户，得奖区也满了，看看`候选区的用户`够不够资格替换`得奖区的用户`
      if (this.candHeap.peek().buy > this.daddyHeap.peek().buy) {
        // 分别拿出来 2 个最优的
        const oldDaddy = this.daddyHeap.pop();
        const newDaddy = this.candHeap.pop();
        // 更新 enterTime
        oldDaddy.enterTime = time;
        newDaddy.enterTime = time;
        // 替换
        this.daddyHeap.push(newDaddy);
        this.candHeap.push(oldDaddy);
      }
    }
  }
  
  // 获取所有得奖的用户id
  getDaddies() {
    const customers = this.daddyHeap.getAllElements();  // Customer[]
    const ids = [];  // number[]  用户id列表
    for (let i = 0, len = customers.length; i < len; i++) {
      ids.push(customers[i].id);
    }
    return ids;
  }
}

// 方法二 使用加强堆
// 时间复杂度 O(N*(logN+logK+K))
/**
 * 前 K 个用户是获奖的用户，返回他们的 id 列表。
 *
 * @param {number[]} arr 用户id名单
 * @param {boolean[]} ops 操作数组
 * @param {number} k 前K名用户
 * @return {Array<Array<number>>} list 得奖的用户id名单
 */
function topK(arr, ops, k) {
  const ans = [];  // Array<Array<number>>
  const whoIsYourDaddy = new WhoIsYourDaddy(k);
  // O(N*(logN+logK+K))
  // N个时刻，logN候选堆，logK得奖堆，K得奖的链
  for (let i = 0, len = arr.length; i < len; i++) {
    // i 号时间点 arr[i] 这个用户进来，发生了 ops[i]
    whoIsYourDaddy.operate(i, arr[i], ops[i]);
    // 把每一步的得奖用户id列表加入ans。
    ans.push(whoIsYourDaddy.getDaddies());
  }
  return ans;
}

// 用户
class Customer {
  constructor(id, buy, enterTime) {
    this.id = id;  // 用户id
    this.buy = buy;  // 购买商品数
    this.enterTime = enterTime;  // 进入得奖区/候选区的时间
  }
}

// 方法一、暴力解
// 干完所有的事，模拟，不优化
// @return Array<Array<number>> 返回的是每次
function compare(arr, ops, k) {
  const map = new Map();  // <number, Customer> <用户id,用户实例>
  const cands = [];  // Customer[] 候选区
  const daddy = [];  // Customer[] 得奖区
  const ans = [];    // Array<Array<number>>  遍历每一步都要返回一次 topK, 组成一个 topK 数组
  
  // O(N^2*logX)  每次事件到来时，都要排个序，还要拉个K的链表等。。
  for (let i = 0, len = arr.length; i < len; i++) {
    // 遍历`用户和操作`列表
    const id = arr[i];  // 用户id
    const buyOrRefund = ops[i];   // 买/退货
    if (!buyOrRefund && !map.has(id)) {
      // 此时是退货行为 并且 没有这个用户, 等同于事件没发生, ans 维持上一次的结果即可。(得奖系统的规则1)
      ans.push(getCurAns(daddy));
      // 继续到下一个用户和用户的操作
      continue;
    }
    // 1. 用户之前购买数===0, 此时买货
    // 2. 用户之前购买数>0, 此时买货
    // 3. 用户之前购买数>0, 此时退货
    if (!map.has(id)) {
      // 用户没有在记录表里，说明: `用户之前购买数===0, 此时买货`
      // buy 和 enterTime 都设置为 0, 在下面具体考察
      map.set(id, new Customer(id, 0, 0));
    }
    // 拿出当前用户
    const c = map.get(id);
    // 买/卖商品
    if (buyOrRefund) {
      c.buy++;
    } else {
      c.buy--;
    }
    if (c.buy === 0) {
      // 如果购买商品已经降到0，记录表移除当前用户
      map.delete(id);
    }
    if (!cands.includes(c) && !daddy.includes(c)) {
      // 即没有在`候选区`也没有在`得奖区`, 说明用户是新进来的并且发生了`购买`
      if (daddy.length < k) {
        // 得奖区还没到达 k, c 进入得奖区
        c.enterTime = i;
        daddy.push(c);
      } else {
        // 得奖区满了，c 进入候选区
        c.enterTime = i;
        cands.push(c);
      }
    }
    // 清掉`得奖区`和`候选区`的购买数为0的用户
    clearZeroBuy(daddy);
    clearZeroBuy(cands);
    // 按各自的规则排序
    cands.sort(compareCands);
    daddy.sort(compareDaddy);
    // 将候选区中胜出的用户移动到得奖区
    move(cands, daddy, k, i);
    // 得到所有用户id
    ans.push(getCurAns(daddy));
  }
  
  return ans;
}

// 返回得奖的所有用户id
function getCurAns(daddy) {
  const ids = [];
  for (let i = 0, len = daddy.length; i < len; i++) {
    ids.push(daddy[i].id);
  }
  return ids;
}

// 清空一个列表中购买数为0的用户
function clearZeroBuy(arr) {
  const noZero = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    const c = arr[i];
    if (c.buy !== 0) {
      noZero.push(c);
    }
  }
  while (arr.length > 0) {
    arr.pop();
  }
  for (let i = 0, len = noZero.length; i < len; i++) {
    arr.push(noZero[i]);
  }
}

// 候选区的用户可能要进入得奖区
// time: 当前时间点
function move(cands, daddy, k, time) {
  if (cands.length === 0) {
    return;
  }
  // 候选区有用户
  if (daddy.length < k) {
    // 得奖区没满
    // 把候选区的第0个用户拿出来，放到得奖区里去
    const c = cands[0];
    // 更新进入时间
    c.enterTime = time;
    // 加入得奖区
    daddy.push(c);
    // 从候选区移走头
    cands.shift();
  } else {
    // 得奖区满了
    // 只有`候选区的最大值`PK赢了`得奖区的最小值`才能把`候选区的用户`替换到`得奖区`
    if (cands[0].buy > daddy[0].buy) {
      const oldDaddy = daddy[0];
      daddy.shift();
      const newDaddy = cands[0];
      cands.shift();
      newDaddy.enterTime = time;
      oldDaddy.enterTime = time;
      daddy.push(newDaddy);
      cands.push(oldDaddy);
    }
  }
}

// 候选区排序规则: 购买数大的排前面，如果购买数一样，谁早谁放前面
function compareCands(c1, c2) {
  return c1.buy !== c2.buy ? c2.buy - c1.buy : c1.enterTime - c2.enterTime;
}

// 得奖区排序规则: 购买数小的排前面，如果购买数一样，谁早谁放前面
// 每次都看看: `候选区0位置`(购买数最大)能否把`得奖区0位置`(购买数最小)干掉
function compareDaddy(c1, c2) {
  return c1.buy !== c2.buy ? c1.buy - c2.buy : c1.enterTime - c2.enterTime;
}
