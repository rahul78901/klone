import {describe, expect, test, vi} from "vitest";
import ObjectState from "../src/object";

const PERSON = {
  name:'raat',
  age:20,
  gender:'f'
}

type PersonType = typeof PERSON

describe("running test for ObjectState",()=>{
  test('should be in proper type',()=>{
   const _person = {
     ...PERSON
   }

    const person = ObjectState<PersonType>(_person)
    // @ts-ignore
    const [get,set,api,other] =
    person()



    expect(typeof get,'get should be a function').toBe('function')
    expect(typeof set,'set should be a function').toBe('function')
    expect(typeof api,'api should be an object').toBe('object')
    expect(typeof other,'other should not be defined').toBe('undefined')
  })
  
  test("should return the proper type", () => {
    const _person = {...PERSON}
    const person = ObjectState<PersonType>(_person);
    const [get, set] = person();

    expect(typeof get(),'get() should be return object').toBe('object');

    set((value) => {
      expect(typeof value, "old value should be in proper type").toBe("object");
      return {}
    });  
  });
  
  test("should return the proper velues", () => {
    const _person = {
      ...PERSON
    }
    const person= ObjectState<PersonType>(_person);
    const [get, set] = person();

    expect(get(),'get() should be return proper values').toBe(_person);

    set((value) => {
      expect(value, "value should be old data").toBe(_person);
      return {};
    });

    expect(get().age,'getter should be return proper value').toBe(_person.age)

  });

  test("listnear should run on any changes", () => {
    const _person = {
      ...PERSON
    }
    const person= ObjectState<PersonType>(_person);
    const [get, set] = person();

    const fn = vi.fn();
    get(fn);

    set(_person);

    expect(fn, "listnear should be called").toBeCalled();

    expect(fn, "listen should be called 2 times").toBeCalledTimes(2);
  });


  test("listnear muted updates changes", () => {
    const _person = {
      ...PERSON
    }

    const person = ObjectState<PersonType>(_person);
    const [get, set] =person();
    const fn = vi.fn();
    get(fn);
    set(_person, false);

    expect(fn, "listnear should not listen for muted update").toBeCalledTimes(
      1,
    );
  });

  test("listnear should not be registered", () => {
    const _test = {
      test:'jkk',
      test2:'lrltl',
      num:0
    }
    const test = ObjectState<typeof _test>(_test);
    const [get, set] = test();
    const fn = vi.fn();
    get(fn, false);

    for (let i = 0; i < 10; i++) {
      set({num:Math.random()});
    }

    expect(
      fn,
      "listnear should not listen for unregistered listnear",
    ).toBeCalledTimes(1);
  });
});


describe("ObjectState With primative values", () => {
  test("ObjectState should not take String as value", () => {
    const string = () => {
      ObjectState(
        // @ts-ignore
        'rahul'
      );
    };
    expect(string, "String should not accept by ObjectState").toThrowError(
      "String is not ObjectState able use State insteed!",
    );
  });

  test("ObjectState should not take Number as value", () => {
    const number = () => {
      ObjectState(
        // @ts-ignore
        8);
    };

    // TODO
    expect(number, "Number should not accept by ObjectState").toThrowError(
      "Number is not ObjectState able use State insteed!",
    );
  });

  test("ObjectState should not take Boolean as value", () => {
    const bool = () => {
      
      ObjectState(
        // @ts-ignore
        true);
    };
    expect(bool, "Boolean should not accept by ObjectState").toThrowError(
      "Boolean is not ObjectState able use State insteed!",
    );
  });
  
  
   test("ObjectState should not take Array as a value", () => {
    const array = () => {
      ObjectState(
        // @ts-ignore
        []);
    };
    expect(array, "Array should not accept by ObjectState").toThrowError(
      "Array is not ObjectState able use ArrayState insteed!",
    );
  });
});


