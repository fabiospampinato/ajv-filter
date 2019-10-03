
/* IMPORT */

import {Ajv, CompilationContext} from 'ajv';
import * as traverse from 'json-schema-traverse';
import {KEYWORD} from './consts';

/* AJV FILTER */

const Filter = {

  patchInstance ( ajv: Ajv, setToUndefined: boolean = false ): Ajv {

    ajv['_opts'].allErrors = true;
    ajv['_opts'].removeAdditional = 'all';

    ajv.addKeyword ( KEYWORD, {
      statements: true,
      inline ( it: CompilationContext ) {

        const LEVEL = it.level,
              DATA_LEVEL = it.dataLevel || '',
              DATA_PATH = it['dataPathArr'][DATA_LEVEL], //TODO: https://github.com/epoberezkin/ajv/issues/1096
              SCHEMA_PROPERTIES_NR = it.schemaPath.split ( 'properties' ).length,
              P_DATA_LEVEL = it.dataLevel - 1 || '',
              TARGET_GETTER = `data${P_DATA_LEVEL}[${DATA_PATH}]`,
              DELETE = setToUndefined ? `${TARGET_GETTER} = undefined;` : `delete ${TARGET_GETTER};`;

        if ( !LEVEL ) return `valid${LEVEL} = true;`;

        return `
          var target = ${TARGET_GETTER};
          var isPlainObject = typeof target === 'object' && !( target instanceof Array );
          if ( errors > errs_${DATA_LEVEL} ) {
            if ( !isPlainObject ) {
              ${DELETE}
            } else {
              for ( var i = errs_${DATA_LEVEL}; i < errors; i++ ) {
                var vError = vErrors[i];
                if ( vError.keyword !== 'required' ) continue;
                if ( vError.schemaPath.split ( 'properties' ).length !== ${SCHEMA_PROPERTIES_NR} ) continue;
                ${DELETE}
              }
            }
          } else if ( isPlainObject ) {
            var isEmpty = true;
            for ( var key in target ) {
              isEmpty = false;
              break;
            }
            if ( isEmpty ) {
              ${DELETE}
            }
          }
          valid${LEVEL} = true;
        `;

      }
    });

    return ajv;

  },

  patchSchema ( schema ) {

    traverse ( schema, {
      cb: {
        post ( schema ) {
          schema[KEYWORD] = true;
        }
      }
    });

    return schema;

  }

};

/* EXPORT */

export default Filter;
