import {Router} from 'express';
import usersRouter from './UsersRoute';
import authRoute from "./AuthRoute";
import userRoomRouter from "./UserRoomRoute";


const routes = Router();

routes.use('/users', usersRouter);
routes.use('/auth', authRoute);
routes.use('/users-room', userRoomRouter);

export default routes;
