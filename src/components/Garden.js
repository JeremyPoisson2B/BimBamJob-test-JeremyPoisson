import React from "react";
import Mower from './Mower'
import '../style.css';

function Garden(props){

    const displayRows = props.garden.map(row => 
        <th>
            {row.map(item => {
                    switch(item){
                        case 'empty':
                            return <div className="darkerTile"/>
                        default:
                            return <div className="darkerTile">
                                <Mower orientation={item}/>
                            </div>
                    }
                })
            }
        </th>
    );

    return(
        <tr>
            { displayRows }
        </tr>
    );
}

export default Garden