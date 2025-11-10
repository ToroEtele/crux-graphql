import { Inject, Service } from 'typedi';
import { Logger } from 'typeorm';

import { typeORMLogLevelMap } from '../constants/typeorm-log-level.map';
import { TypeORMLogLevel } from '../constants/typeorm-log-level.enum';
import { LogService } from '../log.service';

@Service({ global: true })
export class TypeORMLogAdapter implements Logger {
  public static namespace = 'typeorm';

  constructor(@Inject(() => LogService) private readonly logService: LogService) {}

  public isMessageIgnored(message: string): boolean {
    if (
      message.startsWith('All classes found using provided glob pattern') ||
      message.startsWith('SELECT * FROM current_schema()') ||
      message.startsWith('SHOW server_version;') ||
      message.includes('`INFORMATION_SCHEMA`') ||
      message.includes('`VERSION()`')
    ) {
      return true;
    }

    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public log(level: TypeORMLogLevel, message: any): void {
    const messageText = (typeof message === 'object' ? message.message : message)?.toString() ?? '';
    if (this.isMessageIgnored(messageText)) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.logService[typeORMLogLevelMap[level]](message);
  }

  public logMigration(message: string): void {
    if (this.isMessageIgnored(message)) return;
    this.logService.debug(message);
  }

  public logQuery(query: string, parameters?: string[]): void {
    if (this.isMessageIgnored(query)) return;
    if (parameters) {
      return this.logService.debug(`${this.parseQuery(query)} ${JSON.stringify({ parameters })}`);
    }
    this.logService.debug(this.parseQuery(query));
  }

  public logQueryError(error: string, query: string, parameters?: string[]): void {
    this.logService.error({ query, parameters }, error);
  }

  public logQuerySlow(time: number, query: string, parameters?: string[]): void {
    this.logService.warn({ duration: time, parameters, reason: 'SLOW QUERY' }, '%s', query);
  }

  public logSchemaBuild(message: string): void {
    if (this.isMessageIgnored(message)) return;
    this.logService.debug(message);
  }

  private parseQuery(query: string): string {
    return query.replace(/select .*? from/i, 'select * from');
  }
}
