/**
 * lintcode 127 · 拓扑排序
 * https://www.lintcode.com/problem/127/
 *
*/
class DirectedGraphNode {
  constructor(x) {
    this.label = x;  // number
    this.neighbors = [];  // Array<DirectedGraphNode>
  }
}

class Record {
  constructor(n,o) {
    this.node = n;  // DirectedGraphNode 点
    this.nodes = o;  // number 点次
  }
}

class Solution {
  /**
   * 输出图的拓扑排序
   *
   * 比如这么一个图: a->b, b->c, a->c,
   *    a -> b -> c
   *    ----------^
   *
   * 本题是用邻接表法表示的图:
   *   [
   *      { label:'a', neighbors: [b,c] },
   *      { label:'b', neighbors: [c] },
   *      { label:'c', neighbors: [] },
   *   ]
   *
   * @param {Array<DirectedGraphNode>} graph 图
   * @return {Array<DirectedGraphNode>} 拓扑排序结点列表
  */
  topSort(graph) {
    // Map<DirectedGraphNode, Record>
    const order = new Map();
    // 遍历所有点，建立点次表
    for (let i = 0, len = graph.length; i < len; i++) {
      f(graph[i], order);
    }
    // 点次单独用列表装上
    const recordArr = [];  // Array<Record>
    for (const record of order.values()) {
      recordArr.push(record);
    }
    // 排序 谁点次高，谁排在前面
    recordArr.sort((a,b) => b.nodes - a.nodes);
    // 存放拓扑排序结果
    const ans = [];
    for (const record of recordArr) {
      ans.push(record.node);
    }
    return ans;
  }
  
  /**
   * 递归
   * 来到 cur 点，返回 cur 所到之处(cur.next.next.....)，所有的点次。
   *
   * @param {DirectedGraphNode} cur 当前结点
   * @param {Map<DirectedGraphNode, Record>} order 缓存, key表示某一个点的点次已经算过了, value表示点次是多少
   * @return {Record} `点,点次`结构
   */
  f(cur, order) {
    if (order.has(cur)) {
      // 如果已经缓存了，直接返回缓存。
      return order.get(cur);
    }
    // 把 cur 的所有邻居的点次加起来
    let nodes = 0;
    for (let i = 0, len = cur.neighbors.length; i < len; i++) {
      nodes += f(cur.neighbors[i], order).nodes;
    }
    // 还要算上我自己这个点
    // 这其实也是 base case, 想想没有 neighbors 的那些点
    const ans = new Record(cur, nodes+1);
    // 缓存
    order.set(cur, ans);
    // 返回此结构
    return ans;
  }
}


