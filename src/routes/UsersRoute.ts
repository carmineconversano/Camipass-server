import {Router} from "express";
import {authenticate} from "passport";
import {UserController} from "../controllers/UserController";

const usersRouter = Router();

const userController = new UserController();

usersRouter.route('/make')
    .post(async (req, res, next) => {
        await userController.create(req, res);
    })

usersRouter.route('/:id')
    .delete(authenticate("jwt", {session: false}), async (req, res) => {
        await userController.delete(req, res);
    })
    .put(authenticate("jwt", {session: false}), async (req, res) => {
        await userController.update(req, res);
    })

usersRouter.route('/validate-password')
    .post(authenticate("jwt", {session: false}), async (req, res) => {
        await userController.validatePassword(req, res);
    })

export default usersRouter;

