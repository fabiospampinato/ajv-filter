
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

        if ( !it.level ) {

          return 'function isPO(x){return typeof x==="object"&&x!==null&&!Array.isArray(x)}' +
                 'function isEmpty(x){for(var k in x){return false}return true}' +
                 'function hasReqErr(i,lvl){' +
                   'for(;i < errors;i++){' +
                     'var e=vErrors[i];' +
                     'if(e.keyword!=="required")continue;' +
                     'if(e.schemaPath.split("properties").length!==lvl)continue;' +
                     'return true;' +
                   '}' +
                   'return false;' +
                 '};' +
                 'valid0=true;';

        } else {

          const LEVEL = it.level,
                DATA_LEVEL = it.dataLevel || '',
                DATA_PATH = it['dataPathArr'][DATA_LEVEL], //TODO: https://github.com/epoberezkin/ajv/issues/1096
                SCHEMA_PROPERTIES_NR = it.schemaPath.split ( 'properties' ).length,
                P_DATA_LEVEL = it.dataLevel - 1 || '',
                TARGET_GETTER = `data${P_DATA_LEVEL}[${DATA_PATH}]`,
                DELETE = setToUndefined ? `${TARGET_GETTER}=undefined;` : `delete ${TARGET_GETTER};`;

          return `var _=${TARGET_GETTER};` +
                 `if((errors>errs_${DATA_LEVEL}&&(!isPO(_)||hasReqErr(errs_${DATA_LEVEL},${SCHEMA_PROPERTIES_NR}))||(errors<=errs_${DATA_LEVEL}&&isPO(_)&&isEmpty(_)))) ${DELETE}` +
                 `valid${LEVEL}=true;`

        }

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
