/**
 * 拓扑排序
 *
 * 定义:
 *  给一张图
 *  A -> C -> D -> E -> F -> null
 *  B ---^         G ---^
 *
 *  它的拓扑排序:
 *  A,B,C,D,E,G,F
 *  B,A,C,D,E,G,F
 *
 *  这两个排序都对，因为 A,B 是并列的，谁前谁后无所谓。但是只有 A,B 都准备好之后，才能开始 C, 所以 A,B 一定要在 C 之前。
 *
 * 核心:
 * 1. 拓扑序是一个工作流，每个轮到的结点都是`可以开始工作`的，也就是说，它依赖的其他结点都完成工作了(它的入度为0)。
 * 2. 算法排序图的过程其实是`依次完成工作的过程`，要把能完成的工作(入度为0)先完成，然后削去本工作影响的下一步工作的步骤(邻居入度-1)，
 * 继续完成接下来的工作(入度减到0的结点)。
 *
 * 实现:
 * 1. 准备一张`入度表`和一个`0入度队列`，`入度表`记录所有结点的入度, `0入度队列`存放所有入度为0的结点，这些结点表示工作不再依赖别人，可以按顺序开始。
 * 2. 初始化，遍历图，把所有入度为0的点加入队列, 不用考虑入队顺序，因为入度为0的初始工作，先做哪项都可以。
 * 3. 遍历的同时记录所有点的入度，以便下面检查。
 * 4. 队首结点(第1项工作)出队，结点加入 ans 数组形成拓扑顺序(工作流)，这个点所有邻居的入度都减1(本工作做完了，依赖我的下份工作都可以少一步)，如果有减到0的，入队。
 * 5. 持续进行直到队列为空，返回 ans。
 *
 * @param {Graph} graph 图
 * @return {Array<Node>} 拓扑排序后的列表
*/
function sortedTopology(graph) {
  // 1. 准备容器
  // <Node,number> key是某个结点，value是这个结点剩余的`入度`
  const inMap = new Map();
  // Array<Node> 哪个结点`剩余入度`为0时，就放入这个队列
  const zeroInQueue = [];
  // 2. 遍历图中的所有点, 建立`入度表`和`空入度队列`。
  // graph.nodes 是 Map<number,Node>, 所以 graph.nodes.values() 是一个迭代器对象，可以用 for..of 遍历。
  for (const node of graph.nodes.values()) {
    // 表存入 <结点,和它的入度>
    inMap.set(node, node.in);
    if (node.in === 0) {
      // 入度为0的点存入队列
      zeroInQueue.unshift(node);
    }
  }
  // 3.排序
  // 把入度为0的点都在队列里，一个点出队，记录顺序，然后削掉它对所有邻居的影响(入度-1)，如果有入度为0的点就加入队列
  // 拓扑排序的结果是 result
  const result = [];
  while (zeroInQueue.length > 0) {
    // 出队的点，全是入度为0的点，作为本点
    const pop = zeroInQueue.pop();
    // 加入 result 得到你的拓扑序
    result.push(pop);
    for (let i = 0, len = pop.nexts.length; i < len; i++) {
      // 本点的所有邻居点的入度都给我-1，因为`本点`已经排序了，要消掉
      const next = pop.nexts[i];
      inMap.set(next, inMap.get(next)-1);
      if (inMap.get(next) === 0) {
        // 减完发现有些点的入度已经是0了，那就加入队列，即将获得你的拓扑序🕶️
        zeroInQueue.unshift(next);
      }
    }
  }
  // 返回拓扑排序结果
  return result;
}
