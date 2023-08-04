import {User} from "../models/User";
import * as bcrypt from 'bcrypt';
import {Request} from "express";

export class UsersService {

    constructor() {
    }

    public async findById(id: any): Promise<User> {
        return await User.findOne({where: {id: id}});
    }

    public async findByEmail(email: string, password: string) {
        const user = await User.findOne({where: {email}})

        if (bcrypt.compareSync(password, user.password)) {
            return user;
        } else {
            throw new Error('Invalid password');
        }
    }

    async save(user: User) {
        user.username.trim();
        user.email.trim();
        const hash = bcrypt.hashSync(user.password, 10);
        try {
            return await User.create(
                Object.assign(user, {password: hash})
            );
        } catch (err) {
            if (err.name === "SequelizeUniqueConstraintError") {
                if (err.fields.hasOwnProperty("Users.username")) throw new Error("Duplicate username")
                if (err.fields.hasOwnProperty("Users.email")) throw new Error("Duplicate email")
            } else throw new Error(err);
        }
    }

    async getUserFromRequest(req: Request) {
        return req.user as User;
    }

    async delete(user: User) {
        return await User.destroy({where: {id: user.id}})
    }

    async update(user: User) {
        user.username.trim();
        user.email.trim();
        if (user.password !== null && user.password !== undefined) {
            const hash = bcrypt.hashSync(user.password, 10);
            try {
                return await User.update(Object.assign(user, {password: hash}), {
                    where: {id: user.id},
                    returning: true
                });
            } catch (err) {
                throw new Error(err)
            }
        } else {
            try {
                return await User.update(Object.assign(user), {where: {id: user.id}, returning: true});
            } catch (err) {
                throw new Error(err)
            }
        }

    }

    async validatePassword(user: User, password: any) {
        if (bcrypt.compareSync(password, user.password)) {
            return user;
        } else {
            throw new Error('Password doesn\'t match!');
        }
    }
}
