import {BelongsToMany, Column, CreatedAt, DataType, DeletedAt, Model, Table, UpdatedAt} from 'sequelize-typescript'
import {UserRoom} from "./UserRoom";
import {Room} from "./Room";

@Table
export class User extends Model {
    @Column({
        type: DataType.STRING,
        comment: 'Username of the user inside the chatRoom',
        allowNull: false,
        unique: true,
        validate: {
            alphaAndSigns: (value: string) => {
                if(!/^\s*(?:[A-Z0-9\-_]\s*){1,60}$/i.test(value)) {
                    throw new Error('username format error!')
                }
            },
            notEmpty: true,
            len: [1, 60]
        }
    })
    username: string

    @Column({
        type: DataType.STRING,
        comment: 'Color of the user inside the chatRoom',
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50]
        }
    })
    color: string

    @Column({
        type: DataType.STRING,
        comment: 'Email of the user',
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
            len: [3, 255]
        }
    })
    email: string


    /*Viene definita una relazione di uno a molti
    * Un utente può appartenere a più Stanze*/
    @BelongsToMany(() => Room, () => UserRoom)
    rooms: Room[]

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    })
    password: string

    @CreatedAt
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;

    @DeletedAt
    deletionDate: Date;
}
