type LogMetadata = Record<string, unknown>;

const isProduction = import.meta.env.PROD;

const write = (level: 'info' | 'warn' | 'error', message: string, metadata?: LogMetadata): void => {
  if (isProduction && level === 'info') {
    return;
  }

  const payload = metadata ? [message, metadata] : [message];

  if (level === 'error') {
    console.error(...payload);
    return;
  }

  if (level === 'warn') {
    console.warn(...payload);
    return;
  }

  console.info(...payload);
};

export const logger = {
  info: (message: string, metadata?: LogMetadata) => write('info', message, metadata),
  warn: (message: string, metadata?: LogMetadata) => write('warn', message, metadata),
  error: (message: string, metadata?: LogMetadata) => write('error', message, metadata),
};
