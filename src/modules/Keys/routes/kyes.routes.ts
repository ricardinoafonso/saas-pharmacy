import { Router } from "express";
import { keysControler } from "../http/controller/keys.controller";
const keyRouter = Router();
const KeysControler = new keysControler();

keyRouter.get('/', KeysControler.findAll)
keyRouter.get('/:id', KeysControler.findOne)
keyRouter.post('/create',KeysControler.index)
keyRouter.post('/g',KeysControler.geraretekey)
keyRouter.delete('/:id', KeysControler.delete)
keyRouter.put('/:id', KeysControler.update)

export default keyRouter
