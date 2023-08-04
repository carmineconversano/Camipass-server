import UserRoomService from '../../services/UserRoomService'
import {RoomService} from "../../services/RoomService";
import {JoinRoomRequest} from "../../models/helpers/JoinRoomRequest";

export class RoomHandler {
    private userRoomService: UserRoomService;
    private roomService: RoomService;

    constructor() {
        this.userRoomService = new UserRoomService();
        this.roomService = new RoomService();
    }

    public async joinRoom(socket: any, roomObject: { keyword: string }) {
        const user = socket.request.user;
        const joinRoom: JoinRoomRequest = {
            keyword: roomObject.keyword,
            user: user
        }

        const userRoom = await this.userRoomService.joinOrLeave(user, joinRoom, true);
        const room = await this.roomService.findById(userRoom.roomId);

        const message = {
            userId: user.id,
            username: user.username,
            color: user.color,
            text: `has joined the chat`,
        }
        if(!socket.rooms.has(room.id)) {
            socket.join(room.id);
            socket.broadcast.to(room.id).emit("roomInfo", message);
        }
    }

    public async leaveRoom(socket: any, roomObject: { keyword: string }) {
        const user = socket.request.user;
        const joinRoom: JoinRoomRequest = {
            keyword: roomObject.keyword,
            user: user
        }

        const userRoom = await this.userRoomService.joinOrLeave(user, joinRoom, false);
        const room = await this.roomService.findById(userRoom.roomId);

        const message = {
            userId: user.id,
            username: user.username,
            color: user.color,
            text: `has left the chat`,
        }
        socket.leave(room.id);
        socket.broadcast.to(room.id).emit("roomInfo", message);
    }

    async chat(socket: any, roomObject: { keyword: string, text: string }) {
        const user = socket.request.user;

        const room = await this.roomService.findByKeyword(roomObject.keyword);

        const message = {
            userId: user.id,
            username: user.username,
            color: user.color,
            text: roomObject.text,
            time: (new Date()),
        }
        socket.to(room.id).emit("room:chat", message);
    }

    async disconnect(socket: any) {
        const user = socket.request.user;

        const message = {
            userId: user.id,
            username: user.username,
            color: user.color,
            text: `has left the chat`,
        }
        for (const room of socket.rooms) {
            socket.leave(room)
            socket.broadcast.to(room).emit("roomInfo", message);
            socket.leave(room);
        }
        await this.userRoomService.disconnectFromAll(user);
    }
}

