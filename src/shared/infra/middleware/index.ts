import cors from "cors";
import Express from "express";

export const LoadMiddleware = (app: any) => {
  app.use(
    cors({
      origin: true,
    })
  );
  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());
};
