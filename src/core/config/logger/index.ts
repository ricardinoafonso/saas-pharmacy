import { resolve } from "path";
import { existsSync, mkdirSync, createReadStream } from "node:fs";
import { BaseError } from "@errors/Base";
import winston from "winston";

const folder: string = resolve(process.cwd(), ".", "logs");
const file: string = resolve(process.cwd(), ".", "logs/log.log");

if (!existsSync(folder)) {
  mkdirSync(folder, { recursive: true });
  const stream = createReadStream(file, { flags: "a" });
  stream.on("error", (error) => {
    throw new BaseError(
      `${error}`,
      new Error().stack,
      "verifica o directorio de logs",
      500,
      "config:logger",
      "index"
    );
  });
}

const option = {
  file: {
    level: "info",
    filename: file,
    handleException: true,
    maxsize: 5242880,
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.splat(),
      winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;

        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
        }`;
      })
    ),
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

const customLevels = {
  levels: {
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    trace: "white",
    debug: "green",
    info: "green",
    warn: "yellow",
    error: "red",
    fatal: "red",
  },
};

const Logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.File(option.file),
    new winston.transports.Console(option.console),
  ],
  exitOnError: false,
});

Logger.write((message: string, encoding: BufferEncoding) => {
  Logger.info(message);
});

export default Logger;
