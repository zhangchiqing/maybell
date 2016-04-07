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

```
empty()
//=> undefined
```

### isNothing
```
isNothing :: Maybe a -> Boolean
```

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
