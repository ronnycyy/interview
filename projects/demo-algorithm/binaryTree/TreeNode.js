function TreeNode(val) {
  this.val = val;
  this.left = null;
  this.right = null;
}

// module 是经过 Node.js 包装后的 (function (module, exports, require) { ... }) 里的 module 对象。
// module.exports 其实是在给 module 的 exports 属性赋值。
module.exports = TreeNode;
