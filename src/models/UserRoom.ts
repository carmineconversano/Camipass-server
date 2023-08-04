import {Column, CreatedAt, DataType, DeletedAt, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import {User} from "./User";
import {Room} from "./Room";

@Table
export class UserRoom extends Model {
    @Column({
        type: DataType.BOOLEAN,
        comment: 'If the user is anonymous or not',
        allowNull: false,
    })
    anonymous: boolean

    @Column({
        type: DataType.BOOLEAN,
        comment: 'If the user is connected or not',
        allowNull: false,
    })
    connected: boolean

    @Column({
        type: DataType.BOOLEAN,
        comment: 'If the user is deleted or not',
        allowNull: false,
    })
    deleted: boolean

    @ForeignKey(() => User)
    @Column
    userId: string;

    @ForeignKey(() => Room)
    @Column
    roomId: string;

    @CreatedAt
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;

    @DeletedAt
    deletionDate: Date;
}
