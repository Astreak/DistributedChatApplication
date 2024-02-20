import express, { Request, Response } from 'express';
import { signIn} from '../controllers/signInController';
import { checkUser, validateUser } from '../helpers/helper';
var signInRoute = express.Router();
signInRoute.get("/protected",validateUser,(req:Request, res:Response)=>{
    if(res.locals.validated === false){
        res.status(403).send({
            'msg':'Not Validated'
        });
    }else{
        res.status(200).send({
            'msg':'Validated'
        })
    }
});
signInRoute.post('/api/signIn/',checkUser,signIn);
export  { signInRoute };
