/**
 * 最小生成树 K算法 kruskal
 *
 * 定义：
 * `最小生成树算法`处理对象是无向图，在不影响所有点联通的情况下，所有边的权重加起来最小的一种连接方法。
 *
 * 实现：
 * 从权重小的边到权重大的边，依次考察：
 *   如果当前的边不会形成`环`，就要当前的边；
 *   如果当前的边会形成`环`，就不要。
 * 问题：怎么检查环？
 * 方案: 并查集的 isSameSet 方法
 *
 *
 * 并查集法:
 * 说白了就是收集`有效边`的过程:
 * 1. 准备一个 set 存放`有效边`;
 * 2. 把所有点搞出自己的集合 {a},{b},{c},{d},{e},{f},{g}...{n}
 * 3. 按权重从小到大选择边，从最小权重的边开始，同样权重的先选哪条无所谓，检查边两端的点(f,g)是否是同一个集合(isSameSet):
 *      两端不是同一集合，所以连起来不会有环(树需要保证无环)，连上以后放到一个集合里 {f,g}，这条边要了，放到 set 里；
 *      两端是同一个集合，如果选了这条边，必然会出现环路，所以这条边不要了。
 * 4. 返回 set。
 *
 * @param {Graph} graph 图
 * @return {Set<Edge>} 选中的边组成的集合
*/
function kruskal(graph) {
  const UnionFind = require('../UnionFind/UnionFind');
  // 所有点生成自己的集合
  const unionFind = new UnionFind(graph.nodes.values());
  // 按权重从小到大，排序所有的边
  const edgeInterator = graph.edges.values();
  const edgeSortedQueue = [];
  for (const edge of edgeInterator) {
    edgeSortedQueue.unshift(edge);
  }
  edgeSortedQueue.sort((a,b) => a.weight - b.weight);
  // 按权重从小到大尝试`边`, 有效的边存入集合
  const result = new Set();
  while (edgeSortedQueue.length > 0) {
    const edge = edgeSortedQueue.pop();
    if (!unionFind.isSameSet(edge.from, edge.to)) { // O(1)
      result.add(edge);
      unionFind.union(edge.from, edge.to);
    }
  }
  // 返回有效集合
  return result;
}
