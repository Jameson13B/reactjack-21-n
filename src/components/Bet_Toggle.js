import React from 'react';
import '../styles/Bet_Toggle.css';

const BetToggle = (props) => {
    return (
        <div className='BetToggle'>
            <div className='betBtn' onClick={props.decrease}> - </div>
            <h1 className='font'>Bet</h1>
            <div className='betBtn' onClick={props.increase}> + </div>
        </div>
    );
}
 
export default BetToggle;