## 简介

近期接触 Svg 比较多, 想着 Svg 能做些啥。看到 Process On 是一个应用的场景, 而且平时我们多少都会接触一些。使用人群比较多，就这样一拍脑袋决定做一个流程图的程序。

首先我们需要知道流程图需要哪些东西。页面主要分为物料区域、画布区域、操作栏。最终的产物就是在画布上绘制一些图形。  
所以我们的问题变成如何在画布上绘制出矩形、菱形、直线。这个时候就是 Svg 出场的时候了。


最近我接触到了Svg（可伸缩矢量图形）的技术，开始思考Svg能用来做些什么有趣的事情。我注意到流程图是一个常见的应用场景，我们在日常生活中经常会遇到一些流程图。因为流程图的使用人群众多，就这样一拍脑袋决定做一个流程图的程序。

首先，我们需要明确流程图软件需要哪些基本功能。主要的页面可以分为物料区域、画布区域和操作栏。而最终的目标就是在画布上绘制出各种形状的图形。

因此，我们面临的问题就变成了如何在画布上绘制矩形、菱形和直线等基本图形。这时候，Svg技术就派上用场了。

## Svg 

Svg（Scalable Vector Graphics）是一种基于XML的矢量图形格式，在前端开发中被广泛使用。与位图图像相比，Svg图像可以无损放大和缩小，适应不同的屏幕分辨率。

在前端开发中，我们可以使用Svg来创建各种形状和图标，以及实现动画效果。通过直接在HTML文件中插入Svg标签，我们可以定义并绘制出矢量图形。

Svg提供了丰富的元素和属性，例如rect（矩形）、circle（圆形）、path（路径）等，可以用于绘制不同的图形。我们可以通过设置这些元素的属性，如位置、大小、颜色，来控制图形的外观。

此外，Svg还支持CSS样式和JavaScript交互。我们可以为Svg元素应用CSS样式，使其更具吸引力和可定制性。而通过JavaScript，我们可以实现对Svg图形的动态操作和交互，如点击、拖拽、变形等。

我们这里使用 Svg 主要原因是它可以生成各种我们需要的形状。

## 画布上添加图形
从图中可以看出在画布上画出一个 rect 图形。
1. 首先有一个相对坐标轴，可能这个坐标轴的位置是相对浏览器左上角有一定偏移的。
2. 需要知道这个图形的坐标位置
3. 需要知道这个图形的宽高
### 矩形

```TS
// 通过 Bounds 来描述图形位置和大小
class Bounds  {
  constructor(
    public width = 0,
    public height = 0,
    // 画布绝对位置
    public absX = 0,
    public absY = 0,
  ) { }
}
```

```html
   <!-- 绘制 rect 图形代码  -->
    <rect :rx="radiusValue" :ry="radiusValue" :width="shape.bounds.width" :height="shape.bounds.height"
      :x="shape.bounds.absX" :y="shape.bounds.absY" :fill="shape.style.fill" :stroke="shape.style.stroke" :stroke-width="shape.style.width" />
```

绘制一个矩形不仅仅需要 `Bounds` 信息，我们还需要定义一个 `Shape` 类来描述一个通用的图形。可以是任何形状的图形。

```ts
// 目前我们用到这两个属性，后面需要更多属性再加
export class Shape {
    bounds: Bounds;
    style: StyleObj;
}
```

### 直线

首先来看一条最简单的一条直线, 涉及点 (0,0)、(0,6) 两个点，绘制一条线跟矩形不同，他可能涉及多个点，无法通过 `Bounds` 进行描述。可以通过 `Point` 描述点
```html
<path d="M0,0 L0,6 " fill="#000" />
```

```ts
interface Point {
  x: number;
  y: number;
}
```

再来更新下 `Shape` 

```ts
export class Shape {
    id: string; // 图形唯一id
    bounds: Bounds; // 此处的 (absX,absY) 和 waypoint[0] 位置相同
    style: StyleObj;
    waypoint: Point[] // 一条线至少有两个点，可以是多个点，如果多个点不在一条直线上就是折线
}
```

