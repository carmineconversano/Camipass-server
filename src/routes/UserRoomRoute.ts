import {Router} from "express";
import {authenticate} from "passport";
import {UserRoomController} from "../controllers/UserRoomController";

const userRoomRouter = Router();

const userRoomController = new UserRoomController();

userRoomRouter.get('/list',
    authenticate("jwt", {session: false}), async (req, res, next) => {
        await userRoomController.listRooms(req, res);
    })

userRoomRouter.get('/join', authenticate("jwt", {session: false}), (req, res) => {
    console.log('Request received at URL of /users/')
    console.log(req.body);
    res.send('Data received');
})


export default userRoomRouter;

