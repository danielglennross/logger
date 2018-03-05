import {
  logFactory,
  Logger,
  NullLogger,
} from './src/index';

import {
  FileSink,
  ConsoleSink,
} from './src/sinks';

// types
export {
  winston,
  bunyan,
  IWinstonConfig,
  IBunyanConfig,
  Level,
  levels,
  Case,
  cases,
} from './src/types';

export { ISink,
  IFileSink,
  Formatter,
  ISinkConfig,
  IFileSinkConfig,
  newConsoleSink,
  newFileSink,
} from './src/sinks';

export { IMasker, IMaskerConfig, Scrubber, newMasker } from './src/masks';
export { IConfig, ILogger, Logger, NullLogger } from './src/index';

// factory
export const newLogger = logFactory(Logger);
export const newNullLogger = logFactory(NullLogger);
