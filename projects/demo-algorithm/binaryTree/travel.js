// 递归序
function travel(head) {
  if (!head) {
    return;
  }
  // 打印行为加在这里，就是先序遍历
  travel(head.left);
  // 打印行为加在这里，就是中序遍历
  travel(head.right);
  // 打印行为加在这里，就是后序遍历
}
