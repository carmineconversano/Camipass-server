import {Sequelize} from 'sequelize-typescript';
import path from "path";

require('dotenv-flow').config({silent: true})

export const sequelize = new Sequelize({
    logging: false,
    database: process.env.DB_DATABASE || 'camipass',
    dialect: 'mysql',
    username: process.env.DB_USER || 'camipass',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'camipass',
    models: [path.join(__dirname, '../models')]
});
