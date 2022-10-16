// `我的图结构`专用`边`
class Edge {
  constructor(weight, from, to) {
    this.weight = weight;  // number 权重，如 a-(6)->b, 这条`边`的权重就是 6。
    this.from = from; // Node 边从哪个结点出发的
    this.to = to;  // Node 边的终点是哪个结点
  }
}
