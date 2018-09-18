import React from 'react';
import '../styles/Button.css';

const Button = (props) => {
    return (
        <div className={`Button ${props.size}${props.active ? ' '+props.active : ''}`} onClick={props.handler} >{props.content}</div>
    );
}
 
export default Button;