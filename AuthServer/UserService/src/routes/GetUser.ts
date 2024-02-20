import express, { Request, Response } from 'express';
import { getUserInfoByFirstName, getUserInfoByEmail } from '../helpers/helper';
var getUser = express.Router();
getUser.post('/getUser', getUserInfoByFirstName ,(req:Request, res:Response)=>{
	if(res.locals.user.length==0){
		res.status(401).send({
			'msg':"No user found"
		});
	}else{
		res.status(200).send({
			'msg':JSON.stringify(res.locals.user[0])
		});
	}
});
getUser.post('/getUserByEmail', getUserInfoByEmail ,(req:Request, res:Response)=>{
	if(res.locals.userEmail.length==0){
		res.status(401).send({
			'msg':"No user found"
		});
	}else{
		res.status(200).send({
			'msg':JSON.stringify(res.locals.userEmail[0])
		});
	}
});
export {getUser};