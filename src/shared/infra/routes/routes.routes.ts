import keyRouter from '@modules/Keys/routes/kyes.routes';
import companyRouter from '@modules/farmacia/company/routes/company.routes';
import limitRouter from '@modules/limit/routes/limit.routes';
import plansRouter from '@modules/plans/routes/plans.routes';
import SwaggerUI from 'swagger-ui-express';
import docs from './../../../swagger.json';
import authRoute from '@modules/Users/routes/auth.routes';
import SubscriptionRouter from '@modules/subscription/routes/subscription.routes';
import productRouter from '@modules/farmacia/product/routes/product.routes';
import CategoriesRouter from '@modules/farmacia/categories/routes/categories.routes';
import salesRouter from '@modules/farmacia/sales/routes/sales.routes';
import userRoute from '@modules/Users/routes/user.routes';
import { employeesRouter } from '@modules/farmacia/employees/routes/employees.routes';
import refreshRouter from '@modules/token/routes/token.routes';
import { Application } from 'express';
const LoadRoutes = (app: Application) => {
  
  app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(docs));
  app.use('/api/v1/user/auth', authRoute);
  app.use('/api/v1/user', userRoute);
  app.use('/api/v1/token', refreshRouter)

  app.use('/api/v1/subscription', SubscriptionRouter);
  app.use('/api/v1/company', companyRouter);
  app.use('/api/v1/key', keyRouter);
  app.use('/api/v1/plans', plansRouter);
  app.use('/api/v1/limit', limitRouter);
  app.use('/api/v1/product', productRouter);
  app.use('/api/v1/categorie', CategoriesRouter);
  app.use('/api/v1/sales', salesRouter);
  app.use('/api/v1/employees', employeesRouter);
};

export default LoadRoutes;
