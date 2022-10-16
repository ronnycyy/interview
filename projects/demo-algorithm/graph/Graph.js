// 我的`图`结构
class Graph {
  constructor() {
    this.nodes = new Map();  // Map<number, Node>  `点`集合  key是用户给的数字, value是生成的结点
    this.edges = new Set();  // Set<Edge>  `边`集合
  }
}

/**
 * 把二维矩阵转化成图
 *
 * @param {number[][]} matrix 二维矩阵
 * @return {Graph} 图
 *
 * matrix 是用户输入的二维矩阵，规模是 N*3，
 * 每一行的含义是: [weight, from, to]
 * [
 *   [5, 0, 7],  // 从`结点0`连接到`结点7`，边的权重是5
 *   [3, 0, 1],  // 从`结点3`连接到`结点1`，边的权重是3
 * ]
*/
function createGraph(matrix) {
  // 一开始`点集`和`边集`都为空
  const graph = new Graph();
  for (let i = 0; i < matrix.length; i++) {
    // 遍历每一条记录, 如 [5, 0, 7] 代表 0-(5)->7, 把数据存到`我的图`结构里
    const edge = matrix[i];
    const weight = edge[0];
    const from = edge[1];
    const to = edge[2];
    // 如果没有 from/to 结点，就把结点建出来，放到`图`里
    // 如果放过了就不用再放了
    if (!graph.nodes.has(from)) {
      graph.nodes.set(from, new Node(from));
    }
    if (!graph.nodes.has(to)) {
      graph.nodes.set(to, new Node(to));
    }
    // 先把`边两侧的结点`拿出来
    const fromNode = graph.nodes.get(from);
    const toNode = graph.nodes.get(to);
    // 再把`边`拿出来
    const Edge = require("./Edge");
    const newEdge = new Edge(weight,fromNode,toNode);
    // 设置`from结点`的`直接邻居(toNode)`、`往外指的边(newEdge)`、`出度(out++)`
    fromNode.nexts.push(toNode);
    fromNode.edges.push(newEdge);
    fromNode.out++;
    // 设置`to结点`的`入度(in++)`
    toNode.in++;
    // 把`边`加到`图`里
    graph.edges.add(newEdge);
  }
  return graph;
}
