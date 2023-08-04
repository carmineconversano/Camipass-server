import {Request, Response} from "express";
import {UsersService} from "../services/UsersService";
import UserRoomService from "../services/UserRoomService";
import {UserRoom} from "../models/UserRoom";
import {JoinRoomRequest} from "../models/helpers/JoinRoomRequest";

export class UserRoomController {
    private userRoomService: UserRoomService
    private usersService: UsersService

    constructor() {
        this.usersService = new UsersService();
        this.userRoomService = new UserRoomService();
    }

    async create(req: Request, res: Response) {
        const userRoom = req.body as UserRoom;

        try {
            const newUser = await this.userRoomService.save(userRoom);
            console.log(`Trying to create a new connection to room ${userRoom.getDataValue('user')}...`);
            return res.status(201).send(newUser);
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    async join(req: Request, res: Response) {
        const me = await this.usersService.getUserFromRequest(req);

        const userRoomRequest = new JoinRoomRequest();
        userRoomRequest.user = me;
        userRoomRequest.keyword = req.body.keyword;

        this.userRoomService.joinOrLeave(me, userRoomRequest, true).then((success: any) => {
            return res.status(201).send(success);
        }).catch((error: any) => {
            return res.status(400).send(error);
        })
    }

    async listRooms(req: Request, res: Response) {
        const me = await this.usersService.getUserFromRequest(req);

        await this.userRoomService.findAllByUser(me).then((rooms: any) => {
            return res.status(201).send(rooms);
        }).catch((error: any) => {
            return res.status(400).send(error);
        })
    }
}
