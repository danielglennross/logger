import { EventEmitter } from 'events';
import * as bunyan from 'bunyan';

import { IAdapter, IAdapterLogger } from './types';

import { IProvider, Level } from '../types';
import { ISink, IFileSink, Formatter, FileSink } from '../sinks';
import { IMasker } from '../masks';

function newConsoleStream(sink: ISink): any {
  return {
    level: sink.level,
    stream: process.stdout,
  };
}

function newFileStream(sink: IFileSink): any {
  return {
    level: sink.level,
    path: sink.filename,
  };
}

function newDefaultSerializer(maskers: IMasker[]) {
  return function (object: any): any {
    const clone = Object.assign({}, object);
    const masked = maskers.reduce((obj, mask) => {
      obj = mask.scrubber(mask);
      return obj;
    }, clone);
    return masked;
  };
}

function populateSinkGroup(group: object, name: string, factory: (sink: ISink) => any) {
  return function(sink: ISink) {
    const grouping = () => group[name] || {};

    group[name] = {
      ...grouping(),
      streams: [...grouping().streams || [], factory(sink)],
      formatters: [...grouping().formatters || [], (obj: any) => {
        return sink.formatter(obj);
      }],
    };
  };
}

interface ILogArg {
  level: string;
  msg: string;
  meta: any;
}

class BunyanAdapter extends EventEmitter implements IAdapterLogger {
  constructor(sinks: ISink[], maskers: IMasker[]) {
    super();

    const sinkList = (sinks || []).reduce((group, s) => {
      s.match({
        ConsoleSink: populateSinkGroup(group, 'console', newConsoleStream),
        FileSink: populateSinkGroup(group, 'file', newFileStream),
      });
      return group;
    }, {});

    Object.entries(sinkList).map(([k, v]: [string, any]) => {
      const logger = bunyan.createLogger({
        name: `logger-${k}-${Date.now()}`,
        streams: v.streams,
        serializers: {
          default: function (obj: any) {
            const maskerFns = newDefaultSerializer(maskers);
            const formatters = (o: any) => v.formatters.reduce((acc, f) => f(o), o);
            const result = maskerFns(formatters(obj));
            return result;
          },
        },
      });

      this.on('log', (args: ILogArg) => {
        logger[args.level]({ default: args.meta }, args.msg);
      });
    });
  }

  public error(msg: string, err: any): void {
    this.emit('log', <ILogArg>{ level: 'error', msg: msg, meta: err });
  }
  public warn(msg: string, target: any): void {
    this.emit('log', <ILogArg>{ level: 'warn', msg: msg, meta: target });
  }
  public info(msg: string, target: any): void {
    this.emit('log', <ILogArg>{ level: 'info', msg: msg, meta: target });
  }
  public debug(msg: string, target: any): void {
    this.emit('log', <ILogArg>{ level: 'debug', msg: msg, meta: target });
  }
  public verbose(msg: string, target: any): void {
    this.emit('log', <ILogArg>{ level: 'trace', msg: msg, meta: target });
  }
}

export const bunyanAdapter: IAdapter = {
  newLogger(adapter: IProvider, sinks: ISink[], maskers: IMasker[]): IAdapterLogger {
    return new BunyanAdapter(sinks, maskers);
  },
};
