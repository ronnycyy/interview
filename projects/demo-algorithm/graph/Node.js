// `我的图结构`专用结点
class Node {
  constructor(value) {
    this.value = value;  // 结点值
    this.in = 0;  // 入度 (有多少`边`直接指向它)
    this.out = 0;  // 出度 (有多少`边`直接从它出去)
    this.nexts = [];  // Array<Node> 直接邻居, 即直接指向的`结点`, 如 a->b, a->c, 那么 a.nexts = [b,c]
    this.edges = [];  // Array<Edge> 往外指的边，如 a->e, a->f, c->a, 那么 a 往外指的有 2 条边。
  }
}

