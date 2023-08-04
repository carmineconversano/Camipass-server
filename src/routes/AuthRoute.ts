import {Router} from "express";
import {UsersService} from "../services/UsersService";
import {AuthController} from "../controllers/AuthController";

const userServ = new UsersService();
const authRoute = Router();

const authController = new AuthController();

authRoute.route('/login')
    .post(async (req, res, next) => {
        await authController.login(req, res);
    })


export default authRoute;

