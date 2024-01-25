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

* sourceId、targetId
* move、resize 时联动
* 快速创建、删除、拖动时关联关系变动

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