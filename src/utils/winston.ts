import {createLogger, format, transports} from "winston";

export const logger = createLogger();
const {combine, colorize, timestamp, splat, printf} = format;
const colorizeInstance = colorize({colors: {info: 'blue'}});


const customLevels = {
    levels: {
        unauthorized: 0,
        success: 1,
    },
    colors: {
        unauthorized: 'orange',
        success: 'green',
    }
};

const enumerateErrorFormat = format((info: any) => {
    if (info.message instanceof Error) {
        info.message = Object.assign({
            message: info.message.message,
            stack: info.message.stack
        }, info.message);
    }

    if (info instanceof Error) {
        return Object.assign({
            message: info.message,
            stack: info.stack
        }, info);
    }

    return info;
});

export const createLogFile = (filename: string, level = "info") =>
    createLogger({
        levels: customLevels.levels,
        transports: [
            new transports.File({
                level: level,
                dirname: process.env.LOG_ROOT || "public/logs",
                filename: filename,
                format: combine(
                    timestamp({format: "YYYY-MM-DD HH:mm:ss.SSS"}),
                    splat(),
                    printf(({timestamp, level, message, ...args}) =>
                        `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ""}`
                    )
                ),
            })
        ]
    });

logger.add(new transports.Console({
    level: process.env.NODE_ENV === "production" ? "info" : (process.env.NODE_ENV === "development" ? "debug" : "error"),
    format: combine(
        enumerateErrorFormat(),
        timestamp({format: "YYYY-MM-DD HH:mm:ss.SSS"}),
        splat(),
        printf(({timestamp, level, message, ...args}) =>
            colorizeInstance.colorize(level, `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ""}`)
        )
    )
}));

if (process.env.NODE_ENV === "production") {
    logger.add(new transports.File({
        level: "error",
        dirname: process.env.LOG_ROOT || "public/logs",
        filename: "errors.log",
        format: combine(
            timestamp({format: "YYYY-MM-DD HH:mm:ss.SSS"}),
            splat(),
            printf(({timestamp, level, message, ...args}) =>
                `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ""}`
            )
        ),
    }));
}
