type ListListnearType<T> = { (value: T): void } | { <U>(value: T): U };

const ArrayState = <T extends unknown>(initialValue: Array<T>) => {
  if (!Array.isArray(initialValue)) {
    let error: Error;
    if (typeof initialValue === "object") {
      error = new Error(
        "Object is not ArrayState able use ObjectState insteed!",
      );
    } else {
      const _type = typeof initialValue;

      const type = [_type.slice(0, 1).toUpperCase(), _type.slice(1)].join("");

      error = new Error(`${type} is not ArrayState able use State insteed!`);
    }
    throw error;
  }

  type ValueType = Array<T>;

  let value: ValueType = initialValue;

  const listnears = new Set<ListListnearType<ValueType>>();

  const _subscribe = (listnear: ListListnearType<ValueType>) => {
    listnears.add(listnear);
    return () => listnears.delete(listnear);
  };

  const notifyAll = () => listnears.forEach((listnear) => listnear(value));

  const reset = () => {
    value = initialValue;
    notifyAll();
  };

  function get(gatter?: undefined): ValueType;

  function get<U>(getter: (value: ValueType) => U, subscribe?: boolean): U;

  function get(getter?: ListListnearType<ValueType>, subscribe = true) {
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

  function set(
    newValue: { (value: ValueType): ValueType } | ValueType,
    notify: boolean = true,
  ) {
    if (typeof newValue === "function") {
      newValue = newValue(value);
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
    value = [];
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

export type { ListListnearType };

export { ArrayState };

export default ArrayState;
