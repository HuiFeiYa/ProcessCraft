export class Point {
    constructor(public x = 0, public y = 0) {
  
    }
  
    static toInt(p: Point) {
      p.x = parseInt(p.x + '');
      p.y = parseInt(p.y + '');
      return p;
    }
  
    static toIntPoints(points: Point[]) {
      if (points.length === 0) return points;
      points.forEach(p => {
        p.x = Math.round(p.x);
        p.y = Math.round(p.y);
      });
      return points;
    }
  
    static clone(p: Point) {
      return new Point(p.x, p.y);
    }
  
    static isSame(p: Point, p2: Point) {
      return p.x === p2.x && p.y === p2.y;
    }
  
    // 节点去重
    static distinct(points: Point[]) {
      const newPoints = [];
      for (const p of points) {
        if (!newPoints.find(it => this.isSame(it, p))) {
          newPoints.push(p);
        }
      }
      return newPoints;
    }
  
  }

  // z坐标系旋转
export const rotate = function(p:Point, arc:number) {
  // atan2自带坐标系识别, 注意X,Y的顺序
  let A = Math.atan2(p.y, p.x); // 原来的角度
  A += arc;// 旋转，增加一个角度
  let R = Math.sqrt(p.x * p.x + p.y * p.y);// 半径
  return {
    x: Math.cos(A) * R,
    y: Math.sin(A) * R
  };
};