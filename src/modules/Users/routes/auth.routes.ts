import passport from "passport";
import { StrategyLocal, signup as signup } from "../http/controller/auth.strategy";
import { Request, Response,NextFunction, Router } from "express";
const authRoute = Router();
authRoute.post("/signup", signup);
passport.use(StrategyLocal);
authRoute.post('/', async (_req: Request, _res: Response, _next: NextFunction) => {
    passport.authenticate(
      "local",
      (error: any, user: any, info: any, status: any) => {
        if (error) throw error
        _req.login(user, { session: false }, async (error) => {
          if (error)  throw error
          return _res.status(200).json({st:_req.user, info, status});
        });
        return _next();
      }
    )(_req, _res, _next);
  }
);
export default authRoute;
