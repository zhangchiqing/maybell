'use strict';

// > empty()
// undefined
function empty() {
  return undefined;
}

// > isNothing(undefined)
// true
// > isNothing(null)
// true
// > isNothing(0)
// false
// > isNothing(1)
// false
// > isNothing('')
// false
// > isNothing([])
// false
// > isNothing({})
// false
function isNothing(x) {
  return x === undefined || x === null;
}

// > isJust(undefined)
// false
// > isJust(null)
// false
// > isJust(1)
// true
function isJust(x) {
  return !isNothing(x);
}

// > id(1)
// 1
function id(x) {
  return x;
}
// > fmap(id)(undefined)
// undefined
// > fmap(id)(1)
// 1
// > fmap(id)({ a: 1, b: 2 })
// { a: 1, b: 2 }
function fmap(fn) {
  return function(x) {
    if (isNothing(x)) {
      return empty();
    } else {
      return fn(x);
    }
  };
}


var apply = function(fn) {
  return function(args) {
    return fn.apply(this, args);
  };
};

var slice = Array.prototype.slice;

var toArray = function(a) {
  return slice.call(a);
};

// Array Maybe a -> Maybe Array a
// > sequence([1,2,3])
// [1,2,3]
// > sequence([])
// []
// > sequence([undefined, undefined])
// undefined
// > sequence([undefined, 1])
// undefined
// > sequence([1, undefined])
// undefined
function sequence(arr) {
  if (!arr.length) { return arr; }

  for (var i = 0, len = arr.length; i < len; i++) {
    if (isNothing(arr[i])) {
      return empty();
    }
  }

  return arr;
}

// > lift(id)(undefined)
// undefined
// > lift(function(a, b) { return a + b; })(1, 2)
// 3
// > lift(function(a, b) { return a + b; })(undefined, 2)
// undefined
function lift(fn) {
  return function() {
    return fmap(apply(fn))(sequence(toArray(arguments)));
  };
}

// > pipe(id, gt3)(8)
// 8
var pipe = function() {
  var fns = toArray(arguments);
  return function(a) {
    return fns.reduce(function(acc, fn) {
      return fn(acc);
    }, a);
  };
};

function gt3(x) {
  if (x > 3) {
    return x;
  } else {
    return undefined;
  }
}

// (a -> Maybe b) -> Array a -> Maybe Array b
// > traverse(gt3)([5, 6, 7])
// [5, 6, 7]
// > traverse(gt3)([0, 1, 2])
// undefined
// > traverse(gt3)([])
// []
// > traverse(gt3)([5, 6, 1])
// undefined
function traverse(fn) {
  return pipe(function(arr) {
    return arr.map(fmap(fn));
  }, sequence);
}

module.exports = {
  empty: empty,
  isNothing: isNothing,
  isJust: isJust,
  fmap: fmap,
  lift: lift,
  sequence: sequence,
  traverse: traverse,
};
