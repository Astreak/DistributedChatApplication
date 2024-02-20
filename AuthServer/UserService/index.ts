import express, {Request, Response} from 'express';

import os from 'os';
import cluster from 'cluster';
import { signUpRoute } from './src/routes/userSignUp';
import { signInRoute } from './src/routes/userLogin';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import { validateUser } from './src/helpers/helper';
const app = express();
app.use(express.json());
app.use(cors({
   origin:'http://localhost:3000',
   credentials:true
}));
app.use(helmet());
app.use(cookieParser());
import "dotenv/config";
import jwt from 'jsonwebtoken';
import { getUser } from './src/routes/GetUser';
const accessSecretKey:any = process.env.ACCESS;
const refreshSecretKey:any = process.env.REFRESH;
const PORT = process.env.PORT ||  '3000';
app.get("/", (req: any, res: any) => {
   res.status(201).send({
      'message': `Welcome to User Service of the chat app ${process.pid}`,
      'status': 201
   });
});
app.get("/validateUser/",(req:Request, res:Response)=>{
   //console.log(req.headers);
	//const authToken:any = req.headers.authorization; // replace with cookies
   const cookies:any = req.headers.cookie;
   //console.log(cookies);
	if(cookies === undefined){
      res.set("Access-Control-Allow-Credentials", 'true');
      res.set("Access-Control-Allow-Origin","http://localhost:3000");
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.status(201).send({
         'msg':"Token not sent"
		});
		return ;
	}
   const allCookies = cookies.split(";");
   var  accessT:any, refreshT:any;
   for(const a of allCookies){
         if(a.split("=")[0]==='refreshtoken'){
            refreshT = a.split("=")[1];
         }
   }
   //console.log(refreshT);
   
   //console.log(refreshT);
   //console.log("AccessToken: ",accessT);
   //console.log("RefreshToken: ", refreshT);
	//console.log("Auth Token: ", authToken);
	//console.log(cookies.split(";").length);
	try{
      if (refreshT!==undefined){
         const data =  jwt.verify(refreshT, refreshSecretKey);
         //console.log("JWt body: ", data);
         const accessToken = jwt.sign(data, accessSecretKey);
         res.cookie('accessToken', accessToken, {httpOnly: true});
         res.set("Access-Control-Allow-Credentials", 'true');
         res.set("Access-Control-Allow-Origin","http://localhost:3000");
         res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
         res.status(201).send({
            user : JSON.stringify(data)
         });
      }else{
         res.set("Access-Control-Allow-Credentials", 'true');
         res.set("Access-Control-Allow-Origin","http://localhost:3000");
         res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
         res.status(403).send({
            'msg':"Forbidden: Not Authorized"
         });
      }
   }catch(ex){
      console.log("JWT ERROR: ",ex)
      res.set("Access-Control-Allow-Credentials", 'true');
      res.set("Access-Control-Allow-Origin","http://localhost:3000");
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.status(403).send({
         'msg':"Forbidden: Not Authorized"
		});
	}
	return ;
   
});
const cpuCounts = Math.min(os.cpus().length, 4);
app.use(getUser);
app.use(signInRoute);
app.use(signUpRoute);
if (cluster.isPrimary) {
   for (let i = 0; i < cpuCounts; i++) {
      cluster.fork();
   }
} else {
   app.listen(PORT, () => {
      console.log(`[+] Server Connected on PORT: ${PORT} and processID : ${process.pid}`);
   });
}

