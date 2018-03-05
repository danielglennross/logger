import * as myLogger from '../../../index';
import { testTransport } from './sink';

const sink = myLogger.newConsoleSink({
  level: myLogger.levels.debug,
  formatter: function consoleFormatter(object: any): any {
    return object;
  },
});

testTransport('Console', sink);
