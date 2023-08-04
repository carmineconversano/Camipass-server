import {BelongsToMany, Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt} from 'sequelize-typescript'
import {User} from "./User";
import {UserRoom} from "./UserRoom";

@Table
export class Room extends Model {
    @Column({
        type: DataType.STRING,
        comment: 'Keyword of the room',
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 60],
            notEmpty: true,
            alphaAndSigns: (value: string) => {
                if(!/^([A-Z0-9\-_]){1,60}$/i.test(value)) {
                    throw new Error('room format error!')
                }
            },
        }
    })
    keyword: string;

    @BelongsToMany(() => User, () => UserRoom)
    users: User[]

    @CreatedAt
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;

    @DeletedAt
    deletionDate: Date;
}
