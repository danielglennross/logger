import { expect } from 'chai';
import * as myLogger from '../../index';

describe(`Adapters`, () => {
  const cases = myLogger.cases;

  it('should construct logger for: Winston', () => {
    const config: myLogger.IConfig = {
      adapter: myLogger.winston({
        serializeConsole: JSON.stringify,
        serializeFile: JSON.stringify,
      }),
      sinks: [
        myLogger.newConsoleSink({
          level: myLogger.levels.debug,
          formatter: function consoleFormatter(object: any): any {
            return object;
          },
        }),
      ],
      maskers: [
        myLogger.newMasker({
          field: ['validProp1', 'validProp2'],
          case: cases.camel,
          mask: '**scrubbed**',
        }),
      ],
    };

    const logger = myLogger.newLogger(config);
    // tslint:disable-next-line:no-unused-expression
    expect(logger).to.exist;
  });
});
