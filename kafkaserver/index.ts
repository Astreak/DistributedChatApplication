import express, { Request, Response } from 'express';
import 'dotenv/config';
import { connectDB } from './config/ConnectDB';
import { producerConnect } from './kafka/producer';
import { consumerConnect } from './kafka/consumer';
import { db } from './config/SchemaDB';
import cors from 'cors';
const DBURI = process.env.DBURI;
var connectDBIns = connectDB();
connectDBIns(DBURI);
const PORT = process.env.PORT || 3000;
let initApp:()=>express.Express = ():express.Express=>{
	const app = express();
	app.use(express.json());
	app.use(cors({
		origin:"http://localhost:3000",
		credentials:true,
	}));
	app.get("/",(req:Request, res:Response)=>{
		res.status(200).send({
			"message":"Welcome to kafka server"
		});
	});
	app.post("/chatm",(req:Request, res:Response)=>{
		var message:{
			senderId: string,
			receiverId: string,
			message:string
		} = req.body; // a json 
		producerConnect(message); // message is produced
		res.status(200).send({
			'message': 'Data is queued to be written in database'
		});
	});
	app.post("/findUser/",(req:Request, res:Response)=>{
		const id: string = req.body.id;
		const email : string = req.body.email;
		res.set("Access-Control-Allow-Credentials", 'true');
		res.set("Access-Control-Allow-Origin","http://localhost:3000");
		res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		//console.log(req.body);
		db.find({$or: [{"senderId":id}, {"receiverId":email}]})
		.then((d)=>{
			console.log(d);
			res.status(200).send(d);
		});
	});
	app.post("/findUser/",(req:Request, res:Response)=>{
		
	});
	return app;
}

var app = initApp();
app.listen(PORT,async()=>{
	//await init();
	consumerConnect("user0-1");
	console.log(`[+] Kafka server started on ${PORT} `);
});


