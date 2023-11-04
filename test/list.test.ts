import {describe, expect, test, vi} from "vitest";
import ArrayState from "../src/list";

const NAMES = ['rahul','rajesh','babai']

describe("running test for ArrayState",()=>{
  test('should be in proper type',()=>{
    const names = ArrayState<string>([...NAMES])
    // @ts-ignore
    const [get,set,api,other] = names()

    expect(typeof get,'get should be a function').toBe('function')
    expect(typeof set,'set should be a function').toBe('function')
    expect(typeof api,'api should be an object').toBe('object')
    expect(typeof other,'other should not be defined').toBe('undefined')
  })
  

  test("should return the proper type", () => {
    const _names = [...NAMES]
    const names = ArrayState<string>(_names);
    const [get, set] = names();

    expect(typeof get(),'get() should be return array').toBe('object');

    set((value) => {
      expect(typeof value, "old value should be in proper type").toBe("object");
      return [...value];
    });

    expect(get(), "getter should be not be return the old data").not.toBe(
      _names,
    );
  });
  
  test("should return the proper velues", () => {
    const _names = [...NAMES]
    const names = ArrayState<string>(_names);
    const [get, set] = names();

    expect(get(),'get() should be return proper values').toBe(_names);

    set((value) => {
      expect(value, "value should be old data").toBe(_names);
      return [...value];
    });

    expect(get(), "getter should be not be return the old data").not.toBe(
      _names,
    );

    expect(get()[0],'getter should be return proper value').toBe(_names[0])

  });

  test("listnear should run on any changes", () => {
    const _names = [...NAMES]
    const names= ArrayState<string>(_names);
    const [get, set] = names();

    const fn = vi.fn();
    get(fn);

    set(_names);

    expect(fn, "listnear should be called").toBeCalled();

    expect(fn, "listen should be called 2 times").toBeCalledTimes(2);
  });


  test("listnear muted updates changes", () => {
    const _names = [...NAMES]

    const names = ArrayState<string>(_names);
    const [get, set] = names();
    const fn = vi.fn();
    get(fn);
    set(_names, false);

    expect(fn, "listnear should not listen for muted update").toBeCalledTimes(
      1,
    );
  });

  test("listnear should not be registered", () => {
    const _nums = [0,2,4,6,8]
    const nums = ArrayState<number>(_nums);
    const [get, set] = nums();
    const fn = vi.fn();
    get(fn, false);

    for (let i = 0; i < 10; i++) {
      set([Math.random()]);
    }

    expect(
      fn,
      "listnear should not listen for unregistered listnear",
    ).toBeCalledTimes(1);
  });

});


describe("ArrayState With primative values", () => {
  test("ArrayState should not take String as value", () => {
    const string = () => {     
      ArrayState(
        // @ts-ignore
        'rahul');
    };
    expect(string, "String should not accept by ArrayState").toThrowError(
      "String is not ArrayState able use State insteed!",
    );
  });

  test("ArrayState should not take Number as value", () => {
    const number = () => {

      ArrayState(
        // @ts-ignore
        8);
    };

    // TODO
    expect(number, "Number should not accept by ArrayState").toThrowError(
      "Number is not ArrayState able use State insteed!",
    );
  });
  test("ArrayState should not take Boolean as value", () => {
    const bool = () => {
      ArrayState(
        // @ts-ignore
        true);
    };
    expect(bool, "Boolean should not accept by ArrayState").toThrowError(
      "Boolean is not ArrayState able use State insteed!",
    );
  });
  
  
   test("ArrayState should not take Object as a value", () => {
    const obj = () => {
      
      ArrayState(
        // @ts-ignore
        {});
    };
    expect(obj, "Object should not accept by ArrayState").toThrowError(
      "Object is not ArrayState able use ObjectState insteed!",
    );
  });

});


