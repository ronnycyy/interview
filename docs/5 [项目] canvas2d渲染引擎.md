# canvas2D渲染引擎
该项目是一个公司级别的 canvas 2D 渲染引擎，用于支持公司的各种网页设计器，它提供的功能有拾取、局部渲染、事件机制、交互式对象模型等。
我负责的内容是设计并实现拾取方案，以及局部渲染功能的实现。

# f技术选型
Canvas + Typescript

# f负责内容
1. 拾取方案的设计与实现
2. 局部渲染功能实现

# f项目难点
1. 根据用户点击的位置，从 canvas 的绘制结果中高效地拾取出图形。

# f项目成果
基于本渲染引擎，公司实现了各种网页设计器项目，如会场设计器、屏幕设计器等，这些项目已服务于北京市人大常委会、政协常委会、联合国日内瓦办事处等国内外会场。(可查看官网 https://www.taiden.cn)

# 难点1.f拾取  负责内容1
拾取是指根据用户在 canvas 上点击的位置，获取某个图形，以展示选中状态、编辑属性等。但是 canvas 不会保存绘图的状态，绘制完成以后就是一张图片，
所以难点在于如何在一张包含很多图形的图片中，选中某个图形？

研究了 canvas 以及一个叫 fabric.js 的渲染库后，我提出了一个方案，具体的做法分为两步，一步是初始化绘图时，另一步是点击图形时:
*初始化绘图*
1. 维护 2 个 canvas, 宽高一致，上面一个作为`渲染层`，下面一个作为`隐藏层`，`隐藏层`设置`visibility: hidden;`。
2. 定义一个 graphs，维护`颜色`以及`颜色对应的图形`。
3. 获取两层 canvas 对应的 ctx, 初始化绘图。
4. 随机生成颜色值，如果已经用过，重新生成，保证颜色值唯一。
5. 将唯一颜色作为 key, 将图形数据作为值，放入 graphs 中。
6. 根据图形数据，绘制`渲染层`图形。
7. 根据图形数据，加上刚刚生成的唯一颜色值，绘制`隐藏层`图形，`隐藏层`图形的形状和`渲染层`一模一样，只是颜色全部填充唯一key值。
*点击图形*
1. 监听`渲染层`的 mousedown 事件，获取鼠标像素点位置。
2. 把像素点坐标传给`隐藏层`的上下文，通过 hideCtx.getImageData 这个 API，传入 w 和 h 都是1, 获取 ImageData 对象，得到颜色值数组 Uint8ClampedArray。
3. 把数组转成 16 进制的颜色值。
4. 通过颜色值，在 graphs 集合里查找到图形数据。
5. 得到图形数据以后就可以更改颜色、位置、大小等运行时数据了，比如更新选中的图形数据的边框颜色，提示用户已选中了这个控件。最后用这份新数据重新绘图即可。

## 移动
基于`拾取`方案可以很容易实现`移动`逻辑。
1. 拿到`点击`的时候选中的颜色值，从 graphs 集合里拿出图形数据。
2. 监听 mousemove 事件，得到 e.clientX, e.clientY。
3. 改变图形数据的 left, top, 重新绘图。

## fisPointInPath的性能问题
1. ctx.isPointInPath 用来检测某一个点是否在当前路径中。
2. 相当在一个点的集合里找到某一个点, ([point1, point2, point3, ...] => target point), 而且由于 canvas 在绘制完成之后`路径`就消失了，如果现在要检测，需要重新创建`路径`, 相当于在底层要重新绘制一遍。
即每调用一次 isPointInPath, canvas 就会重新绘制一遍`beginPath`决定的 `路径`，然后遍历路径上的所有点，寻找目标点是否在其中。
3. 需要注意的是，当我们每次执行一次 beginPath 方法，检测路径就变成了这次 beginPath 之后绘制的路径，原来的路径不会参与检测。

*初始化绘图 代码*
```js
function initDraw(ctx, hideCtx) {
  const uniqueColor = getUniqueColor();
  graphs[color] = {
    id: 123,
    type: 'circle',
    color: '#4567bd',
    radius: 5,
    lineWidth: 2,
    isFill: false,
    ...
  }
  drawGrap(...);
}
function drawGraph(...) {
  drawSingleGraph(ctx, ...);
  drawSingleGraph(hideCtx, uniqueColor, ...);
}
function drawSingleGraph(ctx, point, isFill, lineWidth, color) {
  ctx.clearRect(0, 0, ctx.width, ctx.height); //清空画布
  ctx.save(); //储存状态
  ctx.beginPath();
  color && (isFill ? ctx.fillStyle = color : ctx.strokeStyle = color); //判断是有颜色的情况，就设置颜色大小
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 5
  point.forEach((point, index) => {
    //index为0
    if (!index) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  })
  ctx.closePath();
  isFill ? ctx.fill() : ctx.stroke();//判断是否是填充
  ctx.restore(); //恢复上一次的状态
}
```
*点击图形 代码*
```js
canvas.addEventListener('mousedown', function (e) {
  let pointX = e.clientX, pointY = e.clientY;
  let getHideColor = hideCtx.getImageData(pointX, pointY, 1, 1).data;
  const getHexColor = rgbToHex(getHideColor[0], getHideColor[1], getHideColor[2]);
  const graphsData = graphs[getHexColor];//选中的图形信息
  selectedGraph = getHexColor;

  downFlag = {
    lastPointX: pointX,
    lastPointY: pointY
  };
  if (!graphsData) {
    return
  }
  const { points, isFill, lineWidth, color } = graphsData;

  graphsData.color = '#ff00ff';//选中更新边框颜色
  drawGraph(ctx, hideCtx, points, isFill, lineWidth, getHexColor, graphsData.color);
}, false)
```

# 负责内容2. f局部渲染
局部渲染是指，canvas 上有很多图形，但是我们很多时候只回操作一个图形，这时候只渲染这个图形代表的部分，而不影响其他图形，就是局部渲染。

我们的老方案是 ctx.clearRect 擦除整张画布重新绘制。我觉得这样很浪费性能，所以提出了一个局部渲染的方案:
基于分层处理来做的，选中一个图形以后，新创建一个图层，把这个图形挪到新图层来，其他图形保留在原图层中，图形变化时，只刷新新图层。这样就不需要每次都擦除原图层的 canvas 
。当你下次点击新的图形时，就把老的图形挪回原图层，把新的图形移动到上层来，这样就优化了性能。

新图层和老图层是重叠的，从上往下，在视觉上看，就好像图形在老图层上刷新一样。

# f层叠控制
用一个数组，存放所有的图形[图形1，图形2，图形3]，先绘制的放最前面，后绘制的放后面。
如果`拾取`的时候，目标点在两个图形的交集处，那么通过 graphs 取到的就是一个数组，选中的默认是在前面一层的图形，这个可以根据应用逻辑自己定义。

# f事件机制的封装
监听 canvas 元素的 mousemove, mousedown, keydown 等事件，通过`拾取`得到图形的运行时数据，进行事件封装。

# f坐标系控制
从 (0,0) 开始，往右 x 增大，往下 y 增加。

# f体积 f打出来的包有多大
td-engine.js: 1MB
td-engine.min.js: 312KB


# f原理
1. 拾取
2. 局部渲染
3. 图形层叠控制
4. 绘图分层处理
5. 事件机制的封装
6. 坐标系的控制 (状态)

# 控件
1. 矩形
2. 圆形
3. 三角形
4. 路径
5. 箭头

# 控制点



================================== fThree.js ==================================

