import express, {Express}  from "express";
import http from 'http';
import { Server } from "socket.io";
import cluster from 'cluster';
import os from 'os';
import 'dotenv/config';
import cors from 'cors';
import { initSocketServer, getSocketIns  } from "./src/config/SocketIns";
import { one2oneRouter, initConnect } from "./src/routes/OneToOne";
import mongoose from "mongoose";
const PORT: string = process.env.PORT || '3000';
const processes: number = os.cpus().length;
// initialize express app
var createExpressApp:()=>Express = ():Express => {
   var app = express();
   app.use(cors());
   app.use(express.json());
   app.get("/", (req, res) => {
      res.status(200).send({
         'message': 'Server is running'
      });
   });
   return app;
}
// initialize create http server
var createHttpServer:()=>[any,express.Express] = ():[any,express.Express] => {
   var app = createExpressApp();
   let server = http.createServer(app);
   return [server,app];
}
// initialize server and socket for each process
var initServer: (a: any) => void = async (server: any): Promise<void> => {
   initSocketServer(server);
   server.listen(PORT, () => {
      console.log(`[+] Server initialized' at PORT: ${PORT} PID ${process.pid}`);
   });
}
if (cluster.isPrimary) {
   for (let i = 0; i < processes; i++) {
      cluster.fork();
   }
} else {
   var app: Express, server: any;
   [server, app] = createHttpServer();
   initServer(server);
   initConnect();
}





