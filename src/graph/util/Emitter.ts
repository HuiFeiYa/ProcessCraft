export class Emitter {
    store:{[propName:string]:Function[]}
    allowUnknownEvent:boolean
    constructor(allowUnknownEvent = false) {
      this.store = {};
      this.allowUnknownEvent = allowUnknownEvent;
  
    }
    on(event:string, callback:Function) {
      // if (!this.allowUnknownEvent && !eventPool[event] ) console.warn('未定义的事件名: ' + event + ',请注册到util/emitter eventPool中');
      if (!this.store[event]) {
        this.store[event] = [];
      }
      this.store[event].push(callback);
    }
    onBatch(obj:{[propName:string]:Function}) {
      Object.keys(obj).forEach(key => {
        this.on(key, obj[key]);
      });
    }
    off(event:string, callback:Function) {
      if (!this.store[event]) return;
      if (!callback) {
        delete this.store[event];
        return;
      }
      const index = this.store[event].indexOf(callback);
      if (index > -1) {
        this.store[event].splice(index, 1);
        if (this.store[event].length == 0) {
          delete this.store[event];
        }
      }
  
    }
    offBatch(obj:{[propName:string]:Function}) {
      Object.keys(obj).forEach(key => {
        this.off(key, obj[key]);
      });
    }
    emit(event:string, ...rest:any[]) {
      if (!this.store[event]) return;
      // if (event !== 'update-hover-shape') {
      //
      // }
      this.store[event].forEach(callback => {
        try {
          callback(...rest);
        } catch (e) {
          console.error(e);
        }
      });
    }
    /**
     *  清除所有事件
     */
    clear() {
      this.store = {};
    }
  
  }