import { Server } from "socket.io";
var io:any;
var initSocketServer: (a:any)=>void = (server:any) => {
    io =  new Server(server,{
        cors: {
           origin: "*",
           methods:["GET","POST"]
        }
     });
}
var getSocketIns = ()=>{
    if(!io){
        throw new Error("Socket server not initialized");
    }
    return io;
}
export {initSocketServer,getSocketIns};