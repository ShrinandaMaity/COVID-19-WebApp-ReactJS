import React, { useState } from 'react';
import { IconButton, Collapse } from '@material-ui/core';
import { prettyPrintStat } from './util';
import './TablE.css';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

function TablE({country, index}) {
    const [open, setOpen] = useState(-1);
    return (
        <div className="row_body">
            <tr className={`table_body_row ${index%2==1?'row_odd':'row_even'}`}>
                <td className="table_index">{index+1}</td>
                <td className="table_country">
                {country.country}
                <IconButton className="table_arrow" onClick={(e) => {setOpen(-open);console.log(open);}}>
                    {
                    open===1
                    ? <KeyboardArrowUpIcon style={{color: "rgba(200,200,200,0.8)"}} />
                    : <KeyboardArrowDownIcon style={{color: "rgba(200,200,200,0.8)"}}/>
                    }
                </IconButton>
                </td>
                <td className="table_cases">
                    <strong>{prettyPrintStat(country.cases)}</strong>
                </td>
                <td className="table_recovered">
                    <strong>{prettyPrintStat(country.recovered)}</strong>
                </td>
                <td className="table_deaths">
                    <strong>{prettyPrintStat(country.deaths)}</strong>
                </td>
            </tr>
            <div>
                <Collapse in={open===1} timeout='auto' unmountOnExit>
                    hi
                </Collapse>
            </div>
        </div>
    )
}

export default TablE;
