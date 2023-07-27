import { Router } from 'express';
import { EmployeesController } from '../http/controller/employees.controller';
const employeesRouter = Router();
const controller = new EmployeesController();

employeesRouter.post('/create', controller.create);
employeesRouter.get('/:id', controller.findAll);

export { employeesRouter };
