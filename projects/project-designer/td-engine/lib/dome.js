var canvas = document.getElementById('canvas')

var context = canvas.getContext('2d');

context.width = canvas.width
context.height = canvas.height

context.beginPath();//开始路劲 重置一个集合
context.moveTo(75, 50);
context.lineTo(100, 75);
context.lineTo(100, 25);
context.closePath(); //路劲闭合，数据集合存储到
context.stroke();  //从集合中拿点



