import {UserRoom} from "../models/UserRoom";
import {User} from "../models/User";
import {JoinRoomRequest} from "../models/helpers/JoinRoomRequest";
import {RoomService} from "./RoomService";
import {Room} from "../models/Room";

class UserRoomService {
    private roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
    }

    public async findById(id: any): Promise<UserRoom> {
        return await UserRoom.findOne({where: {id: id}});
    }

    async save(userRoom: UserRoom) {
        try {
            return await UserRoom.create(
                Object.assign(userRoom)
            );
        } catch (err) {
            throw new Error(err)
        }
    }

    async update(userRoom: UserRoom, id: any) {
        try {
            return await UserRoom.update(Object.assign(userRoom), {where: {id: id}, returning: true});
        } catch (err) {
            throw new Error(err)
        }
    }

    async disconnectFromAll(me: User) {
        return await UserRoom.update({connected: false}, {where: {userId: me.id}})
    }

    async findAllByUser(me: User) {
        return await UserRoom.findAll({where: {userId: me.id}});
    }

    async findOneByUserAndRoomId(me: User, roomId: any) {
        return await UserRoom.findOne({where: {userId: me.id, roomId: roomId}});
    }

    async joinOrLeave(user: User, userRoomRequest: JoinRoomRequest, joinOrLeave: boolean) {
        let reqRoom = await this.roomService.findByKeyword(userRoomRequest.keyword)
        if (reqRoom === null) {
            reqRoom = await this.roomService.save({keyword: userRoomRequest.keyword} as Room).catch(error => {
                throw new Error(error);
            })
        }

        const roomConnection = await this.findOneByUserAndRoomId(user, reqRoom.id);
        if (roomConnection !== null) {
            roomConnection.connected = joinOrLeave;
            await this.update(roomConnection, reqRoom.id);
            return roomConnection;
        } else {
            return await this.save({
                userId: userRoomRequest.user.id,
                roomId: reqRoom.id,
                connected: joinOrLeave,
                anonymous: false,
                deleted: false
            } as UserRoom);
        }
    }

}

export default UserRoomService;
