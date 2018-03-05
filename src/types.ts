export interface IProvider {}
export interface IWinstonProvider extends IProvider {
  serializeConsole: (obj: any) => string;
  serializeFile: (obj: any) => string;
}

export interface IWinstonConfig {
  serializeConsole: (obj: any) => string;
  serializeFile: (obj: any) => string;
}

export class Winston implements IWinstonProvider {
  constructor(public serializeConsole: (obj: any) => string, public serializeFile: (obj: any) => string) { }
}

export interface IBunyanConfig {
}

export class Bunyan implements IProvider {
}

export function winston(config: IWinstonConfig): IProvider {
  return new Winston(config.serializeConsole, config.serializeFile);
}

export function bunyan(config: IBunyanConfig): IProvider {
  return new Bunyan();
}

export type Level = 'verbose' | 'debug' | 'info' | 'warn' | 'error';

export type Levels = {
  verbose: Level,
  debug: Level,
  info: Level,
  warn: Level,
  error: Level,
};

export const levels: Levels = {
  verbose: 'verbose',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
};

export type Lower = 1;
export type Upper = 2;
export type Camel = 4;
export type Pascal = 8;

export type Case = Lower | Upper | Camel | Pascal;

export type Cases = {
  lower: Lower,
  upper: Upper,
  camel: Camel,
  pascal: Pascal,
};

export const cases: Cases = {
  lower: 1,
  upper: 2,
  camel: 4,
  pascal: 8,
};
