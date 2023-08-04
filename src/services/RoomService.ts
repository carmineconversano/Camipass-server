import {Room} from "../models/Room";

export class RoomService {

    constructor() {
    }

    public async findByKeyword(keyword: string): Promise<Room> {
        return await Room.findOne({where: {keyword}});
    }

    public async findById(id: string): Promise<Room> {
        return await Room.findOne({where: {id}});
    }

    async save(room: Room) {
        room.keyword.trim();
        try {
            return await Room.create(
                Object.assign(room)
            );
        } catch (err) {
            throw new Error(err)
        }
    }
}
