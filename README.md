Installation
```
$ npm install maybell
```

maybell is a lightweight library that provides functions to fight against `undefined`.

## API

### fmap

```
fmap :: (a -> b) -> Maybe a -> Maybe b
```

Takes a function which takes a value of type "a" and returns a value of type "b", and Maybe value, applies the function to the value if the value is not undefined, or returns undefined if the value is undefined.
`Maybe a` here means a value that could be either undefined or any other type. It could be `undefined` or `"foo"`, in which case type "a" is String. Or it could be `undefined` or `1`, then type "a" is Number. But it can't be `undefined` or `"foo"` or `1`.
`Maybe b` means its value could be `undefined` or any other type which doesn't have to be the same type as type "a".

Example:
```
// Bad
function getUserName(user) {
  return user.name;
}

getUserName();
//=> !TypeError: Cannot read property 'name' of undefined

// Works
function getUserName(user) {
  if(!user) {
    return ;
  }

  return user.name;
}

getUserName();
//=> undefined

// Better
function getUserName(user) {
  return user.name;
}

var getUserNameFromMaybeUser = fmap(getUserName);

getUserNameFromMaybeUser();
//=> undefined

getUserNameFromMaybeUser({ name: 'Leo' });
//=> 'Leo'
```

### empty
```
empty :: * -> Maybe *
```

returns 'undefined'

```
empty()
//=> undefined
```

### isNothing
```
isNothing :: Maybe a -> Boolean
```

Checks if the input is `undefined` or `null`

```
isNothing(undefined);
//=> true

isNothing(null);
//=> true

isNothing(0)
//=> false

isNothing(false)
//=> false
```

### isJust
```
isJust :: Maybe a -> Boolean
```

Checks if the input is not either `undefined` or `null`

```
isJust(undefined);
//=> false

isJust(null);
//=> false

isJust(0);
//=> true

isJust(false);
//=> true
```

### lift
```
lift :: (a -> b -> ... -> n -> x) -> Maybe a -> Maybe b -> ... -> Maybe n -> Maybe x
```

"lifts" a function and applies the input values to the function if none of them is 'undefined', otherwise returns 'undefined'.

```
var sumValue = function(a, b) {
  return a.value + b.value;
};

lift(sumValue)({ value: 1 }, { value: 2 });
//=> 3;

lift(sumValue)(undefined, { value: 2 });
//=> undefined

lift(sumValue)();
//=> undefined
```

### sequence
```
sequence :: Array Maybe a -> Maybe Array a
```

Takes a list of maybe value and returns the list if none of them is 'undefined'. Otherwise returns 'undefined' if any of list item is 'undefined'.

```
sequence([undefined, 1, 2, 3]);
//=> undefined

sequence([1, 2, 3, 4]);
//=> [1, 2, 3, 4]

sequence([])
//=> []
```

### traverse
```
traverse :: (a -> Maybe b) -> Array a -> Maybe Array b
```

Maps map a function, which takes a value and returns a maybe value, over a list of value, and use sequence to transform the list of maybe value into a list of value.

```
function gt3(x) {
  if (x > 3) {
    return x;
  } else {
    return undefined;
  }
}

traverse(gt3)([5, 6, 7]);
//=> [5, 6, 7]

traverse(gt3)([0, 1, 2]);
//=> undefined

traverse(gt3)([5, 6, 1]);
//=> undefined

traverse(gt3)([]);
//=> []
```