绘制线的代码

```html
      <!-- 展示线 -->
  <path :d="computedData.svgPath" :stroke="computedData.style.strokeColor" :stroke-dasharray="computedData.style.strokeDasharray ||
    (computedData.style.dashed ? '10 8' : '')
    " :stroke-width="computedData.style.strokeWidth" fill="none" stroke-linejoin="round" />
```

### 其他图形
如圆形、菱形、多边形等就不在赘述，也是相同的方法。像这几个图形都可以用 `Bounds` 来描述。知道了坐标，可以通过计算得到各个点，将它们绘制出来。接下来来看看如何将它们联动起来。

```VUE
<script setup lang="ts">
// 以菱形为例：计算菱形的四个点，就是取矩形四条线的中点，将它们连接起来
const points = computed(() => {
    const { absX, absY, width, height } = props.shape.bounds
    return `${absX + width / 2},${absY}  ${absX + width},${absY + height / 2} ${absX + width / 2}, ${absY + height} ${absX}, ${absY + height / 2}`
})
</script>
<!-- 菱形 -->
<polygon :points="points" fill="#fff" stroke="#000" stroke-width="2" />
```

## 交互

### 连线关系
如图所示，当我们将线拖到图形上，需要与图形建立关系。当我们建立关系后效果，拖动图形，线也会跟随移动。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d89464715aa14144a7cddd157eac950a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=292&h=261&s=11499&e=png&b=fdfdfd)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b66919803c79451293517aa82e47a278~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=230&h=275&s=9433&e=png&b=fdfdfd)
继续给 shape 添加 sourceId、targetId 来表示关联元素
```ts
interface Shape {
    id: string; // 图形唯一id
    bounds: Bounds; 
    style: StyleObj;
    waypoint: Point[]; 
    sourceId: string; // 关联的源端图形
    targetId: string; // 关联的目标端图形
}    
```

流程如下
1. 点击线 edgeShape 的端点如起始端点：source (起始点)，进行移动
2. 再释放鼠标的时候，如果此时在另一个图形上，就将 edgeShape 的 sourceId 设置为这个图形 id
3. 移动线 edgeShape 的末端点同理，更新的是 targetId

现在考虑如何判断我们在释放鼠标的时候是否在图形上。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56f3e06c52184459960bdd02d58500f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=576&h=555&s=43268&e=png&b=fcfcfc)
```vue
<!-- 画布顶层,监听整个画布事件 -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" transform-origin="0 0" @mousemove="handleMousemove">
     <!-- 渲染所有图形 -->
     <DiagramShape :graph="graph" :shape="graph.rootShape" />
</svg>
```

```vue
<!-- 每个图形单独设置事件监听，并阻止冒泡 -->
<script>
    const mousemove = (event: MouseEvent) => {
      graph.emitter.emit(EventType.SHAPE_MOUSE_MOVE, event, props.shape);
    }
</script>
  <g @click.stop @mousedown.stop @mouseup.stop @mousemove.stop @dragenter.stop dragenter stop @dragleave.stop @drop.stop
    @dragover.stop @mousemove="mousemove">
    <rect :rx="radiusValue" :ry="radiusValue" :width="shape.bounds.width" :height="shape.bounds.height"
      :x="shape.bounds.absX" :y="shape.bounds.absY" fill="#fff" stroke="#000" stroke-width="2">
    </rect>
  </g>
```

