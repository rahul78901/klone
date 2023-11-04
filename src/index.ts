type StateListnearType<T> = { (value: T): void } | { <U>(value: T): U };

const State = <T extends string | number | boolean>(initialValue: T) => {
  if (Array.isArray(initialValue)) {
    throw new Error("Array is not State able use ListState insteed!");
  }

  if (typeof initialValue === "object") {
    throw new Error("Object is not State able use ObjectState insteed!");
  }

  let value: T = initialValue;

  const listnears = new Set<StateListnearType<T>>();

  const _subscribe = (listnear: StateListnearType<T>) => {
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

  function get(gatter?: StateListnearType<T>, subscribe = true) {
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

  function set(newValue: T, notify?: boolean): void;
  function set(newValue: (value: T) => T, notify?: boolean): void;

  function set(newValue: { (value: T): T } | T, notify = true) {
    if (typeof newValue === "function") {
      newValue = (newValue as (value: T) => T)(value);
    }

    value = newValue;

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

    value = (
      typeof initialValue === "string"
        ? ""
        : typeof initialValue === "number"
        ? 0
        : typeof initialValue === "boolean"
        ? true
        : 0
    ) as T;
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

export type { StateListnearType };

export { State };

export default State;
