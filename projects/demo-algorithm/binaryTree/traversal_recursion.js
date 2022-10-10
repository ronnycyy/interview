// 递归序
function traversal_recursion(head) {
  if (!head) {
    return;
  }
  // 打印行为加在这里，就是先序遍历
  traversal_recursion(head.left);
  // 打印行为加在这里，就是中序遍历
  traversal_recursion(head.right);
  // 打印行为加在这里，就是后序遍历
}
