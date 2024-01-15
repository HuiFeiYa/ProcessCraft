import { Base36 } from "../types";
import { charWidthConfig } from "./charWidth";

/**
 * svg path 路径构造器
 * 小写的方法都是传相对的坐标
 * 大写方法都是传绝对坐标
 */
export class PathBuilder {
  path = "";

  moveTo(dx: number, dy: number) {
    this.path += `m ${dx} ${dy} `;
    return this;
    // this.path.app
  }
  MoveTo(x: number, y: number) {
    this.path += `M ${x} ${y} `;
    return this;
  }

  lineTo(dx: number, dy: number) {
    this.path += `l ${dx} ${dy} `;
    return this;
  }
  LineTo(x: number, y: number) {
    this.path += `L ${x} ${y} `;
    return this;
  }

  lineHorizontalTo(dx: number) {
    this.path += `h ${dx} `;
    return this;
  }
  LineHorizontalTo(x: number) {
    this.path += `H ${x} `;
    return this;
  }

  lineVerticalTo(dy: number) {
    this.path += `v ${dy} `;
    return this;
  }
  LineVerticalTo(y: number) {
    this.path += `V ${y} `;
    return this;
  }

  /**
   * 闭合路径 即Z命令
   */
  closePath() {
    this.path += "Z";
    return this;
  }
  /**
   * 三次贝塞尔曲线 相对
   * @param x1 控制点1
   * @param y1
   * @param x2 控制点2
   * @param y2
   * @param x 终点
   * @param y
   */
  curve(x1: number, y1: number, x2: number, y2: number, x: number, y: number) {
    this.path += `c ${x1} ${y1}, ${x2} ${y2}, ${x} ${y} `;
    return this;
  }
  /**
   * 三次贝塞尔曲线 绝对
   * @param x1 控制点1
   * @param y1
   * @param x2 控制点2
   * @param y2
   * @param x 终点
   * @param y
   */
  Curve(x1: number, y1: number, x2: number, y2: number, x: number, y: number) {
    this.path += `C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y} `;
    return this;
  }
  /**
   * 二次贝塞尔曲线相对
   * @param dx1
   * @param dy1
   * @param dx
   * @param dy
   */
  q(dx1: number, dy1: number, dx: number, dy: number) {
    this.path += `q ${dx1} ${dy1}, ${dx} ${dy} `;
    return this;
  }

  /**
   * 二次贝塞尔曲线 绝对
   * @param x1
   * @param y1
   * @param x
   * @param y
   */
  Q(x1: number, y1: number, x: number, y: number) {
    this.path += `Q ${x1} ${y1}, ${x} ${y} `;
    return this;
  }
  /**
   * S命令会根据前一个C命令或S命令推断出第一个控制点（中心对称点）
   * 如果S命令跟在一个C或S命令后面，则它的第一个控制点会被假设成前一个命令曲线的第二个控制点的中心对称点
   * @param x1
   * @param y1
   * @param x
   * @param y
   */
  s(dx1: number, dy1: number, dx: number, dy: number) {
    this.path += `s ${dx1} ${dy1}, ${dx} ${dy} `;
    return this;
  }

  /**
   * 如果S命令跟在一个C或S命令后面，则它的第一个控制点会被假设成前一个命令曲线的第二个控制点的中心对称点
   * @param x1
   * @param y1
   * @param x
   * @param y
   */
  S(x1: number, y1: number, x: number, y: number) {
    this.path += `S ${x1} ${y1}, ${x} ${y} `;
    return this;
  }

  /**
   * 弧线 （椭圆）
   * https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#arcs
   * @param rx
   * @param ry
   * @param xAxisRotation
   * @param largeArcFlag
   * @param sweepFlag
   * @param x
   * @param y
   */
  Arc(
    rx: number,
    ry: number,
    xAxisRotation: number,
    largeArcFlag: 0 | 1,
    sweepFlag: 0 | 1,
    x: number,
    y: number
  ) {
    this.path += `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y} `;
    return this;
  }
  /**
   *  弧线 （椭圆）
   * https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#arcs
   * @param rx
   * @param ry
   * @param xAxisRotation
   * @param largeArcFlag
   * @param sweepFlag
   * @param dx
   * @param dy
   */
  arc(
    rx: number,
    ry: number,
    xAxisRotation: number,
    largeArcFlag: 0 | 1,
    sweepFlag: 0 | 1,
    dx: number,
    dy: number
  ) {
    this.path += `a ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${dx} ${dy} `;
    return this;
  }

  clear() {
    this.path = "";
  }

  getPath() {
    return this.path;
  }
}

export const pathBuilder = new PathBuilder();


/**
 * 获取唯一的id，以时间为基准，
 */
export const getUid = (() => {
  let now = Base36.encode(Date.now() - 1634869060000);
  let random = Base36.encode(parseInt(Math.random() * 10000 + ''));
  let index = 0;
  let p = `${now}-${random}-`;
  return () => {
    if (index >= Number.MAX_SAFE_INTEGER) {
      now = Base36.encode(Date.now() - 1634869060000);
      random = Base36.encode(parseInt(Math.random() * 10000 + ''));
      index = 0;
      p = `${now}-${random}-`;
    }
    index++;
    return `${p}${Base36.encode(index)}`;

  };
})();

/**
 * 四舍五入转小数，默认保留两位小数
 * @param num
 * @returns
 */
export function float(num: number, precision = 2) {
  return parseFloat(num.toFixed(precision));
}

/**
 * 根据文本字符串，其对应设置的样式获取文本长度
 * @param str 
 * @param fontSize 
 * @param fontWeight 
 * @param fontFamily 
 * @returns 
 */
export function getTextWidth(str: string, fontSize: number, fontFamily: keyof typeof charWidthConfig = '') {

  if (str === null || str === undefined) {
    return 0;
  }
  let width = 0;
  let char = '';
  const scale = (fontSize / 12);
  const oneFontSize = fontSize * 1000;
  let charWidth = 0;
  const length = str.length;
  for (let i = 0; i < length; i++) {
    char = str.charAt(i);
    charWidth = (charWidthConfig)[fontFamily]?.[char];
    if (charWidth) {
      charWidth = charWidth * scale;
    } else {
      charWidth = oneFontSize; // 没有配置的fontFamily使用默认的
    }
    width += charWidth;

  }
  return Math.ceil(width / 1000) + 2;
}