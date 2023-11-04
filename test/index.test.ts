import { describe, expect, test, vi } from "vitest";
import State from "../src";

describe("running test for State", () => {
  test("should in proper type", () => {
    const name = State("rahul");
    // @ts-ignore
    const [get, set, api, other] = name();

    expect(typeof get,'get should be a function').toBe("function");
    expect(typeof set,'set should be a function').toBe("function");
    expect(typeof api,'api should be an object').toBe("object");
    expect(typeof other,'other should not be defined').toBe("undefined");
  });

  test("should return the proper type", () => {
    const name = State<string>("rahul");
    const [get, set] = name();

    expect(typeof get(),'get() should be return string').toBe("string");

    set((value) => {
      expect(typeof value, "old value should be in proper type").toBe("string");
      expect(value, "value should be old data").toBe("rahul");

      return value + "00";
    });

    expect(get(), "getter should be not be return the old data").not.toBe(
      "rahul",
    );
  });

  test("listnear should run on any changes", () => {
    const _name = State<string>("rahul");
    const [get, set] = _name();

    const fn = vi.fn();
    get(fn);

    set("jjjj");

    expect(fn, "listnear should be called").toBeCalled();

    expect(fn, "listen should be called 2 times").toBeCalledTimes(2);
  });

  test("listnear muted updates changes", () => {
    const _name = State<string>("rahul");
    const [get, set] = _name();
    const fn = vi.fn();
    get(fn);
    set("jjjj", false);

    expect(fn, "listnear should not listen for muted update").toBeCalledTimes(
      1,
    );
  });
  test("listnear should not be registered", () => {
    const num = State<number>(8);
    const [get, set] = num();
    const fn = vi.fn();
    get(fn, false);

    for (let i = 0; i < 10; i++) {
      set(Math.random());
    }

    expect(
      fn,
      "listnear should not listen for unregistered listnear",
    ).toBeCalledTimes(1);
  });
});

// TODO:

describe("State With Non primative values", () => {
  test("State should not take Array as value", () => {
    const array = () => {
      State(
      // @ts-ignore
    []);
    };
    expect(array, "Array should not accept by State").toThrowError(
      "Array is not State able use ListState insteed!",
    );
  });

  test("State should not take Object as a value", () => {
    const obj = () => {
      State(
      // @ts-ignore
      {});
    };
    expect(obj, "Object should not accept by State").toThrowError(
      "Object is not State able use ObjectState insteed!",
    );
  });
});
