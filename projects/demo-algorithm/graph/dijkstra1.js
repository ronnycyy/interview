/**
 * 迪瑞克斯拉算法
 *
 * 其实就是贪心，每一步都选出下一个距离最小的点。
 *
 * @param {Node} from 从这个结点开始
 * @return {Map<Node, number>} 路径表 <终点,距离>
 */
function dijkstra1(from) {
  // 准备一张距离表 Map<Node, number>
  const distanceMap = new Map();
  // 出发点到自己的距离是0
  distanceMap.set(from, 0);
  // 打过`对号`的点 Set<Node>
  const selectedNodes = new Set();
  // 在没有打过`对号`的点中，选出距离最小的点  (打过`对号`代表点的`边信息`已经用完，后面不需要再用了)
  // 第 1 步调用，必是 from 结点出来
  let minNode = getMinDistanceAndUnselectedNode(distanceMap, selectedNodes);
  while (minNode) {
    // minNode 是一个中继点
    // distance 是 from 到`中继点`的最小距离
    // 一开始 from 既是`原始点`又是`中继点`，所以一开始 distance 为 0。
    const distance = distanceMap.get(minNode);
    // 遍历`中继点`的所有边，去尝试更新所有`边的终点`
    for (let i = 0, len = minNode.edges.length; i < len; i++) {
      const edge = minNode.edges[i];
      // 抓一下当前边的终点
      const toNode = edge.to;
      if (!distanceMap.has(toNode)) {
        // 如果`终点`不在距离表里, 说明之前 from 到本终点的距离是`正无穷`。
        // 在表里记录 from 到终点的距离: `原始点到中继点的距离`加上`中继点到终点的距离`
        distanceMap.set(toNode, distance + edge.weight);
      } else {
        // 如果`终点`在距离表里
        // 🔥精髓: 如果`经过中继点得到的距离`比`表里记录的距离`要短，那就更新成`经过中继点得到的距离`，这样就能找到 from 到所有连通点的最小距离。
        if (distance + edge.weight < distanceMap.get(toNode)) {
          distanceMap.set(toNode, distance + edge.weight);
        }
      }
    }
    // distanceMap 因为中继点的出现，`中继点所有的边的终点`该更新的就都更新完了
    // 中继点使命完成, 以后会选别人，让别人的`边的终点`去算，你打上`对号`吧
    selectedNodes.add(minNode);
    // 在没有打过`对号`的点中，选出下一个距离最小的点
    minNode = getMinDistanceAndUnselectedNode(distanceMap, selectedNodes);
  }
  // 返回距离表
  return distanceMap;
}

/**
 * 在没有打过`对号`的点中，选出一个距离最小的点
 *
 * 这个实现不好, 因为每次都要遍历一下 Map, 还要查一下 Set, 所以 Dijkstra2 就是优化了这里而诞生的。
 *
 * @param {Map<Node, number>} distanceMap 距离表
 * @param {Set<Node>} selectedNodes 对号集
 */
function getMinDistanceAndUnselectedNode(distanceMap, selectedNodes) {
  let minNode = null;
  let minDistance = Number.MAX_SAFE_INTEGER;
  distanceMap.entries((node,distance) => {
    if (!selectedNodes.has(node) && distance < minDistance) {
      minNode = node;
      minDistance = distance;
    }
  });
  return minNode;
}
