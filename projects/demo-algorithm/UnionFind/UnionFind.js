/**
 * 并查集专用结点
 * @param {V} v 用户给的样本
 * @constructor
 */
function Node(v) {
  this.value = v;
}

/**
 * 并查集
 * 这是个神器🏆，能解决一大片的问题! 你被火车🚄撞了都不能忘的!!
 *
 * 两个优化:
 * 1. 小集合去挂大集合
 * 2. 每查询一次 head, 都把 cur 到 head 的每一个沿途结点挂到 head 上
 *
 * 这两个优化的目的，都是把`链`变得扁平化。
 */
class UnionSet {
  // 初始化的时候，用户把所有样本的列表一股脑地给我
  // Array<V> values
  constructor(values) {
    // Map<V,Node<V>>  `样本->结点`对应表, 代表:用户数据->UnionSet包装后的结点。如 a->a圈, b->b圈。
    this.nodes = new Map();
    // Map<Node<V>,Node<V>>  `结点->父结点`对应表。
    this.parents = new Map();
    // Map<Node<V>,number> 结点代表的集合的大小, 只有集合的代表结点，会在 sizeMap 里留下记录。
    this.sizeMap = new Map();
    // 每个元素生成 UnionSet 专用的 Node 结构
    for (let i = 0, len = values.length; i < len; i++) {
      const node = new Node(values[i]);
      // `用户样本`对应`并查集结点`
      this.nodes.set(values[i], node);
      // 结点初始化对应的父结点是自己
      this.parents.set(node, node);
      // 每个结点都是自己的代表结点，自己成一个小集合
      this.sizeMap.set(node, 1);
    }
  }
  
  /**
   * 内部使用
   *
   * 给定一个结点，请你往上到不能再往上，把`代表结点`返回。
   *
   * 时间复杂度
   * 本方法调用会非常频繁，当调用次数到达 N 的规模以后，单次查询的速度就是 O(1)。
   *
   * 重要优化🔥
   * 每次查询，都让 cur 到 head 的沿途结点直接连上 head, 使得 cur 到 head 的这条链变得扁平。
   * 如 cur->a->b->head, 变为 cur->head, a->head, b->head, head->head。
   * 以后这条链上的结点再查询，就一步到位了，性能提升。
   *
   * 原来的结构:
   *         z
   *       y
   *     x
   *   a
   *     b
   *       c
   *
   * 调用一次 _findHead(a) 之后，结构就变成:
   *
   *         z
   *   a     x    y
   *     b
   *       c
   *
   * 沿途的结点 a->x->y->z 直接连到 z 上, a->z, x->z, y->z，扁平化了。
   *
   * @param {Node<V>>} cur
   * @return {Node<V>} 代表结点 head，也就是 cur 集合的头
   */
  _findHead(cur) {
    // 保存从 cur 到 head 的所有结点，如 cur->a->b->head，保存的是 [cur,a,b,head]。
    const path = [];  // Stack
    // cur 一路往上窜
    while (cur !== this.parents.get(cur)) {
      // `cur不等于父`就是没到顶，继续
      // 沿途结点都放到栈里
      path.push(cur);
      // cur 往上
      cur = this.parents.get(cur);
    }
    // 依次弹出栈的结点，每个结点都连上 head
    while (path.length > 0) {
      const pop = path.pop();
      this.parents.set(pop, cur);
    }
    // 返回 head
    return cur;
  }
  
  /**
   * 查询 a 样本和 b 样本在不在同一个集合里
   *
   * @param {V} a 用户传入的样本a
   * @param {V} b 用户传入的样本b
   */
  isSameSet(a, b) {
    // 判断代表结点是不是同一个即可
    return this._findHead(this.nodes.get(a)) === this._findHead(this.nodes.get(b));
  }
  
  /**
   * 把 a所在的集合 和 b所在的集合 合成一个集合
   * @param {V} a 用户传入的样本a
   * @param {V} b 用户传入的样本b
   */
  union(a, b) {
    // 拿到 a 的代表结点
    const aHead = this._findHead(this.nodes.get(a));
    // 拿到 b 的代表结点
    const bHead = this._findHead(this.nodes.get(b));
    // 如果 aHead === bHead, 那就说明 a,b 已经是同一个集合了，不用做任何事。
    // 只有它们不同的时候，才需要合并。
    if (aHead !== bHead) {
      // a所在集合的大小
      const aSetSize = this.sizeMap.get(aHead);
      // b所在集合的大小
      const bSetSize = this.sizeMap.get(bHead);
      // 拿到较大的那个集合的代表结点
      const big = aSetSize >= bSetSize ? aHead : bHead;
      // 抓一下较小的
      const small = big === aHead ? bHead : aHead;
      // `小集合的头`指向`大集合的头`，含义是: 小集合合并到大集合里去了。
      // 这是一个重要优化🔥
      this.parents.set(small, big);
      // 更新集合大小
      this.sizeMap.set(big, aSetSize + bSetSize);
      // sizeMap 只维护代表结点，小集合已经并入大集合了，小代表结点不存在了，移除记录
      this.sizeMap.delete(small);
    }
  }
}
