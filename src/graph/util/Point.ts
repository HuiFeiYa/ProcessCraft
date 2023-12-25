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