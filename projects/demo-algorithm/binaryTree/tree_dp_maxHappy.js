/**
 * 派对的最大快乐值🎉
 *
 * 公司的每个员工都符合 Employee 类的描述。
 * 整个公司的人员结构可以看作是一棵标准的、 没有环的多叉树。树的头节点是公司唯一的老板。
 * 除老板之外的每个员工都有唯一的直接上级。 叶节点是没有任何下属的基层员工(subordinates列表为空)，除基层员工外，每个员工都有一个或多个直接下级。
 *
 * 这个公司现在要办party，你可以决定哪些员工来，哪些员工不来，规则：
 *   1. 如果某个员工来了，那么这个员工的所有直接下级都不能来
 *   2. 派对的整体快乐值是所有到场员工快乐值的累加
 *   3. 你的目标是让派对的整体快乐值尽量大
 * 给定一棵多叉树的头节点boss，请返回派对的最大快乐值。
 *
 *
 * 一、想问题
 * 以 x 为头的子树，最大快乐值有多少种可能性？
 *
 * 二、分可能性
 * 1. "x来"是一种可能
 * 2. "x不来"是一种可能
 * 两者取其 max 就是"以x为头的子树的最大快乐值🎉"。
 *
 * 1.x来
 *  那么 x 的直属下级就都不能来:
 *  ans = x.value + child1不来.maxHappy + child2不来.maxHappy + ... + childN不来.maxHappy
 *
 * 2.x不来
 *  那么 x 的直属下级可以来，也可以不来，求一个 max 值:
 *  ans = 0 + Math.max(child1来.maxHappy, child1不来.maxHappy) + ... + Math.max(childN来.maxHappy, childN不来.maxHappy)
 *
 * 三、提取 Info 属性
 * 1. 子树"头结点来"的情况下的 maxHappy
 * 2. 子树"头结点不来"的情况下的 maxHappy
*/

/**
 * @param {Employee} root
 * @returns {number}
 */
function maxHappyInParty(root) {
  const info = proc(root);
  return Math.max(info.maxHappyComing, info.maxHappyNoComing);
}

/**
 * @param {Employee} x
 * @returns {Info}
 */
function proc(x) {
  if (!x) {
    return new Info(0, 0);
  }
  // 收集子结点的 infos，整合自己的信息
  let mc = x.happy;  // x来
  let mnc = 0;  // x不来
  for (let i = 0, len = x.subordinates.length; i < len; i++) {
    // 每个直属下级的 info
    const info = proc(x.subordinates[i]);
    // x来，直属下级就都不能来
    mc += info.maxHappyNoComing;
    // x不来，直属下级爱来不来，mnc 含义是"最大"，所以取 max。
    mnc += Math.max(info.maxHappyComing, info.maxHappyNoComing);
  }
  // 上交给父结点
  return new Info(mc, mnc);
}

/**
 * @constructor 子结点上交给父结点的 Info 构造函数
 */
function Info(mc, mnc) {
  this.maxHappyComing = mc;  // 子树"头结点来"的情况下，子树最大快乐值
  this.maxHappyNoComing = mnc;  // 子树"头结点不来"的情况下，子树最大快乐值
}

/**
 * @constructor 员工结点构造函数
 */
function Employee(happy) {
  this.happy = happy;  // number 本员工的快乐值
  this.subordinates = [];  // Array<Employee> 本员工的直属下级们
}


// 本进程的主线程 验证器
function main() {
  const head = new Employee(100);
  const childs = [];
  for (let i = 0; i < 4; i++) {
    const c = new Employee(i+7);
    c.subordinates = [new Employee(i+3)];
    childs.push(c);
  }
  head.subordinates = childs;
  console.log(head)
  console.log(maxHappyInParty(head));
}

main();
