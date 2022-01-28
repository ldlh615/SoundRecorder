export default class EmitEvent {
  private eventMap: Record<string, Function>;

  constructor() {
    this.eventMap = {};
  }

  on(key: string, func: Function) {
    this.eventMap[key] = func;
  }

  off(key: string) {
    delete this.eventMap[key];
  }

  emit(key: string, ...data: any) {
    if (typeof this.eventMap[key] === 'function') {
      return this.eventMap[key](...data);
    }
  }
}
