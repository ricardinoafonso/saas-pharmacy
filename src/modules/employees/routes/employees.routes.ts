import { Router } from 'express';
import { EmployeesController } from '../http/controller/employees.controller';
import { container } from 'tsyringe'
import { Authorization } from '@shared/authorization';

const AuthorizationContainer = container.resolve(Authorization);

const employeesRouter = Router();
const controller = new EmployeesController();

employeesRouter.use(AuthorizationContainer.is(['superuser','admin']))
employeesRouter.post('/create', controller.create);
employeesRouter.get('/:id', controller.findAll);

export { employeesRouter };
