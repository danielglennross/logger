// tslint:disable:no-empty

import { Level, IProvider, Winston, Bunyan } from './types';
import { ISink } from './sinks';
import { IMasker } from './masks';

import { IAdapter, IAdapterLogger } from './adapters/types';
import { winstonAdapter } from './adapters/winston';
import { bunyanAdapter } from './adapters/bunyan';

const adapterCache: { [id: string]: IAdapter } = {};
adapterCache[Winston.name] = winstonAdapter;
adapterCache[Bunyan.name] = bunyanAdapter;

function newAdapter(options: IConfig): IAdapterLogger {
  const { adapter, sinks, maskers } = options;
  const factory = adapterCache[adapter.constructor.name];
  return factory.newLogger(adapter, sinks, maskers);
}

export interface IConfig {
  adapter: IProvider;
  sinks: ISink[];
  maskers?: IMasker[];
}

export interface ILogger {
  error(msg: string, err: any);
  warn(msg: string, target: any);
  info(msg: string, target: any);
  debug(msg: string, target: any);
  verbose(msg: string, target: any);
}

export class Logger implements ILogger {
  private _logger: IAdapterLogger;

  constructor(private options: IConfig) {
    this._logger = newAdapter(options);
  }

  public error(msg: string, err: any) {
    this._logger.error(msg, err);
  }
  public warn(msg: string, target: any) {
    this._logger.warn(msg, target);
  }
  public info(msg: string, target: any) {
    this._logger.info(msg, target);
  }
  public debug(msg: string, target: any) {
    this._logger.debug(msg, target);
  }
  public verbose(msg: string, target: any) {
    this._logger.verbose(msg, target);
  }
}

export class NullLogger implements ILogger {
  public error(msg: string, err: any) { }
  public warn(msg: string, target: any) { }
  public info(msg: string, target: any) { }
  public debug(msg: string, target: any) { }
  public verbose(msg: string, target: any) { }
}

export interface NewableILogger<T> { new(options: IConfig): T; }
export type logFactory = (options: IConfig) => ILogger;

export function logFactory<T extends ILogger>(logger: NewableILogger<T>): logFactory {
  return function (options: IConfig): ILogger {
    return new logger(options);
  };
}
