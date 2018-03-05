import { Level } from './types';

export type Formatter = (object: any) => any;

export interface ISink {
  level: Level;
  formatter: Formatter;
  match(pattern: IConfigPattern): any;
}

export interface IFileSink extends ISink {
  filename: string;
}

export interface IConfigPattern {
  FileSink: (sink: IFileSink) => any;
  ConsoleSink: (sink: ISink) => any;
}

export abstract class BaseSinkConfig  {
  constructor(public level: Level, public formatter: Formatter) {}

  public abstract match(p: IConfigPattern): any;
}

export class ConsoleSink extends BaseSinkConfig implements ISink {
  constructor(level: Level, public formatter: Formatter) {
    super(level, formatter);
  }

  public match(p: IConfigPattern): any {
    return p.ConsoleSink(this);
  }
}

export class FileSink extends BaseSinkConfig implements IFileSink {
  constructor(level: Level, public formatter: Formatter, public filename: string) {
    super(level, formatter);
  }

  public match(p: IConfigPattern): any {
    return p.FileSink(this);
  }
}

export interface ISinkConfig {
  level: Level;
  formatter?: Formatter;
}

export interface IFileSinkConfig extends ISinkConfig {
  filename: string;
}

export function newConsoleSink(options: ISinkConfig) {
  const { level, formatter = (obj: any) => obj } = options;
  return new ConsoleSink(level, formatter);
}

export function newFileSink(options: IFileSinkConfig) {
  const { level, formatter, filename } = options;
  return new FileSink(level, formatter, filename);
}
