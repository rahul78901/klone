type ObjectListnearType<T> = { (value: T): void } | { <U>(value: T): U };

const ObjectState = <T extends Record<string, unknown>>(initialValue: T) => {
  let error: Error | null = null;
  if (Array.isArray(initialValue)) {
    error = new Error("Array is not ObjectState able use ArrayState insteed!");
  }

  if (typeof initialValue !== "object") {
    const _type = typeof initialValue;

    const type = [_type.slice(0, 1).toUpperCase(), _type.slice(1)].join("");

    error = new Error(`${type} is not ObjectState able use State insteed!`);
  }

  if (error?.message) {
    throw error;
  }

  let value: T = initialValue;

  const listnears = new Set<ObjectListnearType<T>>();

  const _subscribe = (listnear: ObjectListnearType<T>) => {
    listnears.add(listnear);
    return () => listnears.delete(listnear);
  };

  const notifyAll = () => listnears.forEach((listnear) => listnear(value));

  const reset = () => {
    value = initialValue;
    notifyAll();
  };

  function get(gatter?: undefined): T;

  function get<U>(getter: (value: T) => U, subscribe?: boolean): U;

  function get(getter?: ObjectListnearType<T>, subscribe = true) {
    if (getter) {
      if (subscribe) {
        const unSubscribe = _subscribe(getter);
        getter(value);
        return unSubscribe;
      }

      return getter(value);
    }

    return value;
  }

  function set(newValue: Partial<T>, notify?: boolean): void;
  function set(newValue: (value: T) => Partial<T>, notify?: boolean): void;

  function set(
    newValue: { (value: T): Partial<T> } | Partial<T>,
    notify = true,
  ) {
    if (typeof newValue === "function") {
      newValue = (newValue as (value: T) => T)(value);
    }

    Object.assign(value, newValue);

    if (notify) {
      notifyAll();
    }
  }

  function clearAll() {
    notifyAll();
    listnears.clear();
  }

  function destroy() {
    clearAll();
    value = {} as T;
  }

  const apis = {
    get,
    set,
    subscribe: _subscribe,
    clear: clearAll,
    destroy,
  };

  function api() {
    return [get, set, apis] as const;
  }

  api.get = api.getState = get;
  api.set = api.setState = set;

  api.subscribe = _subscribe;
  api.clear = api.clearAll = clearAll;
  api.destroy = api.delete = destroy;
  api.notify = notifyAll;
  api.default = api.reset = reset;

  return api;
};

/*
const ObjectState = <T extends Object>(initialValue: T) => {
  type ValueType = T;
  let value: T = initialValue;

  const listnears = new Set<ObjectListnearType<ValueType>>();

  const _subscribe = (listnear: ObjectListnearType<T>) => {
    listnears.add(listnear);
    return () => listnears.delete(listnear);
  };

  const notifyAll = () => listnears.forEach((listnear) => listnear(value));

  const reset = () => {
    value = initialValue;
    notifyAll();
  };

  function get(gatter?: undefined): T;

  function get<U>(getter: (value: T) => U, subscribe: false): U;

  function get<U>(
    gatter?: ObjectListnearType<T> | { (value: T): U },
    subscribe: boolean = true,
  ) {
    if (gatter) {
      if (subscribe) {
        const unSubscribe = _subscribe(gatter);
        gatter(value);
        return unSubscribe;
      }
      return gatter(value);
    }

    return value;
  }

  function set(newValue: Partial<T>, notify?: boolean): void;
  function set(newValue: (value: T) => Partial<T>, notify?: boolean): void;

  function set(
    newValue: { (value: T): Partial<T> } | Partial<T>,
    notify: boolean = true,
  ) {
    if (typeof newValue === "function") {
      newValue = (newValue as (value: T) => T)(value);
    }

    Object.assign(value, newValue);

    if (notify) {
      notifyAll();
    }
  }

  function clearAll() {
    notifyAll();
    listnears.clear();
  }

  function destroy() {
    clearAll();
    value = {} as T;
  }

  const apis = {
    get,
    set,
    subscribe: _subscribe,
    clear: clearAll,
    destroy,
  };

  function api() {
    return [get, set, apis] as const;
  }

  api.get = api.getState = get;
  api.set = api.setState = set;

  api.subscribe = _subscribe;
  api.clear = api.clearAll = clearAll;
  api.destroy = api.delete = destroy;
  api.notify = notifyAll;
  api.default = api.reset = reset;

  return api;
};

*/
export type { ObjectListnearType };

export { ObjectState };

export default ObjectState;
