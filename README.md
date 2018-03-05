A node js provider agnostic logging lib.

Currently Winston & Bunyan are supported.

```ts
import * as myLogger from './index';

// custom log event formatters
function consoleFormatter(object: any): string {
  return object;
}

function fileFormatter(object: any): any {
  return object;
}

const cases = myLogger.cases;

// configure logger

// Adapters: (required)
// select adapter and configure adapter specific options

// Sinks: (required)
// use exported interfaces/types ISink, IFileSink, Formatter, Level to create custom imps
// or factories for pre-built sinks

// Masks: (optional)
// use exported interfaces/types IMasker, Scrubber to create custom imps
// or factories for pre-built maskers
const config: myLogger.IConfig = {
  adapter: myLogger.winston({
    serializeConsole: JSON.stringify,
    serializeFile: JSON.stringify,
  }),
  sinks: [
    myLogger.newFileSink(<myLogger.IFileSinkConfig>{
      level: myLogger.levels.debug,
      formatter: fileFormatter,
      filename: './test.log',
    }),
    myLogger.newConsoleSink(<myLogger.ISinkConfig>{
      level: myLogger.levels.debug,
      formatter: consoleFormatter,
    }),
  ],
  maskers: [
    myLogger.newMasker(<myLogger.IMaskerConfig>{
      mask: '**scrubbed**',
      field: 'token',
      case: cases.lower,
    }),
    myLogger.newMasker(<myLogger.IMaskerConfig>{
      mask: '**scrubbed**',
      field: ['password', 'username'],
      case: cases.lower,
    }),
    myLogger.newMasker(<myLogger.IMaskerConfig>{
      mask: '**scrubbed**',
      field: 'foobar',
      case: cases.lower | cases.upper,
      rule: (object) => object.route === 'GET /api/foobar',
    }),
    myLogger.newMasker(<myLogger.IMaskerConfig>{
      mask: '**scrubbed**',
      field: 'myField',
      case: cases.lower | cases.upper | cases.camel,
      target: 'responseBody',
    }),
    myLogger.newMasker(<myLogger.IMaskerConfig>{
      mask: '**scrubbed**',
      field: 'myField',
      case: cases.lower | cases.upper | cases.camel,
      target: ['responseBody', 'upstream.responseBody'],
    }),
    myLogger.newMasker(<myLogger.IMaskerConfig>{
      mask: '**scrubbed**',
      field: ['myField', 'foobar'],
      case: cases.lower | cases.upper | cases.camel | cases.pascal,
      rule: (object) => object.route === 'GET /api/foobar',
      target: 'responseBody',
    }),
  ],
};

// create logger
const logger = myLogger.newLogger(config);

// log
logger.debug('test', { test: 'test debug prop' });
logger.verbose('test', { test: 'test verbose prop' });
logger.info('test', { test: 'test info prop' });
logger.warn('test', { test: 'test warn prop' });
logger.error('test', { test: 'test error prop' });
```