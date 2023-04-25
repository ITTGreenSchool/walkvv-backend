import winston from 'winston';

const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({all: true}),
        winston.format.printf(info => `[${info.timestamp}] [${info.level}] ${info.message}`),
    ),
    transports: [
        new winston.transports.Console()
    ]
});

winston.addColors(
    {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'gray',
        verbose: 'grey',
    }
)

export default logger;