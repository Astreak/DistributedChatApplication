import React from "react";
import '../styles/general.css';
type stylePropType = {
    value: string
}

var TextNode = (props: stylePropType)=>{
    var styleTag:string, outerShape:string;
    if(props.value!=="" && props.value[0] === '1'){
        styleTag = "display-chat2";
        outerShape = "outer-shape2";
    }else{
        styleTag = "display-chat1";
        outerShape = "outer-shape1";
    }
    return (
        <div className={styleTag}>
            <div className={outerShape}>
               <h3 className="actual-text"> {props.value.slice(1)} </h3>
            </div>
         </div>
    )
}
export  {TextNode};