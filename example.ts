import * as myLogger from './index';

// TODO make these strongle typed
function consoleFormatter(object: any): any {
  // return consoleConfig.colorize(
  //   object.level, `${object.timestamp()} ${object.level}: ${object.message || ''}`,
  // );
  return object;
}

function fileFormatter(object: any): any {
  return object;
}

const cases = myLogger.cases;

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

const logger = myLogger.newLogger(config);

logger.debug('test', { test: 'test debug prop' });
logger.verbose('test', { test: 'test verbose prop' });
logger.info('test', { test: 'test info prop' });
logger.warn('test', { test: 'test warn prop' });
logger.error('test', { test: 'test error prop' });

logger.info('test scrub', {
  test: 'test info prop',
  password: 'password',
  nested: {
    username: 'username',
  },
});
