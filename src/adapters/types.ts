import { Level, IProvider } from '../types';
import { IFileSink, ISink } from '../sinks';
import { IMasker } from '../masks';

export interface IAdapterLogger {
  error(msg: string, err: any): void;
  warn(msg: string, target: any): void;
  info(msg: string, target: any): void;
  debug(msg: string, target: any): void;
  verbose(msg: string, target: any): void;
}

export interface IAdapter {
  newLogger(adapter: IProvider, sinks: ISink[], maskers: IMasker[]): IAdapterLogger;
}
