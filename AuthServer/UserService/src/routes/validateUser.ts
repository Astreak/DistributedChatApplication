import { Request, Response, Router } from "express";
import "dotenv/config";
import jwt from 'jsonwebtoken';
const accessSecretKey:any = process.env.ACCESS;
const refreshSecretKey:any = process.env.REFRESH;
const validationRoute = Router();
validationRoute.get("/validateUser/",(req:Request, res:Response)=>{
	console.log(req.headers);
	const authToken:any = req.headers.authorization;
	//console.log("Auth Token: ", authToken);
	if(authToken === undefined || authToken === null){
		res.status(403).send({
			'msg':"Token not sent"
		});
		return ;
	}
	try{
		const data =  jwt.verify(authToken,accessSecretKey);
		//console.log("JWt body: ", data);
		res.status(201).send({
			user : JSON.stringify(data)
		});
	}catch{
		res.status(403).send({
			'msg':"Forbidden: Not Authorized"
		});
	}
	return ;

});
export {validationRoute};