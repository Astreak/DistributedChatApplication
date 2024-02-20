import React, { useEffect } from "react";
import '../styles/general.css';
import { TextNode } from "./TestNode";
type displayPropsType = {
   user:any,
   valueList: any,
   toUserName: string,
   toUser:any,
   setToUser: any
}
const DisplayChat = (props: displayPropsType) => {
   console.log(props.valueList);
   
   <h1>{ props.toUserName} </h1>
   if(props.valueList === undefined || props.valueList.length === 0 || props.toUser===undefined || props.toUser === null || props.user === null) return (<div></div>);
   return (
      <>
      {
         props.valueList.map((value:any, index:number) => {
            if(value.email === props.toUser.email && value.fromemail === JSON.parse(props.user).email){
               return (
                  <div key = {index} className="display-container">
                  <TextNode value = {'1'+value.message}/>
                  </div>
               );
            }else if(value.email === JSON.parse(props.user).email && value.fromemail === props.toUser.email ){
               return (
                  <div key = {index} className="display-container">
                  <TextNode value = {'2'+value.message}/>
                  </div>
               );
            }else{
               return(<div key={index}></div>);
            }
      })
        
      }
      </>
   )
}
export { DisplayChat };