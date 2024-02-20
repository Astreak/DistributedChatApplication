import { socket } from "../config/SocketIns";
import React, { useEffect, Dispatch, SetStateAction, useState } from "react";
import '../styles/general.css';
import { useNavigate } from "react-router-dom";
import { SearchUser } from "./SearchUser";
type chatBarType = {
   value: string,
   setValue: Dispatch<SetStateAction<string>>,
   displayVal: any, // string []
   setDisplayVal: any,
   validated:boolean,
   user: any,
   token:string,
   toUser:any,
   setToUser:any
}
const ChatBar = (props:chatBarType) => {
   //const [value, setValue]: [string, Dispatch<SetStateAction<string>>] = useState("");
   const toUser = props.toUser;
   const setToUser = props.setToUser;
   const navigate = useNavigate();
   useEffect(()=>{
      console.log("Chat Use Effect Ran with to User: ", toUser);
      if(props.user===undefined || props.user === null){
         navigate("/signIn");
      }else if(JSON.parse(props.user).email!==undefined){
            socket.auth = {email : JSON.parse(props.user).email} ;
            //if(socket.connected === true) socket.disconnect();
            socket.connect();
            const sockI:any = socket.id;
            //redisS.set(JSON.parse(props.user).email, sockI);
            socket.on("send-message-server",(msg:any)=>{
               console.log("Sent from server, " ,msg);
               props.setDisplayVal((displayVal:any)=>{
                  return [...displayVal,{message:msg.message, email:msg.receiverId, fromemail: msg.email} ];
               });
            });
         return ()=>{
            socket.disconnect();
            socket.off("send-message-server");
         }
      }
    },[]);
   let onChangeHandler:(a:any)=> void = (e:any):void => {
      e.preventDefault();
      props.setValue(e.target.value);
   }
   let onSubmitHandler:(e:any)=>Promise<void>  = async(e: any): Promise<void> => {
      e.preventDefault();
      // we have to add the sender and recover userID
      if((props.user!==null || props.user!==undefined)  && toUser!==null ){
         const sockId:any = "asd";
         if(JSON.parse(props.user).email!== undefined){
            console.log(toUser);
            socket.auth = JSON.parse(props.user).email;
            socket.emit("send-message",{senderId: JSON.parse(props.user).id, tousername: toUser.username, fromusername: JSON.parse(props.user).username, email: JSON.parse(props.user).email, receiverId: toUser.email, message:props.value});
         }else{
            //navigate("/errorRoute");
         }
      }
      if (props.value === "" || toUser.email === undefined) return;
      props.setDisplayVal( (displayVal:any) => {return [...displayVal, {message: props.value,email:toUser.email, fromemail: JSON.parse(props.user).email}]});

      console.log(props.displayVal);
      props.setValue("");
      
   }
   if(toUser===null){
      return (<>
         <SearchUser toUser = {toUser } setToUser = {setToUser}/>
      </>
      );
   }
   return (
      <div className="chat-bar">
         <form>
            <span className="chat-comp">
               <input className="input-box" type="text" name="chat" autoFocus value={props.value} onChange={onChangeHandler} />
               <button className="send-button" onClick={onSubmitHandler}>Send</button>
            </span>
         </form>
      </div>
   )
}
export { ChatBar };
