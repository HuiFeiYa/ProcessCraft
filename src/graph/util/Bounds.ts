/**
 * 四舍五入转整数
 * @param num
 * @returns
 */
export function int(num:number|string) {
    return Math.round(+num);
  }
  
export class Bounds {

    constructor(public x = 0, public y = 0, public width = 0, public height = 0, public absX = 0, public absY = 0) {
  
    }
  
    static toInt(bounds:Bounds) {
      bounds.absX = int(bounds.absX);
      bounds.x = int(bounds.x);
      bounds.absY = int(bounds.absY);
      bounds.y = int(bounds.y);
      bounds.width = int(bounds.width);
      bounds.height = int(bounds.height);
    }
  
}