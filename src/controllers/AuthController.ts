import {AuthService, LoginPayload} from "../services/AuthService";
import {Request, Response} from "express";
import httpErrors from "http-errors";
import {logger} from "../utils/winston";

export class AuthController {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response) {
        const payload = req.body as LoginPayload;
        logger.info(`Log in request received from ${payload.email}`)

        if (!payload.email || !payload.password) {
            logger.warning('Invalid email or password!')
            throw new httpErrors.Unauthorized("");
        }

        try {
            const token = await this.authService.login(payload);
            logger.info(`[${payload.email}] Successful login`)
            return res.status(200).send(token);
        } catch (err) {
            logger.error(`Error during login: ${err.message}`)
            return res.status(401).send(err.message);
        }
    }
}
