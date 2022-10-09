// 前缀树结点
class Node1 {
  constructor() {
    this.pass = 0;  // 本结点被经过几次
    this.end = 0;   // 有多少字符串以本结点结尾
    /**
     * 0  a
     * 1  b
     * 2  c
     * ..
     * 25 z
     * next[i] === null  i方向的路不存在
     * next[i] !== null  i方向的路存在
     * 计算 tmp-'a' 来确定找哪条路， 比如 'a'-'a'走编号为0的路，'b'-'a'走编号为1的路, 在 JS 中，需通过 String.prototype.charCodeAt。
     */
    this.nexts = [];  // Array<Node1> 长度26  假设字符串都是小写字母，一个结点最多有 26 条路。
  }
}

// 前缀树结点的另一种表达
class Node2 {
  constructor() {
    this.pass = 0;
    this.end = 0;
    this.nexts = new Map();  // <number,Node2>  <0～25 代表 a~z, Node2 代表下一个结点>
  }
}

// 前缀树
class Trie1 {
  constructor() {
    this.root = new Node1();
  }
  
  // 接收到 1 条字符串，请把它拆开，然后一个一个字符挂到前缀树上
  insert(word) {
    if (word === null) {
      return;
    }
    // 'abc' -> ['a','b','c']
    const charArray = Array.from(word);
    // 每次有新字符串进来，头结点都要 pass++
    let node = this.root;
    node.pass++;
    let path = 0;  // 走哪条路径
    for (let i = 0, len = charArray.length; i < len; i++) {
      // 遍历字符串，算出每个字符该走哪条路
      path = this.getIndex(charArray[i]);
      if (node.nexts[path] === null) {
        // 当前的路底下的结点是空的，建出来，建出来以后pass为0,end为0, 然后到下面处理。
        node.nexts[path] = new Node1();
      }
      // 指针沿着字 str 代表的路，走到下一个结点
      node = node.nexts[path];
      // 到达该结点，pass++
      node.pass++;
    }
    // 本次长长的字符串 insert 结束了，结尾结点end++
    node.end++
  }
  
  // 之前可能加过多次 word 这个字符串，请删掉 1 次
  delete(word) {
    if (this.search(word) !== 0) {
      // 这个 word 真的有在前缀树里才删
      const charArray = Array.from(word);
      // 从头结点开始，往下找
      let node = this.root;
      // 每一个结点都要 --pass
      node.pass--;
      let path = 0;
      for (let i = 0, len = charArray.length; i < len; i++) {
        // 找到下面要走的路
        path = this.getIndex(charArray[i]);
        // 沿途 --pass
        if (--node.nexts[path].pass === 0) {
          // 到某个结点 --pass 完发现减到 0 了，说明下面都不会经过了，那就直接把以这个结点为头的子树删了。
          // 这样就释放了子树的内存，防止 pass 为 0 的结点残留在前缀树中，造成内存泄漏。
          node.nexts[path] = null;
          // 已经删掉以 node 为头的子树，不用往下走了。
          return;
        }
        // 往下走
        node = node.nexts[path];
      }
      // 走到 word 的结尾，end--;
      node.end--;
    }
  }
  
  // 返回 word 这个单词加入过几次
  search(word) {
    // 沿着 word 里的字符一个一个往下找，找到最后一个结点，返回 end
    if (word === null) {
      return 0;
    }
    const charArray = Array.from(word);
    let node = this.root;
    let path = 0;
    for (let i = 0, len = charArray.length; i < len; i++) {
      // 找下一条路
      path = this.getIndex(charArray[i]);
      if (node.nexts[path] === null) {
        // 往下找的过程，但凡找到一条没有建出结点的路，说明这个长长的 word 在某个地方断了，整体就是没有加入过，返回 0 次
        return 0;
      }
      // 指针往下走
      node = node.nexts[path];
    }
    // 能到达末尾，返回 end 即可。
    return node.end;
  }
  
  // 加入过的所有字符串中，有几个是以 pre 为前缀的
  prefixNumber(pre) {
    if (pre === null) {
      return 0;
    }
    const charArray = Array.from(pre);
    let node = root;
    let path = 0;
    for (let i = 0, len = charArray.length; i < len; i++) {
      path = this.getIndex(charArray[i]);
      if (node.nexts[path] === null) {
        // 还没遍历完 pre 就没路了，肯定没有 1 个字符串以 pre 作为前缀，返回 0 就行。
        return 0;
      }
      node = node.nexts[path];
    }
    // 遍历完成 pre, 到达末尾结点，返回 pass 就是以 pre 为前缀的字符串数量。
    return node.pass;
  }
  
  // 返回 character 应该到哪条路径，比如 'b', 就是 'b'.charCodeAt(0) - 'a'.charCodeAt(0)，索引是 1。
  // 'a' 的 ASCII码 是 97
  getIndex(character) {
    return character.charCodeAt(0) - 97;
  }
}
