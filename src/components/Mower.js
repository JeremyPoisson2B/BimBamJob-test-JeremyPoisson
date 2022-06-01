import React from "react";
import MowerImg from './../Assets/mower.png';
import '../style.css';

function Mower(props){
    return(
        <img src={MowerImg} className={props.orientation}/>
    );
}

export default Mower