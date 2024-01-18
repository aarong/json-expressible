[![CI-CD](https://github.com/aarong/json-expressible/actions/workflows/built-test-deploy.yml/badge.svg)](https://github.com/aarong/json-expressible/actions/workflows/built-test-deploy.yml)

# JSON-Expressible

An ES5 Javascript micro library that determines whether a value can be expressed
as JSON.

- Checks whether the value is a valid JSON type (string, number, boolean, null,
  object, or array).

- Recursively checks whether object children and/or array elements are valid
  JSON types.

- Checks whether there are any circular references.

The motivation for this library is twofold:

1. The `JSON.stringify()` function does not throw an error when it encounters
   non-JSON values like `undefined` and `NaN`. Instead, it omits the values or
   converts them to `null` in the returned serialization. As a result, parsing
   the serialization does not return the original value.

2. It can be useful to know whether a value is expressible in JSON without
   actually serializing it.

To install:

```shell
npm install json-expressible
```

To use:

```Javascript
var jsonExpressible = require("json-expressible");

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

console.log(jsonExpressible([ undefined ]));
console.log(jsonExpressible({ abc: undefined }));

var circularObject = {};
circularObject.ref = circularObject;
console.log(jsonExpressible(circularObject));

var circularArray = [];
circularArray.push(circularArray);
console.log(jsonExpressible(circularArray));
```
