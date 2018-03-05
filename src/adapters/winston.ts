import * as winston from 'winston';

import { IAdapter, IAdapterLogger } from './types';

import { IWinstonProvider, Level } from '../types';
import { ISink, IFileSink } from '../sinks';
import { IMasker } from '../masks';

function timestamp(): string {
  return new Date().toISOString();
}

interface ILogEvent {
  meta: any;
  level: string;
  message: string;
}

function newFileTransport(serialize: (obj: any) => string) {
  return function(sink: IFileSink) {
    return new (winston.transports.File) ({
      prettyPrint: true,
      colorize: true,
      json: false,
      level: sink.level,
      formatter: (object: ILogEvent) => {
        object.meta = sink.formatter(object.meta);
        return serialize(object);
      },
      filename: sink.filename,
      timestamp: timestamp,
    });
  };
}

function newConsoleTransport(serialize: (obj: any) => string) {
  return function (sink: ISink) {
    return new (winston.transports.Console) ({
      prettyPrint: true,
      colorize: true,
      level: sink.level,
      formatter: (object: ILogEvent) => {
        object.meta = sink.formatter(object.meta);
        return winston.config.colorize(object.level, serialize(object));
      },
      timestamp: timestamp,
    });
  };
}

function newReWriter(masker: IMasker) {
  return (level, msg, meta) => {
    return masker.scrubber(meta);
  };
}

class WinstonAdapter implements IAdapterLogger {
  private winstonLogger: any;

  constructor(adapter: IWinstonProvider, sinks: ISink[], maskers: IMasker[]) {
    const transports = (sinks || []).map(s => {
      return s.match({
        ConsoleSink: newConsoleTransport(adapter.serializeConsole),
        FileSink: newFileTransport(adapter.serializeFile),
      });
    });

    const rewriters = (maskers || []).map(newReWriter);

    this.winstonLogger = new (winston.Logger)({
      transports,
      rewriters,
    });
  }

  public error(msg: string, err: any): void {
    this.winstonLogger.error(msg, err);
  }
  public warn(msg: string, target: any): void {
    this.winstonLogger.warn(msg, target);
  }
  public info(msg: string, target: any): void {
    this.winstonLogger.info(msg, target);
  }
  public debug(msg: string, target: any): void {
    this.winstonLogger.debug(msg, target);
  }
  public verbose(msg: string, target: any): void {
    this.winstonLogger.verbose(msg, target);
  }
}

export const winstonAdapter: IAdapter = {
  newLogger(adapter: IWinstonProvider, sinks: ISink[], maskers: IMasker[]): IAdapterLogger {
    return new WinstonAdapter(adapter, sinks, maskers);
  },
};
