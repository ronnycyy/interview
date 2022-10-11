// 先序方式序列化和反序列化

const TreeNode = require('./TreeNode');

/**
 * 先序方式序列化
 *
 * 实现:
 * 1. 先序遍历，遇到值就写入字符串，遇到 null 用 "#" 表示。
 * 2. 无论是值还是null都要用","分隔。
 * 3. 注意所有的 null 值都不要忽略。
 *
 * @param {TreeNode} root 二叉树的头结点
 * @return {string} 序列化后的字符串
*/
function serialize_pre_ways(root) {
  if (!root) {
    return "";
  }
  let ans = "";
  const stack = [];
  stack.push(root);
  while (stack.length > 0) {
    const pop = stack.pop();
    
    if (pop.val !== "#") {
      ans += pop.val.toString() + ",";
    } else {
      ans += "#,"
    }
    
    if (pop.right) {
      stack.push(pop.right);
    } else if (pop.val !== '#') {
      stack.push(new TreeNode("#"))
    }
    
    if (pop.left) {
      stack.push(pop.left);
    } else if (pop.val !== '#') {
      stack.push(new TreeNode("#"))
    }
  }
  
  return ans.slice(0, -1);
}


/**
 * 先序方式反序列化
 *
 * 实现:
 * 递归，以先序的方式消费队列
 *
 * @param {string} data 等待被反序列化成二叉树的字符串
 * @return {TreeNode} 二叉树的头结点
 */
function deserialize_pre_ways(data) {
  if (data === "") {
    return null;
  }
  // 根据队列，以先序方式建出二叉树，返回二叉树的头结点
  const preList = function(queue) {
    const s = queue.shift();
    if (s === '#') {
      // 遇到 #, 说明本次消费完毕，返回空树
      return null;
    }
    // 取出队首作为头结点
    const head = new TreeNode(Number(s));
    // 先让左子树消费队列, 直到遇到 "#" 返回
    head.left = preList(queue);
    // 建好 head 的左子树，再让右子树消费队列, 直到遇到 "#" 返回
    head.right = preList(queue);
    // head 的左右子树都已经建好，返回头结点
    return head;
  }
  // 字符串转队列
  const queue = data.split(",");
  // 整个队列用先序方式`反序列化`成二叉树，返回头结点。
  return preList(queue);
}

// 一个程序从硬盘加载到内存里，就形成了一个进程。一个程序可以有好多进程。
// 一个进程开始执行，就有了线程。进程内部可以分出很多的线程，比如 UI 线程，socket 线程等，它们共享进程的内存空间，是进程的不同执行路径。
// 主线程
function main() {
  const tree = new TreeNode(1);
  tree.left = new TreeNode(2);
  tree.right = new TreeNode(3);
  tree.left.left = null;
  tree.left.right = new TreeNode(4);
  // tree.right.left = new TreeNode(5);
  // tree.right.right = null;
  const str = serialize_pre_ways(tree);
  console.log(str);
  const head = deserialize_pre_ways(str);
  console.log(head);
}

main();
