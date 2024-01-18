var jsonExpressible = require(".");

describe("The jsonExpressible() function", function () {
  it("should return correctly for non-objects/arrays", function () {
    expect(jsonExpressible(null)).toBe(true);
    expect(jsonExpressible("string")).toBe(true);
    expect(jsonExpressible(123)).toBe(true);
    expect(jsonExpressible(false)).toBe(true);

    expect(jsonExpressible(undefined)).toBe(false);
    expect(jsonExpressible(NaN)).toBe(false);
    expect(jsonExpressible(function () {})).toBe(false);
    expect(jsonExpressible(new Date())).toBe(false);
    expect(jsonExpressible(Infinity)).toBe(false);
    expect(jsonExpressible(Number.POSITIVE_INFINITY)).toBe(false);
    expect(jsonExpressible(/reg.ex/)).toBe(false);
    expect(jsonExpressible(new Map())).toBe(false);
    expect(jsonExpressible(new Set())).toBe(false);
    expect(jsonExpressible(new Int16Array())).toBe(false);
  });

  it("should return correctly for objects", function () {
    expect(jsonExpressible({ a: 123 })).toBe(true);
    expect(jsonExpressible({ a: undefined })).toBe(false);
    expect(jsonExpressible({ a: { b: 123 } })).toBe(true);
    expect(jsonExpressible({ a: { b: undefined } })).toBe(false);
    expect(jsonExpressible({ a: [123] })).toBe(true);
    expect(jsonExpressible({ a: [undefined] })).toBe(false);
  });

  it("should return correctly for arrays", function () {
    expect(jsonExpressible([123])).toBe(true);
    expect(jsonExpressible([undefined])).toBe(false);
    expect(jsonExpressible([[123]])).toBe(true);
    expect(jsonExpressible([[undefined]])).toBe(false);
    expect(jsonExpressible([{ a: 123 }])).toBe(true);
    expect(jsonExpressible([{ a: undefined }])).toBe(false);
  });

  it("should correctly detect circular references", function () {
    expect(jsonExpressible({ a: true, b: 123 })).toBe(true);
    expect(jsonExpressible([true, 123])).toBe(true);
    expect(jsonExpressible([true, [null], { a: [] }])).toBe(true);

    var thing = { a: 1, b: 1 };
    expect(jsonExpressible({ a: thing, b: thing })).toBe(true);
    expect(jsonExpressible([thing, thing])).toBe(true);

    var val = { a: 1, b: 1 };
    val.c = val;
    expect(jsonExpressible(val)).toBe(false);
    val = { a: 1, b: 1, c: {} };
    val.c.d = val;
    expect(jsonExpressible(val)).toBe(false);
    val = [1, 2];
    val.push(val);
    expect(jsonExpressible(val)).toBe(false);
    val = [1, 2, []];
    val[2].push(val);
    expect(jsonExpressible(val)).toBe(false);
    val = { a: 1, b: 1, c: [] };
    val.c.push(val);
    expect(jsonExpressible(val)).toBe(false);
    val = [1, 2, {}];
    val[2].a = val;
    expect(jsonExpressible(val)).toBe(false);
    val = [[[[[]]]]];
    val[0][0][0][0].push(val);
    expect(jsonExpressible(val)).toBe(false);
    val = { a: { b: { c: { d: {} } } } };
    val.a.b.c.d.e = val;
    expect(jsonExpressible(val)).toBe(false);
  });

  it("sample code should work", function () {
    // The following return true

    console.log(jsonExpressible("abc"));
    console.log(jsonExpressible(123));
    console.log(jsonExpressible(true));
    console.log(jsonExpressible(null));
    console.log(jsonExpressible({ abc: "def" }));
    console.log(jsonExpressible([1, 2, 3]));

    // The following return false

    console.log(jsonExpressible(undefined));
    console.log(jsonExpressible(NaN));
    console.log(jsonExpressible(function () {}));
    console.log(jsonExpressible(new Date()));
    console.log(jsonExpressible(Infinity));
    console.log(jsonExpressible(/reg.ex/));

    console.log(jsonExpressible([undefined]));
    console.log(jsonExpressible({ abc: undefined }));

    var circularObject = {};
    circularObject.ref = circularObject;
    console.log(jsonExpressible(circularObject));

    var circularArray = [];
    circularArray.push(circularArray);
    console.log(jsonExpressible(circularArray));
  });
});
