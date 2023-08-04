import express from 'express';
import routes from './routes/Routes';
import {sequelize} from "./utils/sequelize";
import passport from "passport";
import {AuthService} from "./services/AuthService";
import * as http from "http";
import cors from 'cors';
import jwtAuth from 'socketio-jwt-auth';
import {UsersService} from "./services/UsersService";
import {RoomHandler} from './socket/handlers/roomHandler'
import {logger} from "./utils/winston";

require('dotenv-flow').config({silent: true});

(async () => {
    await sequelize.sync({force: false}).then(() => {
        logger.info(`Successful sync with database ${process.env.DB_DATABASE} on host ${process.env.DB_HOST}.`)
    }).catch((error: any) => {
        logger.error(`Error while syncing database ${process.env.DB_DATABASE} on host ${process.env.DB_HOST}`);
        logger.error(error);
    });
})();

const app = express();
const httpServer = http.createServer(app);
const usersService = new UsersService();
const roomHandler = new RoomHandler();
const corsOptions = {
    origin: ["http://localhost:3000", 'https://camipass.mooo.com', 'http://camipass.mooo.com'],
    credentials: true,
    optionSuccessStatus: 200,
    allowedHeaders: ['Authorization', 'x-auth-token', 'content-type']
}

const io = require('socket.io')(httpServer, {
    cors: corsOptions,
    pingTimeout: 180000,
    pingInterval: 5000
});

app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

passport.use('jwt', new AuthService().getTokenStrategy())
app.use(passport.initialize())
app.use(routes);
const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
    logger.info(`Started server on port ${port}`);
})

io.use(jwtAuth.authenticate({
    secret: process.env.JWT_SECRET,
    succeedWithoutToken: false
}, async function (payload, done) {
    logger.info(`Authenticating user with id: ${payload.userId}`)
    if (payload && payload.userId) {
        try {
            const user = await usersService.findById(payload.userId);
            if (!user) {
                return done(null, false, "User by token not found!");
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    } else {
        return done() // in your connection handler user.logged_in will be false
    }
}))

io.on('connection', (socket: any) => {
    logger.info(`User ${socket.request.user.username} connected to socket.io instance.`)

    socket.on('room:join', async (roomObject: { keyword: string }) => {
        logger.info(`User ${socket.request.user.username} is joining the room with keyword ${roomObject.keyword}.`)
        await roomHandler.joinRoom(socket, roomObject)
    })
    socket.on('room:leave', async (roomObject: { keyword: string }) => {
        logger.info(`User ${socket.request.user.username} is leaving the room with keyword ${roomObject.keyword}.`)
        await roomHandler.leaveRoom(socket, roomObject)
    })

    socket.on('room:chat', async (roomObject: { keyword: any, text: string }) => {
        logger.info(`User ${socket.request.user.username} is sending a message to the room with keyword ${roomObject.keyword}.`)
        await roomHandler.chat(socket, roomObject);
    })

    socket.on('disconnecting', async () => {
        logger.warn(`User ${socket.request.user.username} is leaving the server`);
        await roomHandler.disconnect(socket);
    });

    socket.emit('success', {
        message: 'success logged in!',
        user: socket.request.user
    });
})

