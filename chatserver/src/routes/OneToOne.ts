import { Router } from "express";
import { getSocketIns } from "../config/SocketIns";
import Redis from "ioredis";
import 'dotenv/config';
import ConnectedUser from "../config/GetConnectedUser";
const redisPub = new Redis(6379,"127.0.0.1");
const redisSub = new Redis(6379,"127.0.0.1");
var initConnect: ()=>void = ()=>{
    redisSub.subscribe("new-msg-streamv3");
    const io = getSocketIns();
    redisSub.on("message",async(channel,message)=>{
        //console.log("Subscriber msg", message);
        const toEmail = JSON.parse(message).receiverId;
        console.log(toEmail);
        var data:any = await ConnectedUser.checkUser(toEmail); // revert to then-able formate later 
        if( data===null || data===undefined ) return;
        // sockid is sender's socket id;
        io.to(data.sockid).emit("send-message-server",JSON.parse(message));
    });
    // io.use((socket:any,next:any)=>{
        //     const username = socket.handshake.auth;
        //     console.log(username);
        //     if(username === undefined || username === null){
            //         console.log("Not authorized");
            //         next(new Error("Not Authorized"));
            //     }else next();
            // });
    io.on("connect",(socket:any)=>{
        try{
            if(socket.handshake.auth.email === undefined  || socket.handshake.auth.email === null || socket.handshake.auth.email === "") return ;
                var currentConnection = new ConnectedUser(socket.handshake.auth.email, socket.id);
                // console.log("Auth key, ", socket.handshake.auth);
                //console.log("Index Users ", ConnectedUser._indexedUsers);
        }catch(ex){
            console.log(ex);
            return ;
        }
        console.log("[+] Socket",socket.id,"Connected on process: ", process.pid);
        socket.on("disconnect",()=>{
            ConnectedUser.disconnectUser(socket.handshake.auth.email)
            .then(()=>{
                console.log(`${socket.id} is disconnected`);
            })
            .catch(ex=>{console.log("disconnect, ", ex);});
        });
        socket.on("send-message", (msg:any)=>{
            console.log(msg);
            const toBeCommited = {...msg}; // we should take care of the validity of the json
            //delete toBeCommited["sockId"]; 
            console.log("Commited:", toBeCommited);
            redisPub.publish("new-msg-streamv3",JSON.stringify(msg));
            fetch("http:localhost:8000/chatm",{ // post request to kafka server 
                method: "POST",
                body: JSON.stringify(toBeCommited),
                headers: {
                    'content-type': 'application/json;charset=utf-8' // if not added server doesn't catch the req.body
                 }
            }).then((d)=>{
                return d.json();
            })
            .then((d)=> console.log(d))
            .catch((ex) => console.log(ex));
            //console.log(toBeCommited);
        });
    });
    return io ;
}
var one2oneRouter = Router();
one2oneRouter.get("/chat",(req:any, res:any)=>{

});
export  {one2oneRouter, initConnect};