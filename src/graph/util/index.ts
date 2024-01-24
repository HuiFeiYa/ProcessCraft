import { Base36 } from "../types";
import { Bounds, int } from "./Bounds";
import { Point } from "./Point";
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

export const getStepId = (() => {
  let now = Base36.encode(Date.now() - 1634869060000);
  let random = Base36.encode(parseInt(Math.random() * 1000000 + ''));
  return `${now}${random}`;
})

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

/**
 * 判断两个对象值是否相同
 * @param object1 
 * @param object2 
 * @returns 
 */
export function structuralEquality(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);

    if (
      areObjects && !structuralEquality(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;
}

export function isObject(object) {
  return object != null && typeof object === 'object';
}

/**
 * 对比两个对象，保留它们不同的值
 * @param obj1 
 * @param obj2 
 * @returns 
 */
export function recursiveOmit(obj1, obj2) {
  const result1 = {}; // 用于存储obj1独有的键值对
  const result2 = {}; // 用于存储obj2独有的键值对

  // Helper function to compare values
  const compareValues = (key, value1, value2) => {
    if (value1 === value2) return; // if values are equal, omit them
    if (typeof value1 === 'object' && typeof value2 === 'object' && !Array.isArray(value1) && !Array.isArray(value2)) {
      const [childResult1, childResult2] = recursiveOmit(value1, value2);
      if (Object.keys(childResult1).length !== 0 || Object.keys(childResult2).length !== 0) {
        result1[key] = childResult1;
        result2[key] = childResult2;
      }
    } else {
      result1[key] = value1;
      result2[key] = value2;
    }
  };

  // 对比两个对象的键和值
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
      result1[key] = obj1[key]; // key only in obj1
    } else if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      compareValues(key, obj1[key], obj2[key]); // key in both
    }
  }

  for (let key in obj2) {
    if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
      result2[key] = obj2[key]; // key only in obj2
    }
  }

  return [result1, result2];
}

export function getBoundsCenterPoint(bounds: Bounds, useFloat = true) {
  let x = bounds.absX + bounds.width / 2;
  let y = bounds.absY;
  if (useFloat) {
    x = float(x);
    y = float(y);
  }
  return new Point(x, y);
}