# 数据可视化
## SVG（声明式绘图系统）
弥补了DOM元素绘制曲线麻烦的问题，但是在输出图形前仍旧需要经过引擎解析、布局计算和渲染树生成。而且，一个 SVG 元素只表示一种基本图形，如果展示的数据很复杂，生成图形的 SVG 元素就会很多。这样一来，大量的 SVG 元素不仅会占用很多内存空间，还会增加引擎、布局计算和渲染树生成的开销，降低性能，减慢渲染速度。这也就注定了 SVG 只适合应用于元素较少的简单可视化场景。

```
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black"
  stroke-width="2" fill="orange" />
</svg>
```
* `svg`是根元素，`xmlns`是`xml`的命名空间，浏览器根据这个属性值就能够识别出这是一段svg的内容。
* `circle`元素表示这是一个绘制在SVG图像中的圆形，属性`cx、cy`表示圆心的坐标。属性`r`表示半径。
* `svg`元素使用`document.createElementNS`方法来创建svg元素。
* `svg`的`g`元素表示一个分组，使用它来对svg以安素建立起层次结构。而且，`g`元素的子元素回继承`g`元素的属性。
* 
## canvas 2d （指令式绘图系统）
通过画布进行绘制，做一些交互事件比较麻烦。

## 使用canvas

* canvas和画布上下文

````
<body>
  <canvas width="512" height="512"></canvas>
</body>
````
canvas元素的**width**和**height**是画布宽高而非**css**样式的宽高。

如果不设置CSS样式的宽高默认和canvas元素的宽高相等。

如果设置CSS样式宽高为256px，那么实际的画布宽高就是样式宽高的两倍了。


* canvas 坐标系

和浏览器相似，左上角为坐标原点，x、y轴分别向右向下。

* 绘制几何图形
	1. 获取 Canvas 对象，通过 getContext(‘2d’) 得到 2D 上下文
	2. 设置绘图状态，比如填充颜色 fillStyle，平移变换 translate 等等
	3. 调用 beginPath 指令开始绘制图形
	4. 调用绘图指令，比如 rect，表示绘制矩形
	5. 调用 fill 指令，将绘制内容真正输出到画布上

## WebGL
使用复杂，功能强大，大批量绘制，超高性能，3D。webgl针对底层机制而言更加开放，要与内存、GPU打交道，真正控制图形输出的每一个细节。

1. 图形系统是如何绘图的？
	* 一个通用计算机图形系统主要包括6个部分：输入设备、中央处理单元、图形处理单元、存储器、帧缓存、输出设备
		* 光栅：几乎所有的现代图形系统都是基于光栅来绘制图形的，光栅就是指构成图像的像素阵列。
		* 像素：一个像素对应图像上的一个点，它通常保存图像上的某个具体位置的颜色等信息。
		* 帧缓存：在绘图过程中，像素信息被存放于帧缓存中，帧缓存是一块内存地址。
		* CPU：中央处理单元，负责逻辑计算。
		* GPU：图形处理单元，负责图形计算。 
2. GPU是什么？
	* GPU 是由大量的小型处理单元构成的，它可能远远没有 CPU 那么强大，但胜在数量众多，可以保证每个单元处理一个简单的任务。即使我们要处理一张 800 * 600 大小的图片，GPU 也可以保证这 48 万个像素点分别对应一个小单元，这样我们就可以同时对每个像素点进行计算了。
3. 如何用 WebGL 绘制三角形？
* 浏览器提供的 WebGL API 是 OpenGL ES 的 JavaScript 绑定版本，它赋予了开发者操作 GPU 的能力。这一特点也让 WebGL 的绘图方式和其他图形系统的“开箱即用”（直接调用绘图指令或者创建图形元素就可以完成绘图）的绘图方式完全不同，甚至要复杂得多。我们可以总结为以下 5 个步骤：
	1. 创建`WebGL`上下文
		* 创建`WebGL`上下文这一步和`Canvas2D`的使用几乎一样，区别是将`getContext`参数换成`webgl`
		```
			const canvas = document.querySelector('canvas');
			const gl = canvas.getContext('webgl');
		```
	2. 创建`WebGL`程序
		* 编写两个着色器（Shader）（顶点着色器、片元着色器）。着色器是用 GLSL 这种编程语言编写的代码片段。
		```		
			const vertex = `
			  attribute vec2 position;
			
			  void main() {
			    gl_PointSize = 1.0;
			    gl_Position = vec4(position, 1.0, 1.0);
			  }
			`
			
			
			const fragment = `
			  precision mediump float;
			
			  void main()
			  {
			    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
			  }    
			`
		```
		* 顶点：就是几何图形的顶点
		* 图元：是WebGL可直接处理的图形单元，由WebGl的绘图模式决定，有点、线、三角形等。
		* `WebGL` 从顶点着色器和图元提取像素点给片元着色器执行代码的过程，就是我们前面说的生成光栅信息的过程，我们也叫它光栅化过程。所以，片元着色器的作用，就是处理光栅化后的像素信息。
		* 创建shader对象
		```
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vertexShader, vertex);
			gl.compileShader(vertexShader);
			
			
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fragmentShader, fragment);
			gl.compileShader(fragmentShader);
		```
		* 创建`WebGLProgram`对象，并将这两个`shader`关联到这个`WebGL`程序上。`WebGLProgram`对象的创建过程主要是添加`vertexShader` 和 `fragmentShader`，然后将这个 `WebGLProgram `对象链接到 WebGL 上下文对象上。
		```
			const program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
		```
		* 最后通过`useProgram`选择启动这个`WebGLProgram`对象。
		```
			gl.useProgram(program)
		```
	3. 将数据存入缓冲区
		* `WebGL`坐标系是一个三维空间坐标系，坐标原点是（0，0，0）。其中，x轴朝右、y轴朝上、z轴朝外。这是一个右手坐标系。
		* 首先，我们要定义这个三角形的三个顶点。`WebGL`使用的数据需要用类型数组定义，默认格式是`Float32Array`，它是JavaScript的一种类型化数组，通常用来处理二进制缓冲区的数据。
		```
			const points = new Float32Array([
			  -1, -1,
			  0, 1,
			  1, -1,
			]);
		```
		* 将定义好的数据写入`WebGL`。创建一个缓存对象，将它绑定为当前操作对象，再把当前的数据写入缓存对象。
		```
			const bufferId = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
			gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
		```
	4. 将缓冲区数据读取到`GPU`
		* 现在我们已经把数据写入缓存了，但是我们的`shader`现在还不能读取这个数据，还需要把数据绑定给顶点着色器中的`position`变量。
		```
			const vPosition = gl.getAttribLocation(program, 'position');获取顶点着色器中的position变量的地址
			gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);给变量设置长度和类型
			gl.enableVertexAttribArray(vPosition);激活这个变量
		```
	5. `GPU`执行`WebGL`程序，输出结果
		* 调用绘图指令
		```
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
		```





	
	
	
	








