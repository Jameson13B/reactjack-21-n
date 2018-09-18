import React from 'react';
import Card from './Card';
import '../styles/Card_List.css';

const CardList = (props) => {
    return (
        <div className='CardList'>
            {props.cards.map(card => {
                return (
                    <Card key={Math.random()} card={card} />
                )
            })}
        </div>
    );
}
 
export default CardList;