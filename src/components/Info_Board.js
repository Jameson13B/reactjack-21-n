import React from 'react';
import '../styles/Info_Board.css';

const InfoBoard = (props) => {
    return (
        <div className='InfoBoard'>
            <div className='element'>
                <h1>Bal:</h1>
                <p>$ {props.bal}</p>
            </div>
            <div className='element'>
                <h1>Bet:</h1>
                <p>$ {props.bet}</p>
            </div>
            <div className='element'>
                <h1>+/-:</h1>
                <p>$ {props.win}</p>
            </div>
        </div>
    );
}
 
export default InfoBoard;