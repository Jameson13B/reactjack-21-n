import React from 'react';
import '../styles/Card.css';

const Card = (props) => {
    return (
        <div className='Card'>
            <img src={props.card} alt='card' />
        </div>
    );
}
 
export default Card;