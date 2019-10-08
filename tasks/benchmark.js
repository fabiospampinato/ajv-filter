
/* IMPORT */

const {default: Filter} = require ( '../dist' ),
      Mocks = require ( '../test/mocks' ),
      AJV = require ( 'ajv' ),
      benchmark = require ( 'benchloop' );

/* BENCHMARK */

benchmark.defaultOptions.log = 'compact';

benchmark.group ( 'patch', () => {

  benchmark ({
    name: 'ajv',
    iterations: 50,
    beforeEach: ctx => {
      ctx.ajv = new AJV ();
    },
    fn: ctx => {
      Filter.patchInstance ( ctx.ajv );
    }
  });

  benchmark ({
    name: 'schema',
    iterations: 20000,
    fn: () => {
      Filter.patchSchema ( Mocks.schema );
    }
  });

});

benchmark ({
  name: 'validate',
  iterations: 100000,
  before: ctx => {
    ctx.ajv = Filter.patchInstance ( new AJV () );
    ctx.schema = Filter.patchSchema ( Mocks.schema );
    ctx.validator = ctx.ajv.compile ( ctx.schema );
  },
  fn: ctx => {
    ctx.validator ( Mocks.data );
  }
});

benchmark.summary ();
