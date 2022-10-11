// require 是经过 Node.js 包装后的 (function (module, exports, require) { ... }) 里的 require 函数。
// 如果之前 require 过就会有缓存，本次直接从缓存里拿，不会再执行一遍。
const TreeNode = require('./TreeNode');

/**
 * 按层方式序列化
 *
 * 实现:
 * 1. 把头结点序列化，然后加入队列
 * 2. 以队列方式，按层遍历二叉树，每个结点进入队列前序列化，而不是出队列的时候序列化
 * 3. 结点值为 null 时，无需加入队列，但是要参与序列化
 *
 * @param {TreeNode} root 头结点
 * @return {string} 序列化之后的字符串
 */
function serialize_level_ways(root) {
  const ans = [];  // Array<string>
  if (!root) {
    ans.push("#");
  } else {
    // 先把头结点序列化
    ans.push(root.val.toString());
    // 准备一个队列，存放层序遍历的结果
    const queue = [];  // Array<TreeNode>
    queue.unshift(root);
    
    while (queue.length > 0) {
      root = queue.pop();
      // 弹出的时候，不管孩子是不是 null, 都要序列化到 ans 里。
      // 只有孩子不为 null 的时候，才加入 queue, 参与层序遍历。
      // 所以，不是弹出的时候序列化，而是进去的时候序列化。
      
      if (root.left) {
        ans.push(root.left.val.toString());
        queue.unshift(root.left);
      } else {
        ans.push("#");
      }
      
      if (root.right) {
        ans.push(root.right.val.toString());
        queue.unshift(root.right);
      } else {
        ans.push("#");
      }
    }
  }
  
  return ans.join(",");
}

/**
 * 按层方式反序列化
 *
 * 实现:
 * 1. 把字符串转成队列 (左<---右,这样的顺序,作为队列)
 * 2. 以层序遍历的方式，依次消费队列，建出二叉树
 *
 * @param {string} data 待反序列化的字符串
 * @return {TreeNode} root 反序列化后的二叉树头结点
 */
function deserialize_level_ways(data) {
  if (data === "") {
    return null;
  }
  // 准备一个层序遍历的队列
  const queue = [];
  // 字符串转队列
  const dataQueue = data.split(",");
  // 从队首建出头结点
  const head = generateNode(dataQueue.shift());
  // 建出来就放到队列里去
  if (head !== null) {
    queue.unshift(head);
  }
  // 层序遍历
  while (queue.length > 0) {
    const pop = queue.pop();
    // 每弹出一个结点，就反序列化它的左孩子和右孩子
    pop.left = generateNode(dataQueue.shift());
    pop.right = generateNode(dataQueue.shift());
    // 左右孩子只要反序列化出来有值，就加入队列，等待被弹出反序列化它的子树。
    if (pop.left) {
      queue.unshift(pop.left);
    }
    if (pop.right) {
      queue.unshift(pop.right);
    }
  }
  // 返回建好的头结点
  return head;
  
  // 从单个字符，创建出二叉树结点，返回
  function generateNode(data) {
    if (data === "#") {
      return null;
    }
    return new TreeNode(Number(data), null, null);
  }
}

function main() {
  const tree = new TreeNode(3);
  tree.left = new TreeNode(4);
  tree.right = new TreeNode(5);
  tree.left.left = null;
  tree.left.right = new TreeNode(6);
  // tree.right.left = new TreeNode(7);
  // tree.right.right = null;
  const str = serialize_level_ways(tree);
  console.log(str);
  const head = deserialize_level_ways(str);
  console.log(head);
}

main();
