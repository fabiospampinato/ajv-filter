# Ajv Filter

Library that enables [ajv](https://github.com/epoberezkin/ajv) to filter objects, rather than just validating them.

## Install

```sh
npm install --save ajv-filter
```

## Usage

```ts
import AJV from 'ajv';
import Filter from 'ajv-filter';

const Schema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    },
    bar: {
      type: 'number'
    }
  }
};

const Data = {
  foo: 'string',
  bar: '123'
};

const ajv = Filter.patchInstance ( new AJV () ); // <- patching the instance
const validate = ajv.compile ( Filter.patchSchema ( schema ) ); // <- patching the schema

validate ( Data ); // => false
console.log ( Data ); // { foo: 'string' }
validate ( Data ); // => true
```

## License

MIT © Fabio Spampinato
