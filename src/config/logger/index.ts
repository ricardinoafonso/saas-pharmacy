import { resolve } from "path";
import { existsSync, mkdirSync, createReadStream } from "node:fs";
import { BaseError } from "@errors/Base";
import winston from "winston";

const folder = resolve(process.cwd(), ".", "logs");
const file = resolve(process.cwd(), ".", "logs/log.log");

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
      winston.format.json()
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

const Logger = winston.createLogger({
  transports: [
    new winston.transports.File(option.file),
    new winston.transports.Console(option.console),
  ],
  exitOnError: false,
});

Logger.write((message: any, encoding: any) => {
  Logger.info(message);
});

export default Logger;