事件处理
```JS
export class EdgePointMoveModel {
    // 点击线的控制点
    startMoveEdgePoint() {
        const onMouseMove = this.onMouseMove.bind(this);
        const onMouseUp = () => {
            this.graph.emitter.off(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
            this.graph.emitter.off(EventType.SHAPE_MOUSE_UP, onMouseUp);
            window.removeEventListener('mouseup', onMouseUp); // 如果移动到了画布或窗口之外
        
            this.endMove();
        };
        // 监听移动，此函数处理关联图形高亮
        this.graph.emitter.on(EventType.SHAPE_MOUSE_MOVE, onMouseMove);
        // 此处监听鼠标释放，更新图形关系
        this.graph.emitter.on(EventType.SHAPE_MOUSE_UP, onMouseUp);
        window.addEventListener('mouseup', onMouseUp);
    }
    endMove() {
        /** 更新 edgeShape 的sourceId、targetId */
        if (this.movingShape.subShapeType === SubShapeType.CommonEdge) {
            // 如果有连接源图形，这里之所以通过 newVal 包一层是为了redo 和 undo 做的，这里可以忽略
            if (this.isSourcePoint) {
                if (this.sourceShape) {
                    newVal.sourceId = this.sourceShape.id
                } else {
                    newVal.sourceId = undefined
                }
                newVal.bounds = {
                    ...this.movingShape.bounds,
                    absX: newVal.waypoint[0].x,
                    absY: newVal.waypoint[0].y
                }
            }
            // 如果有连接 target 图形
            if (this.isTargetPoint) {
                if (this.targetShape) {
                    newVal.targetId = this.targetShape.id
                } else {
                    newVal.targetId = undefined
                }
            }
        }
    }
}
```

#### 其他场景处理
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23da7a85df1c40748373533e27c3fb81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=228&h=291&s=10867&e=png&b=fdfdfd)
* 快速创建，上图中快速创建图形需要更新对应 sourceId，targetId 。
* 删除图形时，比如删除目标的矩形，需要更新关联线的关系。  
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/822192fb7a6e42e58042984c659a5bff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=325&h=281&s=13203&e=png&b=fcfcfc)
* 拖动时关联关系变动,从图形1拖动到图形2时需要更新对应的变更关系


### 联动处理
当图形有了关联后，移动图形后需要更改关联线。初始状态如下,将矩形下移时，对应的线也要需要更新 waypoint 。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a587efd5618498f87e57c56b8c58c11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=238&h=268&s=8979&e=png&b=fdfdfd)

由于有关联，移动矩形效果如下：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f6d2c4672fa44c8911fb2854c4c4423~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=255&h=482&s=19222&e=png&b=fdfdfd)

其他场景,不仅仅是移动，如果我们 resize 大小，也是需要同步相关线。效果如下
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb6fcbd5bd4b4d68af606da11419b021~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=245&h=477&s=15596&e=png&b=fefefe)

#### 代码实现
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e24c3c58eb6a4d7bb20a850adeecd604~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=405&h=389&s=9708&e=png&b=ffffff)
如果移动的是 source 端，移动的变更 (dx,dy)。我们需要将整个变更应用到线的第一个端点

```js
/**
 * 伪代码实现,更新关联线逻辑，这里都是直线，没有涉及折线算法
 * @param {number} dx - 水平方向上的位移量。
 * @param {number} dy - 垂直方向上的位移量。
 * @param {Shape} edgeShape 移动的线
 * @param {'source' | 'target'} movePointType 移动时起点还是端点
 */
const endMove = (dx,dy,edgeShape,movePointType) => {
    // 获取绘制线的点
    const waypoint = edgeShape.waypoint
    const firstPoint = waypoint[0]
    const lastPoint = waypoint[waypoint.length - 1]
    if (movePointType === 'source') {
        firstPoint.x += dx
        firstPoint.y += dy
    } else if (movePointType === 'target') {
        lastPoint.x += dx
        lastPoint.y += dy
    }
}
```

### 输入文字
* 矩形上输入
  * 光标如何居中
* 线上输入文字，offsetX、offsetY

### move/resize 预览
* move
* resize
* 快速创建加号

### 自动扩展画布
* updateViewModel


## redo/undo
* indexDb
* 工作原理和流程

## 其他难题
* 连接裁剪
* 矩形 waypoint 计算(目前未做)
* 自动布局，点击调整画布
* 画布缩略图