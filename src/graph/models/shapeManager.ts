import { SkeletonDrawer } from "./ShapeSkeletonUtil";

/**
 * 图形组件管理器
 * 所有图形的组件都要注册到这里
 */
export class ShapeCompManager {
  map = new Map<string, any>();

  skeletonDrawerMap = new Map<string, SkeletonDrawer>();
  /**
   *
   * @param key
   * @param comp 组件
   */
  addShape(key: string, comp: any) {
    this.map.set(key, comp);
    // this.map[comp];
  }
  addShapes(arr: { key: string; comp: any; skeletonDrawer?: SkeletonDrawer }[]) {
    arr.forEach((it) => {
      this.addShape(it.key, it.comp);
      if (it.skeletonDrawer) {
        this.skeletonDrawerMap.set(it.key, it.skeletonDrawer);
      }
    });
  }

  get(key: string) {
    return this.map.get(key);
  }
}
