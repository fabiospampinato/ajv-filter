
/* IMPORT */

import {describe} from 'ava-spec';
import AJV from 'ajv';
import {default as Filter} from '../dist';
import Mocks from './mocks';

/* AJV FILTER */

describe ( 'Ajv Filter', it => {

  it ( 'works', t => {

    const ajv = Filter.patchInstance ( new AJV () ),
          schema = Filter.patchSchema ( Mocks.schema ),
          validator = ajv.compile ( schema ),
          data = Mocks.data;

    t.false ( validator ( data ) );
    t.deepEqual ( data, Mocks.dataExpected );
    t.is ( validator.errors.length, 4 );
    t.true ( validator ( data ) );

  });

});
