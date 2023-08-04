import {Request, Response} from "express";
import {UsersService} from "../services/UsersService";
import {User} from "models/User";
import {logger} from "../utils/winston";

export class UserController {
    private usersService: UsersService

    constructor() {
        this.usersService = new UsersService();
    }

    async create(req: Request, res: Response) {
        const user = req.body as User;
        try {
            logger.info(`Trying to create a new user ${user.username}...`);
            const newUser = await this.usersService.save(user);
            return res.status(201).send(newUser);
        } catch (err) {
            logger.error(err);
            if (err.message.includes("username")) return res.status(410).send(err);
            else if (err.message.includes("email")) return res.status(411).send(err);
            else return res.status(400).send(err);
        }
    }

    async join(req: Request, res: Response) {
        const me = await this.usersService.getUserFromRequest(req);
    }

    async delete(req: Request, res: Response) {
        const userId = req.params.id;
        let user;
        try {
            user = await this.usersService.findById(userId);
            await this.usersService.delete(user);
            return res.status(201).send(user);
        } catch (err) {
            logger.error(`Error while deleting user ${user.username}`);
            logger.error(err);
            return res.status(400).send(err);
        }
    }

    async update(req: Request, res: Response) {
        const user = req.body as User;
        try {
            await this.usersService.update(user);
            return res.status(201).send(user);
        } catch (err) {
            logger.error(`Error while updating user ${user.username}`);
            logger.error(err);
            return res.status(400).send(err);
        }
    }

    async validatePassword(req: Request, res: Response) {
        const password = req.body.password;

        try {
            const me = await this.usersService.getUserFromRequest(req);
            await this.usersService.validatePassword(me, password);
            return res.status(200).send();
        } catch (err) {
            logger.error(`Error while validating user password`);
            logger.error(err);
            return res.status(400).send(err.toString());
        }
    }
}
