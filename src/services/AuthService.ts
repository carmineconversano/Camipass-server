import {ExtractJwt, Strategy, VerifiedCallback} from "passport-jwt";
import {UsersService} from "./UsersService";
import jwt from "jwt-simple";
import {User} from "../models/User";
import moment from "moment";
import httpErrors from "http-errors";
import {Request} from "express";

//TODO capire se va messo per forza
require('dotenv-flow').config({silent: true})

export interface JwtToken {
    exp: number
    userId: string,
    username: string,
    email: string,
    color: string
}

export interface LoginPayload {
    email: string
    password: string
}

export class AuthService {
    private UsersService: UsersService

    constructor() {
        this.UsersService = new UsersService();
    }

    public getTokenStrategy(): Strategy {
        return new Strategy({
                secretOrKey: process.env.JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromHeader("authorization"),
                passReqToCallback: true
            },
            (req: Request, payload: JwtToken, done: VerifiedCallback) => {
                (async () => {
                    try {
                        const user = await this.UsersService.findById(payload.userId);
                        if (!user) {
                            return done({error: "User by token not found!"}, null);
                        }
                        return done(null, user);
                    } catch (err) {
                        return done(err);
                    }
                })();
            });
    }

    async login(payload: LoginPayload): Promise<string> {
        try {
            const user = await this.UsersService.findByEmail(payload.email, payload.password);
            return this.createToken(user);
        } catch (err) {
            throw new httpErrors.Unauthorized("Invalid username or password!");
        }
    }

    public createToken(user: User): string {
        const expires = moment().utc().add({weeks: 1}).unix();
        const token: JwtToken = {
            exp: expires,
            userId: user.id,
            username: user.username,
            email: user.email,
            color: user.color
        };
        const encoded = jwt.encode(token, process.env.JWT_SECRET);

        return `${encoded}`;
    }

    public decodeToken(token: string): JwtToken {
        if (!token) {
            throw new httpErrors.BadRequest("Empty token!");
        }

        return jwt.decode(token, process.env.JWT_SECRET);
    }
}
