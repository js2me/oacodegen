import { Logger } from './logger.js';
import { LoggerConfig } from './logger.types.js';

const logLevels: (keyof Logger)[] = ['debug', 'log', 'info', 'warn', 'error'];

export class LoggerImpl implements Logger {
  private logLevels: (keyof Logger)[];

  constructor(protected config: LoggerConfig) {
    const logLevel = config.mainConfig.logLevel ?? 'info';
    this.logLevels = logLevels.slice(logLevels.indexOf(logLevel));
  }

  protected get logMainData() {
    return [
      `${new Date().toISOString()}:`,
      `[${this.config?.name ?? '-'}]`.padEnd(24, ' '),
    ].join('');
  }

  debug(...args: unknown[]): void {
    if (!this.logLevels.includes('debug')) return;
    console.debug(this.logMainData, ...args);
  }
  log(...args: unknown[]): void {
    if (!this.logLevels.includes('log')) return;
    console.log(this.logMainData, ...args);
  }
  info(...args: unknown[]): void {
    if (!this.logLevels.includes('info')) return;
    console.log(this.logMainData, ...args);
  }
  warn(...args: unknown[]): void {
    if (!this.logLevels.includes('warn')) return;
    console.warn(this.logMainData, ...args);
  }
  error(...args: unknown[]): void {
    if (!this.logLevels.includes('error')) return;
    console.error(this.logMainData, ...args);
  }
}
