type noop = (...args: any[]) => unknown;

class Interceptor<T extends noop> {
  interceptor: T[] = [];

  use = (func: T): T | undefined => {
    if (typeof func === 'function') {
      this.interceptor.push(func);
      return func;
    }
    return undefined;
  };

  eject = (func: T): void => {
    this.interceptor = this.interceptor.filter(item => item !== func);
  };

  clear = (): void => {
    this.interceptor = [];
  };

  toArray = (): T[] => this.interceptor.slice();
}

export default Interceptor;
