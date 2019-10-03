
/* MOCKS */

const Mocks = {
  get schema () {
    return {
      type: 'object',
      properties: {
        root: {
          type: 'boolean'
        },
        foo: {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            },
            bar: {
              type: 'number'
            },
            baz: {
              type: 'number',
              exclusiveMinimum: 0
            },
            qux: {
              type: 'string'
            }
          },
          required: ['foo']
        },
        bar: {
          type: 'array',
          items: {
            type: 'number'
          }
        },
        baz: {
          type: 'object',
          properties: {
            foo: {
              type: 'number'
            }
          }
        },
        qux: {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            },
            bar: {
              type: 'number'
            }
          },
          required: ['foo']
        },
        qux2: {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            },
            bar: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string'
                }
              },
              required: ['foo']
            }
          },
          required: ['foo']
        }
      },
      required: ['root']
    };
  },
  get data () {
    return {
      root: false,
      root2: 123,
      foo: {
        foo: 'string',
        bar: '123',
        baz: 0
      },
      bar: [123],
      baz: {},
      qux: {
        bar: 123
      },
      qux2: {
        foo: 'string',
        bar: {}
      }
    };
  },
  get dataExpected () {
    return {
      root: false,
      foo: {
        foo: 'string'
      },
      bar: [123],
      qux2: {
        foo: 'string'
      }
    };
  }
};

/* EXPORT */

module.exports = Mocks;
