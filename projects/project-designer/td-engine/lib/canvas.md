图形学
    离线渲染 
    在线渲染  实时互动 实时渲染 

    1.数据可视化 
    2.2d在线文档 在线应用 
    3.3d https://gizmohub.com/demos/autohome/?from=groupmessage
    4.游戏
    5.人工智能
    6.AR VR


 一个像素点 ，展示到屏幕过程，背后是什么样子

 数据和指令--> CPU --> 显卡驱动程序  --> 显卡 --> 显示器 -->人眼

显示器  多个小方格    光源 白光->滤光片   -->红、绿、蓝 强度==> 不同的颜色  --> 像素点有规律的排布-->液晶有规律的排序--> 有规律的电压《--电压信号
CRT 磷光物质 ==>
 
 液晶显示器 ==> 液晶 --> 电压  

 数模转换的过程 -->010101010 (CPU) 
 
编码：隐匿在计算机软硬件背后的语言  

显卡  --> 图形处理能力   
1. CPU -->GPU    光栅化  CPU数据 ==>GPU数据
1+2=3
2. GPU --> 显存 
3. 显存 010101010 
4. 010101010 --> 液晶屏

图形学 -->> CPU  GPU 

CPU   
计算单元 
存储单元 
控制单元 
串行处理 


GPU  ==>webgl  面相与GPU编程的接口  
计算单元 
存储单元 
控制单元 

并行处理 



canvas2d    CPU  
webgl  != 3d   GPU 

save restore  绘图状态    
10   50 

[point,point,point,point,point,point]  point
canvas2d  底层绘图的逻辑     笔式触控仪   路劲 
ispointpath   重新绘制路径 



canvas 2d引擎     skia  


canvas2d 引擎： 
1. 拾取  
    canvas ==>绘制完成 ==>图片


    #986367:{
        当前应用绘制的某一个物体的几何逻辑数据
    }


    #985366:{
        当前应用绘制的某一个物体的几何逻辑数据
    }


2. 局部渲染  

3. 图形层叠控制  
    [图形3、图形1、图形2] 舞台 ==>节目表演顺序 
4. 绘图分层处理

5. 事件机制的封装  

6. 坐标系的控制（状态）



https://github.com/myliang/x-spreadsheet

antd 
Gcanvas